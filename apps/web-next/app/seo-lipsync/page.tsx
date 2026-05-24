import {
  ArrowUpRight,
  BadgeDollarSign,
  Bot,
  CheckCircle2,
  CircleDot,
  ExternalLink,
  Gauge,
  Globe2,
  Layers3,
  LineChart,
  Search,
  Sparkles,
  Target,
  TrendingUp,
} from 'lucide-react'
import type { Metadata } from 'next'
import styles from './seo-lipsync.module.css'

export const metadata: Metadata = {
  title: 'lipsync.video SEO Strategy Visualization',
  description: 'A visual Semrush-based breakdown of lipsync.video keyword strategy, landing page matrix, and SEO opportunities.',
}

const metrics = [
  { label: 'US Organic Traffic', value: '20K', change: '+14%', icon: TrendingUp },
  { label: 'Organic Keywords', value: '5.6K', change: '+1.8%', icon: Search },
  { label: 'Authority Score', value: '40', change: 'Very good', icon: Gauge },
  { label: 'Paid Traffic', value: '0', change: 'SEO-led', icon: BadgeDollarSign },
  { label: 'Referring Domains', value: '769', change: '105.3K backlinks', icon: Globe2 },
  { label: 'AI Visibility', value: '17', change: '50 US mentions', icon: Bot },
]

const rankingKeywords = [
  { keyword: 'lipsync', rank: 1, volume: '5.4K', traffic: 712, url: '/' },
  { keyword: 'lip sync', rank: 2, volume: '6.6K', traffic: 541, url: '/' },
  { keyword: 'lip sync ai', rank: 1, volume: '1.9K', traffic: 471, url: '/' },
  { keyword: 'lipsync ai', rank: 1, volume: '1.6K', traffic: 396, url: '/' },
  { keyword: 'ai lip sync', rank: 1, volume: '1.3K', traffic: 322, url: '/' },
  { keyword: 'lip sync video', rank: 1, volume: '590', traffic: 146, url: '/' },
  { keyword: 'free lip sync ai', rank: 1, volume: '390', traffic: 96, url: '/' },
]

const clusters = [
  { name: 'Lip-sync & Talking Avatars', traffic: 10400, color: '#6b9d2e' },
  { name: 'AI Image & Character Generation', traffic: 4300, color: '#2d8a8a' },
  { name: 'AI Baby & Child Generators', traffic: 1500, color: '#b45b3d' },
]

const pages = [
  { page: 'Homepage', job: 'Core converter', keywords: 'lip sync, ai lip sync, free lip sync ai' },
  { page: '/ai-image-editor', job: 'Traffic expansion', keywords: 'ai image editor, free ai photo editor' },
  { page: '/ai-talking-photo-generator', job: 'Adjacent intent', keywords: 'talking photo, make a picture talk' },
  { page: '/ai-baby-generator', job: 'Viral utility', keywords: 'ai baby generator, baby face generator' },
  { page: '/talking-avatar', job: 'Creator tooling', keywords: 'talking avatar creator free' },
  { page: '/blog/*', job: 'Long-tail capture', keywords: 'best tools, alternatives, how-to, trends' },
]

const opportunities = [
  { keyword: 'best lip sync video ai', volume: 880, kd: 38, score: 94, angle: 'Comparison page with product-led CTA' },
  { keyword: 'lip syncing ai', volume: 880, kd: 41, score: 88, angle: 'Glossary + generator landing page' },
  { keyword: 'ai lip sync video generator free', volume: 210, kd: 38, score: 82, angle: 'Free tool page with examples' },
  { keyword: 'best ai talking photo generator', volume: 590, kd: 29, score: 96, angle: 'Best-of page, competitor comparison' },
  { keyword: 'make a picture talk', volume: 320, kd: 40, score: 78, angle: 'How-to workflow page' },
  { keyword: 'how to lip sync ai video', volume: 40, kd: 21, score: 70, angle: 'Tutorial for snippet capture' },
]

const timeline = [
  'Homepage wins head terms',
  'Tool pages widen the market',
  'Blog captures comparison intent',
  'Localized pages multiply long-tail',
  'AI search visibility reinforces authority',
]

export default function SeoLipSyncPage() {
  const maxTraffic = Math.max(...rankingKeywords.map((item) => item.traffic))
  const maxCluster = Math.max(...clusters.map((item) => item.traffic))

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}>
            <Sparkles size={16} />
            Semrush SEO Strategy Snapshot
          </div>
          <h1>lipsync.video 关键词战略可视化</h1>
          <p>
            它不是只押注一个 “lip sync” 词，而是用首页拿核心需求，用工具页扩相邻品类，用博客和多语言页面吃长尾。
          </p>
        </div>
        <div className={styles.heroPanel}>
          <div className={styles.panelLabel}>Strategic Pattern</div>
          <div className={styles.strategyLoop}>
            {timeline.map((item, index) => (
              <div className={styles.loopItem} key={item}>
                <span>{index + 1}</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.metricsGrid}>
        {metrics.map(({ label, value, change, icon: Icon }) => (
          <article className={styles.metricCard} key={label}>
            <div className={styles.metricIcon}>
              <Icon size={20} />
            </div>
            <span>{label}</span>
            <strong>{value}</strong>
            <em>{change}</em>
          </article>
        ))}
      </section>

      <section className={styles.mainGrid}>
        <article className={styles.largePanel}>
          <div className={styles.sectionHeader}>
            <div>
              <span>Core Ranking Engine</span>
              <h2>首页负责吃掉最值钱的 lip sync 词簇</h2>
            </div>
            <Target size={24} />
          </div>
          <div className={styles.keywordBars}>
            {rankingKeywords.map((item) => (
              <div className={styles.keywordRow} key={item.keyword}>
                <div className={styles.keywordMeta}>
                  <strong>{item.keyword}</strong>
                  <span>#{item.rank} · Vol {item.volume} · {item.url}</span>
                </div>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${(item.traffic / maxTraffic) * 100}%` }} />
                </div>
                <b>{item.traffic}</b>
              </div>
            ))}
          </div>
        </article>

        <article className={styles.panel}>
          <div className={styles.sectionHeader}>
            <div>
              <span>Topic Mix</span>
              <h2>流量不只来自 Lip Sync</h2>
            </div>
            <Layers3 size={24} />
          </div>
          <div className={styles.clusterStack}>
            {clusters.map((cluster) => (
              <div className={styles.clusterItem} key={cluster.name}>
                <div>
                  <strong>{cluster.name}</strong>
                  <span>{(cluster.traffic / 1000).toFixed(1)}K traffic</span>
                </div>
                <div className={styles.clusterTrack}>
                  <div
                    className={styles.clusterFill}
                    style={{ width: `${(cluster.traffic / maxCluster) * 100}%`, background: cluster.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className={styles.matrixSection}>
        <div className={styles.sectionHeader}>
          <div>
            <span>Landing Page Matrix</span>
            <h2>页面矩阵把一个工具做成多个入口</h2>
          </div>
          <LineChart size={24} />
        </div>
        <div className={styles.pageMatrix}>
          {pages.map((page) => (
            <article className={styles.pageCard} key={page.page}>
              <div className={styles.pageTitle}>
                <CircleDot size={15} />
                <strong>{page.page}</strong>
              </div>
              <span>{page.job}</span>
              <p>{page.keywords}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.opportunitySection}>
        <div className={styles.sectionHeader}>
          <div>
            <span>Attack Plan</span>
            <h2>最值得对标和抢占的关键词机会</h2>
          </div>
          <ArrowUpRight size={24} />
        </div>
        <div className={styles.opportunityGrid}>
          {opportunities.map((item) => (
            <article className={styles.opportunityCard} key={item.keyword}>
              <div className={styles.scoreRing} style={{ ['--score' as string]: `${item.score}%` }}>
                {item.score}
              </div>
              <div>
                <h3>{item.keyword}</h3>
                <p>{item.angle}</p>
                <div className={styles.chips}>
                  <span>Vol {item.volume}</span>
                  <span>KD {item.kd}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.footerGrid}>
        <article className={styles.takeaway}>
          <CheckCircle2 size={24} />
          <div>
            <h2>可复制的战略</h2>
            <p>
              先用一个高转化免费工具页拿核心词，再把同一能力拆成 talking photo、avatar、pet、baby、image editor 等相邻需求页。
            </p>
          </div>
        </article>
        <article className={styles.warning}>
          <ExternalLink size={24} />
          <div>
            <h2>可攻击的弱点</h2>
            <p>
              它的内容扩张很快，但 sitemap 里出现拼写和 URL 质量问题。更干净的信息架构和更强的比较页有机会切入。
            </p>
          </div>
        </article>
      </section>
    </div>
  )
}
