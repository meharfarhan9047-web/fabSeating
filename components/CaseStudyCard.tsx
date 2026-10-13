import Link from 'next/link'
import { ResponsiveImage } from './ResponsiveImage'
import Image from 'next/image'
import type { Project, CaseStudy } from '@/types'
import { cn } from '@/lib/utils'

interface CaseStudyCardProps {
  project: Project | CaseStudy
  index?: number
  className?: string
}

export function CaseStudyCard({ project, index = 0, className }: CaseStudyCardProps) {
  // Helper to get image
  const getImage = () => {
    if ('heroImage' in project && project.heroImage) return project.heroImage
    if ('images' in project && project.images?.[0]) return project.images[0]
    return null
  }

  // Helper to get category/industry
  const getCategory = () => {
    if ('industry' in project) return project.industry
    if ('category' in project) return project.category
    return 'Project'
  }

  // Helper to get description/summary
  const getDescription = () => {
    if ('summary' in project) return project.summary
    if ('description' in project) return project.description
    return ''
  }

  // Check if coming soon
  const isComingSoon = (project as any).comingSoon

  return (
    <div
      className={cn(
        'group relative overflow-hidden bg-gray-900 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-500 block h-full',
        isComingSoon ? 'cursor-not-allowed' : '',
        className
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        {project.videoUrl ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          >
            <source src={project.videoUrl} type="video/mp4" />
          </video>
        ) : getImage() ? (
          <ResponsiveImage
            image={getImage()!}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (project as any).thumbnail ? (
          <Image 
            src={(project as any).thumbnail} 
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <span className="text-gray-500">No media</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-4 right-4 z-20">
          <span className="text-xs font-bold tracking-widest text-white/90 uppercase bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-md border border-white/20">
            {getCategory()}
          </span>
          {isComingSoon && (
            <span className="absolute -top-2 -right-2 text-xs font-bold tracking-widest text-yellow-400 uppercase bg-yellow-900/80 backdrop-blur-sm px-2 py-1 rounded-md border border-yellow-400/30">
              Coming Soon
            </span>
          )}
        </div>
        {isComingSoon && (
          <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center">
            <div className="text-center">
              <div className="text-white/90 font-serif text-2xl font-bold mb-2">Coming Soon</div>
              <div className="text-white/70 text-sm">This case study is under construction</div>
            </div>
          </div>
        )}
      </div>
      <div className="p-6 bg-gradient-to-b from-gray-900 to-black h-full">
        <div className="mb-2">
          <span className="text-xs font-semibold tracking-wider text-primary-400 uppercase">
            Case Study {index + 1}
          </span>
        </div>
        <h3 className="text-xl font-serif font-bold text-white mb-2 tracking-tight">
          {project.title}
        </h3>
        {getDescription() && (
          <p className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-2">
            {getDescription()}
          </p>
        )}
        {!isComingSoon ? (
          <Link
            href={`/case-studies/${project.slug.current}`}
            className="inline-flex items-center gap-2 text-primary-300 hover:text-primary-200 font-medium text-sm transition-colors duration-300 group/link"
          >
            <span className="tracking-wide">View Details</span>
            <svg
              className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        ) : (
          <div className="inline-flex items-center gap-2 text-gray-500 font-medium text-sm">
            <span className="tracking-wide">Coming Soon</span>
          </div>
        )}
      </div>
    </div>
  )
}
