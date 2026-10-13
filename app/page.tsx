import Image from 'next/image'
import { HomeHero } from '@/components/HomeHero'
import { TestimonialsPreview } from '@/components/TestimonialsPreview'
import { AnimatedCard } from '@/components/AnimatedCard'
import { AnimatedSection } from '@/components/AnimatedSection'
import { ProcessTypewriter } from '@/components/ProcessTypewriter'
import { TeamSection } from '@/components/TeamSection'
import { LazyVideo } from '@/components/LazyVideo'
import { ResponsiveImage } from '@/components/ResponsiveImage'
import { getHomePageData, getHomePageContent, getTeamMembers } from '@/lib/sanity/queries'
import { urlFor } from '@/lib/sanity/client'
import { CaseStudyCard } from '@/components/CaseStudyCard'
import { SkeletonCard } from '@/components/SkeletonCard'
import { PartnersStrip } from '@/components/PartnersStrip'
import { FurnitureCategories } from '@/components/FurnitureCategories'
import { IndustriesServed } from '@/components/IndustriesServed'
import { FaqTeal } from '@/components/FaqTeal'
import { GoogleReviewsCta } from '@/components/GoogleReviewsCta'
import { CONTACT } from '@/lib/siteContent'
import { getSiteSections } from '@/lib/siteSections'

// Dummy data for preview when no Sanity data is available
const dummyCaseStudies = [
  {
    _id: 'dummy-1',
    _type: 'caseStudy',
    title: 'A Regal Home Transformation in Kilpauk',
    slug: { current: 'regal-home-kilpauk' },
    summary: 'Complete furniture and furnishings for a 3-storey residence featuring custom throne chairs and bespoke accent pieces.',
    industry: 'residential',
    client: 'Murugan',
    location: 'Kilpauk, Chennai',
    year: '2024',
    // Replace this with Sanity image URL when uploaded
    heroImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'dummy-2',
    _type: 'caseStudy',
    title: 'Luxury 4BHK Residence in Nungambakkam',
    slug: { current: 'luxury-4bhk-nungambakkam' },
    summary: 'Complete home furniture and furnishings featuring Italian marble dining table, home theatre recliners, and motorized curtains.',
    industry: 'residential',
    client: 'Mr. Rajesh Kothari',
    location: 'Nungambakkam, Chennai',
    year: '2024',
    // Replace this with Sanity image URL when uploaded
    heroImage: 'https://images.unsplash.com/photo-1524758631624-e2822e304a36?auto=format&fit=crop&w=800&q=80'
  },
  {
    _id: 'dummy-3',
    _type: 'caseStudy',
    title: 'Boutique Hotel Lobby',
    slug: { current: 'boutique-hotel-lobby' },
    summary: 'Welcoming and elegant seating solutions for hospitality. Coming Soon.',
    industry: 'hospitality',
    heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    comingSoon: true
  }
]


// Revalidate so Sanity updates (e.g. founders/team) appear on live site within minutes when webhook runs; fallback if webhook not set
export const revalidate = 300

const defaultReels = [
  { id: 1, videoUrl: '/videos/video1.mp4', thumbnail: 'https://images.unsplash.com/photo-1556911220-bff31c812d0c?auto=format&fit=crop&w=800&q=80' },
  { id: 2, videoUrl: '/videos/video2.mp4', thumbnail: 'https://images.unsplash.com/photo-1524758631624-e2822e304a36?auto=format&fit=crop&w=800&q=80' },
  { id: 3, videoUrl: '/videos/video3.mp4', thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80' },
  { id: 4, videoUrl: '/videos/video4.mp4', thumbnail: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80' },
]

const defaultSolutionsCards = [
  { id: 1, title: 'RESIDENTIAL', description: 'Designed around how your family lives, gathers, rests, and grows. A home isn\'t built with furniture. It\'s shaped by how every piece works together.', videoUrl: 'https://cdn.coverr.co/videos/coverr-modern-living-room-1574/1080p.mp4', thumbnail: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80', link: '/solutions/residential' },
  { id: 2, title: 'OFFICE', description: 'Workspaces engineered for productivity, culture, and growth. An office isn\'t just where work happens. It shapes how teams collaborate, focus, and perform.', videoUrl: 'https://cdn.coverr.co/videos/coverr-modern-boutique-office-6267/1080p.mp4', thumbnail: 'https://images.unsplash.com/photo-1497366214047-2a8ba81e032e?auto=format&fit=crop&w=800&q=80', link: '/solutions/office' },
  { id: 3, title: 'HOSPITALITY', description: 'Furniture and furnishings crafted to elevate guest experience. In hospitality, every detail shapes perception. From lobby to guest room, comfort, durability, and aesthetics must work seamlessly together.', videoUrl: 'https://cdn.coverr.co/videos/coverr-modern-cafe-5535/1080p.mp4', thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', link: '/solutions/hospitality' },
]

const defaultProcessSteps = ['Consultation', 'Design & Selection', 'Manufacturing & Sourcing', 'Quality Checks', 'Delivery & Installation', 'After Sales Support']

export default async function Home() {
  const [data, homeContent, teamMembers, sections] = await Promise.all([
    getHomePageData(),
    getHomePageContent(),
    getTeamMembers(),
    getSiteSections(),
  ])

  const heroHeadline = 'Premium Furniture & Furnishings\nfor Homes, Offices & Hospitality'
  const heroSubheadline = 'Since 2001, Fab Seating has been creating complete furniture and furnishing solutions designed for real spaces and long term use.'
  const primaryCta = 'Contact Us'
  const trustLine = 'Crafted & curated from our Chennai facility | Serving residential & commercial spaces across South India'

  // About reels: from Sanity or fallback (with poster URL for Sanity images)
  const aboutReels = (homeContent?.aboutReels || []).map((reel: any, i: number) => {
    const videoUrl = reel.videoUrl || ''
    const posterImage = reel.posterImage
    const posterBuilder = posterImage ? urlFor(posterImage) : null
    const posterUrl = posterBuilder ? posterBuilder.width(800).height(1422).url() : ''
    return { id: i + 1, videoUrl, posterUrl, posterImage }
  })

  // Helper function to get image URL (works with both Sanity images and string URLs)
  function getImageUrl(image: any) {
    if (!image) return null
  
    // If it's a Sanity image object
    if (image && typeof image === 'object' && image.asset) {
      return urlFor(image)?.width(1920).height(1080).url() || null
    }
  
    // If it's a string URL
    if (typeof image === 'string') {
      return image
    }
  
    return null
  }

  // Helper function to get solution image URL (works with both Sanity images and string URLs)
  function getSolutionImageUrl(image: any) {
    if (!image) return null
    
    try {
      // If it's a Sanity image object
      if (image && typeof image === 'object' && image.asset) {
        return urlFor(image)?.width(800).height(450).url() || null
      }
      
      // If it's a string URL
      if (typeof image === 'string') {
        return image
      }
    } catch (error) {
      console.warn('Error getting solution image URL:', error);
      return null;
    }
  
    return null
  }

  // Solutions cards: from Sanity or fallback
  const solutionsVideos = (homeContent?.solutionsCards?.length ? homeContent.solutionsCards : defaultSolutionsCards).map((card: any, i: number) => {
    const fallback = defaultSolutionsCards[i] || defaultSolutionsCards[0]
    const thumbnail = getSolutionImageUrl(card.posterImage) || (card.thumbnail ?? fallback?.thumbnail ?? '')
    return {
      id: i + 1,
      title: card.title ?? fallback?.title ?? '',
      description: card.description ?? fallback?.description ?? '',
      videoUrl: card.videoUrl ?? fallback?.videoUrl ?? '',
      thumbnail, // This will be Sanity image URL when uploaded
      link: card.link ?? fallback?.link ?? '/solutions/residential',
    }
  })

  const processSteps = (homeContent?.processSteps?.length ? homeContent.processSteps : defaultProcessSteps) as string[]

  // Use Sanity data if available
  const projectsToDisplay = data.featuredProjects || []

  return (
    <main className="flex min-h-screen flex-col overflow-hidden">
      {/* 1. Hero Section */}
      <HomeHero
        videoUrl={homeContent?.heroVideoUrl}
        heroPoster={homeContent?.heroImage ? urlFor(homeContent.heroImage)?.width(1600).auto('format').url() : undefined}
        headline={heroHeadline}
        trustIndicators={['Crafted & curated from our Chennai facility', 'Serving residential & commercial spaces across South India']}
        brands={['Premium Quality', '20+ Years Experience', 'Custom Solutions']}
        data={{
          ctaText: primaryCta,
          ctaLink: '/contact',
          image: homeContent?.heroImage
        }}
      />

      <PartnersStrip partners={sections.brandPartners} />

      {/* 2. Quote Section - Social Proof */}
      <section className="relative py-8 md:py-10 grainy-gradient text-white overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        {/* Decorative line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-3 inline-block">
              <svg className="w-6 h-6 text-primary-400/30" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.996 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.984zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
              </svg>
            </div>
            <blockquote className="text-lg md:text-2xl lg:text-3xl font-serif font-light mb-3 italic leading-[1.2] tracking-[-0.02em] text-white/95">
              We are the most experienced makers of exceptional upholstered furniture. Using materials of the highest quality, we ensure every handmade piece is comfortable, beautifully finished, and built to last.
            </blockquote>
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary-400/40"></div>
              <p className="text-sm md:text-base text-primary-200/90 font-serif font-light tracking-wider uppercase">
                Fabseating Furniture & Furnishings
              </p>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary-400/40"></div>
            </div>
          </div>
        </div>
        
        {/* Bottom decorative line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </section>

      {/* 3. About Us Section */}
      <AnimatedSection>
        <section className="relative py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10">
          <div className="max-w-screen-2xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-8">
              <div className="inline-block mb-2">
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary-700">Our Story</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-2 text-primary-950 tracking-tight">
                About Fab Seating
              </h2>
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary-700 to-transparent mx-auto mb-3"></div>
              <p className="text-base md:text-lg text-gray-800 font-medium max-w-2xl mx-auto leading-relaxed">
                Founded in 2001, Fab Seating is a Chennai based furniture and furnishings solutions brand focused on building spaces that last. We bring together furniture, furnishings, planning and execution under one roof.
              </p>
            </div>
            
            {/* Video Reels Grid - Portrait Mode - Full Width (from Sanity Homepage or fallback) */}
            <div className="w-full mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-[6px] md:gap-2">
                {aboutReels.map((reel: { id: number; videoUrl: string; posterUrl: string }, index: number) => (
                  <AnimatedCard key={reel.id} index={index}>
                    <div className="relative w-full aspect-[9/16] overflow-hidden rounded-2xl md:rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.3)] hover:shadow-[0_35px_90px_rgba(0,0,0,0.4)] transition-all duration-500 hover:-translate-y-2">
                      <LazyVideo src={reel.videoUrl} poster={reel.posterUrl} className="w-full h-full object-cover" />
                    </div>
                  </AnimatedCard>
                ))}
              </div>
            </div>

            {/* Minimal Instagram link for Fabseating */}
            <div className="w-full mb-12 flex justify-center">
              <a
                href="https://instagram.com/fabseating"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-5 py-2 text-xs md:text-sm text-gray-800 shadow-[0_14px_35px_rgba(15,23,42,0.22)] hover:shadow-[0_20px_55px_rgba(15,23,42,0.3)] hover:-translate-y-0.5 hover:border-primary-400/80 hover:bg-primary-50/95 hover:text-primary-900 transition-all duration-300 backdrop-blur-md"
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#515bd4]">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-3.5 w-3.5 text-white"
                  >
                    <path
                      fill="currentColor"
                      d="M12 7.3A4.7 4.7 0 1 0 16.7 12 4.7 4.7 0 0 0 12 7.3Zm0 7.7A3 3 0 1 1 15 12a3 3 0 0 1-3 3Zm4.9-7.9a1.1 1.1 0 1 1-1.1-1.1 1.1 1.1 0 0 1 1.1 1.1Z"
                    />
                    <path
                      fill="currentColor"
                      d="M17.9 3.1H6.1A3 3 0 0 0 3.1 6.1v11.8a3 3 0 0 0 3 3h11.8a3 3 0 0 0 3-3V6.1a3 3 0 0 0-3-3Zm1.8 14.8a1.8 1.8 0 0 1-1.8 1.8H6.1a1.8 1.8 0 0 1-1.8-1.8V6.1a1.8 1.8 0 0 1 1.8-1.8h11.8a1.8 1.8 0 0 1 1.8 1.8Z"
                    />
                  </svg>
                </span>
                <span className="tracking-[0.16em] uppercase font-medium">
                  View more
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* Categories Section Moved to Solutions */}

      {/* 5. Furniture & Furnishing Solutions */}
      <AnimatedSection delay={0.2}>
        <FurnitureCategories categories={sections.categories} />
      </AnimatedSection>

      {/* Industries We Serve */}
      <IndustriesServed industries={sections.industries} />

      {/* Teal Strip Divider with Process Typewriter */}
      <section className="relative py-8 md:py-10 grainy-gradient text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/3 w-[800px] h-[800px] bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/3 w-[600px] h-[600px] bg-primary-300 rounded-full blur-3xl"></div>
        </div>
        
        {/* Decorative lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <div className="mb-6">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mb-4"></div>
              <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-primary-300/60 mb-6">Our Process</h3>
            </div>
            <ProcessTypewriter 
              steps={processSteps}
              delay={1500}
            />
          </div>
        </div>
        
        {/* Bottom decorative line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </section>

      {/* 6. Projects Showcase - Carousel/Bento Grid */}
      <AnimatedSection delay={0.3}>
        <section id="projects" className="relative py-16 md:py-20 bg-gradient-to-b from-white via-gray-50/50 to-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-2">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary-700">Portfolio</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-2 text-primary-950 tracking-tight">
              Our Work
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary-700 to-transparent mx-auto mb-3"></div>
            <p className="text-lg md:text-xl text-gray-800 font-medium max-w-3xl mx-auto leading-relaxed">
              Explore our portfolio of completed projects across residential, office, and hospitality spaces.
            </p>
          </div>
          
          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {projectsToDisplay.map((item: any, index: number) => (
              <AnimatedCard key={item._id} index={index}>
                <CaseStudyCard project={item} index={index} />
              </AnimatedCard>
            ))}
          </div>
          
          {/* CTA Button */}
          <div className="text-center">
            <a 
              href="/case-studies" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary-950 text-white font-medium rounded-full hover:bg-primary-900 transition-all duration-300 hover:gap-5 shadow-lg hover:-translate-y-1 hover:shadow-2xl group"
            >
              <span className="text-sm tracking-wider uppercase">View All Case Studies</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* 7. Leadership Section - Legacy Entry */}
      <section className="relative py-8 md:py-10 grainy-gradient text-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/3 w-[800px] h-[800px] bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/3 w-[600px] h-[600px] bg-primary-300 rounded-full blur-3xl"></div>
        </div>
        
        {/* Decorative lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-block mb-2">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary-300/60">Our Heritage</span>
            </div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-serif font-light mb-3 text-white tracking-tight">
              Our Legacy
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mx-auto mb-4"></div>
            <p className="text-sm md:text-base leading-relaxed mb-6 text-white/90 font-light max-w-4xl mx-auto">
              Established in 2001, Fabseating has been at the forefront of furniture manufacturing and furnishings curation. With over two decades of hands-on experience, we&apos;ve built a reputation for excellence, quality, and customer satisfaction across South India.
            </p>
            
            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              {[
                { number: '20+', label: 'Years of Experience' },
                { number: '1000+', label: 'Projects Completed' },
                { number: '500+', label: 'Happy Clients' }
              ].map((stat, index) => (
                <AnimatedCard key={index} index={index}>
                  <div className="group">
                  <div className="text-3xl md:text-4xl lg:text-5xl font-serif font-light text-white mb-1 tracking-tight group-hover:scale-110 transition-transform duration-500">
                    {stat.number}
                  </div>
                  <div className="text-xs md:text-sm text-primary-200/80 font-light tracking-wide uppercase">
                    {stat.label}
                  </div>
                </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom decorative line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </section>

      {/* 8. Custom/Bespoke Solution - Short Custom Quote CTA Section */}
      <AnimatedSection delay={0.4}>
        <section id="custom" className="relative py-16 md:py-20 bg-white overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary-600 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-2">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary-700">Bespoke Craftsmanship</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-2 text-primary-950 tracking-tight">
              Custom & Bespoke Solutions
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary-700 to-transparent mx-auto mb-3"></div>
            <p className="text-lg md:text-xl text-gray-800 font-medium max-w-3xl mx-auto leading-relaxed">
              Tailored furniture solutions designed specifically for your space and style.
            </p>
          </div>
          
          {/* Custom Solutions Text Content */}
          <div className="max-w-6xl mx-auto mb-16 px-2 md:px-4">
            <div className="text-center max-w-5xl mx-auto space-y-6">
              <AnimatedSection delay={0.1} once={false}>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  At Fabseating, furniture doesn&apos;t start with a template. It starts with your space.
                </p>
              </AnimatedSection>
              <AnimatedSection delay={0.2} once={false}>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  Dimensions, comfort, upholstery, wood, finishes — every detail is designed, refined, and crafted specifically for you.
                </p>
              </AnimatedSection>
              <AnimatedSection delay={0.3} once={false}>
                <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                  From one-of-a-kind sofas to fully bespoke dining, bedroom, and statement pieces, we build furniture that fits perfectly, looks intentional, and lasts for years.
                </p>
              </AnimatedSection>
            </div>
          </div>
          
          {/* CTA Button */}
          <div className="text-center">
            <a 
              href="/custom-bespoke" 
              className="inline-flex items-center gap-3 px-8 py-4 bg-primary-950 text-white font-medium rounded-full hover:bg-primary-900 transition-all duration-300 hover:gap-5 shadow-lg hover:-translate-y-1 hover:shadow-2xl group"
            >
              <span className="text-sm tracking-wider uppercase">Get a Custom Quote</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* Team Section (from Sanity Team or fallback) */}
      <AnimatedSection>
        <TeamSection teamMembers={teamMembers} />
      </AnimatedSection>

      {/* 9. Testimonials/Social Proof */}
      {(data.testimonials && data.testimonials.length > 0) || process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID ? (
        <AnimatedSection delay={0.5}>
          <section className="relative py-16 md:py-20 bg-gradient-to-b from-white via-primary-50/30 to-white">
            <TestimonialsPreview 
              testimonials={data.testimonials} 
              showGoogleReviews={!!process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID}
            />
          </section>
        </AnimatedSection>
      ) : null}

      {/* Google Reviews */}
      <GoogleReviewsCta reviewsUrl={sections.reviewsUrl} />

      {/* FAQ Section */}
      <FaqTeal faqs={sections.faqs} />

      {/* Final CTA - Visit Our Showroom */}
      <section className="relative py-12 md:py-16 bg-white text-primary-950 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-400 rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="inline-block mb-2">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary-600">Come See Us</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-3 text-primary-950 tracking-tight">
              Visit Our Showroom
            </h2>
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary-300 to-transparent mx-auto mb-4"></div>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-gray-600 font-medium leading-relaxed">
              Explore our collections, materials, and customization options in person at our Kilpauk, Chennai showroom &mdash; or reach us on WhatsApp to plan your visit.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={CONTACT.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary-950 text-white font-medium rounded-full hover:bg-primary-900 transition-all duration-300 hover:gap-3 shadow-xl hover:-translate-y-1 hover:shadow-2xl group text-base"
              >
                <span className="tracking-wider uppercase text-sm">Get Directions</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 border border-primary-300 text-primary-900 font-medium rounded-full hover:bg-primary-50 transition-all duration-300 text-base"
              >
                <span className="tracking-wider uppercase text-sm">Contact Us</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
