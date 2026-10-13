import { client } from './sanity/client'
import { BRAND_PARTNERS, CATEGORIES, CONTACT, FAQS, INDUSTRIES, type Category } from './siteContent'

// Content for the homepage sections (categories, partners, industries, FAQ,
// Google reviews). Images, brands and category associations are controlled by
// the published Homepage document. Empty CMS media fields stay empty.

export type SiteCategory = Category & {
  /** Sanity productCategory slugs whose products are listed on /category/<slug>. */
  productCategorySlugs: string[]
}
export type BrandPartner = { name: string; logo: string }
export type Faq = { q: string; a: string }
export type SiteSections = {
  categories: SiteCategory[]
  brandPartners: BrandPartner[]
  industries: string[]
  faqs: Faq[]
  reviewsUrl: string
}

// public/images folder -> Sanity productCategory slug (same mapping as scripts/upload-products-to-sanity.js)
export const DIR_TO_PRODUCT_CATEGORY: Record<string, string> = {
  sofas: 'sofas',
  'chairs/dining': 'dining-chairs',
  'chairs/office': 'office-chairs',
  'chairs/lounge': 'lounge-chairs',
  'dining-tables': 'dining-tables',
  'center-side-tables': 'center-side-tables',
  beds: 'beds',
  poufs: 'poufs',
  rugs: 'rugs',
}

const DEFAULT_CATEGORIES: SiteCategory[] = CATEGORIES.map((c) => ({
  ...c,
  productCategorySlugs: c.imageDirs.map((d) => DIR_TO_PRODUCT_CATEGORY[d]).filter(Boolean),
}))

export const DEFAULT_SECTIONS: SiteSections = {
  categories: DEFAULT_CATEGORIES,
  brandPartners: BRAND_PARTNERS,
  industries: INDUSTRIES,
  faqs: FAQS,
  reviewsUrl: CONTACT.reviewsUrl,
}

type Raw = {
  brandPartners?: { name?: string; logo?: string | null }[]
  furnitureCategories?: {
    title?: string
    slug?: string
    blurb?: string
    cover?: string | null
    productCategorySlugs?: (string | null)[]
  }[]
  industries?: string[]
  faqs?: { question?: string; answer?: string }[]
  googleReviewsUrl?: string
} | null

export async function getSiteSections(): Promise<SiteSections> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return DEFAULT_SECTIONS
  let raw: Raw = null
  try {
    raw = await client.fetch<Raw>(
      `*[_type == "homePage" && !(_id in path("drafts.**"))] | order(_id asc)[0] {
        brandPartners[] { name, "logo": logo.asset->url },
        furnitureCategories[] {
          title,
          "slug": slug.current,
          blurb,
          "cover": coverImage.asset->url,
          "productCategorySlugs": productCategories[]->slug.current
        },
        industries,
        faqs[] { question, answer },
        googleReviewsUrl
      }`,
      {},
      { next: { revalidate: 300, tags: ['sanity', 'sanity:homePage'] } } as any,
    )
  } catch {
    return { ...DEFAULT_SECTIONS, categories: [], brandPartners: [] }
  }
  if (!raw) return { ...DEFAULT_SECTIONS, categories: [], brandPartners: [] }

  const partners = (raw.brandPartners || [])
    .filter((b) => b?.name && b.logo)
    .map((b) => ({ name: b.name!, logo: b.logo! }))

  const categories = (raw.furnitureCategories || [])
    .filter((c) => c?.title && c.slug)
    .map((c) => {
      const fallback = DEFAULT_CATEGORIES.find((d) => d.slug === c.slug)
      const refs = (c.productCategorySlugs || []).filter((s): s is string => !!s)
      return {
        slug: c.slug!,
        title: c.title!,
        blurb: c.blurb || fallback?.blurb || '',
        cover: c.cover || null,
        imageDirs: fallback?.imageDirs || [],
        productCategorySlugs: refs,
      }
    })

  const industries = (raw.industries || []).filter(Boolean)
  const faqs = (raw.faqs || [])
    .filter((f) => f?.question && f.answer)
    .map((f) => ({ q: f.question!, a: f.answer! }))

  return {
    categories,
    brandPartners: partners,
    industries: industries.length ? industries : DEFAULT_SECTIONS.industries,
    faqs: faqs.length ? faqs : DEFAULT_SECTIONS.faqs,
    reviewsUrl: raw.googleReviewsUrl || DEFAULT_SECTIONS.reviewsUrl,
  }
}
