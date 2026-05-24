'use client'

import { useMemo, useRef } from 'react'
import Link from 'next/link'
import {
  ArrowBigUp,
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Clapperboard,
  ExternalLink,
  Heart,
  Link2,
  MessageCircle,
  MoreHorizontal,
  Play,
  Plus,
  Repeat2,
  Share2,
  Sparkles,
} from 'lucide-react'
import pageData from './seedance-2-0.json'
import styles from './seedance-2.module.css'
import PromePromptBox from '../PromePromptBox'

const relatedModelSlugs: Record<string, string> = {
  'Seedance 2.0 Fast': 'seedance-2.0-fast',
  'Seedance 1.5 Pro': 'seedance-1.5-pro',
  'Seedance 1.0 Pro': 'seedance-1.0-pro',
  'Seedance 1.0 Pro Fast': 'seedance-1.0-pro-fast',
  'Seedance 1.0 Lite': 'seedance-1.0-lite',
}

const generatorHref = '/tools'

function dommiText(value: string | undefined) {
  return value || ''
}

function getYoutubeEmbedUrl(id: string) {
  return `https://www.youtube.com/embed/${id}`
}

function getYoutubeThumbnailUrl(id: string) {
  return `https://i.ytimg.com/vi/${id}/hq720.jpg`
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function getYoutubeSrcDoc(id: string, title: string) {
  const safeTitle = escapeHtml(title)
  const embedUrl = `${getYoutubeEmbedUrl(id)}?autoplay=1&playsinline=1&rel=0`
  const thumbnailUrl = getYoutubeThumbnailUrl(id)
  const fallbackThumbnailUrl = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

  return `
    <style>
      *{box-sizing:border-box}body{margin:0;background:#0f172a}
      a{position:absolute;inset:0;display:block;color:inherit;text-decoration:none}
      img{width:100%;height:100%;display:block;object-fit:cover}
      .shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(15,23,42,0) 44%,rgba(15,23,42,.24) 100%)}
      .play{position:absolute;left:50%;top:50%;width:66px;height:46px;display:flex;align-items:center;justify-content:center;border-radius:14px;background:#ff0033;box-shadow:0 14px 34px rgba(15,23,42,.28);transform:translate(-50%,-50%);transition:transform .18s ease,background-color .18s ease}
      .play svg{width:24px;height:24px;margin-left:3px;fill:#fff}
      a:hover .play{background:#ff1f4c;transform:translate(-50%,-50%) scale(1.04)}
    </style>
    <a href="${embedUrl}" aria-label="Play ${safeTitle}">
      <img src="${thumbnailUrl}" alt="${safeTitle}" onerror="this.onerror=null;this.src='${fallbackThumbnailUrl}';" />
      <span class="shade" aria-hidden="true"></span>
      <span class="play" aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
      </span>
    </a>
  `
}

function getXUrl(id: string) {
  return `https://twitter.com/i/status/${id}`
}

const xPostPreviews: Record<
  string,
  {
    summary: string
    authorName: string
    handle: string
    authorUrl: string
    date: string
    text: string
    url: string
  }
> = {
  '2037695793554145325': {
    summary: 'Topview Agent V2 and Seedance 2.0 creator workflow discussion',
    authorName: "Tom's KI Ecke",
    handle: 'KI_HAL_2023',
    authorUrl: 'https://twitter.com/KI_HAL_2023',
    date: 'March 28, 2026',
    text: `Topview Agent V2 x Seedance 2.0 just changed the game for long-form AI video.

From a single idea -> full storyboard -> multi-scene, studio-quality video... all in one workflow.

No more stitching short clips. No more complex tools. Just smart automation + precise control.

🎬 pic.twitter.com/hLGK23HeYd`,
    url: 'https://twitter.com/KI_HAL_2023/status/2037695793554145325',
  },
  '2041763561333264865': {
    summary: 'ChatCut Seedance 2.0 creator example',
    authorName: 'ChatCut',
    handle: 'chatcutapp',
    authorUrl: 'https://twitter.com/chatcutapp',
    date: 'April 8, 2026',
    text: 'ChatCut Seedance 2.0 creator example\n\nhttps://t.co/keR0qNwwVR',
    url: 'https://twitter.com/chatcutapp/status/2041763561333264865',
  },
  '2042396177883107519': {
    summary: 'Seedance 2.0 worldwide availability and creator tests',
    authorName: 'Alvaro Cintas',
    handle: 'dr_cintas',
    authorUrl: 'https://twitter.com/dr_cintas',
    date: 'April 10, 2026',
    text: `🚨BREAKING: Seedance 2.0 is now available worldwide on Higgsfield.

Most people focus on the benchmark scores but there's a number buried in the Seedance 2.0 specs that most people gloss over.

90%+ usable output rate.

Every model benchmarks well. Few actually deliver usable output. pic.twitter.com/lHzWdjK9XV`,
    url: 'https://twitter.com/dr_cintas/status/2042396177883107519',
  },
  '2041561378495082582': {
    summary: 'First generation test with Seedance 2.0',
    authorName: 'Umesh',
    handle: 'umesh_ai',
    authorUrl: 'https://twitter.com/umesh_ai',
    date: 'April 7, 2026',
    text: `My first generation with Seedance 2.0 on RunwayML

Prompt: A lone traveler walks across a vast, glass-like ocean under a violet twilight sky. Beneath the transparent water, millions of stars twinkle and pulse as if the entire universe is submerged. Each step ripples through the scene.

https://t.co/DxgvtlKIG4 pic.twitter.com/PzHHv17QnV`,
    url: 'https://twitter.com/umesh_ai/status/2041561378495082582',
  },
  '2041903277835526146': {
    summary: 'Seedance 2.0 creator comparison and pricing discussion',
    authorName: 'JSFILMZ',
    handle: 'JSFILMZ0412',
    authorUrl: 'https://twitter.com/JSFILMZ0412',
    date: 'April 8, 2026',
    text: `🔥 Seedance 2.0 has FINALLY landed in the USA! 🇺🇸

I just compared the pricing and features of Seedance 2.0 against Dreamina and Topview AI.

TLDR: Dreamina doesn't allow faces at the moment and also charges more when you upload video and audio as references. https://t.co/R39eoJ2112 pic.twitter.com/PRHDc02a54`,
    url: 'https://twitter.com/JSFILMZ0412/status/2041903277835526146',
  },
  '2022327369747558640': {
    summary: 'AI product listing and dynamic video workflow discussion',
    authorName: 'Chris Camillo',
    handle: 'ChrisCamillo',
    authorUrl: 'https://twitter.com/ChrisCamillo',
    date: 'February 13, 2026',
    text: `When every product listing is running live AI agents, dynamic pricing, personalized copy, synthetic media, and real-time Q&A, cloud compute demand does not go linear.

It goes exponential. $AMZN $GOOG $META $NVDA https://t.co/kFnHVk2hoD`,
    url: 'https://twitter.com/ChrisCamillo/status/2022327369747558640',
  },
  '2023001993061744933': {
    summary: 'Seedance 2.0 comic panel to video example',
    authorName: 'Paskoboy',
    handle: 'beranalogi',
    authorUrl: 'https://twitter.com/beranalogi',
    date: 'February 15, 2026',
    text: 'AI semakin GILA! cuma modal masukin panel komik, Seedance 2.0 bisa jadikan video kartun Doraemon😱 pic.twitter.com/WZjYi10oja',
    url: 'https://twitter.com/beranalogi/status/2023001993061744933',
  },
  '2037591044372758984': {
    summary: 'Dreamina Seedance 2.0 creator thread',
    authorName: 'Chubby♨️',
    handle: 'kimmonismus',
    authorUrl: 'https://twitter.com/kimmonismus',
    date: 'March 27, 2026',
    text: `1/ We've all been aware of the hype surrounding Dreamina Seedance 2.0, and I finally got early access to the tool. And wow, I'm blown away. This is by far the best.

It is starting to make AI video feel less like "generate a clip" and more like "direct a scene."

What stood out... pic.twitter.com/dQtQINqzEx`,
    url: 'https://twitter.com/kimmonismus/status/2037591044372758984',
  },
  '2024925187095863675': {
    summary: 'Seedance 2.0 complex camera move test',
    authorName: 'SD | AI Animation Storyteller',
    handle: 'SDXLHQ',
    authorUrl: 'https://twitter.com/SDXLHQ',
    date: 'February 20, 2026',
    text: `Test 4 🚨 Complex camera moves.

Seedance 2.0 just makes anything look too simple.

Single line prompt used: Replace the character in Video 1 with the basketball player from Image 1. The player's body proportions, facial features, and athletic build must remain consistent. pic.twitter.com/8ins1JQZKf`,
    url: 'https://twitter.com/SDXLHQ/status/2024925187095863675',
  },
  '2020295747741057507': {
    summary: 'Seedance 2.0 AI filmmaking example',
    authorName: 'nachos2d',
    handle: 'NACHOS2D_',
    authorUrl: 'https://twitter.com/NACHOS2D_',
    date: 'February 8, 2026',
    text: `This was made 100% by artificial intelligence.
I know it's hard to believe, but it was created with Seedance 2.0, a Chinese AI, with no censorship, already released in China and coming globally in the future.
Everything is extremely smooth, with almost no errors.
We're starting... pic.twitter.com/3RCSNOF5V8`,
    url: 'https://twitter.com/NACHOS2D_/status/2020295747741057507',
  },
  '2020267913316561195': {
    summary: 'Seedance 2.0 product advertising prompt example',
    authorName: '尾鳍Vicky',
    handle: 'BFAVicky',
    authorUrl: 'https://twitter.com/BFAVicky',
    date: 'February 7, 2026',
    text: '提示词：根据图片1的脚本生成图片2香水产品的广告内容，旁白的声音参考自然的女声用英文读，香水的比例要注意一些，要用自然的光线融入进背景里，不要太重的贴图和抠图感，节奏可以更明快一些。#seedance 2.0 pic.twitter.com/VdzsANYGca',
    url: 'https://twitter.com/BFAVicky/status/2020267913316561195',
  },
}

function getXPostPreview(post: (typeof pageData.social.x_posts)[number]) {
  return (
    xPostPreviews[post.id] || {
      summary: post.text,
      authorName: 'X creator',
      handle: 'creator',
      authorUrl: 'https://twitter.com',
      date: 'Creator post',
      text: post.text,
      url: getXUrl(post.id),
    }
  )
}

function getXAvatarUrl(handle: string) {
  return `https://unavatar.io/x/${handle}`
}

function getXInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || 'X'
}

function getXAvatarColor(handle: string) {
  const palette = ['#111827', '#0f766e', '#2563eb', '#7c3aed', '#be123c', '#b45309']
  let hash = 0
  for (let index = 0; index < handle.length; index += 1) {
    hash = (hash << 5) - hash + handle.charCodeAt(index)
    hash |= 0
  }
  return palette[Math.abs(hash) % palette.length]
}

function cleanExcerpt(value: string | undefined, maxLength = 210) {
  const text = dommiText(value).replace(/\s+/g, ' ').trim()
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength).trim()}...`
}

function formatCount(value: number | undefined) {
  if (!value) return '0'
  if (value >= 1000) return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`
  return String(value)
}

function formatTimeAgo(timestamp: number | undefined) {
  if (!timestamp) return ''
  const seconds = Math.max(0, Math.floor(Date.now() / 1000 - timestamp))
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min. ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hr. ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} d. ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} mo. ago`
  const years = Math.floor(days / 365)
  return `${years} yr. ago`
}

function subredditInitial(name: string | undefined) {
  return (name || 'R').charAt(0).toUpperCase()
}

function subredditColor(name: string | undefined) {
  const palette = ['#ff4500', '#0079d3', '#00a86b', '#7193ff', '#ff8717', '#ff66ac', '#9c27b0', '#1abc9c']
  if (!name) return palette[0]
  let hash = 0
  for (let index = 0; index < name.length; index += 1) {
    hash = (hash << 5) - hash + name.charCodeAt(index)
    hash |= 0
  }
  return palette[Math.abs(hash) % palette.length]
}

type RedditPost = (typeof pageData.social.reddit_posts)[number]

function getRedditVideo(post: RedditPost) {
  return 'video_url' in post.media ? post.media.video_url : ''
}

function getRedditPreview(post: RedditPost) {
  if ('preview_url' in post.media) return post.media.preview_url
  if ('poster' in post.media) return post.media.poster
  return ''
}

export default function SeedanceLanding() {
  const youtubeRef = useRef<HTMLDivElement>(null)

  const relatedModels = useMemo(
    () =>
      (pageData.related_section.related_models || []).map((name) => ({
        name,
        href: relatedModelSlugs[name] ? `/m/${relatedModelSlugs[name]}` : undefined,
      })),
    []
  )

  const youtubeVideos = pageData.social.youtube_videos || []
  const redditPosts = pageData.social.reddit_posts || []
  const xPosts = pageData.social.x_posts || []
  const highlightSteps = (pageData.how_to_section.steps || []).slice(0, 3)

  function scrollYoutube(direction: number) {
    const scroller = youtubeRef.current
    if (!scroller) return
    scroller.scrollBy({
      left: direction * Math.max(scroller.clientWidth * 0.9, 360),
      behavior: 'smooth',
    })
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroBlobLeft} aria-hidden="true" />
        <div className={styles.heroBlobRight} aria-hidden="true" />
        <div className={styles.container}>
          <div className={styles.heroCopy}>
            <h1>Seedance 2.0 AI Video Generator</h1>
            <p>{dommiText(pageData.hero.description)}</p>

            <PromePromptBox
              styles={styles}
              promptId="seedancePrompt"
              generatorHref={pageData.generator_panel.generator_links.image || generatorHref}
              displayName="Seedance 2.0"
              modelSlug="seedance-2.0"
              analyticsLocation="seedance_landing_generator_box"
              uploadAccept={pageData.generator_panel.upload.accept}
              category={pageData.category}
              fields={pageData.generator_panel.fields}
              generatorLinks={pageData.generator_panel.generator_links}
            />

            <p className={styles.heroTrust}>
              Generate your first videos free · Image-to-video and text-to-video · Built for creator workflows
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section} id="examples">
        <div className={styles.container}>
          <div className={`${styles.sectionHead} ${styles.sectionHeadCenter}`}>
            <h2>{dommiText(pageData.examples_section.h2)}</h2>
            <p>{dommiText(pageData.examples_section.intro)}</p>
          </div>

          <div className={styles.featureStack}>
            {pageData.examples_section.items.map((example, index) => (
              <article
                key={example.title}
                className={`${styles.featureRow} ${index % 2 === 1 ? styles.featureRowReverse : ''}`}
              >
                <div className={styles.featureCopy}>
                  <h3>{dommiText(example.title)}</h3>
                  <p className={styles.featurePrompt}>{dommiText(example.prompt)}</p>
                </div>
                <div className={styles.featureMedia}>
                  <video
                    src={example.result_video}
                    poster={example.result_video_poster}
                    aria-label={example.result_alt || example.title}
                    muted
                    loop
                    playsInline
                    controls
                    preload="metadata"
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.container}>
          <div className={`${styles.sectionHead} ${styles.sectionHeadCenter}`}>
            <h2>{dommiText(pageData.related_section.h2)}</h2>
            <p>{dommiText(pageData.related_section.intro)}</p>
          </div>

          <div className={styles.chipRow}>
            {relatedModels.map((model) =>
              model.href ? (
                <Link key={model.name} className={`${styles.chip} ${styles.chipLink}`} href={model.href}>
                  {model.name}
                </Link>
              ) : (
                <span key={model.name} className={styles.chip}>
                  {model.name}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <div className={styles.embedSection}>
            <div className={styles.sectionHead}>
              <h2>{dommiText(pageData.youtube_section.h2)}</h2>
              <p>{dommiText(pageData.youtube_section.intro)}</p>
            </div>
            <div className={styles.embedShell}>
              <button type="button" className={styles.carouselNav} aria-label="Previous videos" onClick={() => scrollYoutube(-1)}>
                ‹
              </button>
              <div className={styles.youtubeGrid} ref={youtubeRef}>
                {youtubeVideos.map((video) => (
                  <article key={video.id} className={styles.youtubeEmbedCard}>
                    <iframe
                      src={getYoutubeEmbedUrl(video.id)}
                      srcDoc={getYoutubeSrcDoc(video.id, dommiText(video.title))}
                      title={dommiText(video.title)}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </article>
                ))}
              </div>
              <button type="button" className={styles.carouselNav} aria-label="Next videos" onClick={() => scrollYoutube(1)}>
                ›
              </button>
            </div>
          </div>

          <div className={styles.embedSection}>
            <div className={styles.sectionHead}>
              <h2>{dommiText(pageData.reddit_section.h2)}</h2>
              <p>{dommiText(pageData.reddit_section.intro)}</p>
            </div>
            <div className={styles.embedMasonry}>
              {redditPosts.slice(0, 6).map((post) => (
                <article key={post.url} className={styles.redditCard}>
                  <header className={styles.redditHeader}>
                    <span className={styles.redditAvatar} aria-hidden="true">
                      {post.meta.subreddit_icon ? (
                        <img className={styles.redditAvatarImg} src={post.meta.subreddit_icon} alt="" loading="lazy" />
                      ) : (
                        <span
                          className={styles.redditAvatarFallback}
                          style={{ background: subredditColor(post.subreddit) }}
                        >
                          {subredditInitial(post.subreddit)}
                        </span>
                      )}
                    </span>

                    <div className={styles.redditIdentity}>
                      <strong>{post.subreddit}</strong>
                      <span>
                        {post.meta.author ? `Posted by u/${post.meta.author}` : 'Posted on Reddit'}
                        {post.meta.created_utc ? ` · ${formatTimeAgo(post.meta.created_utc)}` : ''}
                      </span>
                    </div>

                    <span className={styles.redditJoin} aria-hidden="true">
                      <Plus size={12} />
                      Join
                    </span>

                    <span className={styles.redditBrand} aria-hidden="true">
                      <svg viewBox="0 0 20 20" width="22" height="22">
                        <circle cx="10" cy="10" r="10" fill="#ff4500" />
                        <path
                          d="M16.7 10c0-.8-.6-1.4-1.4-1.4-.4 0-.7.1-1 .4-1-.7-2.3-1.1-3.7-1.2l.6-3 2.1.4c0 .5.5 1 1 1s1-.5 1-1.1-.5-1-1-1c-.4 0-.8.3-1 .6L10.9 4l-.8 3.8c-1.4.1-2.7.5-3.7 1.2-.3-.3-.6-.4-1-.4-.8 0-1.4.6-1.4 1.4 0 .6.3 1 .8 1.3v.6c0 2 2.3 3.6 5.2 3.6s5.2-1.6 5.2-3.6v-.6c.5-.2.8-.7.8-1.3zM6.9 11c0-.5.5-1 1-1s1 .5 1 1-.5 1-1 1-1-.5-1-1zm6 2.4c-.7.7-2 .8-2.5.8-.5 0-1.8-.1-2.5-.8-.1-.1-.1-.3 0-.4.1-.1.3-.1.4 0 .5.5 1.5.6 2.1.6.6 0 1.6-.1 2.1-.6.1-.1.3-.1.4 0 .1.1.1.3 0 .4zm.1-1.4c-.5 0-1-.5-1-1s.5-1 1-1 1 .5 1 1-.5 1-1 1z"
                          fill="#fff"
                        />
                      </svg>
                      <span>reddit</span>
                    </span>
                  </header>

                  <h3 className={styles.redditTitle}>{dommiText(post.title)}</h3>

                  {getRedditVideo(post) ? (
                    <video
                      className={styles.redditMedia}
                      src={getRedditVideo(post)}
                      poster={getRedditPreview(post)}
                      playsInline
                      controls
                      preload="metadata"
                    />
                  ) : getRedditPreview(post) ? (
                    <img className={styles.redditMedia} src={getRedditPreview(post)} alt={dommiText(post.title)} loading="lazy" />
                  ) : null}

                  {post.excerpt ? <p className={styles.redditExcerpt}>{cleanExcerpt(post.excerpt, 260)}</p> : null}

                  <div className={styles.redditActions} aria-hidden="true">
                    <span>
                      <ArrowBigUp size={16} />
                      {formatCount(post.meta.ups)} upvotes
                    </span>
                    <span>
                      <MessageCircle size={16} />
                      Comment
                    </span>
                    <span>
                      <Link2 size={16} />
                      Copy link
                    </span>
                  </div>

                  <a className={styles.redditCta} href={post.url} target="_blank" rel="noopener noreferrer">
                    {post.meta.num_comments ? `View ${formatCount(post.meta.num_comments)} comments` : 'View on Reddit'}
                    <ExternalLink size={13} />
                  </a>
                </article>
              ))}
            </div>
          </div>

          <div className={styles.embedSection}>
            <div className={styles.sectionHead}>
              <h2>{dommiText(pageData.x_section.h2)}</h2>
              <p>{dommiText(pageData.x_section.intro)}</p>
            </div>
            <div className={styles.twitterGrid}>
              {xPosts.slice(0, 6).map((post) => {
                const preview = getXPostPreview(post)
                return (
                  <article key={post.id} className={styles.twitterEmbedCard}>
                    <header className={styles.xHeader}>
                      <a className={styles.xAuthorLink} href={preview.authorUrl} target="_blank" rel="noopener noreferrer">
                        <span className={styles.xAvatar} style={{ background: getXAvatarColor(preview.handle) }}>
                          <span>{getXInitial(preview.authorName)}</span>
                          <img
                            src={getXAvatarUrl(preview.handle)}
                            alt=""
                            loading="lazy"
                            onError={(event) => {
                              event.currentTarget.style.display = 'none'
                            }}
                          />
                        </span>
                      </a>
                      <div className={styles.xIdentity}>
                        <div>
                          <strong>{preview.authorName}</strong>
                          <BadgeCheck size={15} />
                        </div>
                        <span>
                          @{preview.handle} · {preview.date}
                        </span>
                      </div>
                      <span className={styles.xBrand} aria-hidden="true">
                        X
                      </span>
                    </header>

                    <p className={styles.xText}>{dommiText(preview.text || preview.summary)}</p>

                    <div className={styles.xActions} aria-hidden="true">
                      <span>
                        <MessageCircle size={15} />
                        Reply
                      </span>
                      <span>
                        <Repeat2 size={15} />
                        Repost
                      </span>
                      <span>
                        <Heart size={15} />
                        Like
                      </span>
                      <span>
                        <Share2 size={15} />
                      </span>
                    </div>

                    <a className={styles.xCta} href={preview.url} target="_blank" rel="noopener noreferrer">
                      View post on X
                      <ExternalLink size={13} />
                    </a>

                    <MoreHorizontal className={styles.xMore} size={18} aria-hidden="true" />
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className={styles.container}>
          <div className={`${styles.sectionHead} ${styles.sectionHeadCenter}`}>
            <h2>{dommiText(pageData.how_to_section.h2)}</h2>
            <p>{dommiText(pageData.how_to_section.intro)}</p>
          </div>

          <div className={styles.stepGrid}>
            {highlightSteps.map((step, index) => {
              const Icon = index === 0 ? Play : index === 1 ? Sparkles : Clapperboard
              return (
                <article key={step.title} className={styles.stepCard}>
                  <div className={styles.stepIcon}>
                    <Icon size={28} />
                  </div>
                  <h3>{dommiText(step.title)}</h3>
                  <p>{dommiText(step.description)}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`${styles.container} ${styles.containerNarrow}`}>
          <div className={`${styles.sectionHead} ${styles.sectionHeadCenter}`}>
            <h2>{dommiText(pageData.faq_section.h2)}</h2>
            <p>{dommiText(pageData.faq_section.intro)}</p>
          </div>
          <div className={styles.faqList}>
            {pageData.faq_section.items.map((item, index) => (
              <details key={item.q} open={index === 0}>
                <summary>
                  <span>{dommiText(item.q)}</span>
                  <ChevronDown size={18} />
                </summary>
                <p>{dommiText(item.a)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.container}>
          <img src="/logo.png" alt="Dommi" />
          <h2>{dommiText(pageData.final_cta.h2)}</h2>
          <p>{dommiText(pageData.final_cta.body)}</p>
          <Link
            className={styles.ctaButton}
            href={generatorHref}
            data-analytics-event="cta_clicked"
            data-analytics-location="seedance_landing_final"
            data-analytics-label="Open Dommi Tools"
          >
            Open Dommi Tools
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
