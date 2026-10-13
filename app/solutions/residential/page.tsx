import { getSolutionPage } from '@/lib/sanity/queries'
import { ResponsiveImage } from '@/components/ResponsiveImage'
import { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/PageHero'
import { Section } from '@/components/Section'
import { generateSEOMetadata } from '@/components/SEOHead'
import { CONTACT, waLink } from '@/lib/siteContent'

export const revalidate = 300

export const metadata: Metadata = generateSEOMetadata({
  title: 'Custom Furniture & Home Interiors in Chennai',
  description: 'Custom furniture and complete home furnishing solutions in Chennai — sofas, beds, wardrobes, dining sets, curtains and rugs, designed around your life.',
  path: '/solutions/residential',
})

const WHAT_WE_DESIGN = [
  ['Living Room Furniture', 'Sofas, lounge chairs, centre tables, TV units.'],
  ['Bedroom Furniture', 'Beds, wardrobes, side tables, storage solutions.'],
  ['Dining Spaces', 'Dining tables, chairs, and space-optimised layouts.'],
  ['Smart Storage', 'Wardrobes, modular storage, space-saving designs.'],
  ['Home Office Furniture', 'Functional, comfortable work-from-home setups.'],
  ['Furnishings & Decor', 'Curtains, blinds, rugs, mattresses, and soft furnishings.'],
]
const WHY_CHOOSE = [
  'Over 20+ years of furniture manufacturing experience',
  'Fully custom-made furniture tailored to your space',
  'Premium materials suited for Indian climate and usage',
  'Seamless integration of furniture + furnishings + decor',
  'One team handling design, production, and installation',
  'Strong focus on comfort, durability, and usability',
]
const DIFFERENT = [
  'Consistent design language across rooms',
  'Better space utilisation',
  'Long-term durability',
  'A more premium, finished look',
]
const APPROACH = [
  'Understand your space, layout, and lifestyle',
  'Develop concepts and optimise layouts',
  'Select materials, finishes, and custom details',
  'Manufacture with precision and quality control',
  'Deliver, install, and complete final styling',
]

export default async function ResidentialPage() {
  const page = await getSolutionPage('residential')
  const homes = page?.galleryImages ?? []
  const hero = homes.slice(0, 3)

  return (
    <>
      <PageHero
        title={page?.title || "Custom Furniture & Home Interiors Designed Around Your Life"}
        subtitle={page?.subtitle || "Custom furniture in Chennai for homes that need more than just good-looking pieces."}
        titleClassName="text-3xl sm:text-4xl md:text-5xl leading-[1.05]"
        contentClassName="max-w-5xl"
      />
      <Section className="pt-0">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Intro + CTAs */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              At Fab Seating, we design and manufacture <strong>custom furniture in Chennai</strong> for homes that need more than just good-looking pieces. From sofas and beds to wardrobes, dining sets, curtains, and rugs — every element is built to fit your space, your lifestyle, and your comfort.
            </p>
            <p className="text-base md:text-lg text-primary-800 font-medium">
              Not a display showroom — a walk-in experience studio where your ideas take shape.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a href={waLink('Hi Fab Seating, I would like to design my home.')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-primary-950 px-7 py-3.5 text-white font-semibold text-sm shadow-lg hover:bg-primary-900 hover:-translate-y-1 transition-all">Design My Home</a>
              <a href={CONTACT.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-primary-300 px-7 py-3.5 text-primary-900 font-semibold text-sm hover:bg-primary-50 transition-all">Visit Our Showroom</a>
            </div>
          </div>

          {/* Hero gallery */}
          {hero.length > 0 && (
            <div className="grid gap-6 md:grid-cols-3">
              {hero.map((src, i) => (
                <div key={i} className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/5">
                  <ResponsiveImage image={src} alt={`Fab Seating residential project ${i + 1}`} fill sizes="(max-width:768px) 100vw, 33vw" />
                </div>
              ))}
            </div>
          )}

          {/* Positioning */}
          <div className="text-center max-w-4xl mx-auto space-y-4">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary-950">A home isn&apos;t defined by individual furniture pieces</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              It&apos;s shaped by how everything works together. At Fab Seating, we create <strong>complete home furniture and furnishing solutions</strong> where sofas, storage, fabrics, lighting, and finishes are thoughtfully designed as one system. The result is a home that feels cohesive, functional, and built to last for years.
            </p>
          </div>

          {/* What We Design */}
          <div className="bg-gradient-to-br from-primary-50 to-white rounded-3xl p-8 md:p-12 shadow-lg">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary-950 mb-2 text-center">Complete Residential Furniture Solutions</h2>
            <p className="text-center text-gray-600 mb-8">We design and deliver custom home furniture in Chennai across every part of your home.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {WHAT_WE_DESIGN.map(([t, d]) => (
                <div key={t} className="rounded-2xl bg-white p-5 shadow-sm">
                  <h3 className="font-serif text-lg font-semibold text-primary-950 mb-1">{t}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-primary-800 font-medium mt-6">Built for apartments, villas, and independent homes.</p>
          </div>

          {/* Why Choose */}
          <div className="grainy-gradient rounded-3xl p-8 md:p-12 shadow-xl text-white">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2 relative z-10">Trusted for Custom Furniture &amp; Interiors in Chennai</h2>
            <div className="grid md:grid-cols-2 gap-3 mt-6 relative z-10">
              {WHY_CHOOSE.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl bg-white/10 p-4">
                  <span className="mt-1 h-2 w-2 rounded-full bg-white flex-shrink-0"></span>
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What Makes Us Different */}
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary-950 mb-3">Not Just Furniture — Complete Home Solutions</h2>
            <p className="text-gray-700 mb-6">Unlike standard furniture stores, we don&apos;t sell isolated pieces. We design your home as a complete system — ensuring:</p>
            <div className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto text-left">
              {DIFFERENT.map((d) => (
                <div key={d} className="flex items-center gap-3 rounded-xl border border-primary-100 bg-white p-4 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-500"></span>
                  <span className="text-primary-900 font-medium">{d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Our Approach */}
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary-950 mb-2 text-center">From Idea to Installation</h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary-700 to-transparent mx-auto mb-8"></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {APPROACH.map((step, i) => (
                <div key={i} className="rounded-2xl border border-primary-100 bg-white p-5 shadow-sm text-center">
                  <div className="mx-auto mb-3 w-9 h-9 rounded-full bg-primary-950 text-white flex items-center justify-center text-sm font-bold">{i + 1}</div>
                  <p className="text-sm text-primary-800 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Homes We've Designed */}
          {homes.length > 0 && (
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary-950 mb-2 text-center">Homes We&apos;ve Designed</h2>
              <p className="text-center text-gray-600 mb-8">Living room setups, bedrooms, and full home projects.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {homes.map((src, i) => (
                  <div key={i} className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-md ring-1 ring-black/5">
                    <ResponsiveImage image={src} alt={`Fab Seating home project ${i + 1}`} fill sizes="(max-width:768px) 100vw, 33vw" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Final CTA */}
          <div className="bg-gradient-to-r from-primary-100 to-primary-50 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-primary-950 mb-3">Ready to Design a Home That Feels Complete?</h2>
            <p className="text-lg text-primary-700 mb-8 max-w-2xl mx-auto">Ideal for homeowners planning new homes, renovations, or custom furniture upgrades — across apartments, villas, and independent houses.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={waLink('Hi Fab Seating, I would like to start my home project.')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-950 text-white font-medium rounded-full hover:bg-primary-900 transition-all hover:-translate-y-1 shadow-lg text-sm tracking-wider uppercase">Start Your Home Project</a>
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-primary-950 text-primary-950 font-medium rounded-full hover:bg-primary-950 hover:text-white transition-all text-sm tracking-wider uppercase">Book a Consultation</Link>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
