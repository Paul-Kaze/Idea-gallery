import type { Metadata } from 'next'
import { BabyKeywordPage } from '../baby-keyword-page'

export const metadata: Metadata = {
  title: 'Future Baby Generator | Dommi',
  description: 'Use Dommi as a future baby generator: upload two parent photos and create a playful AI baby preview.',
  alternates: { canonical: '/future-baby-generator' },
}

export default function FutureBabyGeneratorPage() {
  return (
    <BabyKeywordPage
      title="Future Baby Generator"
      intro="Create a playful future baby preview from two clear parent photos, then save or share the result from your Dommi history."
      intent="Visitors searching for future baby generator usually want a fast, low-friction way to try a two-photo baby preview. This page connects that intent directly to the main AI Baby Generator flow."
    />
  )
}
