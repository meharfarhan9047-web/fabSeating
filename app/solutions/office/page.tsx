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
  const page = await getSolutionPage('office')
  const defaultTitle = 'Office Furniture and Furnishings'
  const defaultDescription = 'Professional furniture and furnishings solutions for office spaces'
  
  if (!page) {
    return generateSEOMetadata({
      title: defaultTitle,
      description: defaultDescription,
      path: '/solutions/office',
    })
  }
  return page.seo ? generateSEOMetadata({
    seo: page.seo,
    title: defaultTitle,
    description: defaultDescription,
    image: page.heroImage,
    path: '/solutions/office',
  }) : generateSEOMetadata({
    title: defaultTitle,
    description: defaultDescription,
    path: '/solutions/office',
  })
}

const furnitureIcons: Record<string, string> = {}
const furnishingsIcons: Record<string, string> = {}

export default async function OfficePage() {
  const page = await getSolutionPage('office')

  // Fallback content if no Sanity data exists
  const fallbackContent = {
    emoji: '🏢',
    title: 'OFFICE',
    subtitle: 'Workspaces engineered for productivity, culture, and growth.',
    tagline: 'An office isn\'t just where work happens. It shapes how teams collaborate, focus, and perform.',
    introText: 'Fab Seating designs office environments that balance ergonomics, aesthetics, and efficiency — from executive cabins to large-scale corporate floors.',
    imageOptions: [
      '/office-hero.jpg', // Your uploaded image
      'https://images.unsplash.com/photo-1497366214047-3361a0a2d8e1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517002366821-a344e6c3b3f6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1603796836034-708c3f1b7d81?auto=format&fit=crop&w=1200&q=80'
    ],
    whatWeDesign: [
      'Ergonomic seating systems',
      'Modular workstation layouts',
      'Executive and boardroom environments',
      'Collaborative breakout zones',
      'Reception spaces that elevate brand perception',
      'Smart storage and partition systems'
    ],
    whyChooseUs: [
      'Scalable designs',
      'Durable commercial-grade materials',
      'Custom layouts based on workflow',
      'Professional project coordination'
    ],
    approach: [
      'Understand your space and usage',
      'Concept development and layout planning',
      'Material selection and customization',
      'Production and quality control',
      'Installation and final styling'
    ],
    bestSuitedFor: 'Perfect for corporate offices, co-working spaces, startups, and professional service firms seeking scalable, professional workspace solutions.',
  }

  // Use Sanity data if available, otherwise use fallback
  const content = {
    title: `${page?.emoji || fallbackContent.emoji} ${page?.title || fallbackContent.title}`,
    subtitle: page?.subtitle || fallbackContent.subtitle,
    tagline: page?.tagline || fallbackContent.tagline,
    introText: page?.introText || fallbackContent.introText,
    imageOptions: (page?.galleryImages && page.galleryImages.length > 0) ? [] : fallbackContent.imageOptions,
    whatWeDesign: page?.whatWeDesign || fallbackContent.whatWeDesign,
    whyChooseUs: page?.whyChooseUs || fallbackContent.whyChooseUs,
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

          {/* What We Build */}
          <div className="bg-gradient-to-br from-primary-50 to-white rounded-3xl p-8 md:p-12 shadow-lg">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-primary-950 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="min-w-0 break-words font-serif text-3xl font-bold text-primary-950">What We Build For Workspaces</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {content.whatWeDesign.map((item: string, index: number) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm">
                  <div className="w-2 h-2 rounded-full bg-primary-950"></div>
                  <span className="text-primary-800 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Built For Teams */}
          <div className="bg-gradient-to-br from-primary-950 to-primary-900 rounded-3xl p-8 md:p-12 shadow-xl text-white">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="min-w-0 break-words font-serif text-3xl font-bold">Built For Growing Teams</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {content.whyChooseUs.map((item: string, index: number) => (
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
                {content.approach.map((step: string, index: number) => (
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
              Ready to Transform Your Workspace?
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
                href="/projects?category=office"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-primary-950 text-primary-950 font-medium rounded-full hover:bg-primary-950 hover:text-white transition-all duration-300 hover:gap-3 group"
              >
                <span className="text-sm tracking-wider uppercase">View Workspaces</span>
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
