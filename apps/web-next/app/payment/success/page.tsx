import { Suspense } from 'react'

interface PageProps {
    searchParams: Promise<{ checkout_id?: string }>
}

async function SuccessContent({ searchParams }: { searchParams: { checkout_id?: string } }) {
    return (
        <main
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fafafa',
                padding: '24px',
            }}
        >
            <div
                style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    padding: '48px 40px',
                    maxWidth: '480px',
                    width: '100%',
                    textAlign: 'center',
                    boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.12)',
                }}
            >
                {/* Success icon */}
                <div
                    style={{
                        fontSize: '56px',
                        marginBottom: '20px',
                        lineHeight: 1,
                    }}
                >
                    🎉
                </div>

                <h1
                    style={{
                        fontSize: '26px',
                        fontWeight: 700,
                        color: '#111827',
                        marginBottom: '10px',
                        marginTop: 0,
                    }}
                >
                    Payment Successful!
                </h1>

                <p
                    style={{
                        fontSize: '15px',
                        color: '#6b7280',
                        lineHeight: 1.6,
                        marginBottom: '28px',
                    }}
                >
                    Your credits have been added to your account.
                    <br />
                    You can now use them across all tools.
                </p>

                {searchParams.checkout_id && (
                    <p
                        style={{
                            fontSize: '12px',
                            color: '#9ca3af',
                            backgroundColor: '#f9fafb',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            marginBottom: '28px',
                            fontFamily: 'monospace',
                        }}
                    >
                        Order ID: {searchParams.checkout_id}
                    </p>
                )}

                <a
                    href="/"
                    style={{
                        display: 'inline-block',
                        height: '44px',
                        lineHeight: '44px',
                        padding: '0 28px',
                        backgroundColor: '#111827',
                        color: '#ffffff',
                        borderRadius: '12px',
                        fontSize: '14px',
                        fontWeight: 600,
                        textDecoration: 'none',
                        transition: 'background-color 0.2s',
                    }}
                >
                    Back to Home
                </a>
            </div>
        </main>
    )
}

export default async function SuccessPage({ searchParams }: PageProps) {
    const resolvedParams = await searchParams
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent searchParams={resolvedParams} />
        </Suspense>
    )
}
