export default {
  name: 'homePage',
  title: 'Homepage',
  type: 'document',
  fields: [
    { name: 'heroVideoFile', title: 'Hero video upload', type: 'file', options: { accept: 'video/*' } },
    {
      name: 'galleryImages',
      title: 'Main Gallery Photos',
      type: 'array',
      description: 'Photos shown on /projects (Gallery). Drag to reorder, add or remove photos, then Publish. No local photo fallback is used.',
      of: [{ type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', title: 'Image description', type: 'string' }] }],
    },
    {
      name: 'heroImage',
      title: 'Hero background image',
      type: 'image',
      options: { hotspot: true },
      description: 'Main hero section background. Used as fallback if no video.',
    },
    {
      name: 'aboutReels',
      title: 'About section – video reels (4 items)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'videoFile', title: 'Video upload', type: 'file', options: { accept: 'video/*' } },
            { name: 'videoUrl', title: 'External video URL (optional)', type: 'url', description: 'Used when no uploaded video is selected.' },
            { name: 'posterImage', title: 'Poster / thumbnail image', type: 'image', options: { hotspot: true } },
          ],
          preview: {
            select: { title: 'videoUrl' },
            prepare({ title }: { title?: string }) {
              return { title: title ? `Reel: ${title.slice(0, 40)}…` : 'Reel' }
            },
          },
        },
      ],
      validation: (Rule: any) => Rule.max(4),
    },
    {
      name: 'solutionsCards',
      title: 'Our Solutions – 3 cards (Residential, Office, Hospitality)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text' },
            { name: 'link', title: 'Link', type: 'string', description: 'e.g. /solutions/residential' },
            { name: 'posterImage', title: 'Poster / thumbnail image', type: 'image', options: { hotspot: true } },
            { name: 'videoUrl', title: 'Video URL (optional)', type: 'url' },
          ],
          preview: {
            select: { title: 'title' },
            prepare({ title }: { title?: string }) {
              return { title: title || 'Solution card' }
            },
          },
        },
      ],
      validation: (Rule: any) => Rule.max(6),
    },
    {
      name: 'processSteps',
      title: 'Process steps (typewriter strip)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'e.g. Consultation, Design & Selection, Manufacturing…',
    },
    {
      name: 'brandPartners',
      title: 'Brand partners strip',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', title: 'Brand name', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'logo', title: 'Logo', type: 'image' },
          ],
          preview: { select: { title: 'name', media: 'logo' } },
        },
      ],
      description: 'Leave empty to use the built-in list.',
    },
    {
      name: 'furnitureCategories',
      title: 'Furniture & furnishing categories',
      type: 'array',
      description: 'Cards in the "What We Make" section. Each gets its own /category/<slug> page. Leave empty to use the built-in list.',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Title', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'slug', title: 'Slug', type: 'slug', options: { source: (_doc: any, ctx: any) => ctx.parent?.title, maxLength: 96 }, validation: (Rule: any) => Rule.required() },
            { name: 'blurb', title: 'Short description', type: 'text', rows: 2 },
            { name: 'coverImage', title: 'Cover image', type: 'image', options: { hotspot: true } },
            {
              name: 'productCategories',
              title: 'Products shown on this category page',
              type: 'array',
              of: [{ type: 'reference', to: [{ type: 'productCategory' }] }],
              description: 'Products from these product categories are listed on the page.',
            },
          ],
          preview: { select: { title: 'title', subtitle: 'slug.current', media: 'coverImage' } },
        },
      ],
    },
    {
      name: 'industries',
      title: 'Industries we serve',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Leave empty to use the built-in list.',
    },
    {
      name: 'faqs',
      title: 'FAQ section',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', title: 'Question', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'answer', title: 'Answer', type: 'text', validation: (Rule: any) => Rule.required() },
          ],
          preview: { select: { title: 'question' } },
        },
      ],
      description: 'Leave empty to use the built-in list.',
    },
    {
      name: 'googleReviewsUrl',
      title: 'Google reviews link',
      type: 'url',
      description: 'Your Google Business Profile reviews link, used by the "Loved on Google" section.',
    },
  ],
  preview: {
    prepare() {
      return { title: 'Homepage' }
    },
  },
}
