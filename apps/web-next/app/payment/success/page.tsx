import { Suspense } from 'react'
import { PaymentSuccessClient } from './PaymentSuccessClient'

interface PageProps {
  searchParams: Promise<{ checkout_id?: string }>
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams

  return (
    <Suspense fallback={<div>Loading payment status...</div>}>
      <PaymentSuccessClient checkoutId={resolvedParams.checkout_id} />
    </Suspense>
  )
}
