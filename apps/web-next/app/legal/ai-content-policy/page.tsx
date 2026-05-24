import type { Metadata } from 'next'
import { LegalShell, legalDocs } from '../legal-docs'

export const metadata: Metadata = {
  title: 'AI Content Policy | Dommi',
  description: legalDocs.aiContent.description,
  alternates: { canonical: '/legal/ai-content-policy' },
}

export default function AiContentPolicyPage() {
  return <LegalShell doc={legalDocs.aiContent} />
}
