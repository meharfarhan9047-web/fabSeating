import { MetadataRoute } from 'next'
import { getCaseStudies, getProjects, getBlogPosts } from '@/lib/sanity/queries'
import { BLOG_POSTS } from '@/lib/blog/posts'
import { getSiteSections } from '@/lib/siteSections'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fabseating.com'
  const [studies, sections, projects, posts] = await Promise.all([getCaseStudies(), getSiteSections(), getProjects(), getBlogPosts()])

  const routes = [
    '',
    '/projects',
    ...projects.map((project) => `/projects/${project.slug.current}`),
    '/blog',
    ...Array.from(new Set([...BLOG_POSTS.map((post) => post.slug), ...posts.map((post) => post.slug.current)])).map((slug) => `/blog/${slug}`),
    '/case-studies',
    ...studies.map((study) => `/case-studies/${study.slug.current}`),
    '/contact',
    '/custom-bespoke',
    '/solutions/residential',
    '/solutions/office',
    '/solutions/hospitality',
    ...sections.categories.map((c) => `/category/${c.slug}`),
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return routes
}
