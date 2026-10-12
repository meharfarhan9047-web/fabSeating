import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { parseBody } from 'next-sanity/webhook'

export async function POST(req: NextRequest) {
  try {
    const webhookSecret = process.env.SANITY_WEBHOOK_SECRET
    if (webhookSecret) {
      const { isValidSignature } = await parseBody(req, webhookSecret)
      if (!isValidSignature) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    } else {
      await req.json()
    }

    // Revalidate every path that shows Sanity content so the live site updates instantly
    const pathsToRevalidate = [
      '/',
      '/projects',
      '/contact',
      '/solutions/residential',
      '/solutions/office',
      '/solutions/hospitality',
    ]
    pathsToRevalidate.forEach((path) => revalidatePath(path))
    revalidatePath('/case-studies', 'layout')
    revalidatePath('/blog', 'layout')
    revalidatePath('/category', 'layout')

    // Invalidate all Sanity-backed data so next request fetches fresh content
    revalidateTag('sanity')
    revalidateTag('sanity:teamMember')
    revalidateTag('sanity:homePage')
    revalidateTag('sanity:contactPage')
    revalidateTag('sanity:siteSettings')
    revalidateTag('sanity:project')
    revalidateTag('sanity:caseStudy')
    revalidateTag('sanity:catalog')
    revalidateTag('sanity:solutionPage')
    revalidateTag('sanity:blogPost')
    revalidateTag('sanity:testimonial')
    revalidateTag('sanity:productCategory')
    revalidateTag('sanity:product')

    return NextResponse.json({ revalidated: true, paths: pathsToRevalidate })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}
