export default {
  name: 'articleMedia',
  title: 'Article Images',
  type: 'document',
  fields: [
    { name: 'title', title: 'Article name', type: 'string' },
    { name: 'slug', title: 'Existing article slug', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'image', title: 'Article illustration', type: 'image', options: { hotspot: true }, description: 'Replace or remove the illustration without changing the article layout.' },
  ],
  preview: { select: { title: 'title', media: 'image' } },
}
