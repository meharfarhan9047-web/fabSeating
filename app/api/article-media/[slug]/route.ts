import { readFile } from 'fs/promises'
import path from 'path'
import { getBlogPostBySlug } from '@/lib/blog/posts'
import { client, urlFor } from '@/lib/sanity/client'
import type { SanityImage } from '@/types'

export const revalidate = 300

export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  const post = getBlogPostBySlug(params.slug)
  if (!post) return new Response('Article not found', { status: 404 })
  const html = await readFile(path.join(process.cwd(), 'public', 'blog', post.htmlFile), 'utf8')
  const media = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    ? await client.fetch<{ image?: SanityImage } | null>(
      '*[_type == "articleMedia" && slug == $slug][0]{image}',
      { slug: post.slug },
      { next: { revalidate: 300, tags: ['sanity', 'sanity:articleMedia'] } } as any,
    ) : null
  const source = urlFor(media?.image)?.width(1200).auto('format').url()
  // The template is a trusted repository file; only its image URL is changed.
  const escaped = source?.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
  const content = html.replace(/<img\b[^>]*>/gi, (tag) => escaped ? tag.replace(/src="[^"]*"/, `src="${escaped}"`) : '')
  return new Response(content, { headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=0, must-revalidate' } })
}
