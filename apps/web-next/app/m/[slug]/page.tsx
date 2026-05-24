import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ModelLanding from '../ModelLanding'
import {
  getModelCanonicalPath,
  getModelDisplayName,
  getModelPageByRouteSlug,
  MODEL_STATIC_ROUTE_SLUGS,
} from '../model-data'
import { buildModelJsonLd } from '../schema'
import type { ModelPageData } from '../model-types'

type PageProps = {
  params: Promise<{
    slug: string
  }>
}

function getTitle(model: ModelPageData) {
  return model.meta?.title || `${getModelDisplayName(model)} AI ${model.category === 'image' ? 'Image' : 'Video'} Generator | Dommi`
}

function getDescription(model: ModelPageData) {
  return model.meta?.description || model.hero.description
}

function getKeywords(model: ModelPageData) {
  const keywords = model.meta?.keywords
  if (Array.isArray(keywords)) return keywords
  if (typeof keywords === 'string') {
    return keywords
      .split(',')
      .map((keyword) => keyword.trim())
      .filter(Boolean)
  }
  return [getModelDisplayName(model), `${getModelDisplayName(model)} Dommi`, `AI ${model.category} generator`]
}

export function generateStaticParams() {
  return MODEL_STATIC_ROUTE_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const model = getModelPageByRouteSlug(slug)

  if (!model) {
    return {
      title: 'AI Model Not Found | Dommi',
    }
  }

  const title = getTitle(model)
  const description = getDescription(model)
  const canonical = getModelCanonicalPath(model)

  return {
    title,
    description,
    keywords: getKeywords(model),
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
}

export default async function ModelPage({ params }: PageProps) {
  const { slug } = await params
  const model = getModelPageByRouteSlug(slug)

  if (!model) notFound()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildModelJsonLd(model)) }}
      />
      <ModelLanding pageData={model} />
    </>
  )
}
