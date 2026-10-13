import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { PageHero } from './PageHero'
import { Section } from './Section'
import { ResponsiveImage } from './ResponsiveImage'
import { ProductGalleryCard } from './ProductGalleryCard'
import { urlFor } from '@/lib/sanity/client'
import type { CaseStudy } from '@/types'

const portableComponents = {
  types: {
    image: ({ value }: { value: any }) => <div className="relative my-6 aspect-[4/3]"><ResponsiveImage image={value} alt={value.alt || ''} fill /></div>,
  },
}

export function SanityCaseStudyView({ study, backHref = '/case-studies', backLabel = 'Back to all case studies' }: { study: CaseStudy; backHref?: string; backLabel?: string }) {
  const showcase = (study.showcase || []).filter((item) => item.type === 'image' ? item.image?.asset : item.videoUrl)
  const gallery = (study.gallery || []).filter((image) => image.asset || image.imageUrl)
  const media = showcase.length ? showcase : (gallery.length ? gallery : study.heroImage ? [study.heroImage] : []).map((image) => ({ type: 'image' as const, image, videoUrl: undefined }))
  const sections: { heading: string; content: any }[] = [
    { heading: 'The Challenge', content: study.challenge },
    { heading: 'The Solution', content: study.solution },
    { heading: 'The Result', content: study.result },
  ]
  return (
    <>
      <PageHero title={study.title} subtitle={study.subtitle || study.summary} />
      <Section>
        <div className="mx-auto max-w-6xl">
          {study.heroImage && <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl"><ResponsiveImage image={study.heroImage} alt={study.title} fill priority sizes="(max-width: 1200px) 100vw, 1152px" /></div>}
          <dl className="mb-12 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[['Client', study.client], ['Location', study.location], ['Year', study.year], ['Sector', study.industry]].filter(([, value]) => value).map(([label, value]) => <div key={label} className="min-w-0 break-words"><dt className="text-sm text-gray-600">{label}</dt><dd className="font-medium text-primary-950">{value}</dd></div>)}
          </dl>
          {study.summary && <p className="mb-12 text-lg leading-relaxed text-gray-700">{study.summary}</p>}
          {study.story?.map((story, index) => (
            <section key={index} className="mb-12 grid items-center gap-8 md:grid-cols-2">
              <div className={index % 2 ? 'md:order-2' : ''}><h2 className="mb-4 font-serif text-3xl text-primary-950">{story.heading}</h2><div className="prose max-w-none">{story.content && <PortableText value={story.content} components={portableComponents} />}</div></div>
              {story.image && <div className="relative aspect-[4/3] overflow-hidden rounded-2xl"><ResponsiveImage image={story.image} alt={story.heading || study.title} fill /></div>}
            </section>
          ))}
          {sections.filter((section) => section.content?.length).map((section) => <section key={section.heading} className="mb-12"><h2 className="mb-4 font-serif text-3xl text-primary-950">{section.heading}</h2><div className="prose max-w-none"><PortableText value={section.content} components={portableComponents} /></div></section>)}
          {!!study.stats?.length && <dl className="mb-12 grid gap-6 sm:grid-cols-3">{study.stats.map((stat, index) => <div key={index} className="rounded-xl bg-primary-50 p-6"><dt className="text-sm text-primary-700">{stat.label}</dt><dd className="font-serif text-2xl text-primary-950">{stat.value}</dd></div>)}</dl>}
          {!!study.productsUsed?.length && <section className="mb-12"><h2 className="mb-6 font-serif text-3xl text-primary-950">Products Used</h2><div className="grid grid-cols-2 gap-4 md:grid-cols-3">{study.productsUsed.map((product) => {
            const images = (product.images || []).flatMap((image) => { const src = urlFor(image)?.width(1000).auto('format').url(); return src ? [src] : [] })
            return images.length ? <ProductGalleryCard key={product._id} product={{ id: product._id, title: product.title, src: images[0], images }} /> : <p key={product._id}>{product.title}</p>
          })}</div></section>}
          {!!media.length && <section><h2 className="mb-6 font-serif text-3xl text-primary-950">Project Gallery</h2><div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{media.map((item, index) => <div key={index} className="relative aspect-square overflow-hidden rounded-2xl bg-primary-50">{item.type === 'image' && item.image ? <ResponsiveImage image={item.image} alt={`${study.title}, view ${index + 1}`} fill /> : item.videoUrl ? <video src={item.videoUrl} controls playsInline preload="metadata" className="h-full w-full object-cover" /> : null}</div>)}</div></section>}
          {study.videoUrl && <p className="mt-8"><a href={study.videoUrl} target="_blank" rel="noopener noreferrer" className="text-primary-700 underline">Watch the project walkthrough</a></p>}
          {study.testimonial?.quote && <blockquote className="mt-12 rounded-2xl bg-primary-50 p-6"><p className="font-serif text-xl">“{study.testimonial.quote}”</p><footer className="mt-4">{study.testimonial.author}{study.testimonial.role && `, ${study.testimonial.role}`}</footer></blockquote>}
          <Link href={backHref} className="mt-12 inline-block text-primary-700 underline">{backLabel}</Link>
        </div>
      </Section>
    </>
  )
}
