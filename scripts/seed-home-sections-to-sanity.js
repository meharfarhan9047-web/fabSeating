/**
 * Fills the Sanity "Homepage" document's new sections (brand partners, furniture
 * categories, industries, FAQs, Google reviews link) with the site's current
 * content, uploading logos and cover images from public/images.
 *
 * Only EMPTY fields are filled, so anything already edited in Sanity Studio is
 * never overwritten. Safe to re-run.
 *
 * Usage:
 *   node scripts/seed-home-sections-to-sanity.js            # dry run (default)
 *   node scripts/seed-home-sections-to-sanity.js --commit   # write to Sanity
 *
 * Run AFTER scripts/upload-products-to-sanity.js so product categories exist.
 * Needs SANITY_API_WRITE_TOKEN (.env.local locally, or a GitHub Actions secret).
 */
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const envFile = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/)
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}

const COMMIT = process.argv.includes('--commit')
const PUBLIC = path.join(__dirname, '..', 'public')
const defaults = require('../lib/siteDefaults.json')

// public/images folder -> Sanity productCategory slug (same as upload-products-to-sanity.js)
const DIR_TO_PRODUCT_CATEGORY = {
  sofas: 'sofas',
  'chairs/dining': 'dining-chairs',
  'chairs/office': 'office-chairs',
  'chairs/lounge': 'lounge-chairs',
  'dining-tables': 'dining-tables',
  'center-side-tables': 'center-side-tables',
  beds: 'beds',
  poufs: 'poufs',
  rugs: 'rugs',
}

const key = (s) => crypto.createHash('md5').update(String(s)).digest('hex').slice(0, 12)
const isEmpty = (v) => !Array.isArray(v) ? !v : v.length === 0

async function main() {
  console.log(`${COMMIT ? 'SEED' : 'DRY RUN'}: ${defaults.brandPartners.length} partners, ${defaults.categories.length} categories, ${defaults.industries.length} industries, ${defaults.faqs.length} FAQs`)
  if (!COMMIT) {
    console.log('Nothing written. Re-run with --commit (needs SANITY_API_WRITE_TOKEN).')
    return
  }
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!token || token.startsWith('your_')) {
    console.error('Missing SANITY_API_WRITE_TOKEN (.env.local locally, or a GitHub Actions secret)')
    process.exit(1)
  }
  const { createClient } = require('@sanity/client')
  const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'n59kaaxb',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  })

  async function uploadImage(publicPath) {
    if (!publicPath) return undefined
    const file = path.join(PUBLIC, publicPath.replace(/^\//, ''))
    if (!fs.existsSync(file)) {
      console.warn(`  ! missing ${publicPath}, skipped`)
      return undefined
    }
    const asset = await client.assets.upload('image', fs.createReadStream(file), { filename: path.basename(file) })
    return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
  }

  const home = (await client.fetch(`*[_type == "homePage" && !(_id in path("drafts.**"))] | order(_id asc)[0]`)) || null
  const homeId = home?._id || 'homePage'
  if (!home) await client.createIfNotExists({ _id: homeId, _type: 'homePage' })

  const productCats = await client.fetch(`*[_type == "productCategory"]{ _id, "slug": slug.current }`)
  const catIdBySlug = Object.fromEntries(productCats.map((c) => [c.slug, c._id]))

  const set = {}

  if (isEmpty(home?.brandPartners)) {
    set.brandPartners = []
    for (const b of defaults.brandPartners) {
      set.brandPartners.push({ _key: key(b.name), _type: 'object', name: b.name, logo: await uploadImage(b.logo) })
    }
  }

  if (isEmpty(home?.furnitureCategories)) {
    set.furnitureCategories = []
    for (const c of defaults.categories) {
      const refs = c.imageDirs
        .map((d) => catIdBySlug[DIR_TO_PRODUCT_CATEGORY[d]])
        .filter(Boolean)
        .map((id) => ({ _key: key(id), _type: 'reference', _ref: id }))
      set.furnitureCategories.push({
        _key: key(c.slug),
        _type: 'object',
        title: c.title,
        slug: { _type: 'slug', current: c.slug },
        blurb: c.blurb,
        coverImage: await uploadImage(c.cover),
        productCategories: refs,
      })
    }
  }

  if (isEmpty(home?.industries)) set.industries = defaults.industries
  if (isEmpty(home?.faqs)) set.faqs = defaults.faqs.map((f) => ({ _key: key(f.q), _type: 'object', question: f.q, answer: f.a }))
  if (!home?.googleReviewsUrl) set.googleReviewsUrl = defaults.reviewsUrl

  const fields = Object.keys(set)
  if (!fields.length) {
    console.log('Homepage sections already filled in Sanity. Nothing to do.')
    return
  }
  await client.patch(homeId).ifRevisionId(home?._rev).set(set).commit()
  // Seed the same missing fields on an existing draft so its next publish preserves them.
  const draft = await client.getDocument(`drafts.${homeId}`)
  if (draft) {
    const draftSet = Object.fromEntries(Object.entries(set).filter(([name]) => isEmpty(draft[name])))
    if (Object.keys(draftSet).length) await client.patch(draft._id).ifRevisionId(draft._rev).set(draftSet).commit()
  }
  console.log(`Filled: ${fields.join(', ')}`)
}

main().catch((e) => {
  console.error(e.message || e)
  process.exit(1)
})
