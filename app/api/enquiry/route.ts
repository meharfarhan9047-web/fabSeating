import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

function getResend() {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return new Resend(apiKey)
}

const enquirySchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  message: z.string().min(1),
  productId: z.string().optional(),
  projectId: z.string().optional(),
  originPage: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = enquirySchema.parse(body)

    const emailContent = `
New Enquiry from FabSeating Website

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
${data.productId ? `Product ID: ${data.productId}` : ''}
${data.projectId ? `Project ID: ${data.projectId}` : ''}
${data.originPage ? `Origin Page: ${data.originPage}` : ''}

Message:
${data.message}
    `.trim()

    const resend = getResend()
    if (!resend) {
      return NextResponse.json({ error: 'Enquiry delivery is temporarily unavailable' }, { status: 503 })
    }
    const { error } = await resend.emails.send({
      from: 'FabSeating <noreply@fabseating.com>',
      to: 'info@fabseating.com',
      subject: `New Enquiry from ${data.name}`,
      text: emailContent,
      replyTo: data.email,
    })
    if (error) {
      console.error('Enquiry delivery failed:', error.name)
      return NextResponse.json({ error: 'Failed to send enquiry' }, { status: 502 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Enquiry error:', error)
    return NextResponse.json(
      { error: 'Failed to send enquiry' },
      { status: 500 }
    )
  }
}

