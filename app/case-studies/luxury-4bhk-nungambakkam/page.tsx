import CaseStudyPage, { generateMetadata as metadataForStudy } from '../[slug]/page'

export const revalidate = 300
const params = { slug: 'luxury-4bhk-nungambakkam' }

export async function generateMetadata() {
  return metadataForStudy({ params })
}

export default async function Page() {
  return CaseStudyPage({ params })
}
