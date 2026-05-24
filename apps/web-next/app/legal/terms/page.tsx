import type { Metadata } from 'next'
import { LegalShell, legalDocs } from '../legal-docs'

export const metadata: Metadata = {
  title: 'Terms of Service | Dommi',
  description: legalDocs.terms.description,
  alternates: { canonical: '/legal/terms' },
}

export default function TermsPage() {
  return <LegalShell doc={legalDocs.terms} />
}
