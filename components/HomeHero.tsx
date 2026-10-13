'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ResponsiveImage } from './ResponsiveImage'
import { LazyVideo } from './LazyVideo'
import { Container } from './Container'
import type { SanityImage } from '@/types'

interface HomeHeroProps {
  data?: {
    title?: string
    subtitle?: string
    image?: SanityImage
    ctaText?: string
    ctaLink?: string
  }
  headline: string
  subheadline?: string
  trustIndicators: string[]
  brands: string[]
  videoUrl?: string
  heroPoster?: string
  heroVideos?: { src?: string; title?: string; poster?: string }[]
}

export function HomeHero({
  data,
  headline,
  subheadline,
  trustIndicators,
  brands,
  videoUrl,
  heroPoster,
  heroVideos = [],
}: HomeHeroProps) {
  const defaultData = {
    title: headline,
    subtitle: subheadline || '',
    ctaText: 'Contact Us',
    ctaLink: '/contact',
  }

  const heroData = { ...defaultData, ...data }
  const fallbackPoster = heroPoster || ''
  

  type HeroSlide = { src?: string; title?: string; poster?: string }
  const slides: HeroSlide[] =
    heroVideos.length > 0
      ? heroVideos
      : videoUrl
      ? [{ src: videoUrl, poster: fallbackPoster }]
      : [{ poster: fallbackPoster }]

  return (
    <section className="relative pt-[6rem] sm:pt-[7rem] md:pt-[7.5rem] lg:pt-[8rem] mt-2 md:mt-4 pb-12 md:pb-16">
      <Container>
        <div className="relative overflow-hidden rounded-[28px] md:rounded-[32px] bg-primary-950 text-primary-50 shadow-[0_30px_90px_rgba(0,0,0,0.2)]">
          <div className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth no-scrollbar">
            {slides.map((slide, idx) => (
              <div
                key={slide.src ?? `fallback-${idx}`}
                className="relative min-w-full snap-start"
              >
                <div className="relative min-h-[70vh] overflow-hidden rounded-[28px] md:rounded-[32px] md:min-h-0 md:h-[calc(100vh-12.5rem)] lg:h-[calc(100vh-13rem)]">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${slide.poster || fallbackPoster})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {slide.src ? (
                      <LazyVideo
                        className="h-full w-full object-cover"
                        src={slide.src}
                        poster={(slide as any).poster || fallbackPoster}
                      />
                    ) : heroData.image ? (
                      <ResponsiveImage
                        image={heroData.image}
                        alt=""
                        fill
                        priority
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/15 to-black/30" />
                  </div>

                  <div className="relative z-10 flex min-h-[70vh] flex-col justify-center px-4 sm:px-6 md:px-10 lg:px-14 py-24 sm:py-28 md:min-h-0 md:h-full md:py-[clamp(1rem,5vh,4rem)]">
                    <div className="w-full max-w-full sm:max-w-4xl md:max-w-5xl lg:max-w-6xl mx-auto space-y-[clamp(0.75rem,2vmin,1.25rem)] rounded-2xl bg-black/15 p-[clamp(1rem,2.5vmin,2rem)] shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
                      <div className="space-y-3 md:space-y-4">
                        <motion.h1
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6 }}
                          className="font-serif text-[clamp(1.5rem,6vmin,3.75rem)] leading-tight font-black text-white drop-shadow-[0_15px_45px_rgba(0,0,0,0.6)] break-words"
                          style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                        >
                          {heroData.title?.split('\n').map((line, i) => (
                            <span key={i} className="block">
                              {line}
                            </span>
                          ))}
                        </motion.h1>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <Link
                          href="/projects"
                          className="inline-flex items-center justify-center rounded-full bg-primary-50 px-[clamp(1rem,2.4vmin,1.5rem)] py-[clamp(0.625rem,1.5vmin,0.75rem)] text-[clamp(0.75rem,1.7vmin,0.875rem)] font-semibold text-primary-900 shadow-lg shadow-primary-900/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                        >
                          View Projects
                        </Link>
                        {heroData.ctaLink && (
                          <Link
                            href={heroData.ctaLink}
                            className="inline-flex items-center justify-center rounded-full border border-primary-200/40 bg-white/10 px-[clamp(1rem,2.4vmin,1.5rem)] py-[clamp(0.625rem,1.5vmin,0.75rem)] text-[clamp(0.75rem,1.7vmin,0.875rem)] font-semibold text-primary-50 backdrop-blur transition-all duration-300 hover:bg-white/20 hover:-translate-y-1 hover:shadow-xl"
                          >
                            {heroData.ctaText}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {slides.length > 1 && (
            <div className="pointer-events-none absolute inset-x-4 bottom-6 flex justify-center gap-2 md:inset-x-10">
              {slides.map((_, idx) => (
                <span
                  key={idx}
                  className="h-2 w-2 rounded-full bg-white/40"
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
