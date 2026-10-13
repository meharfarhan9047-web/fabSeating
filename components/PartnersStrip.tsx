import Image from 'next/image'
import { DEFAULT_SECTIONS, type BrandPartner } from '@/lib/siteSections'

export function PartnersStrip({ partners = DEFAULT_SECTIONS.brandPartners }: { partners?: BrandPartner[] }) {
  return (
    <section className="relative bg-white py-12 md:py-16 border-y border-primary-100/60">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-10">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary-700">Explore by Brands</span>
          <p className="mt-3 text-sm md:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We source premium fabrics, furnishings, wallpapers, and interior materials from some of the industry&apos;s most trusted brands&mdash;ensuring exceptional quality, durability, and timeless design in every project.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-0 max-w-6xl mx-auto">
          {partners.map((brand) => (
            <div
              key={brand.name}
              className="group flex items-center justify-center border border-primary-200 bg-white p-4 md:p-5 h-28 md:h-32 hover:shadow-md hover:border-primary-300/70 transition-all duration-300"
              title={brand.name}
            >
              <Image
                src={brand.logo}
                alt={`${brand.name} logo`}
                width={140}
                height={56}
                className="max-h-14 max-w-full w-auto object-contain opacity-90 group-hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
