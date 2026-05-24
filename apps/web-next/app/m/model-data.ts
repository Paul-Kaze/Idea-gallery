import gptImage2 from './model-data/gpt-image-2.json'
import happyHorse10 from './model-data/happy-horse-1-0.json'
import happyHorse15 from './model-data/happy-horse-1-5.json'
import ltx23 from './model-data/ltx-2-3.json'
import nanoBanana from './model-data/nano-banana.json'
import nanoBanana2 from './model-data/nano-banana-2.json'
import nanoBananaPro from './model-data/nano-banana-pro.json'
import seedance10Lite from './model-data/seedance-1-0-lite.json'
import seedance10Pro from './model-data/seedance-1-0-pro.json'
import seedance10ProFast from './model-data/seedance-1-0-pro-fast.json'
import seedance15Pro from './model-data/seedance-1-5-pro.json'
import seedance20 from './model-data/seedance-2-0.json'
import seedance20Fast from './model-data/seedance-2-0-fast.json'
import seedance30 from './model-data/seedance-3-0.json'
import seedream40 from './model-data/seedream-4-0.json'
import seedream45 from './model-data/seedream-4-5.json'
import type { ModelPageData } from './model-types'

type SeoPageConfig = {
  slug: string
  name: string
  vendor: string
  metaTitle: string
  metaDescription: string
  heroDescription: string
  relatedHeading: string
  relatedIntro: string
  relatedModels: string[]
  highlightsHeading: string
  highlightsIntro: string
  highlights: Array<{
    title: string
    text: string
  }>
  howToHeading: string
  howToIntro: string
  promptPlaceholder: string
  ctaHeading: string
  ctaBody: string
  keywords: string[]
  faq: Array<{
    q: string
    a: string
  }>
}

type SeoImagePageConfig = {
  slug: string
  name: string
  vendor: string
  metaTitle?: string
  metaDescription?: string
  heroDescription?: string
  searchIntent: string
  bestFor: string
  workflow: string
  promptPlaceholder?: string
  relatedModels?: string[]
  keywords: string[]
}

type SeoTrafficVideoPageConfig = {
  slug: string
  name: string
  vendor: string
  metaTitle?: string
  metaDescription?: string
  heroDescription?: string
  searchIntent: string
  bestFor: string
  workflow: string
  promptPlaceholder?: string
  relatedModels: string[]
  keywords: string[]
}

const CORE_VIDEO_MODEL_LINKS = [
  'Kling AI',
  'Hailuo AI',
  'Sora',
  'Veo',
  'Runway AI',
  'Pika AI',
  'Luma AI',
  'PixVerse AI',
  'Seedance',
  'Seedance 2.0',
  'Wan AI',
]

const TOOL_BRAND_LINKS = [
  'HeyGen',
  'Vidnoz',
  'Akool',
  'Animaker',
  'Haiper AI',
  'PixVerse AI',
  'Runway AI',
  'Kling AI',
]

const CORE_IMAGE_MODEL_LINKS = [
  'GPT Image 2',
  'Nano Banana 2',
  'Seedream',
  'Recraft',
  'Ideogram',
  'Stable Diffusion',
  'Flux AI',
  'DALL-E',
  'Imagen',
  'GPT-4o',
  'Flux Kontext',
  'Qwen Image',
  'Midjourney',
]

function withoutCurrentModel(models: string[], name: string) {
  return models.filter((model) => model !== name)
}

function createSeoVideoPage(config: SeoPageConfig): ModelPageData {
  const modelOptions = Array.from(new Set([config.name, ...config.relatedModels])).slice(0, 9)
  const heroTitle = config.name.endsWith('AI') ? `${config.name} Video Generator` : `${config.name} AI Video Generator`

  return {
    slug: config.slug,
    category: 'video',
    vendor: config.vendor,
    brand: config.name,
    meta: {
      title: config.metaTitle,
      description: config.metaDescription,
      keywords: config.keywords,
    },
    hero: {
      h1: heroTitle,
      description: config.heroDescription,
    },
    generator_panel: {
      agent_label: `Plan ${config.name} workflows in Dommi`,
      pill_label: 'AI Video',
      quick_motion: 'Auto',
      quick_style: 'Style',
      quick_motion_options: ['Auto', 'Camera Motion', 'Character Motion', 'Product Motion'],
      quick_style_options: ['Style', 'Cinematic', 'Realistic', 'Anime', 'Commercial'],
      tool_modes: [
        { label: 'Image to Video', value: 'image' },
        { label: 'Text to Video', value: 'text' },
      ],
      fields: [
        {
          name: 'model',
          label: 'Model',
          default: config.name,
          options: modelOptions,
        },
        {
          name: 'aspectRatio',
          label: 'Aspect ratio',
          default: '16:9',
          options: ['16:9', '9:16', '1:1', '4:3', '3:4'],
        },
        {
          name: 'duration',
          label: 'Duration',
          default: '5s',
          options: ['5s', '10s', '15s'],
        },
        {
          name: 'resolution',
          label: 'Resolution',
          default: '1080p',
          options: ['720p', '1080p'],
        },
      ],
      upload: {
        show: true,
        placeholder: 'Click to upload an image',
        hint: 'JPG, PNG, WEBP',
        accept: 'image/jpeg,image/png,image/webp',
      },
      prompt_placeholders: {
        text: config.promptPlaceholder,
        image: `Describe how ${config.name} or a nearby Dommi workflow should animate the reference image.`,
      },
      toggles: [
        {
          name: 'cameraFixed',
          label: 'Camera fixed',
          default: false,
        },
      ],
      generator_links: {
        image: '/tools',
        text: '/tools',
      },
      submit_labels: {
        image: 'Open Tools',
        text: 'Open Tools',
      },
    },
    related_section: {
      h2: config.relatedHeading,
      intro: config.relatedIntro,
      related_models: config.relatedModels,
    },
    highlights_section: {
      h2: config.highlightsHeading,
      intro: config.highlightsIntro,
      items: config.highlights,
    },
    how_to_section: {
      h2: config.howToHeading,
      intro: config.howToIntro,
      steps: [
        {
          title: `Define the ${config.name} use case`,
          description: `Decide whether you need ${config.name} for text-to-video, image-to-video, avatar video, product clips, social ads, or comparison research before opening a generator.`,
        },
        {
          title: 'Write a compact prompt brief',
          description: 'Describe the subject, action, camera, pacing, aspect ratio, brand constraints, and any reference image rules in one focused brief.',
        },
        {
          title: 'Compare the result with nearby tools',
          description: `Use the related Dommi model pages to compare ${config.name} intent against alternatives, then choose the workflow that best matches the output you need.`,
        },
      ],
    },
    faq_section: {
      h2: `${config.name} FAQ`,
      intro: `Short answers for people researching ${config.name}, free access, alternatives, and AI video workflows.`,
      items: config.faq,
    },
    final_cta: {
      h2: config.ctaHeading,
      body: config.ctaBody,
      btn_label: 'Open Dommi Tools',
      btn_href: '/tools',
    },
  }
}

function createSeoImagePage(config: SeoImagePageConfig): ModelPageData {
  const relatedModels = config.relatedModels || withoutCurrentModel(CORE_IMAGE_MODEL_LINKS, config.name).slice(0, 8)
  const modelOptions = Array.from(new Set([config.name, ...relatedModels])).slice(0, 9)
  const heroTitle = config.name.endsWith('AI') ? `${config.name} Image Generator` : `${config.name} AI Image Generator`
  const metaTitle = config.metaTitle || `${config.name} Free AI Image Generator Alternative | Dommi`
  const metaDescription =
    config.metaDescription ||
    `Research ${config.name}, compare related AI image models, and plan text-to-image or image editing workflows in Dommi.`

  return {
    slug: config.slug,
    category: 'image',
    vendor: config.vendor,
    brand: config.name,
    meta: {
      title: metaTitle,
      description: metaDescription,
      keywords: config.keywords,
    },
    hero: {
      h1: heroTitle,
      description:
        config.heroDescription ||
        `Use this Dommi page to research ${config.name} image generation, compare nearby image models, and plan practical creative prompts.`,
    },
    generator_panel: {
      agent_label: `Plan ${config.name} image workflows in Dommi`,
      pill_label: 'AI Image',
      quick_motion: 'Mode',
      quick_style: 'Style',
      quick_motion_options: ['Text to Image', 'Image Edit', 'Reference Image', 'Brand Asset'],
      quick_style_options: ['Style', 'Photorealistic', 'Illustration', 'Product', 'Graphic Design'],
      tool_modes: [
        { label: 'Text to Image', value: 'text' },
        { label: 'Image to Image', value: 'image' },
      ],
      fields: [
        {
          name: 'model',
          label: 'Model',
          default: config.name,
          options: modelOptions,
        },
        {
          name: 'aspectRatio',
          label: 'Aspect ratio',
          default: '1:1',
          options: ['1:1', '16:9', '9:16', '4:3', '3:4'],
        },
        {
          name: 'quality',
          label: 'Quality',
          default: 'High',
          options: ['Fast', 'High', 'Ultra'],
        },
        {
          name: 'output',
          label: 'Output',
          default: 'Image',
          options: ['Image', 'Product visual', 'Poster', 'Social creative'],
        },
      ],
      upload: {
        show: true,
        placeholder: 'Click to upload a reference image',
        hint: 'JPG, PNG, WEBP',
        accept: 'image/jpeg,image/png,image/webp',
      },
      prompt_placeholders: {
        text:
          config.promptPlaceholder ||
          `Describe the ${config.name} image you want: subject, style, composition, lighting, aspect ratio, and final use.`,
        image: `Describe how ${config.name} should reinterpret the reference image while preserving the important subject details.`,
      },
      toggles: [
        {
          name: 'preserveSubject',
          label: 'Preserve subject',
          default: true,
        },
      ],
      generator_links: {
        image: '/tools',
        text: '/tools',
      },
      submit_labels: {
        image: 'Open Tools',
        text: 'Open Tools',
      },
    },
    related_section: {
      h2: `${config.name} alternatives and related image models`,
      intro: `Compare ${config.name} with nearby image models before choosing the right workflow for style, prompt control, editing, and brand-safe output.`,
      related_models: relatedModels,
    },
    highlights_section: {
      h2: `Why creators search ${config.name} in Dommi`,
      intro: `${config.name} keywords can capture model-name, brand-name, free-access, and alternative-search intent from AI image creators.`,
      items: [
        { title: 'Brand keyword intent', text: config.searchIntent },
        { title: 'Best creative fit', text: config.bestFor },
        { title: 'Comparison value', text: `Compare ${config.name} with ${relatedModels.slice(0, 4).join(', ')} when users care about access, style control, realism, or editing quality.` },
        { title: 'Prompt workflow', text: config.workflow },
      ],
    },
    how_to_section: {
      h2: `How to plan a ${config.name} image workflow in Dommi`,
      intro: `Turn ${config.name} search intent into a focused image brief that can be compared against adjacent AI image models.`,
      steps: [
        {
          title: `Define the ${config.name} use case`,
          description: `Decide whether the goal is a product visual, character concept, social creative, logo-style asset, image edit, or reference-based generation.`,
        },
        {
          title: 'Write a compact image prompt',
          description: 'Specify the subject, visual style, composition, lighting, aspect ratio, text rules, brand constraints, and any reference image requirements.',
        },
        {
          title: 'Compare related image models',
          description: `Use the related Dommi model pages to compare ${config.name} against alternatives, then choose the workflow that best matches the output quality and control you need.`,
        },
      ],
    },
    faq_section: {
      h2: `${config.name} FAQ`,
      intro: `Short answers for people researching ${config.name}, free access, alternatives, and AI image workflows.`,
      items: [
        { q: `What is ${config.name}?`, a: `${config.name} is an AI image model or creative brand people research for image generation, editing, visual design, and prompt-based creative workflows.` },
        { q: `Is ${config.name} free?`, a: `${config.name} access and pricing can change. This Dommi page is designed for users comparing free, trial, or lower-friction ways to plan ${config.name}-style image workflows.` },
        { q: `What is ${config.name} best for?`, a: config.bestFor },
        { q: `What are ${config.name} alternatives?`, a: `Common alternatives to compare include ${relatedModels.slice(0, 6).join(', ')}.` },
        { q: `Can I plan ${config.name}-style images in Dommi?`, a: `Yes. Dommi model pages help structure prompts, compare related models, and turn ${config.name} search intent into a practical creative brief.` },
      ],
    },
    final_cta: {
      h2: `Compare ${config.name} image workflows in Dommi`,
      body: `Open Dommi tools when you want to turn ${config.name} research into a usable text-to-image or image-editing prompt.`,
      btn_label: 'Open Dommi Tools',
      btn_href: '/tools',
    },
  }
}

function createSeoTrafficVideoPage(config: SeoTrafficVideoPageConfig): ModelPageData {
  return createSeoVideoPage({
    slug: config.slug,
    name: config.name,
    vendor: config.vendor,
    metaTitle: config.metaTitle || `${config.name} Free AI Video Generator Alternative | Dommi`,
    metaDescription:
      config.metaDescription ||
      `Research ${config.name}, compare related AI video models and brand alternatives, and plan text-to-video or image-to-video workflows in Dommi.`,
    heroDescription:
      config.heroDescription ||
      `Use this Dommi page to research ${config.name} video generation, compare nearby models, and plan practical AI video prompts.`,
    relatedHeading: `${config.name} alternatives and related AI video models`,
    relatedIntro: `Compare ${config.name} with nearby video models and tool brands before choosing the right workflow for motion, prompt control, access, and output style.`,
    relatedModels: config.relatedModels,
    highlightsHeading: `Why creators search ${config.name} in Dommi`,
    highlightsIntro: `${config.name} keywords can capture model-name, brand-name, legacy-name, free-access, and alternative-search intent from AI video creators.`,
    highlights: [
      { title: 'Brand keyword intent', text: config.searchIntent },
      { title: 'Best video fit', text: config.bestFor },
      { title: 'Comparison value', text: `Compare ${config.name} with ${config.relatedModels.slice(0, 4).join(', ')} when users care about access, quality, speed, or model style.` },
      { title: 'Prompt workflow', text: config.workflow },
    ],
    howToHeading: `How to plan a ${config.name} workflow in Dommi`,
    howToIntro: `Turn ${config.name} search intent into a focused video prompt and model comparison checklist.`,
    promptPlaceholder:
      config.promptPlaceholder ||
      `Describe the ${config.name} style video: subject, motion, camera movement, scene, duration, and final use case.`,
    ctaHeading: `Compare ${config.name} with Dommi video workflows`,
    ctaBody: `Use Dommi to structure ${config.name} prompts and compare related AI video alternatives before choosing a generator.`,
    keywords: config.keywords,
    faq: [
      { q: `What is ${config.name}?`, a: `${config.name} is an AI video model, brand, or legacy search term people use when researching video generation, model access, and practical AI video workflows.` },
      { q: `Is ${config.name} free?`, a: `${config.name} access and pricing can change. This page is built for users comparing free, trial, or lower-friction ways to plan ${config.name}-style video workflows.` },
      { q: `What is ${config.name} best for?`, a: config.bestFor },
      { q: `What are ${config.name} alternatives?`, a: `Common alternatives to compare include ${config.relatedModels.slice(0, 6).join(', ')}.` },
      { q: `Can Dommi help plan ${config.name}-style videos?`, a: `Yes. Dommi helps convert ${config.name} search intent into a clear prompt, model comparison, and production workflow.` },
    ],
  })
}

const SEO_VIDEO_PAGE_CONFIGS: SeoPageConfig[] = [
  {
    slug: 'kling-ai',
    name: 'Kling AI',
    vendor: 'Kuaishou',
    metaTitle: 'Kling AI Free AI Video Generator Alternative | Dommi',
    metaDescription:
      'Research Kling AI, compare it with Seedance, Runway, Veo, and other AI video models, then plan image-to-video or text-to-video workflows in Dommi.',
    heroDescription:
      'Use this Dommi page to research Kling AI video generation, compare nearby models, and plan cinematic image-to-video or text-to-video workflows.',
    relatedHeading: 'Kling AI alternatives and related models',
    relatedIntro: 'Compare Kling AI with high-demand AI video models before choosing the right workflow for motion, camera control, and social clips.',
    relatedModels: CORE_VIDEO_MODEL_LINKS.filter((name) => name !== 'Kling AI'),
    highlightsHeading: 'Why creators compare Kling AI in Dommi',
    highlightsIntro: 'Kling AI attracts search demand around image-to-video, motion control, and cinematic prompt tests. Use these notes to match the right intent.',
    highlights: [
      { title: 'Image-to-video demand', text: 'Kling AI is often researched for turning still images into moving shots with believable subject and camera motion.' },
      { title: 'Cinematic motion tests', text: 'Use Kling-style prompts when you want to evaluate action, depth, camera pushes, and realistic short-form video language.' },
      { title: 'Model comparison value', text: 'Compare Kling AI against Seedance, Veo, Runway, and Hailuo when the searcher wants a stronger or cheaper alternative.' },
      { title: 'Commercial clip planning', text: 'Kling AI keywords often overlap with product reveal, fashion, travel, and social ad video use cases.' },
    ],
    howToHeading: 'How to plan a Kling AI workflow in Dommi',
    howToIntro: 'Use a focused comparison workflow before deciding whether Kling AI or another AI video model best fits the job.',
    promptPlaceholder: 'Describe the Kling AI style video: subject, camera movement, scene, action, and output format.',
    ctaHeading: 'Compare Kling AI with Dommi video workflows',
    ctaBody: 'Open Dommi tools when you want to turn the Kling AI search intent into a practical video generation brief.',
    keywords: ['Kling AI', 'Kling AI free', 'Kling AI video generator', 'Kling AI alternative', 'AI video generator'],
    faq: [
      { q: 'What is Kling AI?', a: 'Kling AI is a popular AI video generation brand associated with text-to-video and image-to-video creation. People often research it for cinematic motion, camera control, and realistic short clips.' },
      { q: 'Is Kling AI free?', a: 'Availability and free access can change. This Dommi page targets people comparing free or lower-friction ways to plan AI video workflows around Kling AI style use cases.' },
      { q: 'What is Kling AI best for?', a: 'Kling AI search intent is strongest around image-to-video, cinematic motion, product clips, character movement, and short social videos.' },
      { q: 'What are Kling AI alternatives?', a: 'Common alternatives to compare include Seedance, Hailuo AI, Runway AI, Veo, Sora, Pika AI, Luma AI, and PixVerse AI.' },
      { q: 'Can I compare Kling AI with other models in Dommi?', a: 'Yes. Dommi model pages are built to help you compare AI video workflows, related models, and prompt strategies before choosing a generator.' },
    ],
  },
  {
    slug: 'hailuo-ai',
    name: 'Hailuo AI',
    vendor: 'MiniMax',
    metaTitle: 'Hailuo AI Free AI Video Generator Alternative | Dommi',
    metaDescription:
      'Research Hailuo AI from MiniMax, compare Hailuo with Kling, Seedance, Runway, and Veo, and plan short AI video workflows in Dommi.',
    heroDescription:
      'Use this Dommi page to research Hailuo AI video generation, compare MiniMax video workflows, and choose the right model for short cinematic clips.',
    relatedHeading: 'Hailuo AI alternatives and related models',
    relatedIntro: 'Compare Hailuo AI with other high-demand AI video models for character motion, prompt adherence, and short-form storytelling.',
    relatedModels: CORE_VIDEO_MODEL_LINKS.filter((name) => name !== 'Hailuo AI'),
    highlightsHeading: 'Why creators compare Hailuo AI in Dommi',
    highlightsIntro: 'Hailuo AI brand searches often come from people evaluating MiniMax video quality, character motion, and model upgrades.',
    highlights: [
      { title: 'Short-form video fit', text: 'Hailuo AI is frequently compared for punchy clips, cinematic prompts, and social-first AI video experiments.' },
      { title: 'Character motion research', text: 'Use Hailuo AI prompts when the searcher cares about expressive motion, gestures, and subject continuity.' },
      { title: 'Version-led search demand', text: 'Hailuo model names and version keywords create useful long-tail opportunities for future child pages.' },
      { title: 'Alternative intent', text: 'Hailuo AI searchers often compare MiniMax output with Kling, Seedance, Runway, and Veo before committing.' },
    ],
    howToHeading: 'How to plan a Hailuo AI workflow in Dommi',
    howToIntro: 'Turn Hailuo AI research intent into a practical short-video prompt and model comparison checklist.',
    promptPlaceholder: 'Describe the Hailuo AI style video: subject, character motion, camera direction, and scene mood.',
    ctaHeading: 'Compare Hailuo AI with Dommi video workflows',
    ctaBody: 'Use Dommi to structure Hailuo AI style prompts and compare them with nearby AI video models.',
    keywords: ['Hailuo AI', 'Hailuo AI free', 'MiniMax AI video generator', 'Hailuo AI alternative', 'AI video generator'],
    faq: [
      { q: 'What is Hailuo AI?', a: 'Hailuo AI is a MiniMax AI video generation product that people research for short video creation, character motion, and cinematic prompt output.' },
      { q: 'Is Hailuo AI free?', a: 'Free access can change by platform and region. This Dommi page helps searchers compare free or accessible workflows around Hailuo AI style video generation.' },
      { q: 'What is Hailuo AI best for?', a: 'It is commonly researched for short-form AI video, character motion, image-to-video experiments, and cinematic social clips.' },
      { q: 'What are Hailuo AI alternatives?', a: 'Alternatives worth comparing include Kling AI, Seedance, Runway AI, Veo, Sora, Pika AI, Luma AI, and PixVerse AI.' },
      { q: 'Can Dommi help with Hailuo AI prompt planning?', a: 'Yes. Use the related Dommi model pages to structure prompts, compare models, and choose the best workflow for the clip you want.' },
    ],
  },
  {
    slug: 'sora',
    name: 'Sora',
    vendor: 'OpenAI',
    metaTitle: 'Sora Free AI Video Generator Alternative | Dommi',
    metaDescription:
      'Research OpenAI Sora, compare it with Veo, Kling, Runway, Seedance, and other AI video generators, and plan prompt workflows in Dommi.',
    heroDescription:
      'Use this Dommi page to research Sora search intent, compare OpenAI video generation with other models, and plan cinematic AI video prompts.',
    relatedHeading: 'Sora alternatives and related models',
    relatedIntro: 'Compare Sora with leading AI video models when searchers want cinematic quality, prompt depth, or an accessible alternative workflow.',
    relatedModels: CORE_VIDEO_MODEL_LINKS.filter((name) => name !== 'Sora'),
    highlightsHeading: 'Why creators compare Sora in Dommi',
    highlightsIntro: 'Sora carries huge brand demand, but many searchers are really looking for practical alternatives, examples, and prompt workflows.',
    highlights: [
      { title: 'OpenAI brand demand', text: 'Sora searches often start broad, then narrow into free access, alternatives, examples, and text-to-video workflows.' },
      { title: 'Cinematic prompt planning', text: 'Use Sora-style briefs for world building, shot continuity, character action, and camera choreography.' },
      { title: 'Alternative comparisons', text: 'Compare Sora with Veo, Runway, Kling, Seedance, Hailuo, and Luma when access or output style matters.' },
      { title: 'Story-first use cases', text: 'Sora intent is strongest for trailers, short films, cinematic scenes, concept videos, and advanced prompt examples.' },
    ],
    howToHeading: 'How to plan a Sora-style workflow in Dommi',
    howToIntro: 'Use Dommi to turn Sora research into a structured prompt, model comparison, and production checklist.',
    promptPlaceholder: 'Describe the Sora-style video: story moment, camera path, subject action, world details, and pacing.',
    ctaHeading: 'Compare Sora with Dommi video workflows',
    ctaBody: 'Open Dommi tools to plan Sora-style prompts and compare accessible AI video model alternatives.',
    keywords: ['Sora', 'Sora AI', 'Sora free', 'OpenAI Sora video generator', 'Sora alternative'],
    faq: [
      { q: 'What is Sora?', a: 'Sora is OpenAI AI video generation brand, commonly researched for text-to-video, cinematic scene generation, and advanced video prompt examples.' },
      { q: 'Is Sora free?', a: 'Sora access and pricing can change. Many searchers use Sora free keywords while looking for accessible alternatives or ways to plan similar AI video workflows.' },
      { q: 'What is Sora best for?', a: 'Sora is associated with cinematic text-to-video, story scenes, world building, realistic motion, and complex prompt following.' },
      { q: 'What are Sora alternatives?', a: 'Common alternatives include Veo, Runway AI, Kling AI, Seedance, Hailuo AI, Pika AI, Luma AI, and PixVerse AI.' },
      { q: 'Can I use Dommi for Sora-style prompt planning?', a: 'Yes. Dommi pages help you compare model intent, write prompts, and choose practical tools for cinematic AI video work.' },
    ],
  },
  {
    slug: 'veo',
    name: 'Veo',
    vendor: 'Google DeepMind',
    metaTitle: 'Veo Free AI Video Generator Alternative | Dommi',
    metaDescription:
      'Research Google Veo, compare it with Sora, Runway, Kling, Seedance, and Hailuo, and plan cinematic AI video workflows in Dommi.',
    heroDescription:
      'Use this Dommi page to research Google Veo video generation, compare it with other AI video models, and plan cinematic prompt workflows.',
    relatedHeading: 'Veo alternatives and related models',
    relatedIntro: 'Compare Google Veo with Sora, Runway, Kling, Seedance, and other AI video models for cinematic output and prompt control.',
    relatedModels: CORE_VIDEO_MODEL_LINKS.filter((name) => name !== 'Veo'),
    highlightsHeading: 'Why creators compare Veo in Dommi',
    highlightsIntro: 'Veo search demand is strongest around Google AI video generation, cinematic quality, and alternatives with easier workflow access.',
    highlights: [
      { title: 'Google AI video demand', text: 'Veo carries strong brand association with high-fidelity AI video, cinematic scenes, and advanced model research.' },
      { title: 'Cinematic output evaluation', text: 'Compare Veo against Sora, Runway, and Seedance when the brief needs polished camera movement and visual realism.' },
      { title: 'Prompt quality research', text: 'Veo-style pages can answer how to write prompts for scene continuity, camera movement, and commercial-quality clips.' },
      { title: 'Accessible alternative intent', text: 'Many users searching Veo also search for free, available, or easier-to-use AI video alternatives.' },
    ],
    howToHeading: 'How to plan a Veo-style workflow in Dommi',
    howToIntro: 'Use Dommi to turn Veo research into a structured AI video prompt and comparison checklist.',
    promptPlaceholder: 'Describe the Veo-style video: scene, subject, camera, realism level, action, and final use case.',
    ctaHeading: 'Compare Veo with Dommi video workflows',
    ctaBody: 'Use Dommi to plan Veo-style prompts and compare the best model path for your AI video idea.',
    keywords: ['Veo', 'Veo AI', 'Veo free', 'Google Veo video generator', 'Veo alternative'],
    faq: [
      { q: 'What is Veo?', a: 'Veo is Google DeepMind AI video generation brand, commonly researched for high-fidelity text-to-video and cinematic AI video output.' },
      { q: 'Is Veo free?', a: 'Veo availability and pricing can change. Searchers using Veo free keywords are often comparing accessible alternatives or planning similar workflows.' },
      { q: 'What is Veo best for?', a: 'Veo intent is strongest for cinematic text-to-video, realistic scenes, high-quality motion, and advanced prompt research.' },
      { q: 'What are Veo alternatives?', a: 'Common alternatives include Sora, Runway AI, Kling AI, Seedance, Hailuo AI, Pika AI, Luma AI, and PixVerse AI.' },
      { q: 'Can Dommi help with Veo prompt planning?', a: 'Yes. Dommi helps structure AI video prompts and compare Veo-style intent against nearby AI video models.' },
    ],
  },
  {
    slug: 'runway-ai',
    name: 'Runway AI',
    vendor: 'Runway',
    metaTitle: 'Runway AI Free AI Video Generator Alternative | Dommi',
    metaDescription:
      'Research Runway AI video generation, compare Runway with Sora, Veo, Kling, Seedance, and Pika, and plan creator workflows in Dommi.',
    heroDescription:
      'Use this Dommi page to research Runway AI, compare video generation and editing workflows, and plan creator-ready AI video prompts.',
    relatedHeading: 'Runway AI alternatives and related models',
    relatedIntro: 'Compare Runway AI with other AI video models and tools for text-to-video, image-to-video, video editing, and creator workflows.',
    relatedModels: CORE_VIDEO_MODEL_LINKS.filter((name) => name !== 'Runway AI'),
    highlightsHeading: 'Why creators compare Runway AI in Dommi',
    highlightsIntro: 'Runway has strong brand demand across AI video generation and creative editing, making it a useful comparison page for bottom-funnel searchers.',
    highlights: [
      { title: 'Creative suite intent', text: 'Runway searchers often want more than a model: they compare generation, editing, motion, and production workflow.' },
      { title: 'Image-to-video comparison', text: 'Runway is commonly compared with Kling, Pika, Luma, and Seedance for animating reference images.' },
      { title: 'Professional workflow fit', text: 'Use Runway-style prompts when the final clip needs to fit into ads, film tests, explainers, or creator reels.' },
      { title: 'Alternative search value', text: 'Runway alternatives are a strong SEO angle because users compare price, access, speed, and output style.' },
    ],
    howToHeading: 'How to plan a Runway AI workflow in Dommi',
    howToIntro: 'Use Dommi to compare Runway AI intent against model-specific workflows and practical AI video tools.',
    promptPlaceholder: 'Describe the Runway-style video: reference image, camera movement, edit goal, and final channel.',
    ctaHeading: 'Compare Runway AI with Dommi video workflows',
    ctaBody: 'Open Dommi tools to plan Runway-style prompts and compare alternatives for creator video production.',
    keywords: ['Runway AI', 'Runway AI free', 'Runway video generator', 'Runway AI alternative', 'AI video editing'],
    faq: [
      { q: 'What is Runway AI?', a: 'Runway AI is a creative AI platform widely researched for video generation, image-to-video, video editing, and production workflows.' },
      { q: 'Is Runway AI free?', a: 'Runway access and free tiers can change. This page targets searchers comparing free or lower-friction Runway AI alternatives.' },
      { q: 'What is Runway AI best for?', a: 'Runway is commonly researched for creative video generation, image-to-video, AI editing, motion experiments, and production workflows.' },
      { q: 'What are Runway AI alternatives?', a: 'Alternatives include Sora, Veo, Kling AI, Seedance, Hailuo AI, Pika AI, Luma AI, and PixVerse AI.' },
      { q: 'Can I compare Runway AI in Dommi?', a: 'Yes. Dommi model pages help compare Runway-style use cases with nearby AI video tools and prompt workflows.' },
    ],
  },
  {
    slug: 'pika-ai',
    name: 'Pika AI',
    vendor: 'Pika Labs',
    metaTitle: 'Pika AI Free AI Video Generator Alternative | Dommi',
    metaDescription:
      'Research Pika AI, compare it with Runway, Luma, Kling, Seedance, and PixVerse, and plan social AI video workflows in Dommi.',
    heroDescription:
      'Use this Dommi page to research Pika AI video generation, compare playful AI video tools, and plan social-first prompt workflows.',
    relatedHeading: 'Pika AI alternatives and related models',
    relatedIntro: 'Compare Pika AI with video models and tools for stylized clips, image-to-video, meme effects, and fast social content.',
    relatedModels: CORE_VIDEO_MODEL_LINKS.filter((name) => name !== 'Pika AI'),
    highlightsHeading: 'Why creators compare Pika AI in Dommi',
    highlightsIntro: 'Pika AI brand searches often point to quick video effects, social clips, and accessible image-to-video workflows.',
    highlights: [
      { title: 'Social-first video intent', text: 'Pika AI searchers often want fast, playful clips for TikTok, Reels, memes, and creator experiments.' },
      { title: 'Stylized motion', text: 'Use Pika-style prompts for animation, surreal effects, transformations, and short visual hooks.' },
      { title: 'Image-to-video alternatives', text: 'Compare Pika AI with Luma, Runway, Kling, Seedance, and PixVerse when animating still images.' },
      { title: 'Low-friction research', text: 'Pika AI free and alternative keywords are useful because many users want an easy way to test AI video ideas.' },
    ],
    howToHeading: 'How to plan a Pika AI workflow in Dommi',
    howToIntro: 'Turn Pika AI search intent into a prompt that fits social, meme, or stylized video use cases.',
    promptPlaceholder: 'Describe the Pika-style video: hook, transformation, subject, visual style, and social format.',
    ctaHeading: 'Compare Pika AI with Dommi video workflows',
    ctaBody: 'Use Dommi to plan Pika-style clips and compare nearby models for social AI video ideas.',
    keywords: ['Pika AI', 'Pika Labs', 'Pika AI free', 'Pika AI alternative', 'AI video effects'],
    faq: [
      { q: 'What is Pika AI?', a: 'Pika AI is a video generation brand commonly researched for stylized AI clips, image-to-video, effects, and social video creation.' },
      { q: 'Is Pika AI free?', a: 'Free access can change. This page is built for searchers comparing Pika AI free options and similar low-friction AI video tools.' },
      { q: 'What is Pika AI best for?', a: 'Pika AI is often associated with fast social videos, stylized transformations, AI effects, and creator-friendly image-to-video workflows.' },
      { q: 'What are Pika AI alternatives?', a: 'Alternatives include Runway AI, Luma AI, Kling AI, Seedance, PixVerse AI, Sora, Veo, and Hailuo AI.' },
      { q: 'Can Dommi help with Pika-style prompts?', a: 'Yes. Dommi helps structure social-first AI video prompts and compare related model choices.' },
    ],
  },
  {
    slug: 'luma-ai',
    name: 'Luma AI',
    vendor: 'Luma AI',
    metaTitle: 'Luma AI Free AI Video Generator Alternative | Dommi',
    metaDescription:
      'Research Luma AI video generation, compare Luma with Runway, Pika, Kling, Seedance, and Sora, and plan AI video workflows in Dommi.',
    heroDescription:
      'Use this Dommi page to research Luma AI video generation, compare image-to-video workflows, and plan realistic AI motion prompts.',
    relatedHeading: 'Luma AI alternatives and related models',
    relatedIntro: 'Compare Luma AI with adjacent AI video models for realistic motion, image-to-video, camera direction, and creator workflows.',
    relatedModels: CORE_VIDEO_MODEL_LINKS.filter((name) => name !== 'Luma AI'),
    highlightsHeading: 'Why creators compare Luma AI in Dommi',
    highlightsIntro: 'Luma AI attracts search demand from creators comparing accessible AI video generation, realistic motion, and image-to-video workflows.',
    highlights: [
      { title: 'Realistic motion research', text: 'Luma AI searchers often care about natural motion, camera drift, and believable short video output.' },
      { title: 'Image-to-video planning', text: 'Use Luma-style prompts when the source image, subject preservation, and camera path are central to the brief.' },
      { title: 'Creator workflow fit', text: 'Luma is frequently compared for concept clips, social posts, product teasers, and creative tests.' },
      { title: 'Alternative comparisons', text: 'Compare Luma with Pika, Runway, Kling, Seedance, Sora, and Veo when choosing the right video model.' },
    ],
    howToHeading: 'How to plan a Luma AI workflow in Dommi',
    howToIntro: 'Use Dommi to turn Luma AI research into a clear image-to-video or text-to-video prompt brief.',
    promptPlaceholder: 'Describe the Luma-style video: source image, natural motion, camera path, and final creative goal.',
    ctaHeading: 'Compare Luma AI with Dommi video workflows',
    ctaBody: 'Open Dommi tools to plan Luma-style motion prompts and compare the best AI video model for your idea.',
    keywords: ['Luma AI', 'Luma AI free', 'Luma video generator', 'Luma AI alternative', 'image to video AI'],
    faq: [
      { q: 'What is Luma AI?', a: 'Luma AI is commonly researched for AI video generation, image-to-video creation, realistic motion, and creator workflows.' },
      { q: 'Is Luma AI free?', a: 'Luma AI access and free tiers can change. This page helps searchers compare Luma AI free intent with related alternatives.' },
      { q: 'What is Luma AI best for?', a: 'Luma AI is often researched for image-to-video, realistic camera movement, short concept clips, and creator video experiments.' },
      { q: 'What are Luma AI alternatives?', a: 'Alternatives include Runway AI, Pika AI, Kling AI, Seedance, Sora, Veo, Hailuo AI, and PixVerse AI.' },
      { q: 'Can I compare Luma AI in Dommi?', a: 'Yes. Dommi pages help compare Luma-style use cases with related AI video models and prompt workflows.' },
    ],
  },
  {
    slug: 'pixverse-ai',
    name: 'PixVerse AI',
    vendor: 'PixVerse',
    metaTitle: 'PixVerse AI Free AI Video Generator Alternative | Dommi',
    metaDescription:
      'Research PixVerse AI, compare PixVerse with Kling, Runway, Pika, Seedance, and Luma, and plan AI video effect workflows in Dommi.',
    heroDescription:
      'Use this Dommi page to research PixVerse AI video generation, compare effect-led workflows, and plan image-to-video or text-to-video clips.',
    relatedHeading: 'PixVerse AI alternatives and related models',
    relatedIntro: 'Compare PixVerse AI with models and tools for effects, image-to-video, social clips, and stylized AI video generation.',
    relatedModels: CORE_VIDEO_MODEL_LINKS.filter((name) => name !== 'PixVerse AI'),
    highlightsHeading: 'Why creators compare PixVerse AI in Dommi',
    highlightsIntro: 'PixVerse AI sits between model searches and tool-brand searches because people look for both video models and viral effect workflows.',
    highlights: [
      { title: 'Effect-led search demand', text: 'PixVerse AI searchers often want creative effects, stylized clips, and fast social video transformations.' },
      { title: 'Model version opportunities', text: 'PixVerse version names create future child-page opportunities for long-tail SEO.' },
      { title: 'Image-to-video workflow', text: 'Use PixVerse-style prompts when a reference image, effect, style, and short clip format matter most.' },
      { title: 'Alternative comparisons', text: 'Compare PixVerse with Kling, Runway, Pika, Seedance, Luma, Sora, and Veo for different video styles.' },
    ],
    howToHeading: 'How to plan a PixVerse AI workflow in Dommi',
    howToIntro: 'Use Dommi to turn PixVerse AI search intent into a clear effect or image-to-video prompt.',
    promptPlaceholder: 'Describe the PixVerse-style video: effect, source image, subject, style, and social format.',
    ctaHeading: 'Compare PixVerse AI with Dommi video workflows',
    ctaBody: 'Open Dommi tools to plan PixVerse-style clips and compare related AI video models.',
    keywords: ['PixVerse AI', 'PixVerse AI free', 'PixVerse video generator', 'PixVerse alternative', 'AI video effects'],
    faq: [
      { q: 'What is PixVerse AI?', a: 'PixVerse AI is a video generation brand commonly researched for AI video effects, image-to-video, text-to-video, and stylized short clips.' },
      { q: 'Is PixVerse AI free?', a: 'PixVerse AI free access can change. This page targets people comparing free or easier ways to plan PixVerse-style AI video workflows.' },
      { q: 'What is PixVerse AI best for?', a: 'PixVerse AI is often associated with video effects, stylized transformations, social clips, and image-to-video experiments.' },
      { q: 'What are PixVerse AI alternatives?', a: 'Alternatives include Kling AI, Runway AI, Pika AI, Seedance, Luma AI, Sora, Veo, and Hailuo AI.' },
      { q: 'Can Dommi help with PixVerse-style prompts?', a: 'Yes. Dommi helps structure effect-led AI video prompts and compare adjacent model choices.' },
    ],
  },
  {
    slug: 'heygen',
    name: 'HeyGen',
    vendor: 'HeyGen',
    metaTitle: 'HeyGen Free AI Video Generator Alternative | Dommi',
    metaDescription:
      'Research HeyGen AI avatars, video translation, and business video workflows, then compare HeyGen with Dommi video and avatar tool alternatives.',
    heroDescription:
      'Use this Dommi page to research HeyGen brand intent, compare avatar video workflows, and plan business or marketing AI video prompts.',
    relatedHeading: 'HeyGen alternatives and related AI video tools',
    relatedIntro: 'Compare HeyGen with AI avatar, video translation, product video, and creator video alternatives before choosing a workflow.',
    relatedModels: TOOL_BRAND_LINKS.filter((name) => name !== 'HeyGen'),
    highlightsHeading: 'Why creators compare HeyGen in Dommi',
    highlightsIntro: 'HeyGen searchers often want avatar video, translation, lip sync, sales outreach, training content, or a practical alternative.',
    highlights: [
      { title: 'Avatar video intent', text: 'HeyGen brand keywords commonly map to AI presenters, talking-head videos, onboarding clips, and training content.' },
      { title: 'Video translation research', text: 'Many HeyGen searches involve localization, translated videos, lip sync, and multilingual business communication.' },
      { title: 'B2B video workflows', text: 'HeyGen is often compared for sales videos, customer education, internal training, and marketing explainers.' },
      { title: 'Alternative search value', text: 'HeyGen alternative pages can capture users comparing price, export quality, avatar realism, and workflow fit.' },
    ],
    howToHeading: 'How to plan a HeyGen-style workflow in Dommi',
    howToIntro: 'Use Dommi to turn HeyGen search intent into a practical avatar, explainer, or translated video brief.',
    promptPlaceholder: 'Describe the HeyGen-style video: speaker, message, audience, language, tone, and distribution channel.',
    ctaHeading: 'Compare HeyGen with Dommi video tools',
    ctaBody: 'Use Dommi to plan avatar-style videos, translated explainers, and business video alternatives.',
    keywords: ['HeyGen', 'HeyGen AI', 'HeyGen free', 'HeyGen alternative', 'AI avatar video generator'],
    faq: [
      { q: 'What is HeyGen?', a: 'HeyGen is an AI video platform commonly researched for avatars, talking-head videos, video translation, voice workflows, and business communication.' },
      { q: 'Is HeyGen free?', a: 'HeyGen access and free tiers can change. This page helps searchers compare HeyGen free intent with practical AI video alternatives.' },
      { q: 'What is HeyGen best for?', a: 'HeyGen is often researched for AI avatars, training videos, sales outreach, video localization, and multilingual explainers.' },
      { q: 'What are HeyGen alternatives?', a: 'Common alternatives include Vidnoz, Akool, Animaker, Haiper AI, Runway AI, PixVerse AI, and broader AI video tools.' },
      { q: 'Can Dommi help plan HeyGen-style videos?', a: 'Yes. Dommi helps convert avatar or explainer video intent into a clear script, prompt, and tool comparison workflow.' },
    ],
  },
  {
    slug: 'vidnoz',
    name: 'Vidnoz',
    vendor: 'Vidnoz',
    metaTitle: 'Vidnoz Free AI Video Generator Alternative | Dommi',
    metaDescription:
      'Research Vidnoz AI avatars, training videos, and business video workflows, then compare Vidnoz with Dommi AI video tool alternatives.',
    heroDescription:
      'Use this Dommi page to research Vidnoz brand intent, compare avatar and presentation workflows, and plan business AI video prompts.',
    relatedHeading: 'Vidnoz alternatives and related AI video tools',
    relatedIntro: 'Compare Vidnoz with AI avatar, explainer, training, and marketing video alternatives before choosing a workflow.',
    relatedModels: TOOL_BRAND_LINKS.filter((name) => name !== 'Vidnoz'),
    highlightsHeading: 'Why creators compare Vidnoz in Dommi',
    highlightsIntro: 'Vidnoz searchers often want business video production, digital presenters, voice workflows, or a lower-friction alternative.',
    highlights: [
      { title: 'Business video intent', text: 'Vidnoz brand searches map to training videos, explainers, sales pitches, and internal communications.' },
      { title: 'Avatar presentation workflows', text: 'Use Vidnoz-style briefs when the video needs a presenter, script, slides, or corporate narration.' },
      { title: 'Voice and localization research', text: 'Vidnoz pages can capture people comparing voice cloning, translation, and multilingual video workflows.' },
      { title: 'Alternative comparisons', text: 'Compare Vidnoz with HeyGen, Akool, Animaker, Haiper, Runway, and PixVerse depending on the output style.' },
    ],
    howToHeading: 'How to plan a Vidnoz-style workflow in Dommi',
    howToIntro: 'Turn Vidnoz search intent into a practical business video, training, or avatar prompt brief.',
    promptPlaceholder: 'Describe the Vidnoz-style video: business message, speaker style, audience, script, and format.',
    ctaHeading: 'Compare Vidnoz with Dommi video tools',
    ctaBody: 'Open Dommi tools to plan business video prompts and compare Vidnoz-style alternatives.',
    keywords: ['Vidnoz', 'Vidnoz AI', 'Vidnoz free', 'Vidnoz alternative', 'AI avatar video generator'],
    faq: [
      { q: 'What is Vidnoz?', a: 'Vidnoz is an AI video brand commonly researched for avatars, business videos, training content, and AI presentation workflows.' },
      { q: 'Is Vidnoz free?', a: 'Vidnoz free access can change. This page helps users compare Vidnoz free intent with related AI video alternatives.' },
      { q: 'What is Vidnoz best for?', a: 'Vidnoz is often researched for training videos, avatar presentations, sales videos, explainers, and corporate communications.' },
      { q: 'What are Vidnoz alternatives?', a: 'Alternatives include HeyGen, Akool, Animaker, Haiper AI, Runway AI, PixVerse AI, and other AI video generators.' },
      { q: 'Can Dommi help plan Vidnoz-style videos?', a: 'Yes. Dommi can help structure the message, script, prompt, and model comparison before you create a business video.' },
    ],
  },
  {
    slug: 'akool',
    name: 'Akool',
    vendor: 'Akool',
    metaTitle: 'Akool Free AI Video Generator Alternative | Dommi',
    metaDescription:
      'Research Akool AI video, avatar, face swap, and translation workflows, then compare Akool with Dommi AI video tool alternatives.',
    heroDescription:
      'Use this Dommi page to research Akool brand intent, compare avatar and face-swap workflows, and plan marketing AI video prompts.',
    relatedHeading: 'Akool alternatives and related AI video tools',
    relatedIntro: 'Compare Akool with AI avatar, video translation, face swap, marketing video, and creator video alternatives.',
    relatedModels: TOOL_BRAND_LINKS.filter((name) => name !== 'Akool'),
    highlightsHeading: 'Why creators compare Akool in Dommi',
    highlightsIntro: 'Akool searchers often want avatar videos, personalized marketing, face swap workflows, video translation, or a comparable AI video tool.',
    highlights: [
      { title: 'Personalized video intent', text: 'Akool brand keywords map to marketing personalization, avatars, campaign videos, and customer-facing content.' },
      { title: 'Face swap research', text: 'Use Akool-style briefs when the searcher wants character replacement, presenter changes, or visual personalization.' },
      { title: 'Translation and localization', text: 'Akool comparisons often include multilingual video, translated marketing assets, and localized creative workflows.' },
      { title: 'Alternative search value', text: 'Akool alternative intent works well for users comparing avatar realism, face tools, pricing, and export workflows.' },
    ],
    howToHeading: 'How to plan an Akool-style workflow in Dommi',
    howToIntro: 'Turn Akool search intent into a practical personalized video, avatar, or translated marketing brief.',
    promptPlaceholder: 'Describe the Akool-style video: avatar, face, message, language, audience, and campaign use case.',
    ctaHeading: 'Compare Akool with Dommi video tools',
    ctaBody: 'Use Dommi to plan avatar, localization, and marketing video prompts before choosing the final tool.',
    keywords: ['Akool', 'Akool AI', 'Akool free', 'Akool alternative', 'AI face swap video'],
    faq: [
      { q: 'What is Akool?', a: 'Akool is an AI video brand commonly researched for avatars, face swap, personalized marketing videos, and translation workflows.' },
      { q: 'Is Akool free?', a: 'Akool free access can change. This page helps searchers compare Akool free intent with related AI video alternatives.' },
      { q: 'What is Akool best for?', a: 'Akool is often researched for avatar video, face swap, personalized ads, translated content, and marketing workflows.' },
      { q: 'What are Akool alternatives?', a: 'Alternatives include HeyGen, Vidnoz, Animaker, Haiper AI, PixVerse AI, Runway AI, and other AI video tools.' },
      { q: 'Can Dommi help plan Akool-style videos?', a: 'Yes. Dommi helps you structure personalized video prompts, localization briefs, and tool comparisons.' },
    ],
  },
  {
    slug: 'animaker',
    name: 'Animaker',
    vendor: 'Animaker',
    metaTitle: 'Animaker Free AI Video Generator Alternative | Dommi',
    metaDescription:
      'Research Animaker AI video, animated presentations, character video, and lip sync workflows, then compare Animaker with Dommi alternatives.',
    heroDescription:
      'Use this Dommi page to research Animaker brand intent, compare animated video workflows, and plan explainer or presentation prompts.',
    relatedHeading: 'Animaker alternatives and related AI video tools',
    relatedIntro: 'Compare Animaker with avatar, animated explainer, presentation, social video, and AI video generation alternatives.',
    relatedModels: TOOL_BRAND_LINKS.filter((name) => name !== 'Animaker'),
    highlightsHeading: 'Why creators compare Animaker in Dommi',
    highlightsIntro: 'Animaker searchers often want animated explainers, character videos, presentation videos, lip sync, or an easier AI workflow.',
    highlights: [
      { title: 'Animated explainer intent', text: 'Animaker brand keywords map to education, business explainers, YouTube intros, and animated presentations.' },
      { title: 'Character workflow research', text: 'Use Animaker-style briefs when character design, voiceover, lip sync, and scenes are central to the output.' },
      { title: 'Presentation video demand', text: 'Animaker searches often include turning static content into animated decks or narrated training videos.' },
      { title: 'Alternative comparisons', text: 'Compare Animaker with HeyGen, Vidnoz, Akool, Haiper, PixVerse, and Runway depending on animation needs.' },
    ],
    howToHeading: 'How to plan an Animaker-style workflow in Dommi',
    howToIntro: 'Turn Animaker search intent into a clear animated explainer, character, or presentation video brief.',
    promptPlaceholder: 'Describe the Animaker-style video: character, script, scene sequence, animation style, and audience.',
    ctaHeading: 'Compare Animaker with Dommi video tools',
    ctaBody: 'Use Dommi to plan animated explainers, presentation videos, and related AI video workflows.',
    keywords: ['Animaker', 'Animaker AI', 'Animaker free', 'Animaker alternative', 'animated video generator'],
    faq: [
      { q: 'What is Animaker?', a: 'Animaker is a video creation brand commonly researched for animated videos, explainers, character animation, presentations, and AI-assisted video workflows.' },
      { q: 'Is Animaker free?', a: 'Animaker free access can change. This page helps searchers compare Animaker free intent with other AI video and animation alternatives.' },
      { q: 'What is Animaker best for?', a: 'Animaker is often researched for animated explainers, training videos, character scenes, lip sync, YouTube intros, and presentation videos.' },
      { q: 'What are Animaker alternatives?', a: 'Alternatives include HeyGen, Vidnoz, Akool, Haiper AI, PixVerse AI, Runway AI, and broader AI video generators.' },
      { q: 'Can Dommi help plan Animaker-style videos?', a: 'Yes. Dommi helps convert animated video ideas into scripts, scene prompts, and tool comparison workflows.' },
    ],
  },
  {
    slug: 'haiper-ai',
    name: 'Haiper AI',
    vendor: 'Haiper',
    metaTitle: 'Haiper AI Free AI Video Generator Alternative | Dommi',
    metaDescription:
      'Research Haiper AI video generation, templates, prompt-to-video workflows, and alternatives, then compare Haiper with Dommi video tools.',
    heroDescription:
      'Use this Dommi page to research Haiper AI brand intent, compare prompt-to-video workflows, and plan social or creative AI video prompts.',
    relatedHeading: 'Haiper AI alternatives and related AI video tools',
    relatedIntro: 'Compare Haiper AI with model-led and tool-led AI video alternatives for prompt-to-video, templates, effects, and social clips.',
    relatedModels: TOOL_BRAND_LINKS.filter((name) => name !== 'Haiper AI'),
    highlightsHeading: 'Why creators compare Haiper AI in Dommi',
    highlightsIntro: 'Haiper AI searchers often want an accessible AI video generator, templates, social effects, or a stronger alternative workflow.',
    highlights: [
      { title: 'Prompt-to-video intent', text: 'Haiper AI brand keywords commonly map to quick text-to-video creation and prompt experimentation.' },
      { title: 'Template-driven workflows', text: 'Use Haiper-style briefs when the user wants a starting template, effect, or social clip direction.' },
      { title: 'Creator video research', text: 'Haiper searches often overlap with meme clips, portraits, creative concepts, and lightweight social content.' },
      { title: 'Alternative comparisons', text: 'Compare Haiper with PixVerse, Runway, Pika, Vidnoz, Animaker, Kling, and Seedance depending on output needs.' },
    ],
    howToHeading: 'How to plan a Haiper AI workflow in Dommi',
    howToIntro: 'Turn Haiper AI search intent into a compact prompt brief for social, template-led, or creative video generation.',
    promptPlaceholder: 'Describe the Haiper-style video: prompt idea, template, style, subject, and social channel.',
    ctaHeading: 'Compare Haiper AI with Dommi video tools',
    ctaBody: 'Use Dommi to plan Haiper-style prompts and compare related AI video alternatives.',
    keywords: ['Haiper AI', 'Haiper AI free', 'Haiper video generator', 'Haiper alternative', 'prompt to video AI'],
    faq: [
      { q: 'What is Haiper AI?', a: 'Haiper AI is a video generation brand commonly researched for prompt-to-video, templates, social clips, and creative AI video workflows.' },
      { q: 'Is Haiper AI free?', a: 'Haiper AI free access can change. This page helps searchers compare Haiper AI free intent with related alternatives.' },
      { q: 'What is Haiper AI best for?', a: 'Haiper AI is often researched for quick AI video prompts, templates, social content, effects, and creative experiments.' },
      { q: 'What are Haiper AI alternatives?', a: 'Alternatives include PixVerse AI, Runway AI, Pika AI, Kling AI, Seedance, Vidnoz, Animaker, and HeyGen.' },
      { q: 'Can Dommi help plan Haiper-style videos?', a: 'Yes. Dommi helps structure prompt-to-video briefs and compare nearby AI video tools.' },
    ],
  },
]

const SEO_IMAGE_PAGE_CONFIGS: SeoImagePageConfig[] = [
  {
    slug: 'recraft',
    name: 'Recraft',
    vendor: 'Recraft',
    searchIntent:
      'Recraft brand searches usually come from designers comparing AI image generation, editable brand graphics, vector-style assets, and production-ready creative outputs.',
    bestFor:
      'Recraft-style workflows are a strong fit for logos, icons, illustrations, social graphics, product visuals, and consistent brand assets.',
    workflow:
      'Start with a design brief, specify the asset format and style system, then compare the result with Ideogram, Flux AI, Seedream, and GPT Image 2.',
    keywords: ['Recraft', 'Recraft AI', 'Recraft AI image generator', 'Recraft free', 'Recraft alternative'],
  },
  {
    slug: 'ideogram',
    name: 'Ideogram',
    vendor: 'Ideogram',
    searchIntent:
      'Ideogram keywords often come from users who need image generation with stronger typography, posters, logos, merch mockups, and text-in-image control.',
    bestFor:
      'Ideogram-style prompts work well for posters, title cards, packaging concepts, logo explorations, and image creatives where readable text matters.',
    workflow:
      'Define the exact text, layout hierarchy, style reference, and output format before comparing Ideogram with Recraft, Flux AI, GPT Image 2, and Midjourney.',
    keywords: ['Ideogram', 'Ideogram AI', 'Ideogram image generator', 'Ideogram free', 'Ideogram alternative'],
  },
  {
    slug: 'stable-diffusion',
    name: 'Stable Diffusion',
    vendor: 'Stability AI',
    searchIntent:
      'Stable Diffusion searches capture broad open-model demand around AI art, local generation, checkpoints, LoRA workflows, and controllable image creation.',
    bestFor:
      'Stable Diffusion-style workflows are useful for custom styles, character concepts, fine-tuned looks, local experiments, and creator-controlled image pipelines.',
    workflow:
      'Write a prompt with subject, style, negative constraints, aspect ratio, and reference rules, then compare Stable Diffusion with Flux AI, Midjourney, and Seedream.',
    keywords: ['Stable Diffusion', 'Stable Diffusion AI', 'Stable Diffusion image generator', 'Stable Diffusion free', 'Stable Diffusion alternative'],
  },
  {
    slug: 'flux-ai',
    name: 'Flux AI',
    vendor: 'Black Forest Labs',
    searchIntent:
      'Flux AI keywords usually indicate users comparing modern image quality, prompt adherence, realism, and open-model alternatives to Midjourney or Stable Diffusion.',
    bestFor:
      'Flux AI-style workflows fit realistic portraits, product concepts, cinematic images, editorial visuals, and prompt tests that need sharp composition.',
    workflow:
      'Describe the subject, camera, lighting, texture, and realism level, then compare Flux AI with Flux Kontext, Stable Diffusion, Seedream, and GPT Image 2.',
    keywords: ['Flux AI', 'Flux AI image generator', 'Flux AI free', 'Flux AI alternative', 'Black Forest Labs Flux'],
  },
  {
    slug: 'seedream',
    name: 'Seedream',
    vendor: 'ByteDance',
    searchIntent:
      'Seedream brand keywords capture ByteDance image-model demand, especially users comparing Seedream versions, image editing, and creator-ready visual generation.',
    bestFor:
      'Seedream-style workflows are useful for image generation, reference-based editing, product visuals, social creatives, and fast concept exploration.',
    workflow:
      'Use a short creative brief with the desired subject, style, edit instruction, and output context, then compare Seedream with GPT Image 2, Nano Banana 2, and Imagen.',
    relatedModels: ['Seedream 4.5', 'Seedream 4.0', 'GPT Image 2', 'Nano Banana 2', 'Imagen', 'Qwen Image', 'Flux AI', 'Midjourney'],
    keywords: ['Seedream', 'Seedream AI', 'Seedream image generator', 'Seedream free', 'Seedream alternative'],
  },
  {
    slug: 'dall-e',
    name: 'DALL-E',
    vendor: 'OpenAI',
    searchIntent:
      'DALL-E searches still capture strong OpenAI image-generation demand from users comparing prompt-based image creation, editing, and accessible alternatives.',
    bestFor:
      'DALL-E-style workflows fit concept art, illustrations, creative ideation, educational visuals, social assets, and general-purpose prompt-to-image tasks.',
    workflow:
      'Convert the idea into a clear subject, style, composition, and usage brief, then compare DALL-E with GPT Image 2, GPT-4o, Imagen, and Midjourney.',
    keywords: ['DALL-E', 'DALL-E AI', 'DALL-E image generator', 'DALL-E free', 'DALL-E alternative'],
  },
  {
    slug: 'imagen',
    name: 'Imagen',
    vendor: 'Google DeepMind',
    searchIntent:
      'Imagen keywords capture Google AI image model interest, especially users comparing realism, prompt fidelity, product imagery, and Gemini-adjacent workflows.',
    bestFor:
      'Imagen-style workflows are useful for realistic images, product scenes, editorial concepts, polished prompt tests, and brand-safe creative exploration.',
    workflow:
      'Specify the visual subject, composition, realism level, lighting, and brand constraints, then compare Imagen with GPT Image 2, Seedream, Flux AI, and Midjourney.',
    keywords: ['Imagen', 'Imagen AI', 'Google Imagen', 'Imagen image generator', 'Imagen alternative'],
  },
  {
    slug: 'gpt-4o',
    name: 'GPT-4o',
    vendor: 'OpenAI',
    searchIntent:
      'GPT-4o image keywords come from users looking for OpenAI image generation, conversational editing, multimodal prompts, and ChatGPT-style creative workflows.',
    bestFor:
      'GPT-4o-style image workflows fit iterative visual editing, idea refinement, social assets, thumbnails, product concepts, and prompt conversations.',
    workflow:
      'Describe the image goal in plain language, add edit constraints and references, then compare GPT-4o with GPT Image 2, DALL-E, Nano Banana 2, and Seedream.',
    keywords: ['GPT-4o', 'GPT-4o image generator', 'GPT-4o image', 'GPT-4o free', 'GPT-4o image alternative'],
  },
  {
    slug: 'flux-kontext',
    name: 'Flux Kontext',
    vendor: 'Black Forest Labs',
    searchIntent:
      'Flux Kontext searches usually come from users comparing contextual image editing, reference preservation, and prompt-driven modifications in the Flux ecosystem.',
    bestFor:
      'Flux Kontext-style workflows are useful for editing an existing image, preserving subject identity, changing scenes, adjusting product visuals, and controlled variations.',
    workflow:
      'Upload or describe the reference, state what must stay fixed, define the edit, then compare Flux Kontext with Flux AI, Seedream, GPT Image 2, and Qwen Image.',
    keywords: ['Flux Kontext', 'Flux Kontext AI', 'Flux Kontext image editor', 'Flux Kontext free', 'Flux Kontext alternative'],
  },
  {
    slug: 'qwen-image',
    name: 'Qwen Image',
    vendor: 'Alibaba',
    searchIntent:
      'Qwen Image keywords capture Alibaba image-model demand from users comparing multilingual prompts, text rendering, image editing, and Chinese-model alternatives.',
    bestFor:
      'Qwen Image-style workflows fit multilingual visual concepts, product creatives, poster-style assets, text-aware images, and regional model comparisons.',
    workflow:
      'Define the language, exact visual text, layout, subject, and style, then compare Qwen Image with Seedream, Imagen, GPT Image 2, and Ideogram.',
    keywords: ['Qwen Image', 'Qwen Image AI', 'Qwen image generator', 'Qwen Image free', 'Qwen Image alternative'],
  },
  {
    slug: 'midjourney',
    name: 'Midjourney',
    vendor: 'Midjourney',
    searchIntent:
      'Midjourney brand searches capture high-volume AI art and image-generation demand from users comparing visual quality, styles, prompts, and alternatives.',
    bestFor:
      'Midjourney-style workflows are strong for cinematic art, stylized portraits, editorial concepts, moodboards, fantasy visuals, and high-impact creative exploration.',
    workflow:
      'Write a compact art-direction prompt with subject, medium, style, composition, and mood, then compare Midjourney with Flux AI, Stable Diffusion, Seedream, and Ideogram.',
    keywords: ['Midjourney', 'Midjourney AI', 'Midjourney image generator', 'Midjourney free', 'Midjourney alternative'],
  },
]

const SEO_TRAFFIC_VIDEO_PAGE_CONFIGS: SeoTrafficVideoPageConfig[] = [
  {
    slug: 'pollo-ai',
    name: 'Pollo AI',
    vendor: 'Pollo AI',
    searchIntent:
      'Pollo AI brand searches come from users comparing the Pollo model ecosystem, video generation access, image-to-video workflows, and alternative creator tools.',
    bestFor:
      'Pollo AI-style workflows are most relevant for users researching all-in-one AI video generation, model routing, creative effects, and fast social video experiments.',
    workflow:
      'Write a concise video brief, pick whether the job is text-to-video or image-to-video, then compare Pollo AI with Kling AI, Hailuo AI, Runway AI, Seedance, and Veo.',
    relatedModels: ['Kling AI', 'Hailuo AI', 'Runway AI', 'PixVerse AI', 'Seedance', 'Veo', 'Sora', 'Pika AI'],
    keywords: ['Pollo AI', 'Pollo AI video generator', 'Pollo AI free', 'Pollo AI alternative', 'Pollo AI model'],
  },
  {
    slug: 'seedance',
    name: 'Seedance',
    vendor: 'ByteDance',
    searchIntent:
      'Seedance keywords capture ByteDance video-model demand from users comparing Seedance versions, text-to-video, image-to-video, and fast creator workflows.',
    bestFor:
      'Seedance-style workflows fit cinematic short videos, product clips, character motion, social creative, and model-version comparisons.',
    workflow:
      'Start with the story beat, subject motion, camera path, and duration, then compare Seedance versions against Kling AI, Hailuo AI, Veo, Sora, and Wan AI.',
    relatedModels: ['Seedance 3.0', 'Seedance 2.0', 'Seedance 2.0 Fast', 'Kling AI', 'Hailuo AI', 'Veo', 'Sora', 'Wan AI'],
    keywords: ['Seedance', 'Seedance AI', 'Seedance video generator', 'Seedance free', 'Seedance alternative'],
  },
  {
    slug: 'seaweed',
    name: 'Seaweed AI',
    vendor: 'ByteDance',
    searchIntent:
      'Seaweed AI is useful as a legacy or alternate ByteDance video-model keyword that can capture users who have not switched to the newer Seedance naming.',
    bestFor:
      'Seaweed AI-style pages work best as bridge content for users researching older ByteDance video model names, Seedance comparisons, and AI video access.',
    workflow:
      'Explain the legacy naming, guide users toward Seedance-style video workflows, and compare the output intent with Kling AI, Hailuo AI, Veo, and Sora.',
    relatedModels: ['Seedance', 'Seedance 2.0', 'Seedance 3.0', 'Kling AI', 'Hailuo AI', 'Veo', 'Sora', 'Wan AI'],
    keywords: ['Seaweed AI', 'Seaweed video generator', 'ByteDance Seaweed AI', 'Seaweed AI alternative', 'Seaweed Seedance'],
  },
  {
    slug: 'wan-ai',
    name: 'Wan AI',
    vendor: 'Alibaba',
    searchIntent:
      'Wan AI keywords capture Alibaba video-model demand from users comparing Wan versions, image-to-video output, Chinese model ecosystems, and AI video alternatives.',
    bestFor:
      'Wan AI-style workflows are useful for cinematic clips, image-to-video, motion tests, product visuals, and users comparing Alibaba models with Seedance or Kling.',
    workflow:
      'Define the source image or text prompt, motion direction, camera movement, and realism level, then compare Wan AI with WanX AI, Seedance, Kling AI, Hailuo AI, and Veo.',
    relatedModels: ['WanX AI', 'Seedance', 'Kling AI', 'Hailuo AI', 'Veo', 'Sora', 'Runway AI', 'PixVerse AI'],
    keywords: ['Wan AI', 'Wan AI video generator', 'Wan AI free', 'Wan 2.6', 'Wan AI alternative'],
  },
  {
    slug: 'wanx-ai',
    name: 'WanX AI',
    vendor: 'Alibaba',
    searchIntent:
      'WanX AI is a legacy or alternate Alibaba video/image model keyword that can capture users searching older Wanxiang and WanX naming instead of Wan AI.',
    bestFor:
      'WanX AI-style pages work best as bridge content for users researching Alibaba model names, Wan AI alternatives, and multimodal creative generation.',
    workflow:
      'Connect the older WanX intent to current Wan AI-style video planning, then compare model fit with Seedance, Kling AI, Hailuo AI, Veo, and Runway AI.',
    relatedModels: ['Wan AI', 'Seedance', 'Kling AI', 'Hailuo AI', 'Veo', 'Sora', 'Runway AI', 'PixVerse AI'],
    keywords: ['WanX AI', 'Wanx AI', 'Wanxiang AI', 'WanX video generator', 'WanX AI alternative'],
  },
]

const MEDEO_PAGE: ModelPageData = {
  ...createSeoTrafficVideoPage({
    slug: 'medeo',
    name: 'Medeo',
    vendor: 'Medeo',
    metaTitle: 'Medeo Free AI Video Generator Alternative | Dommi',
    metaDescription:
      'Research Medeo AI video generation, content-to-video conversion, Visual Track editing, gaming backgrounds, and AI B-roll workflows, then compare Medeo with Dommi alternatives.',
    heroDescription:
      'Medeo is researched for turning prompts, blogs, URLs, slides, scripts, and media assets into finished short-form videos with narration, captions, visuals, and B-roll. Use Dommi to plan a Medeo-style video workflow and compare related AI video alternatives.',
    searchIntent:
      'Medeo brand searches usually come from creators looking for a chat-to-video or content-to-video tool that can automate scripts, narration, subtitles, visuals, music, and short-form packaging.',
    bestFor:
      'Medeo-style workflows are best for repurposing blogs, URLs, slides, screenshots, ideas, or scripts into TikTok, Reels, Shorts, explainers, tutorials, and social storytelling videos.',
    workflow:
      'Start with the source material, decide whether the output needs narration, subtitles, B-roll, gaming backgrounds, or a visual timeline, then compare Medeo with Dommi, Pollo AI, Runway AI, HeyGen, Vidnoz, and Seedance.',
    promptPlaceholder:
      'Describe the Medeo-style video: source content, audience, script tone, visuals, B-roll needs, subtitles, narration, and final platform.',
    relatedModels: ['Pollo AI', 'Runway AI', 'HeyGen', 'Vidnoz', 'Akool', 'Animaker', 'Haiper AI', 'PixVerse AI', 'Kling AI', 'Seedance'],
    keywords: [
      'Medeo',
      'Medeo AI',
      'Medeo free',
      'Medeo AI video generator',
      'Medeo alternative',
      'content to video AI',
      'AI B-roll generator',
      'blog to video AI',
      'slides to video AI',
      'gaming video generator',
    ],
  }),
  highlights_section: {
    h2: 'Key Features of Medeo',
    intro:
      'Medeo pages rank by matching concrete product functions instead of only repeating the brand name. These are the feature angles worth covering for Medeo search traffic.',
    items: [
      {
        title: 'Visual Track timeline',
        text: 'Medeo exposes script blocks, generated scenes, narration, subtitles, and music on a synchronized visual timeline so creators can adjust timing after generation.',
        image: 'https://oss.prd.medeo.app/landing/imgs/hero/h-timeline.webp',
        image_alt: 'Medeo Visual Track timeline screenshot',
      },
      {
        title: 'Content-to-video converter',
        text: 'Medeo can turn source material such as URLs, documents, PDFs, slides, screenshots, or written ideas into structured video projects instead of starting from a blank prompt.',
        image: 'https://oss.prd.medeo.app/landing/imgs/f1/f1-bg-2.webp',
        image_alt: 'Medeo content-to-video assets and docs screenshot',
      },
      {
        title: 'Script, voice, and captions',
        text: 'The product positions itself around multimodal automation: script generation, voiceover, captions, background music, and visual scenes are produced as one video package.',
        image: 'https://oss.prd.medeo.app/landing/imgs/hero/h-audioscript.webp',
        image_alt: 'Medeo audio script and caption editor screenshot',
      },
      {
        title: 'AI B-roll and gaming visuals',
        text: 'Medeo leans into short-form creator formats by adding relevant B-roll, generated scene inserts, and recognizable gaming or cinematic backgrounds for social storytelling.',
        image: 'https://oss.prd.medeo.app/landing/imgs/f2/f2-timeline.webp',
        image_alt: 'Medeo generated visual timeline with cinematic and gaming scenes',
      },
    ],
  },
  examples_section: {
    h2: 'Medeo feature screenshots and workflow examples',
    intro:
      'Use these product-function sections to target Medeo long-tail searches such as Visual Track, content to video, slides to video, gaming video, and AI B-roll generator.',
    items: [
      {
        title: 'Visual Track for script-synced editing',
        prompt:
          'Prompt angle: Convert a story brief into a 45-second short video with synchronized narration, subtitles, B-roll cards, and music. Keep each scene editable on the timeline.',
        result_image: 'https://oss.prd.medeo.app/landing/imgs/hero/h-timeline.webp',
        result_alt: 'Medeo Visual Track timeline with script, scene cards, narration, and music tracks',
      },
      {
        title: 'Content-to-video from URLs, docs, slides, and assets',
        prompt:
          'Prompt angle: Turn a blog post, landing page URL, PDF, or slide deck into a short explainer video with a summary script, supporting visuals, captions, and a clean 16:9 export.',
        result_image: 'https://oss.prd.medeo.app/landing/imgs/f1/f1-bg-2.webp',
        result_alt: 'Medeo content-to-video interface showing uploaded media, docs, links, and generated scenes',
      },
      {
        title: 'Gaming background and short-form storytelling formats',
        prompt:
          'Prompt angle: Create a fast-paced story video with gameplay-style backgrounds, a dramatic script, voiceover, subtitles, and scene changes for TikTok or YouTube Shorts.',
        result_image: 'https://oss.prd.medeo.app/landing/imgs/f2/f2-timeline.webp',
        result_alt: 'Medeo visual timeline with generated gaming-style scene cards and audio tracks',
      },
      {
        title: 'AI B-roll generator for stronger narrative videos',
        prompt:
          'Prompt angle: Generate relevant B-roll inserts from the script, then use Dommi to compare whether a dedicated image-to-video or text-to-video model should create the final clips.',
        result_image: 'https://framerusercontent.com/images/91I35AmlbgxNCocxqkRMdawDiQM.webp',
        result_alt: 'Medeo AI B-roll generated visual example',
      },
    ],
  },
  how_to_section: {
    h2: 'How to use Medeo-style workflows in Dommi',
    intro:
      'Use Dommi to turn Medeo research intent into a clear video brief before choosing the final generation or editing workflow.',
    steps: [
      {
        title: 'Collect the source material',
        description:
          'Start with the blog post, URL, slide deck, screenshot, product notes, or script you want to repurpose, then identify the target platform and video length.',
      },
      {
        title: 'Write the Dommi video brief',
        description:
          'Describe the audience, narration style, scene sequence, B-roll needs, captions, visual references, aspect ratio, and whether the clip should feel like an explainer, tutorial, ad, or story.',
      },
      {
        title: 'Compare the right model path',
        description:
          'Use Dommi related pages to compare Medeo-style automation with Pollo AI, Runway AI, HeyGen, Vidnoz, Seedance, Kling AI, and other tools before opening the generator.',
      },
    ],
  },
  faq_section: {
    h2: 'Medeo FAQ',
    intro: 'Short answers for people researching Medeo free access, best use cases, alternatives, editing, and pricing intent.',
    items: [
      {
        q: 'What is Medeo AI?',
        a: 'Medeo AI is a video creation product people research for chat-to-video, content-to-video, script generation, voiceover, captions, visual scenes, music, and timeline-based editing.',
      },
      {
        q: 'Is Medeo free?',
        a: 'Medeo access, free credits, and pricing can change. This Dommi page targets users comparing Medeo free intent with lower-friction ways to plan similar AI video workflows.',
      },
      {
        q: 'What is Medeo best for?',
        a: 'Medeo is best researched for repurposing blogs, URLs, slides, screenshots, scripts, or ideas into short-form videos with narration, captions, visuals, B-roll, and social-ready formatting.',
      },
      {
        q: 'Can I edit a Medeo-style video after generation?',
        a: 'Medeo positions its Visual Track as a way to adjust generated scenes, script timing, subtitles, narration, music, and assets after the initial video is produced.',
      },
      {
        q: 'What are Medeo alternatives?',
        a: 'Common Medeo alternatives to compare include Pollo AI, Runway AI, HeyGen, Vidnoz, Akool, Animaker, Haiper AI, PixVerse AI, Kling AI, and Seedance.',
      },
      {
        q: 'Can Dommi help with Medeo-style content-to-video planning?',
        a: 'Yes. Dommi helps turn Medeo search intent into a practical prompt, source-content checklist, model comparison, and creator workflow before you generate or edit the final video.',
      },
    ],
  },
  final_cta: {
    h2: 'Plan a Medeo-style AI video in Dommi',
    body: 'Use Dommi tools to turn source content, scripts, screenshots, or slides into a clear video generation brief and compare the best model path.',
    btn_label: 'Open Dommi Tools',
    btn_href: '/tools',
  },
}

const SEO_MODEL_PAGES = [
  ...SEO_VIDEO_PAGE_CONFIGS.map(createSeoVideoPage),
  ...SEO_TRAFFIC_VIDEO_PAGE_CONFIGS.map(createSeoTrafficVideoPage),
  MEDEO_PAGE,
  ...SEO_IMAGE_PAGE_CONFIGS.map(createSeoImagePage),
]

export const MODEL_PAGES = [
  seedance30,
  seedance20,
  seedance20Fast,
  seedance15Pro,
  seedance10Pro,
  seedance10ProFast,
  seedance10Lite,
  ...SEO_MODEL_PAGES,
  happyHorse15,
  happyHorse10,
  ltx23,
  nanoBananaPro,
  nanoBanana2,
  nanoBanana,
  seedream45,
  seedream40,
  gptImage2,
] as ModelPageData[]

const PRIMARY_ROUTE_BY_SOURCE_SLUG: Record<string, string> = {
  'seedance-3-0': 'seedance-3.0',
  'seedance-2-0': 'seedance-2.0',
  'seedance-2-0-fast': 'seedance-2.0-fast',
  'seedance-1-5-pro': 'seedance-1.5-pro',
  'seedance-1-0-pro': 'seedance-1.0-pro',
  'seedance-1-0-pro-fast': 'seedance-1.0-pro-fast',
  'seedance-1-0-lite': 'seedance-1.0-lite',
  'happy-horse-1-5': 'happy-horse-1.5',
  'happy-horse-1-0': 'happy-horse-1.0',
  'ltx-2-3': 'ltx-2.3',
  'seedream-4-5': 'seedream-4.5',
  'seedream-4-0': 'seedream-4.0',
}

const SOURCE_SLUG_BY_NAME: Record<string, string> = {
  'Seedance 3.0': 'seedance-3-0',
  'Seedance 2.0': 'seedance-2-0',
  'Seedance 2.0 Fast': 'seedance-2-0-fast',
  'Seedance 1.5 Pro': 'seedance-1-5-pro',
  'Seedance 1.0 Pro': 'seedance-1-0-pro',
  'Seedance 1.0 Pro Fast': 'seedance-1-0-pro-fast',
  'Seedance 1.0 Lite': 'seedance-1-0-lite',
  Seedance: 'seedance',
  'Seaweed AI': 'seaweed',
  'Wan AI': 'wan-ai',
  'WanX AI': 'wanx-ai',
  'Pollo AI': 'pollo-ai',
  'Kling AI': 'kling-ai',
  'Hailuo AI': 'hailuo-ai',
  Sora: 'sora',
  Veo: 'veo',
  'Runway AI': 'runway-ai',
  'Pika AI': 'pika-ai',
  'Luma AI': 'luma-ai',
  'PixVerse AI': 'pixverse-ai',
  HeyGen: 'heygen',
  Vidnoz: 'vidnoz',
  Akool: 'akool',
  Animaker: 'animaker',
  'Haiper AI': 'haiper-ai',
  Medeo: 'medeo',
  'Happy Horse 1.5': 'happy-horse-1-5',
  'Happy Horse 1.0': 'happy-horse-1-0',
  'LTX 2.3': 'ltx-2-3',
  'Ltx 2.3': 'ltx-2-3',
  'Nano Banana Pro': 'nano-banana-pro',
  'Nano Banana 2': 'nano-banana-2',
  'Nano Banana': 'nano-banana',
  'Seedream 4.5': 'seedream-4-5',
  'Seedream 4.0': 'seedream-4-0',
  Seedream: 'seedream',
  'GPT Image 2': 'gpt-image-2',
  Recraft: 'recraft',
  Ideogram: 'ideogram',
  'Stable Diffusion': 'stable-diffusion',
  'Flux AI': 'flux-ai',
  'DALL-E': 'dall-e',
  Imagen: 'imagen',
  'GPT-4o': 'gpt-4o',
  'Flux Kontext': 'flux-kontext',
  'Qwen Image': 'qwen-image',
  Midjourney: 'midjourney',
}

export function getModelRouteSlug(sourceSlug: string) {
  return PRIMARY_ROUTE_BY_SOURCE_SLUG[sourceSlug] || sourceSlug
}

export function getModelCanonicalPath(model: ModelPageData) {
  return `/m/${getModelRouteSlug(model.slug)}`
}

export function getModelDisplayName(model: ModelPageData) {
  const defaultField = model.generator_panel?.fields?.find((field) => field.name === 'model')?.default
  if (defaultField) return defaultField

  return model.hero.h1
    .replace(/\s+[—-]\s+.*$/, '')
    .replace(/\s+AI (Video|Image).*$/, '')
    .trim()
}

function getAliases(model: ModelPageData) {
  return Array.from(new Set([getModelRouteSlug(model.slug), model.slug]))
}

const MODEL_BY_ROUTE_SLUG = new Map<string, ModelPageData>()

for (const model of MODEL_PAGES) {
  for (const alias of getAliases(model)) {
    MODEL_BY_ROUTE_SLUG.set(alias, model)
  }
}

export function getModelPageByRouteSlug(routeSlug: string) {
  return MODEL_BY_ROUTE_SLUG.get(routeSlug)
}

export function getRelatedModelHref(name: string) {
  const sourceSlug = SOURCE_SLUG_BY_NAME[name]
  if (!sourceSlug) return undefined
  return `/m/${getModelRouteSlug(sourceSlug)}`
}

export const MODEL_STATIC_ROUTE_SLUGS = Array.from(
  new Set(MODEL_PAGES.flatMap((model) => getAliases(model)))
).filter((slug) => slug !== 'seedance-2.0')

export const MODEL_INDEX_ITEMS = MODEL_PAGES.map((model) => ({
  name: getModelDisplayName(model),
  category: model.category,
  vendor: model.vendor,
  href: getModelCanonicalPath(model),
  description: model.hero.description,
}))
