import type { Metadata } from 'next'
import { LegalShell, legalDocs } from '../legal-docs'

export const metadata: Metadata = {
  title: 'Deletion Policy | Dommi',
  description: legalDocs.deletion.description,
  alternates: { canonical: '/legal/deletion-policy' },
}

export default function DeletionPolicyPage() {
  return <LegalShell doc={legalDocs.deletion} />
}
