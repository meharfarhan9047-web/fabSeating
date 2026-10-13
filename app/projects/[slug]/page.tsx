import { cache } from 'react'
import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { getProjectBySlug, getCaseStudyBySlug } from '@/lib/sanity/queries'
import { SanityCaseStudyView } from '@/components/SanityCaseStudyView'
import { generateSEOMetadata } from '@/components/SEOHead'

export const revalidate = 300
const loadProject = cache(getProjectBySlug)

interface ProjectPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = await loadProject(params.slug)
  if (!project) return {}
  return generateSEOMetadata({
    seo: project.seo,
    image: project.images?.[0],
    title: project.seo?.title || project.title,
    description: project.seo?.description || project.description || project.title,
    path: `/projects/${params.slug}`,
    noIndex: project.seo?.noIndex,
  })
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await loadProject(params.slug)
  if (!project) {
    // Preserve project URLs that actually refer to an existing case study.
    const study = await getCaseStudyBySlug(params.slug)
    if (study) redirect(`/case-studies/${params.slug}`)
    notFound()
  }
  return <SanityCaseStudyView
    study={{
      _id: project._id,
      _type: 'caseStudy',
      title: project.title,
      slug: project.slug,
      summary: project.description,
      heroImage: project.images?.find((image) => image.asset || image.imageUrl),
      gallery: project.images,
      location: project.location,
      year: project.year,
      industry: project.category,
      videoUrl: project.videoUrl,
    }}
    backHref="/projects"
    backLabel="Back to Gallery"
  />
}
