'use client'

import { useState } from 'react'
import { X, Zap, Star } from 'lucide-react'

interface CreditPackage {
    key: string
    name: string
    credits: number
    price: string
    unitPrice: string
    popular?: boolean
}

const PACKAGES: CreditPackage[] = [
    {
        key: 'starter',
        name: 'Starter',
        credits: 80,
        price: '$2.99',
        unitPrice: '$0.037/credit',
    },
    {
        key: 'growth',
        name: 'Growth',
        credits: 200,
        price: '$6.99',
        unitPrice: '$0.035/credit',
        popular: true,
    },
    {
        key: 'pro',
        name: 'Pro',
        credits: 450,
        price: '$14.88',
        unitPrice: '$0.033/credit',
    },
]

interface CreditsModalProps {
    isOpen: boolean
    onClose: () => void
    isLoggedIn: boolean
    onLoginRequired: () => void
}

export function CreditsModal({ isOpen, onClose, isLoggedIn, onLoginRequired }: CreditsModalProps) {
    const [loadingKey, setLoadingKey] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    if (!isOpen) return null

    const handleBuy = async (pkg: CreditPackage) => {
        if (!isLoggedIn) {
            onLoginRequired()
            return
        }

        setError(null)
        setLoadingKey(pkg.key)

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ packageKey: pkg.key }),
            })

            const data = await response.json()

            if (!response.ok || !data.checkoutUrl) {
                throw new Error(data.error || 'Failed to create checkout')
            }

            // Redirect to Creem payment page
            window.location.href = data.checkoutUrl
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
            setError(message)
            setLoadingKey(null)
        }
    }

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1000,
                    backdropFilter: 'blur(4px)',
                }}
            />

            {/* Modal */}
            <div
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1001,
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    padding: '32px',
                    width: '100%',
                    maxWidth: '640px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                }}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        color: '#9ca3af',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '48px',
                            height: '48px',
                            backgroundColor: '#fef3c7',
                            borderRadius: '12px',
                            marginBottom: '12px',
                        }}
                    >
                        <Zap size={24} color="#f59e0b" fill="#f59e0b" />
                    </div>
                    <h2
                        style={{
                            fontSize: '22px',
                            fontWeight: 700,
                            color: '#111827',
                            margin: '0 0 6px',
                        }}
                    >
                        Buy Credits
                    </h2>
                    <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                        Power up your creativity — credits never expire
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div
                        style={{
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: '10px',
                            padding: '10px 14px',
                            marginBottom: '20px',
                            fontSize: '13px',
                            color: '#dc2626',
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* Package cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {PACKAGES.map((pkg) => (
                        <div
                            key={pkg.key}
                            style={{
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '18px 20px',
                                borderRadius: '14px',
                                border: pkg.popular ? '2px solid #6366f1' : '1.5px solid #e5e7eb',
                                backgroundColor: pkg.popular ? '#f5f3ff' : '#fafafa',
                                transition: 'border-color 0.2s, box-shadow 0.2s',
                            }}
                        >
                            {/* Popular badge */}
                            {pkg.popular && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '-10px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        backgroundColor: '#6366f1',
                                        color: '#ffffff',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        padding: '2px 10px',
                                        borderRadius: '99px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    <Star size={10} fill="#fff" />
                                    Most Popular
                                </div>
                            )}

                            {/* Left: Package info */}
                            <div>
                                <div
                                    style={{
                                        fontSize: '15px',
                                        fontWeight: 600,
                                        color: '#111827',
                                        marginBottom: '2px',
                                    }}
                                >
                                    {pkg.name}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Zap size={13} color="#f59e0b" fill="#f59e0b" />
                                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                                        {pkg.credits.toLocaleString()} Credits
                                    </span>
                                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>· {pkg.unitPrice}</span>
                                </div>
                            </div>

                            {/* Right: Price + Buy */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
                                <span
                                    style={{
                                        fontSize: '18px',
                                        fontWeight: 700,
                                        color: pkg.popular ? '#6366f1' : '#111827',
                                    }}
                                >
                                    {pkg.price}
                                </span>
                                <button
                                    onClick={() => handleBuy(pkg)}
                                    disabled={loadingKey !== null}
                                    style={{
                                        height: '36px',
                                        padding: '0 18px',
                                        backgroundColor: pkg.popular ? '#6366f1' : '#111827',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '10px',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        cursor: loadingKey !== null ? 'not-allowed' : 'pointer',
                                        opacity: loadingKey !== null && loadingKey !== pkg.key ? 0.5 : 1,
                                        transition: 'opacity 0.2s, background-color 0.2s',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {loadingKey === pkg.key ? 'Loading...' : 'Buy Now'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer note */}
                <p
                    style={{
                        textAlign: 'center',
                        fontSize: '12px',
                        color: '#9ca3af',
                        marginTop: '20px',
                        marginBottom: 0,
                    }}
                >
                    Secure payments powered by{' '}
                    <span style={{ fontWeight: 600, color: '#6b7280' }}>Creem</span>
                </p>
            </div>
        </>
    )
}
