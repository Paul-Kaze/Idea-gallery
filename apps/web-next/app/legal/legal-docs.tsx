import Link from 'next/link'

type LegalSection = {
  title: string
  body: string
}

export type LegalDoc = {
  title: string
  description: string
  updated: string
  href: string
  sections: LegalSection[]
}

export const legalDocs: Record<string, LegalDoc> = {
  terms: {
    title: 'Terms of Service',
    description: 'The rules for using Dommi, managing accounts, credits, generated content, and paid services.',
    updated: 'May 20, 2026',
    href: '/legal/terms',
    sections: [
      {
        title: 'Using Dommi',
        body: 'Dommi provides web-based AI creative tools for generating, viewing, and managing media. You may use the service only if you can form a binding agreement and you follow these terms.',
      },
      {
        title: 'Accounts and security',
        body: 'You are responsible for your account activity and for keeping your sign-in method secure. If you believe your account has been accessed without permission, contact support@dommi.ai.',
      },
      {
        title: 'Credits and paid features',
        body: 'Some features require credits. Credits are consumed when a generation request is successfully completed, unless a product screen states otherwise. Pricing and credit packages may change over time.',
      },
      {
        title: 'User content',
        body: 'You must have the rights and consent needed for any image, prompt, or other material you upload. You are responsible for how you use generated outputs.',
      },
      {
        title: 'Prohibited uses',
        body: 'Do not use Dommi to create illegal, abusive, exploitative, deceptive, or non-consensual content. Do not attempt to bypass rate limits, security controls, payment systems, or usage restrictions.',
      },
      {
        title: 'Service changes',
        body: 'Dommi may modify, suspend, or discontinue features. We will try to preserve important user data, but the service is provided as a hosted software product that can change.',
      },
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    description: 'How Dommi collects, uses, stores, and protects account data, uploaded photos, generated media, and analytics events.',
    updated: 'May 20, 2026',
    href: '/legal/privacy',
    sections: [
      {
        title: 'Information we collect',
        body: 'We collect account information such as email, name, and avatar from sign-in providers. We also collect prompts, uploaded media, generated results, credit usage, payment metadata, device information, and product analytics events.',
      },
      {
        title: 'How we use information',
        body: 'We use this information to provide the product, run generation requests, maintain history, calculate credits, process payments, prevent abuse, troubleshoot issues, and improve the service.',
      },
      {
        title: 'Photo handling',
        body: 'Uploaded photos are used to generate the requested result. Generated results and related metadata may be stored in your account history so you can view or download them later.',
      },
      {
        title: 'Analytics',
        body: 'Dommi may use analytics tools such as Google Analytics or PostHog to understand page visits, product funnels, and feature usage. Analytics events should not include raw uploaded images or sensitive prompts.',
      },
      {
        title: 'Service providers',
        body: 'We may use infrastructure, storage, payment, authentication, analytics, and generation providers to operate Dommi. These providers process data only as needed to support the service.',
      },
      {
        title: 'Contact and deletion',
        body: 'For privacy questions or deletion requests, contact support@dommi.ai. Deletion requests are handled according to the Deletion Policy.',
      },
    ],
  },
  refund: {
    title: 'Refund Policy',
    description: 'How Dommi handles credit purchases, failed payments, duplicate charges, and refund requests.',
    updated: 'May 20, 2026',
    href: '/legal/refund',
    sections: [
      {
        title: 'Credit purchases',
        body: 'Credits are digital usage units for Dommi tools. Once credits are delivered and used, they are generally non-refundable unless required by law or approved by Dommi support.',
      },
      {
        title: 'Failed or delayed fulfillment',
        body: 'If payment succeeds but credits do not appear after webhook processing, contact support@dommi.ai with your order information. We will verify the order and apply the credits or refund when appropriate.',
      },
      {
        title: 'Duplicate charges',
        body: 'If you believe you were charged twice for the same purchase, contact support. Verified duplicate charges are eligible for refund or equivalent credit correction.',
      },
      {
        title: 'Generation failures',
        body: 'If a generation fails and credits were charged, Dommi may restore credits after reviewing the request logs. Poor subjective output quality does not automatically qualify for a refund.',
      },
    ],
  },
  aiContent: {
    title: 'AI Content Policy',
    description: 'Rules for uploading images and generating AI content with Dommi.',
    updated: 'May 20, 2026',
    href: '/legal/ai-content-policy',
    sections: [
      {
        title: 'Consent and image rights',
        body: 'Only upload photos you own or have permission to use. For family, baby, face, or likeness-based tools, make sure you have consent from the people depicted.',
      },
      {
        title: 'No harmful content',
        body: 'Do not create content that is illegal, exploitative, harassing, hateful, sexually explicit involving minors, non-consensual intimate, or intended to deceive people about real events.',
      },
      {
        title: 'Creative previews',
        body: 'AI Baby Generator outputs are creative previews. They are not medical, genetic, biometric, or scientific predictions.',
      },
      {
        title: 'Labeling and responsibility',
        body: 'When sharing AI-generated content in contexts where confusion is possible, you should disclose that the media is AI-generated. You are responsible for downstream use of outputs.',
      },
    ],
  },
  deletion: {
    title: 'Deletion Policy',
    description: 'How users can request removal of account data, uploaded photos, generated media, and history records.',
    updated: 'May 20, 2026',
    href: '/legal/deletion-policy',
    sections: [
      {
        title: 'What can be deleted',
        body: 'You can request deletion of account records, generation history, stored generated media, and stored uploaded media associated with your account where technically available.',
      },
      {
        title: 'How to request deletion',
        body: 'Email support@dommi.ai from the email address tied to your account. Include the account email and the type of data you want deleted.',
      },
      {
        title: 'Processing time',
        body: 'Dommi will review deletion requests and process them within a reasonable timeframe. Some records may remain temporarily in backups, logs, payment records, fraud prevention systems, or legal compliance archives.',
      },
      {
        title: 'Payment and audit records',
        body: 'Payment, tax, fraud prevention, and support records may be retained when required for legitimate business, legal, or compliance purposes.',
      },
    ],
  },
}

export const legalIndex = Object.values(legalDocs)

export function LegalShell({ doc }: { doc: LegalDoc }) {
  return (
    <main style={{ maxWidth: '880px', margin: '0 auto', padding: '72px 32px', color: '#374151', lineHeight: 1.7 }}>
      <Link href="/legal" style={{ color: '#155dfc', fontWeight: 700, textDecoration: 'none' }}>
        Legal center
      </Link>
      <h1 style={{ fontSize: '42px', lineHeight: 1.1, color: '#111827', margin: '18px 0 10px' }}>
        {doc.title}
      </h1>
      <p style={{ fontSize: '17px', color: '#64748b', margin: '0 0 8px' }}>{doc.description}</p>
      <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 42px' }}>Last updated: {doc.updated}</p>

      {doc.sections.map((section) => (
        <section key={section.title} style={{ marginBottom: 34 }}>
          <h2 style={{ fontSize: '22px', color: '#111827', margin: '0 0 10px' }}>{section.title}</h2>
          <p style={{ margin: 0 }}>{section.body}</p>
        </section>
      ))}
    </main>
  )
}
