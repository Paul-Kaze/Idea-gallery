'use client'

import Link from 'next/link'

export function Footer() {
    return (
        <footer
            style={{
                marginTop: 'auto',
                padding: '24px 32px',
                backgroundColor: '#ffffff',
                borderTop: '1px solid #e5e7eb',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '24px',
                fontSize: '14px',
                color: '#6b7280',
            }}
        >
            <div>
                Contact us: <a href="mailto:support@dommi.ai" style={{ color: '#155dfc', textDecoration: 'none' }}>support@dommi.ai</a>
            </div>
            <div style={{ width: '1px', height: '14px', backgroundColor: '#d1d5db' }} />
            <Link href="/legal" style={{ color: '#6b7280', textDecoration: 'none' }} onMouseEnter={(e) => e.currentTarget.style.color = '#111827'} onMouseLeave={(e) => e.currentTarget.style.color = '#6b7280'}>
                Legal Center
            </Link>
        </footer>
    )
}
