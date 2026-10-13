import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { generateSEOMetadata } from '@/components/SEOHead'
import { getCaseStudyBySlug } from '@/lib/sanity/queries'
import { SanityCaseStudyView } from '@/components/SanityCaseStudyView'

export const revalidate = 300

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const study = await getCaseStudyBySlug(params.slug)
  return generateSEOMetadata({
    seo: study?.seo,
    title: study?.title || 'Case Study',
    description: study?.summary,
    image: study?.heroImage,
    path: `/case-studies/${params.slug}`,
  })
}

export default async function CaseStudyPage({ params }: Props) {
  const study = await getCaseStudyBySlug(params.slug)
  if (!study) notFound()
  return <SanityCaseStudyView study={study} />
}
