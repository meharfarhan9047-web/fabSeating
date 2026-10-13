'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { ProductImage } from '@/lib/sanity/queries'

export function ProductGalleryCard({ product }: { product: ProductImage }) {
  const images = Array.from(new Set([product.src, ...(product.images || [])].filter(Boolean)))
  const [selected, setSelected] = useState(product.src)
  const active = images.includes(selected) ? selected : product.src
  return (
    <article className="overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-sm">
      <div className="relative aspect-square bg-[#f7f5f0]">
        <Image src={active} alt={product.title} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-contain p-2" />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto p-3" aria-label={`${product.title} views`}>
          {images.map((src, index) => (
            <button key={src} type="button" aria-label={`Show ${product.title} view ${index + 1}`} aria-pressed={active === src} onClick={() => setSelected(src)} className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 ${active === src ? 'border-primary-700' : 'border-primary-100'}`}>
              <Image src={src} alt="" fill sizes="56px" className="object-contain" />
            </button>
          ))}
        </div>
      )}
      <h2 className="p-3 text-sm font-medium text-primary-900">{product.title}</h2>
    </article>
  )
}
