'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, LogOut, Zap } from 'lucide-react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { CreditsModal } from './CreditsModal'

export function Header() {
  const { data: session } = useSession()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [credits, setCredits] = useState<number | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch credits when user is logged in
  const fetchCredits = useCallback(async () => {
    if (!session?.user?.email) return
    try {
      const res = await fetch('/api/user/credits', { cache: 'no-store' })
      if (res.ok) {
        const data = await res.json()
        setCredits(data.credits ?? 0)
      }
    } catch {
      // Silently fail - credits just won't show
    }
  }, [session?.user?.email])

  useEffect(() => {
    fetchCredits()

    const handleCreditsUpdate = () => {
      fetchCredits()
    }

    window.addEventListener('update-credits', handleCreditsUpdate)
    return () => {
      window.removeEventListener('update-credits', handleCreditsUpdate)
    }
  }, [fetchCredits])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLoginRequired = () => {
    setIsModalOpen(false)
    signIn('google')
  }

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '64px',
          zIndex: 100,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderBottom: '1px solid #f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: '24px',
          paddingRight: '24px',
        }}
      >
        {/* Left: Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src="/logo.png"
            alt="Dommi"
            width={57}
            height={32}
            style={{ objectFit: 'contain' }}
            priority
          />
        </Link>

        {/* Right: Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Credits Display Area (only when logged in) */}
          {session && credits !== null && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                title="Your credits"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  height: '34px',
                  padding: '0 12px',
                  backgroundColor: '#fef3c7',
                  border: '1px solid #fde68a',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#92400e',
                  whiteSpace: 'nowrap',
                }}
              >
                <Zap size={13} color="#f59e0b" fill="#f59e0b" />
                {credits.toLocaleString()}
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                style={{
                  height: '34px',
                  padding: '0 14px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '9999px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#374151',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
              >
                Charge
              </button>
            </div>
          )}

          {/* Divider */}
          <div
            style={{
              width: '1px',
              height: '24px',
              backgroundColor: '#f3f4f6',
              flexShrink: 0,
            }}
          />

          {/* Auth */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {session ? (
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || 'User avatar'}
                      width={32}
                      height={32}
                      style={{ borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: '#e5e7eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span style={{ color: '#4b5563', fontSize: 14 }}>
                        {session.user?.name?.[0]?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  )}
                </button>

                {isDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      minWidth: '160px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      padding: '4px',
                      zIndex: 200,
                    }}
                  >
                    <button
                      onClick={() => signOut()}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 12px',
                        background: 'none',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        whiteSpace: 'nowrap',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <LogOut size={16} />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => signIn('google')}
                style={{
                  height: '36px',
                  padding: '0 16px',
                  backgroundColor: '#155dfc',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.1), 0px 1px 2px 0px rgba(0,0,0,0.1)',
                }}
              >
                Sign in
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Credits Purchase Modal */}
      <CreditsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isLoggedIn={!!session}
        onLoginRequired={handleLoginRequired}
      />
    </>
  )
}
