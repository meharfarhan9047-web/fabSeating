'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { SiteCategory } from '@/lib/siteSections'
import { waLink } from '@/lib/siteContent'

export function FurnitureCategories({ categories }: { categories: SiteCategory[] }) {
  const collection = useRef<HTMLDivElement>(null)
  const move = (direction: number) => collection.current?.scrollBy({ left: direction * collection.current.clientWidth * 0.8, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  return (
    <section id="solutions" className="bg-white py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary-700">What We Make</span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-primary-950 md:text-4xl">Explore by Furniture</h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">Custom furniture and furnishings for homes, offices and hospitality spaces.</p>
        </div>
        <div className="mx-auto max-w-6xl">
          <div className="mb-4 flex justify-end gap-2">
            <button type="button" onClick={() => move(-1)} aria-label="Previous furniture categories" aria-controls="furniture-collection" className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-200 text-xl text-primary-950 hover:bg-primary-50">←</button>
            <button type="button" onClick={() => move(1)} aria-label="Next furniture categories" aria-controls="furniture-collection" className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-200 text-xl text-primary-950 hover:bg-primary-50">→</button>
          </div>
          <div ref={collection} id="furniture-collection" className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-5" aria-label="Furniture categories">
            {categories.map((category) => <Link key={category.slug} href={`/category/${category.slug}`} className="group w-40 shrink-0 snap-start text-center md:w-52">
              <div className="relative aspect-square overflow-hidden rounded-full border border-primary-100 bg-primary-50">
                {category.cover ? <Image src={category.cover} alt={category.title} fill sizes="(max-width:768px) 160px, 208px" className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105" /> : <div className="flex h-full items-center justify-center p-6 font-serif text-xl text-primary-800">{category.title}</div>}
              </div>
              <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-primary-950">{category.title}</h3>
            </Link>)}
          </div>
        </div>
        <div className="mt-10 text-center"><a href={waLink('Hi Fab Seating, I would like to know more about your furniture & furnishing solutions.')} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-full bg-primary-950 px-7 py-3.5 text-sm font-semibold text-white hover:bg-primary-800">Enquire on WhatsApp</a></div>
      </div>
    </section>
  )
}
