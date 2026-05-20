import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2,
  Download,
  ImagePlus,
  LockKeyhole,
  SlidersHorizontal,
  Sparkles,
  Wand2,
} from 'lucide-react'
import type { CoupleLandingData } from './couple-landing-data'
import styles from './dommi-couple-ideas.module.css'

export function DommiCoupleIdeasPage({ data }: { data: CoupleLandingData }) {
  const featuredIdeas = data.ideas.slice(0, 6)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  }

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <h1>{data.h1}</h1>
          <p>{data.intro}</p>
          <div className={styles.heroActions}>
            <Link href="#generator-preview" className={styles.primaryButton}>
              Generate Couple Photos
              <ArrowRight size={18} />
            </Link>
            <Link href="#ideas" className={styles.secondaryButton}>
              Browse Ideas
            </Link>
          </div>
          <div className={styles.heroProof}>
            {data.stats.map((stat) => (
              <span key={stat}>
                <CheckCircle2 size={15} />
                {stat}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.heroStudio} aria-label="Dommi couple photo generation preview">
          <div className={styles.studioTop}>
            <div>
              <strong>Couple Photo Maker</strong>
              <span>From two portraits to a finished photoshoot concept</span>
            </div>
            <Wand2 size={22} />
          </div>
          <div className={styles.uploadRow}>
            <div className={styles.uploadSlot}>
              <ImagePlus size={22} />
              <strong>Partner 1</strong>
              <span>Upload portrait</span>
            </div>
            <div className={styles.uploadSlot}>
              <ImagePlus size={22} />
              <strong>Partner 2</strong>
              <span>Separate photo ok</span>
            </div>
          </div>
          <div className={styles.previewGrid}>
            {featuredIdeas.slice(0, 4).map((idea) => (
              <div className={styles.previewTile} key={idea.title}>
                <img src={idea.image} alt="" />
                <span>{idea.title}</span>
              </div>
            ))}
          </div>
          <div className={styles.controlRows}>
            <div>
              <SlidersHorizontal size={17} />
              <span>Mode</span>
              <strong>Natural + Romantic</strong>
            </div>
            <div>
              <Sparkles size={17} />
              <span>Prompt</span>
              <strong>{featuredIdeas[0]?.prompt}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.intentStrip}>
        <div>
          <strong>For couples who do not know what to shoot yet.</strong>
          <span>Pick a mood, pose, location, or occasion and turn it into a prompt-ready AI photoshoot.</span>
        </div>
        <Link href="#generator-preview">
          Start from two photos
          <ArrowRight size={16} />
        </Link>
      </section>

      <section className={styles.ideaSection} id="ideas">
        <div className={styles.sectionHeader}>
          <h2>Ready-to-create couple photoshoot ideas</h2>
          <p>{data.ideasIntro}</p>
        </div>

        <div className={styles.filterGrid} aria-label="Couple photoshoot idea filters">
          {data.filters.map((filter) => (
            <button key={filter} type="button">
              {filter}
            </button>
          ))}
        </div>

        <div className={styles.ideaGrid}>
          {featuredIdeas.map((idea) => (
            <article className={styles.ideaCard} key={idea.title}>
              <img src={idea.image} alt={`${idea.title} couple photoshoot idea`} loading="lazy" />
              <div className={styles.ideaCopy}>
                <div>
                  <span>{idea.tag}</span>
                  <h3>{idea.title}</h3>
                  <p>{idea.bestFor}</p>
                </div>
                <div className={styles.promptRow}>
                  <strong>Prompt starter</strong>
                  <p>{idea.prompt}</p>
                </div>
                <Link href="#generator-preview">
                  Generate this look
                  <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.workflowSection}>
        <div className={styles.sectionHeader}>
          <h2>Turn search inspiration into a usable image workflow</h2>
          <p>
            The page is built around the real blockers behind the keyword: awkward poses, missing
            locations, separate selfies, and the need for a photo that feels natural enough to share.
          </p>
        </div>
        <div className={styles.workflowGrid}>
          {data.guideSections.map((section, index) => (
            <article className={styles.workflowCard} key={section.title}>
              <div className={styles.stepIcon}>{index + 1}</div>
              <h3>{section.title}</h3>
              <p>{section.text}</p>
              <ul>
                {section.items.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={15} />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.generatorSection} id="generator-preview">
        <div className={styles.generatorPanel}>
          <div className={styles.panelHeader}>
            <div>
              <h2>{data.generatorTitle}</h2>
              <p>{data.generatorIntro}</p>
            </div>
            <Download size={24} />
          </div>
          <div className={styles.generateLayout}>
            <div className={styles.dropzone}>
              <ImagePlus size={24} />
              <strong>Upload two portraits</strong>
              <span>Clear selfies work best</span>
            </div>
            <div className={styles.settingList}>
              {data.generatorChips.map((chip) => (
                <div key={chip}>
                  <CheckCircle2 size={16} />
                  <span>{chip}</span>
                </div>
              ))}
            </div>
          </div>
          <Link href="/tools" className={styles.fullButton}>
            Open Dommi Tools
            <ArrowRight size={18} />
          </Link>
          <p className={styles.privacy}>
            <LockKeyhole size={15} />
            {data.privacyNote}
          </p>
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className={styles.sectionHeader}>
          <h2>{data.faqTitle}</h2>
        </div>
        <div className={styles.faqList}>
          {data.faqs.map((faq) => (
            <details key={faq.q}>
              <summary>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.relatedSection}>
        <h2>Keep planning your couple photos</h2>
        <div className={styles.relatedLinks}>
          {data.related.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
              <ArrowRight size={16} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
