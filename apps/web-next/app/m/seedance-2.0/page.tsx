import type { Metadata } from 'next'
import ModelLanding from '../ModelLanding'
import { buildModelJsonLd } from '../schema'
import type { ModelPageData } from '../model-types'
import pageData from './seedance-2-0.json'

const modelData = pageData as ModelPageData
const title = modelData.meta?.title || 'Seedance 2.0 AI Video Generator | Dommi'
const description = modelData.meta?.description || modelData.hero.description
const canonical = '/m/seedance-2.0'

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'seedance 2.0',
    'seedance 2.0 ai video generator',
    'seedance image to video',
    'seedance text to video',
    'ai video generator',
  ],
  alternates: {
    canonical,
  },
  openGraph: {
    title,
    description,
    type: 'website',
    url: canonical,
  },
  twitter: {
    title,
    description,
  },
}

export default function Seedance20Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildModelJsonLd(modelData)) }}
      />
      <ModelLanding pageData={modelData} />
    </>
  )
}
