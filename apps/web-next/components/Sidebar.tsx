'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Wrench, FolderOpen } from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()

  const navItems = [
    {
      label: 'Home',
      icon: Home,
      href: '/',
      isActive: pathname === '/',
    },
    {
      label: 'Tools',
      icon: Wrench,
      href: '/tools',
      isActive: pathname === '/tools',
    },
    {
      label: 'Assets',
      icon: FolderOpen,
      href: '#',
      isActive: false,
    },
  ]

  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        width: '80px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #f3f4f6',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        paddingTop: '64px', // account for Header
      }}
    >
      {/* Navigation */}
      <nav
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '100%',
          padding: '0 8px',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '63px',
              borderRadius: '14px',
              padding: '8px 0',
              gap: '6px',
              textDecoration: 'none',
              transition: 'background-color 0.15s ease',
              backgroundColor: item.isActive ? '#f9fafb' : 'transparent',
            }}
            onMouseEnter={(e) => {
              if (!item.isActive) {
                e.currentTarget.style.backgroundColor = '#f9fafb'
              }
            }}
            onMouseLeave={(e) => {
              if (!item.isActive) {
                e.currentTarget.style.backgroundColor = 'transparent'
              }
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: item.isActive ? '#ffffff' : 'transparent',
                border: item.isActive ? '1px solid #e5e7eb' : 'none',
                boxShadow: item.isActive ? '0px 4px 20px 0px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              <item.icon
                size={22}
                style={{ color: item.isActive ? '#101828' : '#99a1af' }}
              />
            </div>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 500,
                color: item.isActive ? '#101828' : '#99a1af',
                letterSpacing: '0.037em',
                lineHeight: '15px',
                textAlign: 'center',
              }}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
