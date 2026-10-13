'use client'

import { useEffect, useState } from 'react'
import { Reveal } from './Reveal'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface GoogleReview {
  author_name: string
  profile_photo_url?: string
  rating: number
  text: string
  time: number
}

export function GoogleReviewsWidget({ maxReviews = 4 }: { maxReviews?: number }) {
  const [reviews, setReviews] = useState<GoogleReview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    let mounted = true
    setLoading(true)
    async function fetchReviews() {
      try {
        const response = await fetch('/api/google-reviews', { signal: controller.signal })
        if (!response.ok) throw new Error('Reviews request failed')
        const data = await response.json()

        if (mounted && data.reviews && Array.isArray(data.reviews)) {
          setReviews(data.reviews.slice(0, maxReviews))
        }
      } catch (error) {
        if (mounted) setReviews([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchReviews()
    return () => { mounted = false; controller.abort() }
  }, [maxReviews])

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-primary-700">Loading reviews...</p>
      </div>
    )
  }

  if (reviews.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {reviews.map((review, idx) => (
        <Reveal key={`google-${review.time}`} delay={idx * 80}>
          <div className="relative bg-white rounded-3xl shadow-[0_18px_45px_rgba(0,0,0,0.12)] p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(0,0,0,0.18)]">
            <div className="absolute top-4 right-4">
              <svg
                className="w-6 h-6 text-blue-600"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            
            {review.rating && (
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      'text-lg',
                      i < review.rating ? 'text-yellow-500' : 'text-primary-300'
                    )}
                  >
                    ★
                  </span>
                ))}
              </div>
            )}
            
            <p className="text-primary-700 mb-6 leading-relaxed italic">
              &quot;{review.text}&quot;
            </p>
            
            <div className="flex items-center gap-4">
              {review.profile_photo_url && (
                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={review.profile_photo_url}
                    alt={review.author_name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div>
                <p className="font-semibold text-primary-950">{review.author_name}</p>
                <p className="text-sm text-primary-600">Google Review</p>
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  )
}

