'use client'

import { useEffect } from 'react'

export function PWARegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    if (process.env.NODE_ENV !== 'production') {
      void navigator.serviceWorker.getRegistrations()
        .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
        .catch(() => {})
      if ('caches' in window) {
        void caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith('fabseating-')).map((key) => caches.delete(key)))).catch(() => {})
      }
      return
    }
    const register = () => {
      void navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' }).catch(() => {})
    }
    // Hydration can finish after the load event on a slow phone.
    if (document.readyState === 'complete') register()
    else window.addEventListener('load', register, { once: true })
    return () => window.removeEventListener('load', register)
  }, [])
  return null
}
