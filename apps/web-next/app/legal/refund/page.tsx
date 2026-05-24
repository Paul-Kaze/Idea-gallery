import type { Metadata } from 'next'
import { LegalShell, legalDocs } from '../legal-docs'

export const metadata: Metadata = {
  title: 'Refund Policy | Dommi',
  description: legalDocs.refund.description,
  alternates: { canonical: '/legal/refund' },
}

export default function RefundPage() {
  return <LegalShell doc={legalDocs.refund} />
}
