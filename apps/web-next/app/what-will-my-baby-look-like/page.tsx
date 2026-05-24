import type { Metadata } from 'next'
import { BabyKeywordPage } from '../baby-keyword-page'

export const metadata: Metadata = {
  title: 'What Will My Baby Look Like? | Dommi',
  description: 'Curious what your baby might look like? Use Dommi to create a playful AI baby preview from two parent photos.',
  alternates: { canonical: '/what-will-my-baby-look-like' },
}

export default function WhatWillMyBabyLookLikePage() {
  return (
    <BabyKeywordPage
      title="What Will My Baby Look Like?"
      intro="Upload two parent photos and generate a playful baby preview with Dommi. The result is designed for curiosity and sharing, not prediction."
      intent="This search is curiosity-led and high volume. The page answers the question directly, then routes users into the AI Baby Generator while making the creative-preview limitation clear."
    />
  )
}
