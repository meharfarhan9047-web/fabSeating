/** Import the existing Gallery photos once; never overwrite a client-managed gallery.
 * node scripts/seed-main-gallery-to-sanity.js --commit
 */
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const envFile = path.join(__dirname, '..', '.env.local')
for (const line of (fs.existsSync(envFile) ? fs.readFileSync(envFile, 'utf8') : '').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
}
const base = path.join(__dirname, '..', 'public/images')
const dirs = ['gallery/case-study-murugan-kilpauk', 'gallery/case-study-kothari-nungambakkam', 'gallery']
const files = dirs.flatMap(dir => fs.readdirSync(path.join(base, dir)).filter(name => /\.(png|jpe?g|webp|avif)$/i.test(name)).sort().map(name => path.join(base, dir, name)))
async function main() {
  if (!process.argv.includes('--commit')) { console.log(`Dry run: ${files.length} existing gallery photos`); return }
  if (!process.env.SANITY_API_WRITE_TOKEN) throw new Error('Missing SANITY_API_WRITE_TOKEN')
  const client = require('@sanity/client').createClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'n59kaaxb', dataset:process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',apiVersion:'2024-01-01',token:process.env.SANITY_API_WRITE_TOKEN,useCdn:false})
  const home = await client.fetch('*[_type=="homePage" && !(_id in path("drafts.**"))] | order(_id asc)[0]')
  if (!home) throw new Error('Published Homepage document missing')
  if (home.galleryImages !== undefined) { console.log('Gallery already managed in Sanity; no changes.'); return }
  const assets = await client.fetch('*[_type=="sanity.imageAsset"]{_id,sha1hash}')
  const byHash = new Map(assets.map(a => [a.sha1hash,a._id]))
  const seen = new Set()
  const photos = []
  const planned = files.flatMap(file => { const hash = crypto.createHash('sha1').update(fs.readFileSync(file)).digest('hex'); if(seen.has(hash)) return []; seen.add(hash); return [{file,hash}] })
  for (let i=0;i<planned.length;i+=4) {
    const batch = await Promise.all(planned.slice(i,i+4).map(async ({file,hash}) => {
      const id = byHash.get(hash) || (await client.assets.upload('image',fs.createReadStream(file),{filename:path.basename(file)}))._id
      return {_type:'image',_key:hash.slice(0,16),asset:{_type:'reference',_ref:id},alt:'Fab Seating furniture and project photograph'}
    }))
    photos.push(...batch)
    console.log(`Prepared ${photos.length}/${planned.length} photos`)
  }
  await client.patch(home._id).setIfMissing({galleryImages:photos}).commit()
  const draft = await client.getDocument(`drafts.${home._id}`)
  if (draft) await client.patch(draft._id).setIfMissing({galleryImages:photos}).commit()
  console.log(`Main Gallery: ${photos.length} unique Sanity photos; source was ${files.length} files`)
}
main().catch(e => {console.error(e.message);process.exit(1)})
