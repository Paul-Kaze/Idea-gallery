import { getAbsoluteUrl } from '../../lib/site'
import {
  getModelCanonicalPath,
  getModelDisplayName,
  getRelatedModelHref,
} from './model-data'
import type { ModelPageData } from './model-types'

function text(value: string | undefined) {
  return value || ''
}

function getTitle(model: ModelPageData) {
  return model.meta?.title || `${getModelDisplayName(model)} AI ${model.category === 'image' ? 'Image' : 'Video'} Generator | Dommi`
}

function getDescription(model: ModelPageData) {
  return model.meta?.description || model.hero.description
}

function youtubeVideoSchema(model: ModelPageData, canonicalUrl: string) {
  return (model.social?.youtube_videos || []).map((video) => {
    const embedUrl = `https://www.youtube.com/embed/${video.id}`
    const watchUrl = video.url || `https://www.youtube.com/watch?v=${video.id}`
    const schema: Record<string, unknown> = {
      '@type': 'VideoObject',
      '@id': `${canonicalUrl}#video-${video.id}`,
      name: video.title,
      description: video.description || `${video.title} for ${getModelDisplayName(model)} creators.`,
      embedUrl,
      url: watchUrl,
      thumbnailUrl: video.thumbnailUrl || `https://i.ytimg.com/vi/${video.id}/hq720.jpg`,
      isPartOf: {
        '@id': `${canonicalUrl}#webpage`,
      },
    }

    if (video.uploadDate) schema.uploadDate = video.uploadDate

    return schema
  })
}

function relatedItemListSchema(model: ModelPageData, canonicalUrl: string) {
  const relatedItems = (model.related_section?.related_models || [])
    .map((name) => {
      const href = getRelatedModelHref(name)
      if (!href) return undefined
      return { name, href }
    })
    .filter((item): item is { name: string; href: string } => Boolean(item))

  if (!relatedItems.length) return undefined

  return {
    '@type': 'ItemList',
    '@id': `${canonicalUrl}#related-models`,
    name: model.related_section?.h2 || `Related AI models for ${getModelDisplayName(model)}`,
    itemListElement: relatedItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: getAbsoluteUrl(item.href),
    })),
  }
}

function howToSchema(model: ModelPageData, canonicalUrl: string) {
  const steps = model.how_to_section?.steps || []
  if (!steps.length) return undefined

  return {
    '@type': 'HowTo',
    '@id': `${canonicalUrl}#how-to`,
    name: model.how_to_section?.h2 || `How to use ${getModelDisplayName(model)} in Dommi`,
    description: model.how_to_section?.intro || getDescription(model),
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: text(step.title),
      text: text(step.description),
    })),
  }
}

export function buildModelJsonLd(model: ModelPageData) {
  const canonicalPath = getModelCanonicalPath(model)
  const canonicalUrl = getAbsoluteUrl(canonicalPath)
  const title = getTitle(model)
  const description = getDescription(model)
  const faqItems = (model.faq_section?.items || []).map((item) => ({
    '@type': 'Question',
    name: text(item.q),
    acceptedAnswer: {
      '@type': 'Answer',
      text: text(item.a),
    },
  }))

  const graph: Array<Record<string, unknown>> = [
    {
      '@type': 'WebPage',
      '@id': `${canonicalUrl}#webpage`,
      name: title,
      url: canonicalUrl,
      description,
      about: {
        '@type': 'Thing',
        name: getModelDisplayName(model),
      },
      isPartOf: {
        '@type': 'WebSite',
        name: 'Dommi',
        url: getAbsoluteUrl('/'),
      },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${canonicalUrl}#software`,
      name: title,
      url: canonicalUrl,
      description,
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Web',
      provider: {
        '@type': 'Organization',
        name: 'Dommi',
        url: getAbsoluteUrl('/'),
      },
      creator: {
        '@type': 'Organization',
        name: model.vendor,
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${canonicalUrl}#breadcrumbs`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Dommi',
          item: getAbsoluteUrl('/'),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'AI Models',
          item: getAbsoluteUrl('/m'),
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: getModelDisplayName(model),
          item: canonicalUrl,
        },
      ],
    },
  ]

  if (faqItems.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${canonicalUrl}#faqs`,
      mainEntity: faqItems,
    })
  }

  const howTo = howToSchema(model, canonicalUrl)
  if (howTo) graph.push(howTo)

  const relatedItems = relatedItemListSchema(model, canonicalUrl)
  if (relatedItems) graph.push(relatedItems)

  graph.push(...youtubeVideoSchema(model, canonicalUrl))

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
}
