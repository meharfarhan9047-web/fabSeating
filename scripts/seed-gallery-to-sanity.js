/** Adds the existing showroom photos to Sanity without replacing client content.
 * node scripts/seed-gallery-to-sanity.js --commit
 */
const fs = require('fs')
const path = require('path')
const envFile = path.join(__dirname, '..', '.env.local')
for (const line of (fs.existsSync(envFile) ? fs.readFileSync(envFile, 'utf8') : '').split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
}
const groups = [
  { slug: 'showroom-blush-sofa', title: 'Blush Upholstered Sofa', category: 'sofas', files: ['5D5A6203.jpg', '5D5A6187.jpg'] },
  { slug: 'showroom-taupe-sofa', title: 'Taupe Upholstered Sofa', category: 'sofas', files: ['5D5A6255.jpg', '5D5A6258.jpg'] },
  { slug: 'showroom-patterned-lounge-chair', title: 'Patterned Lounge Chair', category: 'lounge-chairs', files: ['5D5A8750.jpg', '5D5A8750-1.jpg'] },
  { slug: 'showroom-cream-recliner', title: 'Cream Recliner', category: 'lounge-chairs', files: ['5D5A8972.jpg', '5D5A8972-1.jpg'] },
]
const gallery = ['5D5A6038.jpg', '5D5A8249.jpg', '5D5A6203.jpg', '5D5A6363.jpg', '5D5A3823.jpg', '5D5A8275.jpg', '5D5A8750.jpg', '5D5A8874.jpg', '5D5A8972.jpg', '5D5A6315.jpg', '5D5A4106.jpg', '5D5A8781.jpg']
async function main() {
  if (!process.argv.includes('--commit')) { console.log(`Dry run: ${groups.length} multi-view products and ${gallery.length} residential gallery images`); return }
  if (!process.env.SANITY_API_WRITE_TOKEN) throw new Error('Missing SANITY_API_WRITE_TOKEN')
  const { createClient } = require('@sanity/client')
  const client = createClient({ projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'n59kaaxb', dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_API_WRITE_TOKEN, useCdn: false })
  const uploads = new Map()
  function upload(filename) {
    if (!uploads.has(filename)) uploads.set(filename, client.assets.upload('image', fs.createReadStream(path.join(__dirname, '..', 'public/images/gallery', filename)), { filename }).then(asset => ({ _type: 'image', _key: filename.replace(/[^a-zA-Z0-9]/g, '-'), asset: { _type: 'reference', _ref: asset._id } })))
    return uploads.get(filename)
  }
  for (const group of groups) {
    const id = `product-${group.slug}`
    if (await client.getDocument(id)) continue
    const images = await Promise.all(group.files.map(upload))
    await client.createIfNotExists({ _id: id, _type: 'product', title: group.title, slug: { _type: 'slug', current: group.slug }, category: { _type: 'reference', _ref: `productCategory-${group.category}` }, images })
    console.log(`Added multi-view product: ${group.title}`)
  }
  const doc = await client.fetch('*[_type == "solutionPage" && type == "residential" && !(_id in path("drafts.**"))][0]')
  const id = doc?._id || 'solutionPage-residential'
  if (!doc) await client.createIfNotExists({ _id: id, _type: 'solutionPage', type: 'residential', title: 'Custom Furniture & Home Interiors Designed Around Your Life', subtitle: 'Custom furniture in Chennai for homes that need more than just good-looking pieces.', tagline: 'Complete furniture and furnishings designed around your life.', introText: 'At Fab Seating, we design and manufacture custom furniture in Chennai for homes that need more than just good-looking pieces.', whatWeDesign: ['Living room furniture', 'Bedroom furniture', 'Dining spaces', 'Storage and furnishings'], whyChooseUs: ['Custom-made furniture', 'Premium materials', 'Complete installation'], approach: ['Consultation', 'Design', 'Manufacturing', 'Installation'], bestSuitedFor: 'Apartments, villas and independent homes.' })
  if (!doc?.galleryImages?.length) {
    const images = []
    for (let offset = 0; offset < gallery.length; offset += 4) images.push(...await Promise.all(gallery.slice(offset, offset + 4).map(upload)))
    const patch = client.patch(id).set({ galleryImages: images })
    if (doc) patch.ifRevisionId(doc._rev)
    await patch.commit()
    console.log(`Residential gallery: ${images.length} Sanity images`)
  }
}
main().catch(e => { console.error(e.message); process.exit(1) })
