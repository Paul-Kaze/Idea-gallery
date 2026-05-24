import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  Baby,
  Camera,
  ChevronDown,
  CheckCircle2,
  Download,
  Heart,
  LockKeyhole,
  ShieldCheck,
  Upload,
  Wand2,
} from 'lucide-react'
import styles from './ai-baby-generator.module.css'

export const metadata: Metadata = {
  title: 'AI Baby Generator Free - See What Your Baby Will Look Like | Dommi',
  description:
    'Upload two parent photos and generate a fun AI baby prediction. Try Dommi AI Baby Generator free to see what your future baby might look like.',
  keywords: [
    'ai baby generator',
    'baby ai generator free',
    'future baby generator',
    'what will my baby look like',
    'ai baby face generator free',
  ],
  alternates: {
    canonical: '/ai-baby-generator',
  },
}

const examples = [
  {
    title: 'Soft studio portrait',
    description: 'A clean baby portrait style designed for natural family sharing.',
    tone: 'Realistic',
    image: '/ai-baby-generator/baby-soft-portrait.jpg',
    alt: 'Close-up baby portrait used as a realistic AI baby output example',
  },
  {
    title: 'Warm family keepsake',
    description: 'A gentle preview for couples, family chats, and fun planning moments.',
    tone: 'Cute',
    image: '/ai-baby-generator/baby-family-keepsake.jpg',
    alt: 'Baby hand held by a parent as a family keepsake example',
  },
  {
    title: 'Future baby preview',
    description: 'A fast two-photo generation flow for trying different parent images.',
    tone: 'Preview',
    image: '/ai-baby-generator/baby-future-preview.jpg',
    alt: 'Sleeping baby portrait used as a future baby preview example',
  },
]

const steps = [
  {
    icon: Upload,
    title: 'Upload two photos',
    text: 'Add a clear photo for each parent. Front-facing portraits work best.',
  },
  {
    icon: Baby,
    title: 'Choose boy or girl',
    text: 'Pick the baby gender style you want to preview before generating.',
  },
  {
    icon: Download,
    title: 'Generate and save',
    text: 'Create a baby photo in seconds, then download or make another version.',
  },
]

const useCases = [
  'Couples curious about what their future baby might look like',
  'Fun social posts, family group chats, and surprise reveals',
  'Cute profile pictures, keepsakes, and playful baby face predictions',
  'Testing different parent photos to get a more natural result',
]

const faqs = [
  {
    question: 'Is Dommi AI Baby Generator free?',
    answer:
      'You can start with a free generation flow. Higher-resolution downloads or additional generations may use credits depending on your account settings.',
  },
  {
    question: 'How does the AI baby generator work?',
    answer:
      'Upload two parent photos, choose a baby style, and Dommi creates a fun baby face prediction based on the visual features in the photos.',
  },
  {
    question: 'Is the result an accurate prediction?',
    answer:
      'No AI baby generator can truly predict genetics. Treat the result as a fun creative preview, not a medical or scientific forecast.',
  },
  {
    question: 'What photos should I upload?',
    answer:
      'Use clear, well-lit portraits where each face is visible. Avoid sunglasses, heavy filters, side profiles, or blurry images.',
  },
  {
    question: 'Are my photos private?',
    answer:
      'Dommi is designed to keep the upload flow clear and privacy-first. Review the privacy policy for details on photo handling, storage, and account data.',
  },
]

const relatedPages = [
  { label: 'Future Baby Generator', href: '/future-baby-generator' },
  { label: 'Baby AI Generator Free', href: '/baby-ai-generator-free' },
  { label: 'AI Baby Face Generator Free', href: '/ai-baby-face-generator-free' },
  { label: 'What Will My Baby Look Like?', href: '/what-will-my-baby-look-like' },
]

export default function AIBabyGeneratorLandingPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <h1>See what your baby might look like with AI</h1>
          <p>
            Upload two parent photos and generate a realistic, shareable baby face preview in seconds.
            Dommi makes future baby predictions simple, private, and fun to try.
          </p>
          <div className={styles.heroActions}>
            <Link
              className={styles.primaryButton}
              href="/tools/ai-baby-generator"
              data-analytics-event="cta_clicked"
              data-analytics-location="ai_baby_landing_hero"
              data-analytics-label="Generate My Baby"
            >
              Generate My Baby
              <ArrowRight size={18} />
            </Link>
            <Link
              className={styles.secondaryButton}
              href="#examples"
              data-analytics-event="cta_clicked"
              data-analytics-location="ai_baby_landing_hero"
              data-analytics-label="View examples"
            >
              View examples
            </Link>
          </div>
          <div className={styles.trustRow}>
            <span><CheckCircle2 size={15} /> Try free</span>
            <span><ShieldCheck size={15} /> Privacy-first flow</span>
            <span><Camera size={15} /> Two-photo upload</span>
          </div>
        </div>

        <div className={styles.toolCard} aria-label="AI baby generator preview">
          <div className={styles.toolHeader}>
            <div>
              <span>Start here</span>
              <strong>Baby photo preview</strong>
            </div>
            <Wand2 size={20} />
          </div>
          <div className={styles.uploadGrid}>
            <div className={styles.uploadBox}>
              <Upload size={20} />
              <strong>Parent photo 1</strong>
              <span>PNG or JPG</span>
            </div>
            <div className={styles.uploadBox}>
              <Upload size={20} />
              <strong>Parent photo 2</strong>
              <span>Clear portrait</span>
            </div>
          </div>
          <div className={styles.selectorRow}>
            <button className={styles.selectedPill} type="button" aria-pressed="true">Girl</button>
            <button type="button" aria-pressed="false">Boy</button>
            <button type="button" aria-pressed="false">Surprise</button>
          </div>
          <div className={styles.resultPreview}>
            <div className={styles.resultImage} aria-hidden="true">
              <img src="/ai-baby-generator/family-preview.jpg" alt="" />
              <span className={styles.aiChip}>AI</span>
            </div>
            <div>
              <span>Result style</span>
              <strong>Soft realistic portrait</strong>
              <p>Best with bright, front-facing photos.</p>
            </div>
          </div>
          <Link
            className={styles.fullWidthButton}
            href="/tools/ai-baby-generator"
            data-analytics-event="cta_clicked"
            data-analytics-location="ai_baby_landing_tool_card"
            data-analytics-label="Try AI Baby Generator Free"
          >
            Try AI Baby Generator Free
          </Link>
          <p className={styles.microcopy}>
            No perfect prediction promised. Just a playful AI preview you can share or save.
          </p>
        </div>
      </section>

      <section className={styles.statStrip} aria-label="Why this tool works for search visitors">
        <div>
          <strong>2 photos</strong>
          <span>parent inputs</span>
        </div>
        <div>
          <strong>10-30 sec</strong>
          <span>typical generation flow</span>
        </div>
        <div>
          <strong>Free start</strong>
          <span>low-friction trial</span>
        </div>
        <div>
          <strong>HD option</strong>
          <span>credit-based upgrade path</span>
        </div>
      </section>

      <section className={styles.section} id="examples">
        <div className={styles.sectionHeader}>
          <h2>Generate baby photos that feel natural and easy to share</h2>
          <p>
            Set expectations before the upload with clear result styles, polished previews, and simple
            before-and-after storytelling.
          </p>
        </div>
        <div className={styles.exampleGrid}>
          {examples.map((example, index) => (
            <article className={styles.exampleCard} key={example.title}>
              <div className={styles.exampleImage}>
                <img src={example.image} alt={example.alt} />
                <div className={styles.faceCircle}>{index + 1}</div>
              </div>
              <div className={styles.cardCopy}>
                <span>{example.tone}</span>
                <h3>{example.title}</h3>
                <p>{example.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Create a future baby photo in three simple steps</h2>
        </div>
        <div className={styles.stepGrid}>
          {steps.map((step, index) => (
            <article className={styles.stepCard} key={step.title}>
              <div className={styles.stepIcon}>
                <step.icon size={22} />
              </div>
              <span>Step {index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.splitSection}>
        <div className={styles.useCasePanel}>
          <h2>Built for curiosity, not complicated editing</h2>
          <div className={styles.useCaseList}>
            {useCases.map((useCase) => (
              <div key={useCase}>
                <Heart size={17} />
                <p>{useCase}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.privacyPanel}>
          <LockKeyhole size={26} />
          <h2>Make privacy visible before the upload</h2>
          <p>
            Baby and family-photo pages need extra clarity. Dommi keeps the privacy note close to the
            upload flow so visitors understand how photos are handled before they generate a result.
          </p>
          <Link href="/legal/privacy">Review privacy policy</Link>
        </div>
      </section>

      <section className={styles.relatedSection}>
        <div className={styles.sectionHeader}>
          <h2>Use one core tool to support multiple SEO entry points</h2>
        </div>
        <div className={styles.relatedGrid}>
          {relatedPages.map((page) => (
            <Link
              href={page.href}
              key={page.href}
              data-analytics-event="internal_link_clicked"
              data-analytics-location="ai_baby_related_keywords"
              data-analytics-label={page.label}
            >
              {page.label}
              <ArrowRight size={16} />
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.faqSection}>
        <div className={styles.sectionHeader}>
          <h2>Questions people ask before trying an AI baby generator</h2>
        </div>
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <details key={faq.question} open={index === 0}>
              <summary>
                <span>{faq.question}</span>
                <ChevronDown size={18} />
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.finalCta}>
        <div>
          <h2>Generate your first AI baby photo with Dommi</h2>
          <p>Start with two clear parent photos and see a playful future baby preview in seconds.</p>
        </div>
        <Link
          className={styles.primaryButton}
          href="/tools/ai-baby-generator"
          data-analytics-event="cta_clicked"
          data-analytics-location="ai_baby_landing_final"
          data-analytics-label="Try it free"
        >
          Try it free
          <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  )
}
