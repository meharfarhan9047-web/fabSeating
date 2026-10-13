import { LazyVideo } from './LazyVideo'

interface VideoCardProps {
  src: string
  title?: string
  rounded?: 'md' | 'lg' | 'full'
  aspect?: string
  poster?: string
}

const defaultPoster =
  'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80'

export function VideoCard({ src, title, rounded = 'lg', aspect = 'aspect-[4/5]', poster }: VideoCardProps) {
  return (
    <div
      className="group relative w-full overflow-hidden bg-primary-100 rounded-2xl shadow-[0_18px_45px_rgba(0,0,0,0.22)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_26px_70px_rgba(0,0,0,0.3)]"
      style={{
        backgroundImage: `url(${poster || defaultPoster})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className={`${aspect} w-full overflow-hidden`}>
        <LazyVideo
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={src}
          poster={poster || defaultPoster}
        />
      </div>
      {title && (
        <div className="pointer-events-none absolute inset-0 flex items-end">
          <div className="w-full bg-gradient-to-t from-black/75 via-black/40 to-transparent px-4 py-4 text-base font-bold tracking-wide text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.45)]">
            {title}
          </div>
        </div>
      )}
      <div
        className={`absolute inset-0 rounded-${rounded} ring-1 ring-inset ring-white/10 transition duration-500 group-hover:ring-white/40`}
        aria-hidden
      />
    </div>
  )
}

