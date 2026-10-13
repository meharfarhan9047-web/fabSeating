export interface Product {
  _id: string
  _type: 'product'
  _updatedAt?: string
  title: string
  slug?: { current: string }
  description?: string
  category?: {
    _id: string
    title: string
    slug: { current: string }
  }
  price?: number
  images?: SanityImage[]
  specifications?: Array<{
    label: string
    value: string
  }>
  featured?: boolean
  seo?: SEO
}

export interface ProductCategory {
  _id: string
  _type: 'productCategory'
  title: string
  slug: { current: string }
  description?: string
  image?: SanityImage
}

export interface Project {
  _id: string
  _type: 'project'
  _updatedAt?: string
  title: string
  slug: { current: string }
  description?: string
  images?: SanityImage[]
  videoUrl?: string
  location?: string
  year?: string
  category?: 'residential' | 'office' | 'hospitality'
  furniture?: string[]
  furnishings?: string[]
  featured?: boolean
  seo?: SEO
}

export interface CaseStudy {
  _id: string
  _type: 'caseStudy'
  _updatedAt?: string
  title: string
  subtitle?: string
  slug: { current: string }
  summary?: string
  heroImage?: SanityImage
  client?: string
  location?: string
  year?: string
  industry?: string
  story?: Array<{
    heading?: string
    content?: any
    image?: SanityImage
  }>
  showcase?: Array<{
    type: 'image' | 'video'
    image?: SanityImage
    videoUrl?: string
  }>
  challenge?: any
  solution?: any
  result?: any
  stats?: Array<{
    label: string
    value: string
  }>
  gallery?: SanityImage[]
  videoUrl?: string
  productsUsed?: Product[]
  testimonial?: {
    quote: string
    author: string
    role: string
  }
  seo?: SEO
}

export interface BlogPostSection {
  _key?: string
  number?: string
  title?: string
  tags?: string[]
  body?: any
  highlight?: string
}

export interface BlogPost {
  _id: string
  _type: 'blogPost'
  _updatedAt?: string
  title: string
  slug: { current: string }
  excerpt?: string
  content?: any
  featuredImage?: SanityImage
  author?: {
    name: string
    image?: SanityImage
  }
  publishedAt?: string
  seo?: SEO
  /** Journal layout (same as main site blog articles) */
  useJournalLayout?: boolean
  heroTag?: string
  byline?: string
  intro?: any
  sections?: BlogPostSection[]
  summaryTitle?: string
  summaryBody?: any
  summaryBullets?: string[]
  ctaHeading?: string
  ctaDescription?: string
  readTime?: string
  category?: string
}

export interface Testimonial {
  _id: string
  _type: 'testimonial'
  name: string
  role?: string
  company?: string
  content: string
  image?: SanityImage
  rating?: number
  featured?: boolean
}

export interface FAQ {
  _id: string
  _type: 'faq'
  question: string
  answer: any
  category?: string
}

export interface SanityImage {
  _key?: string
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
  caption?: string
  imageUrl?: string
}

export interface SEO {
  title?: string
  description?: string
  image?: SanityImage
  noIndex?: boolean
}

export interface LandingPage {
  _id: string
  _type: 'landingPage'
  title: string
  slug: { current: string }
  sections?: LandingPageSection[]
  seo?: SEO
}

export interface SolutionPage {
  _id: string
  _type: 'solutionPage'
  type: 'residential' | 'office' | 'hospitality'
  title: string
  subtitle?: string
  introText: string
  heroImage?: SanityImage
  furnitureItems: string[]
  furnishingsItems: string[]
  bestSuitedFor: string
  secondaryImage?: SanityImage
  seo?: SEO
}

export type LandingPageSection =
  | { _type: 'hero'; title?: string; subtitle?: string; image?: SanityImage; cta?: { text: string; link: string } }
  | { _type: 'features'; title?: string; items?: Array<{ title: string; description: string; icon?: string }> }
  | { _type: 'textWithImage'; title?: string; content?: any; image?: SanityImage; imagePosition?: 'left' | 'right' }
  | { _type: 'testimonials'; title?: string; testimonials?: Testimonial[] }
  | { _type: 'faq'; title?: string; faqs?: FAQ[] }
  | { _type: 'cta'; title?: string; subtitle?: string; buttonText?: string; buttonLink?: string }

export interface Catalog {
  _id: string
  _type: 'catalog'
  title: string
  description?: string
  coverImage?: SanityImage
  fileUrl?: string | null
  seo?: SEO
}
