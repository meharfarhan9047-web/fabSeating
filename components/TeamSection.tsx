import React from 'react'
import Image from 'next/image'
import { Section } from '@/components/Section'
import { urlFor } from '@/lib/sanity/client'

type TeamMember = {
  _id: string
  name: string
  role: string
  bio?: string | null
  image?: { asset?: { _ref: string } } | null
  socials?: { linkedin?: string; twitter?: string; instagram?: string; email?: string } | null
  imageUrl?: string
}

// Hard-coded leadership copy. Sanity controls only photos & socials.
const HARD_CODED_TEAM: TeamMember[] = [
  {
    _id: '1',
    name: 'Mr. Gobind Chugani',
    role: 'Founder',
    bio: '“A seasoned industry leader with over 30 years of experience, guiding Fabseating’s vision to create spaces that inspire.”',
  },
  {
    _id: '2',
    name: 'Mr. Deenu Chugani',
    role: 'Director – Business & Strategy',
    bio: '“A forward-thinking business strategist, driving Fabseating’s growth with innovation and a modern market perspective.”',
  },
  {
    _id: '3',
    name: 'Mr. Haresh',
    role: 'Operations & Client Relations Manager',
    bio: '“A dedicated operations leader, ensuring seamless coordination and consistent quality across every client experience.”',
  },
]

export const TeamSection = ({ teamMembers: sanityMembers }: { teamMembers?: TeamMember[] | null }) => {
  // Merge hard-coded text with optional images + socials from Sanity (by order)
  const teamMembers: TeamMember[] = HARD_CODED_TEAM.map((base, index) => {
    const sanity = sanityMembers?.[index]
    return {
      ...base,
      image: sanity?.image ?? null,
      socials: sanity?.socials ?? undefined,
    }
  })
  return (
    <Section className="grainy-gradient py-12 md:py-16 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary-300 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-10">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary-200/80 mb-2 block">Our Leadership</span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3">Meet the Minds Behind Fab Seating</h2>
          <div className="w-16 h-px bg-white/30 mx-auto"></div>
        </div>

        <div className="flex flex-col gap-8 md:gap-12 max-w-4xl mx-auto">
          {teamMembers.map((member, index) => {
            const socials = member.socials || {}
            const hasSocials =
              !!(socials.linkedin || socials.twitter || socials.instagram || socials.email)
            return (
            <div 
              key={member._id} 
              className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="relative group shrink-0">
                <div className={`absolute top-3 ${index % 2 === 1 ? '-right-3' : '-left-3'} w-full h-full border-2 border-white/20 rounded-2xl -z-10 transition-transform duration-500 group-hover:translate-x-1 group-hover:translate-y-1`}></div>
                <div className={`absolute -inset-1 bg-white/10 rounded-[1.2rem] -z-20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <div className="relative w-64 h-80 md:w-72 md:h-96 overflow-hidden rounded-2xl shadow-lg bg-gradient-to-br from-primary-100 to-white">
                  {member.image?.asset ? (
                    <Image
                      // Use the full original photo (no Studio crop / forced aspect ratio)
                      src={urlFor({ asset: member.image.asset } as any)!.width(1000).fit('max').url()}
                      alt={member.name}
                      fill
                      sizes="(max-width: 768px) 256px, 288px"
                      className="object-contain transition-transform duration-700 group-hover:scale-105 p-4"
                    />
                  ) : null
                  }
                </div>
              </div>

              <div className={`flex-1 text-center ${index % 2 === 1 ? 'md:text-right' : 'md:text-left'}`}>
                <h3 className="text-2xl font-serif font-bold text-white mb-1">{member.name}</h3>
                <div className={`flex items-center gap-3 mb-4 justify-center ${index % 2 === 1 ? 'md:justify-end' : 'md:justify-start'}`}>
                  {index % 2 === 1 && <span className="hidden md:block w-8 h-px bg-primary-300/50"></span>}
                  <p className="text-primary-200 font-medium tracking-wider uppercase text-xs">{member.role}</p>
                  {index % 2 === 0 && <span className="hidden md:block w-8 h-px bg-primary-300/50"></span>}
                </div>
                <p className="text-primary-100/90 leading-relaxed mb-5 text-sm md:text-base max-w-md mx-auto md:mx-0 ml-auto mr-auto">
                  {member.bio}
                </p>
                {hasSocials && (
                  <div className={`flex gap-3 justify-center ${index % 2 === 1 ? 'md:justify-end' : 'md:justify-start'}`}>
                    {socials.linkedin && (
                      <a href={socials.linkedin} className="p-2 bg-white/10 rounded-full text-white hover:bg-white hover:text-primary-900 transition-colors shadow-sm border border-white/10">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                        </svg>
                      </a>
                    )}
                    {socials.twitter && (
                      <a href={socials.twitter} className="p-2 bg-white/10 rounded-full text-white hover:bg-white hover:text-primary-900 transition-colors shadow-sm border border-white/10">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                    )}
                    {socials.instagram && (
                      <a href={socials.instagram} className="p-2 bg-white/10 rounded-full text-white hover:bg-white hover:text-primary-900 transition-colors shadow-sm border border-white/10">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.451 4.63c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                        </svg>
                      </a>
                    )}
                    {socials.email && (
                      <a href={socials.email} className="p-2 bg-white rounded-full text-primary-900 hover:bg-primary-900 hover:text-white transition-colors shadow-sm border border-primary-100">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          )})}
        </div>
      </div>
    </Section>
  )
}
