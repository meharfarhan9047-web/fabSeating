import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Montserrat } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Analytics } from '@/components/Analytics'
import { StickyBookCTA } from '@/components/StickyBookCTA'
import { PWARegister } from '@/components/PWARegister'
import { getSiteSettings } from '@/lib/sanity/queries'
import { CONTACT } from '@/lib/siteContent'
import { urlFor } from '@/lib/sanity/client'

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'optional', // Better for luxury - prevents FOUT
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800', '900'],
  preload: true,
  adjustFontFallback: true,
})

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'optional', // Better for luxury - prevents FOUT
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  preload: true,
  adjustFontFallback: true,
})

export const metadata: Metadata = {
  title: {
    default: 'Fabseating | Premium Furniture & Furnishings',
    template: '%s | Fabseating',
  },
  description: 'Fabseating designs, manufactures, and curates premium furniture and furnishings for homes, offices, and hospitality spaces in Chennai since 2001.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://fabseating.com'),
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo.png', type: 'image/png', sizes: '512x512' },
      { url: '/logo.png', type: 'image/png', sizes: '192x192' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Fab Seating',
  },
  openGraph: {
    title: 'Fabseating | Premium Furniture & Furnishings',
    description: 'Fabseating designs, manufactures, and curates premium furniture and furnishings for homes, offices, and hospitality spaces in Chennai since 2001.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://fabseating.com',
    siteName: 'Fabseating',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Fab Seating',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fabseating | Premium Furniture & Furnishings',
    description: 'Fabseating designs, manufactures, and curates premium furniture and furnishings for homes, offices, and hospitality spaces in Chennai since 2001.',
    images: ['/logo.png'],
  },
}

export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 5, themeColor: '#2a2520' }

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSiteSettings()
  const logoBuilder = settings?.logo ? urlFor(settings.logo as any) : null
  const logoUrl = logoBuilder ? logoBuilder.width(440).fit('max').url() : null

  return (
    <html lang="en" className={`${playfair.variable} ${montserrat.variable} luxury-scrollbar`}>
      <body className="font-sans antialiased luxury-scrollbar">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary-950 focus:text-primary-50 focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-50 focus:ring-offset-2"
        >
          Skip to main content
        </a>
        <PWARegister />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FurnitureStore',
              name: 'Fab Seating',
              description: 'Premium custom furniture and furnishings for homes, offices and commercial spaces since 2001.',
              url: process.env.NEXT_PUBLIC_SITE_URL || 'https://fabseating.com',
              telephone: CONTACT.phoneTel,
              email: CONTACT.email,
              image: (process.env.NEXT_PUBLIC_SITE_URL || 'https://fabseating.com') + '/logo.png',
              address: { '@type': 'PostalAddress', streetAddress: CONTACT.addressLine, addressLocality: 'Chennai', addressRegion: 'Tamil Nadu', addressCountry: 'IN' },
              areaServed: 'India',
              foundingDate: '2001',
              sameAs: [
                'https://www.instagram.com/fabseating/',
                'https://www.youtube.com/@FabSeating',
              ],
            }),
          }}
        />
        <Header logoUrl={logoUrl} />
        <main id="main-content">{children}</main>
        <StickyBookCTA />
        <Footer logoUrl={logoUrl} />
        <Analytics />
      </body>
    </html>
  )
}

