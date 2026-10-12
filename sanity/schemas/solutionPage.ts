export default {
  name: 'solutionPage',
  title: 'Solutions',
  type: 'document',
  fields: [
    {
      name: 'type',
      title: 'Solution Type',
      type: 'string',
      options: {
        list: [
          { title: 'Residential', value: 'residential' },
          { title: 'Office', value: 'office' },
          { title: 'Hospitality', value: 'hospitality' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'emoji',
      title: 'Page Emoji',
      type: 'string',
      description: 'The emoji icon for this solution type (e.g., 🏠, 🏢, 🏨)',
    },
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      description: 'The main title for the solution page.',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'subtitle',
      title: 'Page Subtitle',
      type: 'string',
      description: 'The subtitle shown below the main title.',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'tagline',
      title: 'Tagline',
      type: 'text',
      description: 'The main tagline that appears in the hero section.',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'introText',
      title: 'Intro Paragraph',
      type: 'text',
      description: 'The introductory text that explains the solution.',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'galleryImages',
      title: 'Gallery Images',
      type: 'array',
      of: [{ type: 'image' }],
      description: 'First three appear in the hero. Residential also displays the full collection below.',
      validation: (Rule: any) => Rule.max(30),
    },
    {
      name: 'whatWeDesign',
      title: 'What We Design/Build',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of what you design or build for this solution type.',
      validation: (Rule: any) => Rule.required().min(3),
    },
    {
      name: 'whyChooseUs',
      title: 'Why Choose Us/Trust Us',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of reasons why clients should choose Fab Seating.',
      validation: (Rule: any) => Rule.required().min(3),
    },
    {
      name: 'approach',
      title: 'Our Approach',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of steps in your approach process.',
      validation: (Rule: any) => Rule.required().min(4),
    },
    {
      name: 'bestSuitedFor',
      title: 'Best Suited For',
      type: 'text',
      description: 'Description of who this solution is best suited for.',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'secondaryImage',
      title: 'Secondary Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'title', type: 'string', title: 'SEO Title' },
        { name: 'description', type: 'text', title: 'SEO Description' },
        { name: 'image', type: 'image', title: 'SEO Image' },
        { name: 'noIndex', type: 'boolean', title: 'No Index', initialValue: false },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      type: 'type',
      media: 'heroImage',
    },
    prepare(value: Record<string, unknown>) {
      const title = value?.title as string | undefined
      const type = value?.type as string | undefined
      return {
        title: title || 'Untitled',
        subtitle: type ? type.charAt(0).toUpperCase() + type.slice(1) : '',
      }
    },
  },
}

