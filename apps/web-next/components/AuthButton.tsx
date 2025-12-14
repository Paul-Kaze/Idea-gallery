import React, { useState, useRef, useEffect } from 'react'
import { User } from 'lucide-react'

interface AuthButtonProps {
  isAuthenticated: boolean
  onLogin: () => void
  onLogout: () => void
}

export function AuthButton({ isAuthenticated, onLogin, onLogout }: AuthButtonProps) {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }
    if (showMenu) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showMenu])

  //未认证状态渲染
  if (!isAuthenticated) {
    return (
      <button onClick={onLogin} className="px-4 py-1.5 text-sm text-gray-900 hover:text-gray-600 transition-colors">
        Log in
      </button>
    )
  }
  //已认证状态渲染
  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setShowMenu(!showMenu)} className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white hover:bg-gray-700 transition-colors">
        <User className="w-4 h-4" />
      </button>
      {showMenu && (
        <div className="absolute right-0 top-full mt-2 bg-white rounded shadow-md border border-gray-200 py-1 min-w-[100px]">
          <button
            onClick={() => {
              onLogout()
              setShowMenu(false)
            }}
            className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  )
}
