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
import { getModelDisplayName, getRelatedModelHref } from './model-data'
import PromePromptBox from './PromePromptBox'
import type { ModelPageData, RedditPost, RelatedModelLink, XPost } from './model-types'
import styles from './model-landing.module.css'

type ModelLandingProps = {
  pageData: ModelPageData
}

function dommiText(value: string | undefined) {
  return value || ''
}

function getGeneratorHref(pageData: ModelPageData) {
  const links = pageData.generator_panel?.generator_links
  return links?.image || links?.text || pageData.final_cta?.btn_href || pageData.final_cta?.btn_link || '/tools'
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

function getXUrl(post: XPost) {
  return post.url || `https://twitter.com/i/status/${post.id}`
}

function getXSourceFromText(text: string) {
  const match = text.match(/^([^:]{2,52}):\s+/)
  return match?.[1]?.trim()
}

function getXDateFromId(id: string) {
  try {
    const timestamp = (BigInt(id) >> 22n) + 1288834974657n
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(Number(timestamp)))
  } catch {
    return 'Source post'
  }
}

function getXHandle(authorName: string, handle: string | undefined) {
  if (handle) return handle.replace(/^@/, '')
  const mention = authorName.match(/@([A-Za-z0-9_]+)/)
  if (mention) return mention[1]
  return authorName.replace(/[^a-zA-Z0-9_]/g, '') || 'creator'
}

function getXDisplayText(text: string, authorName: string) {
  const source = getXSourceFromText(text)
  if (source && source.toLowerCase() === authorName.toLowerCase()) {
    return text.replace(/^([^:]{2,52}):\s+/, '')
  }
  return text
}

function getXPostPreview(post: XPost) {
  const authorName = post.author || getXSourceFromText(post.text) || 'X creator'
  const handle = getXHandle(authorName, post.handle)
  return {
    authorName,
    handle,
    authorUrl: `https://twitter.com/${handle}`,
    date: post.date || getXDateFromId(post.id),
    text: getXDisplayText(post.text, authorName),
    url: getXUrl(post),
  }
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

function getRedditVideo(post: RedditPost) {
  return post.media?.video_url || ''
}

function getRedditPreview(post: RedditPost) {
  return post.media?.preview_url || post.media?.poster || post.media?.image_url || ''
}

function getMediaAlt(title: string, alt: string | undefined) {
  return alt || title
}

export default function ModelLanding({ pageData }: ModelLandingProps) {
  const youtubeRef = useRef<HTMLDivElement>(null)

  const relatedModels = useMemo<RelatedModelLink[]>(
    () =>
      (pageData.related_section?.related_models || []).map((name) => ({
        name,
        href: getRelatedModelHref(name),
      })),
    [pageData.related_section?.related_models]
  )

  const generatorHref = getGeneratorHref(pageData)
  const displayName = getModelDisplayName(pageData)
  const uploadAccept = pageData.generator_panel?.upload?.accept || 'image/jpeg,image/png,image/webp'
  const youtubeVideos = pageData.social?.youtube_videos || []
  const redditPosts = pageData.social?.reddit_posts || []
  const xPosts = pageData.social?.x_posts || []
  const displayedRedditPosts = redditPosts.slice(0, 9)
  const highlightSteps = (pageData.how_to_section?.steps || []).slice(0, 3)
  const examples = pageData.examples_section?.items || []
  const highlights = pageData.highlights_section?.items || []

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
            <h1>{dommiText(pageData.hero.h1)}</h1>
            <p>{dommiText(pageData.hero.description)}</p>

            <PromePromptBox
              styles={styles}
              promptId={`${pageData.slug}Prompt`}
              generatorHref={generatorHref}
              displayName={displayName}
              modelSlug={pageData.slug}
              analyticsLocation="model_landing_generator_box"
              uploadAccept={uploadAccept}
              category={pageData.category}
              fields={pageData.generator_panel?.fields}
              generatorLinks={pageData.generator_panel?.generator_links}
            />

            <p className={styles.heroTrust}>
              Create in Dommi with text or reference images. Built for practical creator workflows.
            </p>
          </div>
        </div>
      </section>

      {examples.length ? (
        <section className={styles.section} id="examples">
          <div className={styles.container}>
            <div className={`${styles.sectionHead} ${styles.sectionHeadCenter}`}>
              <h2>{dommiText(pageData.examples_section?.h2)}</h2>
              <p>{dommiText(pageData.examples_section?.intro)}</p>
            </div>

            <div className={styles.featureStack}>
              {examples.map((example, index) => (
                <article
                  key={example.title}
                  className={`${styles.featureRow} ${index % 2 === 1 ? styles.featureRowReverse : ''}`}
                >
                  <div className={styles.featureCopy}>
                    <h3>{dommiText(example.title)}</h3>
                    <p className={styles.featurePrompt}>{dommiText(example.prompt)}</p>
                  </div>
                  <div className={styles.featureMedia}>
                    {example.result_video ? (
                      <video
                        src={example.result_video}
                        poster={example.result_video_poster}
                        aria-label={getMediaAlt(example.title, example.result_alt)}
                        muted
                        loop
                        playsInline
                        controls
                        preload="metadata"
                      />
                    ) : example.result_image ? (
                      <img
                        src={example.result_image}
                        alt={getMediaAlt(example.title, example.result_alt)}
                        loading="lazy"
                      />
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {highlights.length ? (
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={`${styles.sectionHead} ${styles.sectionHeadCenter}`}>
              <h2>{dommiText(pageData.highlights_section?.h2)}</h2>
              <p>{dommiText(pageData.highlights_section?.intro)}</p>
            </div>
            <div className={styles.highlightGrid}>
              {highlights.slice(0, 6).map((item) => (
                <article className={styles.highlightCard} key={item.title}>
                  {item.image ? (
                    <div className={styles.highlightMedia}>
                      <img src={item.image} alt={item.image_alt || item.title} loading="lazy" />
                    </div>
                  ) : null}
                  <h3>{dommiText(item.title)}</h3>
                  <p>{dommiText(item.text)}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {relatedModels.length ? (
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={`${styles.sectionHead} ${styles.sectionHeadCenter}`}>
              <h2>{dommiText(pageData.related_section?.h2)}</h2>
              <p>{dommiText(pageData.related_section?.intro)}</p>
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
      ) : null}

      {youtubeVideos.length || displayedRedditPosts.length || xPosts.length ? (
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            {youtubeVideos.length ? (
              <div className={styles.embedSection}>
                <div className={styles.sectionHead}>
                  <h2>{dommiText(pageData.youtube_section?.h2)}</h2>
                  <p>{dommiText(pageData.youtube_section?.intro)}</p>
                </div>
                <div className={styles.embedShell}>
                  <button type="button" className={styles.carouselNav} aria-label="Previous videos" onClick={() => scrollYoutube(-1)}>
                    {'<'}
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
                    {'>'}
                  </button>
                </div>
              </div>
            ) : null}

            {displayedRedditPosts.length ? (
              <div className={styles.embedSection}>
                <div className={styles.sectionHead}>
                  <h2>{dommiText(pageData.reddit_section?.h2)}</h2>
                  <p>{dommiText(pageData.reddit_section?.intro)}</p>
                </div>
                <div
                  className={`${styles.embedMasonry} ${
                    displayedRedditPosts.length <= 2 ? styles.embedMasonryCompact : ''
                  }`}
                >
                  {displayedRedditPosts.map((post) => (
                    <article key={post.url} className={styles.redditCard}>
                      <header className={styles.redditHeader}>
                        <span className={styles.redditAvatar} aria-hidden="true">
                          {post.meta?.subreddit_icon ? (
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
                          <strong>{post.subreddit || 'Reddit'}</strong>
                          <span>
                            {post.meta?.author ? `Posted by u/${post.meta.author}` : 'Posted on Reddit'}
                            {post.meta?.created_utc ? ` / ${formatTimeAgo(post.meta.created_utc)}` : ''}
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
                          {formatCount(post.meta?.ups)} upvotes
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
                        {post.meta?.num_comments ? `View ${formatCount(post.meta.num_comments)} comments` : 'View on Reddit'}
                        <ExternalLink size={13} />
                      </a>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}

            {xPosts.length ? (
              <div className={styles.embedSection}>
                <div className={styles.sectionHead}>
                  <h2>{dommiText(pageData.x_section?.h2)}</h2>
                  <p>{dommiText(pageData.x_section?.intro)}</p>
                </div>
                <div className={styles.twitterGrid}>
                  {xPosts.slice(0, 9).map((post) => {
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
                              @{preview.handle} / {preview.date}
                            </span>
                          </div>
                          <span className={styles.xBrand} aria-hidden="true">
                            X
                          </span>
                        </header>

                        <p className={styles.xText}>{dommiText(preview.text)}</p>

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
            ) : null}
          </div>
        </section>
      ) : null}

      {highlightSteps.length ? (
        <section className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.container}>
            <div className={`${styles.sectionHead} ${styles.sectionHeadCenter}`}>
              <h2>{dommiText(pageData.how_to_section?.h2)}</h2>
              <p>{dommiText(pageData.how_to_section?.intro)}</p>
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
      ) : null}

      {pageData.faq_section?.items?.length ? (
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
      ) : null}

      <section className={styles.cta}>
        <div className={styles.container}>
          <img src="/logo.png" alt="Dommi" />
          <h2>{dommiText(pageData.final_cta?.h2 || `Create with ${displayName} in Dommi`)}</h2>
          <p>{dommiText(pageData.final_cta?.body || `Open Dommi tools and start generating with ${displayName}.`)}</p>
          <Link
            className={styles.ctaButton}
            href={generatorHref}
            data-analytics-event="cta_clicked"
            data-analytics-location="model_landing_final"
            data-analytics-label={pageData.final_cta?.btn_label || 'Open Dommi Tools'}
          >
            {pageData.final_cta?.btn_label || 'Open Dommi Tools'}
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
