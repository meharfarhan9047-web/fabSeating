import { notFound } from 'next/navigation'
import { ProductGalleryCard } from '@/components/ProductGalleryCard'
import Link from 'next/link'
import { Metadata } from 'next'
import { PageHero } from '@/components/PageHero'
import { Section } from '@/components/Section'
import { waLink } from '@/lib/siteContent'
import { getSiteSections } from '@/lib/siteSections'
import { generateSEOMetadata } from '@/components/SEOHead'
import { getProductImagesByCategory } from '@/lib/sanity/queries'


export async function generateStaticParams() {
  const { categories } = await getSiteSections()
  const slugs = new Set(categories.map((c) => c.slug))
  return Array.from(slugs, (slug) => ({ slug }))
}

async function findCategory(slug: string) {
  const { categories } = await getSiteSections()
  return categories.find((c) => c.slug === slug)
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const cat = await findCategory(params.slug)
  if (!cat) return {}
  return generateSEOMetadata({
    title: `${cat.title} in Chennai`,
    description: cat.blurb,
    path: `/category/${cat.slug}`,
  })
}

export const revalidate = 300

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const cat = await findCategory(params.slug)
  if (!cat) notFound()

  const images = await getProductImagesByCategory(cat.productCategorySlugs)

  return (
    <>
      <PageHero title={cat.title} subtitle={cat.blurb} />
      <Section>
        <div className="max-w-6xl mx-auto">
          {images.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {images.map((img) => (
                <ProductGalleryCard key={img.src} product={img} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 rounded-3xl border border-primary-100 bg-primary-50/40">
              <h3 className="font-serif text-2xl font-semibold text-primary-950 mb-3">Collection coming soon</h3>
              <p className="text-gray-600 max-w-xl mx-auto mb-6">We craft {cat.title.toLowerCase()} fully custom to your space. Message us on WhatsApp with your requirements for designs and a personalized quote.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <a
              href={waLink(`Hi Fab Seating, I'm interested in ${cat.title}. Please share details.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-8 py-4 text-white font-semibold text-sm shadow-lg hover:bg-[#1eb955] hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
            >
              Enquire on WhatsApp
            </a>
            <div className="mt-6">
              <Link href="/#solutions" className="text-sm text-primary-700 hover:text-primary-900 underline underline-offset-4">&larr; Back to all categories</Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
