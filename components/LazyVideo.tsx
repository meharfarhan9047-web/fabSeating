'use client'

import { useEffect, useRef, useState } from 'react'

interface LazyVideoProps {
  src: string
  poster?: string
  className?: string
}

/**
 * Autoplaying muted loop that only fetches its video once it scrolls near the
 * viewport. Avoids downloading every reel on page load (and stops download
 * managers from grabbing all of them at once).
 */
export function LazyVideo({ src, poster, className }: LazyVideoProps) {
  const ref = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [active, setActive] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setActive(true)
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        const inView = entries.some((e) => e.isIntersecting)
        if (inView) setActive(true)
        setVisible(inView)
      },
      { rootMargin: '200px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const updatePlayback = () => {
      if (visible && !document.hidden) void video.play().catch(() => {})
      else video.pause()
    }
    updatePlayback()
    document.addEventListener('visibilitychange', updatePlayback)
    return () => {
      document.removeEventListener('visibilitychange', updatePlayback)
      video.pause()
    }
  }, [active, visible, src])

  return (
    <div ref={ref} className="h-full w-full">
      {active ? (
        <video
          ref={videoRef}
          className={className}
          src={src}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          disableRemotePlayback
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        poster ? <img src={poster} alt="" className={className} loading="lazy" /> : <div className={className} />
      )}
    </div>
  )
}
