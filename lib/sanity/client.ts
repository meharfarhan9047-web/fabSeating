import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImage } from '@/types'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export const client = createClient({
  projectId: projectId || 'placeholder',
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  perspective: 'published',
})

const builder = imageUrlBuilder(client)

export function urlFor(source: SanityImage | undefined) {
  if (!source || !source.asset) return null
  return builder.image(source)
}

