import { Metadata } from 'next'
import { PageHero } from '@/components/PageHero'
import { Section } from '@/components/Section'
import { generateSEOMetadata } from '@/components/SEOHead'
import Link from 'next/link'
import Image from 'next/image'
import { getSolutionPage } from '@/lib/sanity/queries'
import { ResponsiveImage } from '@/components/ResponsiveImage'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSolutionPage('hospitality')
  const defaultTitle = 'Hospitality Furniture and Furnishings'
  const defaultDescription = 'Durable and stylish furniture and furnishings solutions for hospitality spaces'
  
  if (!page) {
    return generateSEOMetadata({
      title: defaultTitle,
      description: defaultDescription,
      path: '/solutions/hospitality',
    })
  }
  return page.seo ? generateSEOMetadata({
    seo: page.seo,
    title: defaultTitle,
    description: defaultDescription,
    image: page.heroImage,
    path: '/solutions/hospitality',
  }) : generateSEOMetadata({
    title: defaultTitle,
    description: defaultDescription,
    path: '/solutions/hospitality',
  })
}

const furnitureIcons: Record<string, string> = {}
const furnishingsIcons: Record<string, string> = {}

export default async function HospitalityPage() {
  const page = await getSolutionPage('hospitality')

  // Fallback content if no Sanity data exists
  const fallbackContent = {
    emoji: '🏨',
    title: 'HOSPITALITY',
    subtitle: 'Furniture and furnishings crafted to elevate guest experience.',
    tagline: 'In hospitality, every detail shapes perception. From lobby to the guest room, comfort, durability, and aesthetics must work seamlessly together.',
    introText: 'Fab Seating delivers hospitality environments built to withstand high traffic while maintaining refined visual appeal.',
    imageOptions: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1551884947-55d9348293e0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598928506311-c55ded91e20c?auto=format&fit=crop&w=1200&q=80'
    ],
    designedFor: [
      'Guest room environments',
      'Restaurant and café seating systems',
      'Lobby and lounge concepts',
      'Outdoor hospitality furniture',
      'Branded custom-built solutions',
      'Commercial-grade furnishings and soft decor'
    ],
    whyTrustUs: [
      'High-traffic durability',
      'Custom finishes and branding integration',
      'Timely project execution',
      'Experience across hotels, cafés, and restaurants'
    ],
    approach: [
      'Understand your space and usage',
      'Concept development and layout planning',
      'Material selection and customization',
      'Production and quality control',
      'Installation and final styling'
    ],
    bestSuitedFor: 'Perfect for hotels, resorts, restaurants, cafés, bars, and event venues seeking durable, stylish, and guest-friendly environments.',
  }

  // Use Sanity data if available, otherwise use fallback
  const content = {
    title: `${page?.emoji || fallbackContent.emoji} ${page?.title || fallbackContent.title}`,
    subtitle: page?.subtitle || fallbackContent.subtitle,
    tagline: page?.tagline || fallbackContent.tagline,
    introText: page?.introText || fallbackContent.introText,
    imageOptions: (page?.galleryImages && page.galleryImages.length > 0) ? [] : fallbackContent.imageOptions,
    designedFor: page?.whatWeDesign || fallbackContent.designedFor,
    whyTrustUs: page?.whyChooseUs || fallbackContent.whyTrustUs,
    approach: page?.approach || fallbackContent.approach,
    bestSuitedFor: page?.bestSuitedFor || fallbackContent.bestSuitedFor,
  }

  return (
    <>
      <PageHero
        title={content.title}
        subtitle={content.subtitle}
        contentClassName="max-w-6xl"
        titleClassName="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.05]"
      />
      <Section>
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Hero gallery */}
          <div className="space-y-8">
            <div className="grid gap-6 md:gap-8 md:grid-cols-3">
              {[
                page?.galleryImages?.[0] || page?.heroImage,
                page?.galleryImages?.[1] || page?.secondaryImage || page?.heroImage,
                page?.galleryImages?.[2] || page?.heroImage || page?.secondaryImage,
              ].filter(Boolean).map((image, index) => (
                <div
                  key={index}
                  className="group relative aspect-[4/3] md:aspect-[3/4] rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:ring-primary-300/40"
                >
                  {typeof image === 'string' ? (
                    <Image
                      src={image}
                      alt={`${content.title} - Image ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  ) : (
                    <ResponsiveImage
                      image={image}
                      alt={`${content.title} - Image ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center space-y-4">
              <p className="text-xl text-primary-700 leading-relaxed max-w-4xl mx-auto">
                {content.tagline}
              </p>
              <p className="text-lg text-primary-600 leading-relaxed max-w-4xl mx-auto">
                {content.introText}
              </p>
            </div>
          </div>

          {/* Designed For */}
          <div className="bg-gradient-to-br from-primary-50 to-white rounded-3xl p-8 md:p-12 shadow-lg">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-primary-950 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h2 className="min-w-0 break-words font-serif text-3xl font-bold text-primary-950">Designed For Hospitality Spaces</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {content.designedFor.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full bg-primary-950"></div>
                  <span className="text-primary-800 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Why Trust Us */}
          <div className="bg-gradient-to-br from-primary-950 to-primary-900 rounded-3xl p-8 md:p-12 shadow-xl text-white">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="min-w-0 break-words font-serif text-3xl font-bold">Why Hospitality Brands Trust Us</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {content.whyTrustUs.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Our Approach */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
              {page?.secondaryImage ? (
                <ResponsiveImage
                  image={page.secondaryImage}
                  alt={content.title}
                  fill
                  className="object-cover"
                />
              ) : null
              }
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-200 flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="min-w-0 break-words font-serif text-3xl font-bold text-primary-950">Our Approach</h2>
              </div>
              <div className="space-y-3">
                {content.approach.map((step, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary-950 text-white flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className="text-primary-700 font-medium">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-primary-100 to-primary-50 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="min-w-0 break-words font-serif text-3xl font-bold text-primary-950 mb-4">
              Ready to Elevate Your Guest Experience?
            </h2>
            <p className="text-lg text-primary-700 mb-8 max-w-2xl mx-auto">
              {content.bestSuitedFor}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-950 text-white font-medium rounded-full hover:bg-primary-900 transition-all duration-300 hover:gap-3 shadow-lg hover:-translate-y-1 hover:shadow-2xl group"
              >
                <span className="text-sm tracking-wider uppercase">Start Your Project</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                href="/projects?category=hospitality"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-primary-950 text-primary-950 font-medium rounded-full hover:bg-primary-950 hover:text-white transition-all duration-300 hover:gap-3 group"
              >
                <span className="text-sm tracking-wider uppercase">View Venues</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
