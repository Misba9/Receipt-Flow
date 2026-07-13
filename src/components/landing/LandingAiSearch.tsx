import { AiSearchSections } from '@/components/seo/AiSearchBlocks'
import { buildLandingHomeAiSearch } from '@/content/ai-search'

export function LandingAiSearch() {
  return <AiSearchSections block={buildLandingHomeAiSearch()} />
}
