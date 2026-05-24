export type ToolMode = {
  label: string
  value: string
}

export type GeneratorField = {
  name: string
  label: string
  default: string
  options: string[]
}

export type GeneratorPanel = {
  agent_label?: string
  pill_label?: string
  quick_motion?: string
  quick_style?: string
  quick_motion_options?: string[]
  quick_style_options?: string[]
  tool_modes?: ToolMode[]
  fields?: GeneratorField[]
  upload?: {
    show?: boolean
    placeholder?: string
    hint?: string
    accept?: string
  }
  prompt_placeholders?: Record<string, string>
  toggles?: Array<{
    name: string
    label: string
    default?: boolean
  }>
  generator_links?: Record<string, string>
  submit_labels?: Record<string, string>
}

export type ModelExample = {
  title: string
  prompt: string
  result?: string
  result_image?: string
  result_video?: string
  result_video_poster?: string
  result_alt?: string
}

export type RedditPost = {
  title: string
  url: string
  height?: number
  subreddit?: string
  excerpt?: string
  media?: {
    type?: string
    image_url?: string
    preview_url?: string
    video_url?: string
    poster?: string
    width?: number
    height?: number
    gallery_count?: number
  }
  meta?: {
    author?: string
    created_utc?: number
    ups?: number
    num_comments?: number
    subreddit_icon?: string
  }
}

export type YoutubeVideo = {
  id: string
  title: string
  url?: string
  description?: string
  uploadDate?: string
  thumbnailUrl?: string
}

export type XPost = {
  id: string
  text: string
  author?: string
  handle?: string
  date?: string
  url?: string
}

export type ModelPageData = {
  slug: string
  source_slug?: string
  category: 'image' | 'video' | string
  vendor: string
  brand?: string
  meta?: {
    title?: string
    description?: string
    keywords?: string | string[]
  }
  hero: {
    h1: string
    description: string
  }
  generator_panel?: GeneratorPanel
  related_section?: {
    h2: string
    intro?: string
    related_models?: string[]
  }
  highlights_section?: {
    h2: string
    intro?: string
    items?: Array<{
      title: string
      text: string
      image?: string
      image_alt?: string
    }>
  }
  examples_section?: {
    h2: string
    intro?: string
    items?: ModelExample[]
  }
  youtube_section?: {
    h2: string
    intro?: string
  }
  reddit_section?: {
    h2: string
    intro?: string
  }
  x_section?: {
    h2: string
    intro?: string
  }
  social?: {
    youtube_videos?: YoutubeVideo[]
    reddit_posts?: RedditPost[]
    x_posts?: XPost[]
  }
  how_to_section?: {
    h2: string
    intro?: string
    steps?: Array<{
      title: string
      description: string
    }>
  }
  faq_section?: {
    h2: string
    intro?: string
    items?: Array<{
      q: string
      a: string
    }>
  }
  final_cta?: {
    logo?: string
    h2: string
    body?: string
    btn_label?: string
    btn_link?: string
    btn_href?: string
  }
}

export type RelatedModelLink = {
  name: string
  href?: string
}
