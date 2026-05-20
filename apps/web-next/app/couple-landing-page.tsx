import Link from 'next/link'
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Heart,
  Images,
  LockKeyhole,
  Sparkles,
  Upload,
  Wand2,
} from 'lucide-react'
import type { CoupleLandingData } from './couple-landing-data'
import styles from './couple-landing.module.css'

export function CoupleLandingPage({ data }: { data: CoupleLandingData }) {
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

      <section
        className={styles.hero}
        style={{ backgroundImage: `linear-gradient(90deg, rgba(13, 16, 18, 0.84), rgba(13, 16, 18, 0.48) 48%, rgba(13, 16, 18, 0.16)), url(${data.heroImage})` }}
      >
        <div className={styles.heroInner}>
          <div className={styles.eyebrow}>
            <Sparkles size={16} />
            {data.eyebrow}
          </div>
          <h1>{data.h1}</h1>
          <p>{data.intro}</p>
          <div className={styles.heroActions}>
            <Link href="#generator-preview" className={styles.primaryButton}>
              {data.primaryCta}
              <ArrowRight size={18} />
            </Link>
            <Link href="#ideas" className={styles.secondaryButton}>
              {data.secondaryCta}
            </Link>
          </div>
          <div className={styles.statRow}>
            {data.stats.map((stat) => (
              <span key={stat}>
                <CheckCircle2 size={15} />
                {stat}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.filterBand} aria-label="Idea filters">
        {data.filters.map((filter) => (
          <span key={filter}>{filter}</span>
        ))}
      </section>

      <section className={styles.introGrid}>
        <div>
          <span className={styles.sectionKicker}>From search intent to finished image</span>
          <h2>Give every idea a direct path to creation.</h2>
        </div>
        <p>
          {data.ideasIntro}
        </p>
      </section>

      <section className={styles.ideaGrid} id="ideas">
        {data.ideas.map((idea, index) => (
          <article className={styles.ideaCard} key={idea.title}>
            <div className={styles.ideaImageWrap}>
              <img
                src={idea.image}
                alt={`${idea.title} couple photo idea`}
                loading={index < 2 ? 'eager' : 'lazy'}
              />
              <span>{idea.tag}</span>
            </div>
            <div className={styles.ideaCopy}>
              <h3>{idea.title}</h3>
              <p>{idea.bestFor}</p>
              <div className={styles.promptBox}>
                <strong>Prompt starter</strong>
                <span>{idea.prompt}</span>
              </div>
              <div className={styles.mistake}>
                <Heart size={15} />
                {idea.mistake}
              </div>
              <Link href="#generator-preview" className={styles.textButton}>
                Generate this look
                <ArrowRight size={16} />
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className={styles.guideSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionKicker}>Practical direction</span>
          <h2>{data.guideTitle}</h2>
          <p>{data.guideIntro}</p>
        </div>
        <div className={styles.guideGrid}>
          {data.guideSections.map((section) => (
            <article className={styles.guideCard} key={section.title}>
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
        <div className={styles.generatorCopy}>
          <span className={styles.sectionKicker}>AI couple photo maker</span>
          <h2>{data.generatorTitle}</h2>
          <p>{data.generatorIntro}</p>
          <div className={styles.generatorChips}>
            {data.generatorChips.map((chip) => (
              <span key={chip}>{chip}</span>
            ))}
          </div>
        </div>

        <div className={styles.generatorPanel} aria-label="AI couple photo generator preview">
          <div className={styles.panelTop}>
            <div>
              <span>Start with two photos</span>
              <strong>Couple image preview</strong>
            </div>
            <Wand2 size={22} />
          </div>
          <div className={styles.uploadGrid}>
            <div className={styles.uploadSlot}>
              <Upload size={22} />
              <strong>Partner photo 1</strong>
              <span>Clear portrait</span>
            </div>
            <div className={styles.uploadSlot}>
              <Upload size={22} />
              <strong>Partner photo 2</strong>
              <span>Separate selfie ok</span>
            </div>
          </div>
          <div className={styles.modeRows}>
            <div>
              <Camera size={17} />
              <span>Style</span>
              <strong>{data.filters[0]}</strong>
            </div>
            <div>
              <Images size={17} />
              <span>Format</span>
              <strong>Post + Story</strong>
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
          <span className={styles.sectionKicker}>Answers before upload</span>
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
        <div>
          <span className={styles.sectionKicker}>Keep exploring</span>
          <h2>Related couple photo pages</h2>
        </div>
        <div className={styles.relatedLinks}>
          {data.related.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
              <ArrowRight size={16} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
