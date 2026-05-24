import type { Metadata } from 'next'
import { BabyKeywordPage } from '../baby-keyword-page'

export const metadata: Metadata = {
  title: 'Baby AI Generator Free | Dommi',
  description: 'Try a baby AI generator flow on Dommi with clear photo uploads, account history, and credit-based generation.',
  alternates: { canonical: '/baby-ai-generator-free' },
}

export default function BabyAiGeneratorFreePage() {
  return (
    <BabyKeywordPage
      title="Baby AI Generator Free"
      intro="Start with Dommi's AI baby generator flow and see how two parent portraits can become a fun baby photo preview."
      intent="Free-intent searches need a clear path to try the product, understand credits, and avoid exaggerated claims. Dommi routes visitors to the same core generator while setting privacy and accuracy expectations."
    />
  )
}
