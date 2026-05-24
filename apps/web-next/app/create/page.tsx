import type { Metadata } from 'next'
import CreatePageClient from './CreatePageClient'

export const metadata: Metadata = {
  title: 'Create | Dommi',
  description: 'Create AI videos and images with Dommi in a focused creator workspace.',
  alternates: {
    canonical: '/create',
  },
}

export default function CreatePage() {
  return <CreatePageClient />
}
