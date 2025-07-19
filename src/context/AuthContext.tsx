'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

interface AuthContextType {
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated on mount
    const token = localStorage.getItem('adminToken')
    setIsAuthenticated(!!token)
  }, [])

  const login = (token: string) => {
    localStorage.setItem('adminToken', token)
    Cookies.set('adminToken', token, { expires: 7 })
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    Cookies.remove('adminToken')
    setIsAuthenticated(false)
    // Force a page reload to clear all state
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 