import Image from 'next/image'
import { urlFor } from '@/lib/sanity/client'
import type { SanityImage } from '@/types'
import { cn } from '@/lib/utils'

interface ResponsiveImageProps {
  image?: SanityImage | string
  alt?: string
  className?: string
  priority?: boolean
  sizes?: string
  fill?: boolean
  width?: number
  height?: number
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
}

export function ResponsiveImage({
  image,
  alt,
  className,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  fill,
  width,
  height,
  objectFit = 'cover',
}: ResponsiveImageProps) {
  if (!image) return null

  // Both Sanity assets and existing local URL images are supported.
  if (typeof image === 'string' || image.imageUrl) {
    const src = typeof image === 'string' ? image : image.imageUrl!
    
    if (fill) {
      return (
        <Image
          src={src}
          alt={alt || (typeof image === 'string' ? '' : image.alt) || ''}
          fill
          className={cn(objectFit === 'contain' ? 'object-contain' : 'object-cover', className)}
          priority={priority}
          sizes={sizes}
        />
      )
    }

    return (
      <Image
        src={src}
        alt={alt || (typeof image === 'string' ? '' : image.alt) || ''}
        width={width || 1200}
        height={height || 800}
        className={cn(
          objectFit === 'cover' && 'object-cover',
          objectFit === 'contain' && 'object-contain',
          objectFit === 'fill' && 'object-fill',
          objectFit === 'none' && 'object-none',
          objectFit === 'scale-down' && 'object-scale-down',
          className
        )}
        priority={priority}
        sizes={sizes}
      />
    )
  }

  const imageUrl = urlFor(image)
  if (!imageUrl) return null

  const src = imageUrl.width(width || 1600).auto('format').url()

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt || (typeof image === 'string' ? '' : image.alt) || ''}
        fill
        className={cn(objectFit === 'contain' ? 'object-contain' : 'object-cover', className)}
        priority={priority}
        sizes={sizes}
      />
    )
  }

  return (
    <Image
      src={src}
      alt={alt || (typeof image === 'string' ? '' : image.alt) || ''}
      width={width || 1200}
      height={height || 800}
      className={cn(
        objectFit === 'cover' && 'object-cover',
        objectFit === 'contain' && 'object-contain',
        objectFit === 'fill' && 'object-fill',
        objectFit === 'none' && 'object-none',
        objectFit === 'scale-down' && 'object-scale-down',
        className
      )}
      priority={priority}
      sizes={sizes}
    />
  )
}

