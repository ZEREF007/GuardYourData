import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: number
  name: string
  email: string
  role: 'learner' | 'admin'
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string; pending?: boolean; demo_code?: string; email?: string }>
  register: (name: string, email: string, password: string) => Promise<{ ok: boolean; pending?: boolean; demo_code?: string; email?: string; error?: string }>
  logout: () => void
  completeLogin: (token: string, user: User) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (t && u) {
      setToken(t)
      setUser(JSON.parse(u))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) {
      // 403 means unverified email — surface pending state to the UI
      if (res.status === 403 && data.pending)
        return { ok: false, pending: true, demo_code: data.demo_code, email: data.email, error: data.error }
      return { ok: false, error: data.error || 'Login failed' }
    }
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    return { ok: true }
  }

  const register = async (name: string, email: string, password: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    const data = await res.json()
    if (!res.ok) return { ok: false, error: data.error || 'Registration failed' }
    // pending = true means email verification OTP was sent
    if (data.pending) return { ok: true, pending: true, demo_code: data.demo_code, email: data.email }
    // legacy: immediate login (shouldn't happen with new server)
    if (data.token) {
      setToken(data.token); setUser(data.user)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    }
    return { ok: true }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const completeLogin = (tok: string, u: User) => {
    setToken(tok)
    setUser(u)
    localStorage.setItem('token', tok)
    localStorage.setItem('user', JSON.stringify(u))
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, completeLogin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
