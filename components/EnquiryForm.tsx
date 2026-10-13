'use client'

import { useRef, useState } from 'react'
import { trackEvent, trackConversion } from '@/lib/analytics'
import { cn } from '@/lib/utils'

interface EnquiryFormProps {
  productId?: string
  projectId?: string
  originPage?: string
  className?: string
}

export function EnquiryForm({ productId, projectId, originPage, className }: EnquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const submitting = useRef(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting.current) return
    submitting.current = true
    setIsSubmitting(true)
    setSubmitStatus('idle')
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 30000)

    try {
      const response = await fetch('/api/enquiry', {
        method: 'POST',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          productId,
          projectId,
          originPage: originPage || window.location.pathname,
        }),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', phone: '', message: '' })
        trackConversion('enquiry_submitted', { productId, projectId, originPage })
        trackEvent('enquiry_submitted', { productId, projectId, originPage })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      window.clearTimeout(timeout)
      submitting.current = false
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Name *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 border border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-950 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email *
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-3 border border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-950 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-2">
          Phone *
        </label>
        <input
          type="tel"
          id="phone"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-3 border border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-950 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Message *
        </label>
        <textarea
          id="message"
          required
          rows={6}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-3 border border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-950 focus:border-transparent resize-none"
        />
      </div>

      {submitStatus === 'success' && (
        <div className="p-4 bg-green-50 text-green-800 text-sm">
          Thank you! We&apos;ll get back to you soon.
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="p-4 bg-red-50 text-red-800 text-sm">
          Something went wrong. Please try again.
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-8 py-4 bg-primary-950 text-primary-50 hover:bg-primary-900 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Send Enquiry'}
      </button>
    </form>
  )
}

