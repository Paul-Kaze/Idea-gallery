import type { Metadata } from 'next'
import { BabyKeywordPage } from '../baby-keyword-page'

export const metadata: Metadata = {
  title: 'AI Baby Face Generator Free | Dommi',
  description: 'Generate a playful AI baby face preview from parent photos with Dommi.',
  alternates: { canonical: '/ai-baby-face-generator-free' },
}

export default function AiBabyFaceGeneratorFreePage() {
  return (
    <BabyKeywordPage
      title="AI Baby Face Generator Free"
      intro="Use two clear portraits to create a soft, realistic baby face preview for fun family sharing."
      intent="Baby face searches are focused on the result image. This page clarifies that the output is a creative AI preview and points visitors to the upload flow."
    />
  )
}
