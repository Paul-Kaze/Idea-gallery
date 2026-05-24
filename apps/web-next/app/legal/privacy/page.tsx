import type { Metadata } from 'next'
import { LegalShell, legalDocs } from '../legal-docs'

export const metadata: Metadata = {
  title: 'Privacy Policy | Dommi',
  description: legalDocs.privacy.description,
  alternates: { canonical: '/legal/privacy' },
}

export default function PrivacyPage() {
  return <LegalShell doc={legalDocs.privacy} />
}
