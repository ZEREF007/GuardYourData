import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Eye, EyeOff, CheckCircle, XCircle, Loader2, KeyRound, RotateCcw, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import clsx from 'clsx'

const API = '/api'

const checks = [
  { label: '8+ characters',     test: (p: string) => p.length >= 8 },
  { label: 'Uppercase letter',  test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Number',            test: (p: string) => /[0-9]/.test(p) },
  { label: 'Special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

type Mode = 'login' | 'register' | 'forgot' | 'forgot-reset' | '2fa-verify'

export default function AuthPage() {
  const [mode, setMode]            = useState<Mode>('login')
  const [tab,  setTab]             = useState<'login' | 'register'>('login')
  const [name, setName]            = useState('')
  const [email, setEmail]          = useState('')
  const [password, setPassword]    = useState('')
  const [showPw, setShowPw]        = useState(false)
  const [use2fa, setUse2fa]        = useState(false)
  const [otp, setOtp]              = useState('')
  const [demoCode, setDemoCode]    = useState('')
  const [newPassword, setNewPw]    = useState('')
  const [showNewPw, setShowNewPw]  = useState(false)
  const [pendingEmail, setPending] = useState('')
  const [loading, setLoading]      = useState(false)
  const [error, setError]          = useState('')

  const { login, register } = useAuth()
  const nav = useNavigate()

  const resetState = (m: Mode) => { setMode(m); setError(''); setOtp(''); setDemoCode('') }
  const switchTab  = (t: 'login' | 'register') => { setTab(t); resetState(t); setName(''); setEmail(''); setPassword('') }

  /* ─── Login / Register ─── */
  const submitAuth = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      if (use2fa && tab === 'login') {
        const r = await fetch(`${API}/auth/2fa/init`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
        const data = await r.json()
        if (!r.ok) return setError(data.error || 'Something went wrong')
        setDemoCode(data.demo_code || ''); setPending(email); setOtp('')
        setMode('2fa-verify')
      } else {
        const res = tab === 'login' ? await login(email, password) : await register(name, email, password)
        if (res.ok) {
          const u = JSON.parse(localStorage.getItem('user') || '{}')
          nav(u.role === 'admin' ? '/admin' : '/')
        } else { setError(res.error ?? 'Something went wrong') }
      }
    } finally { setLoading(false) }
  }

  /* ─── 2FA verify ─── */
  const submit2fa = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const r = await fetch(`${API}/auth/2fa/verify`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail, code: otp }),
      })
      const data = await r.json()
      if (!r.ok) return setError(data.error || 'Invalid code')
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      nav(data.user.role === 'admin' ? '/admin' : '/')
    } finally { setLoading(false) }
  }

  /* ─── Forgot password step 1 ─── */
  const submitForgot = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const r = await fetch(`${API}/auth/forgot`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await r.json()
      if (!r.ok) return setError(data.error || 'Something went wrong')
      setDemoCode(data.demo_code || ''); setPending(email); setOtp(''); setNewPw('')
      setMode('forgot-reset')
    } finally { setLoading(false) }
  }

  /* ─── Forgot password step 2 ─── */
  const submitReset = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const r = await fetch(`${API}/auth/reset-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail, code: otp, newPassword }),
      })
      const data = await r.json()
      if (!r.ok) return setError(data.error || 'Something went wrong')
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      nav(data.user.role === 'admin' ? '/admin' : '/')
    } finally { setLoading(false) }
  }

  const pwStrength = password   ? checks.filter(c => c.test(password)).length   : 0
  const npStrength = newPassword? checks.filter(c => c.test(newPassword)).length : 0
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][pwStrength] ?? ''
  const strengthColor = ['', 'bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500']
  const inputCls = 'w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/30 transition-all'

  const DemoCodeBox = ({ code }: { code: string }) => code ? (
    <div className="mb-4 px-4 py-3 bg-amber-950/50 border border-amber-500/30 rounded-xl">
      <p className="text-amber-300 text-xs font-medium mb-1">📧 Demo Mode — code that would be emailed:</p>
      <p className="text-amber-200 font-mono text-2xl font-black tracking-[0.4em] text-center py-1">{code}</p>
    </div>
  ) : null

  const OtpInput = () => (
    <div>
      <label className="block text-slate-400 text-xs font-medium mb-1.5">6-Digit Code</label>
      <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,'').slice(0,6))}
        required maxLength={6} placeholder="000000"
        className={clsx(inputCls, 'text-center font-mono text-xl tracking-[0.4em]')} />
    </div>
  )

  return (
    <div className="auth-page-wrap min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center group-hover:bg-brand-500 transition-colors">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="text-white font-bold text-lg leading-none">FinTech Security</div>
              <div className="text-brand-400 text-sm">Training Platform</div>
            </div>
          </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl shadow-black/40">
          <AnimatePresence mode="wait">

            {/* ═══ LOGIN / REGISTER ═══ */}
            {(mode === 'login' || mode === 'register') && (
              <motion.div key="auth" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <div className="flex bg-slate-800/60 rounded-xl p-1 mb-7">
                  {(['login', 'register'] as const).map(t => (
                    <button key={t} onClick={() => switchTab(t)}
                      className={clsx('flex-1 py-2 rounded-lg text-sm font-semibold transition-all',
                        tab === t ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-400 hover:text-white')}>
                      {t === 'login' ? '🔑 Sign In' : '🆕 Register'}
                    </button>
                  ))}
                </div>

                <form onSubmit={submitAuth} className="space-y-4">
                  {tab === 'register' && (
                    <div>
                      <label className="block text-slate-400 text-xs font-medium mb-1.5">Full Name</label>
                      <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Your name" className={inputCls} />
                    </div>
                  )}

                  <div>
                    <label className="block text-slate-400 text-xs font-medium mb-1.5">Email Address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@company.com" className={inputCls} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-slate-400 text-xs font-medium">Password</label>
                      {tab === 'login' && (
                        <button type="button" onClick={() => { setPending(email); resetState('forgot') }}
                          className="text-brand-400 hover:text-brand-300 text-xs font-medium transition-colors">
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                        placeholder={tab === 'register' ? 'Min 8 chars · Uppercase · Number · Special' : 'Your password'}
                        className={clsx(inputCls, 'pr-11')} />
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {tab === 'register' && password && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 space-y-2">
                        <div className="flex gap-1.5">
                          {[0,1,2,3].map(i => <div key={i} className={clsx('h-1 flex-1 rounded-full transition-all', i < pwStrength ? strengthColor[pwStrength] : 'bg-slate-700')} />)}
                        </div>
                        <div className="text-xs text-slate-400 font-medium">{strengthLabel}</div>
                        <div className="grid grid-cols-2 gap-1">
                          {checks.map(c => (
                            <div key={c.label} className="flex items-center gap-1.5 text-xs">
                              {c.test(password) ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <XCircle className="w-3 h-3 text-slate-600" />}
                              <span className={c.test(password) ? 'text-emerald-400' : 'text-slate-500'}>{c.label}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {tab === 'login' && (
                    <button type="button" onClick={() => setUse2fa(v => !v)}
                      className={clsx('w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all',
                        use2fa ? 'bg-brand-900/40 border-brand-500/50 text-brand-300' : 'bg-slate-800/40 border-slate-700/40 text-slate-400 hover:border-slate-600')}>
                      <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1 text-left">Two-factor authentication (2FA)</span>
                      <div className={clsx('w-8 h-4 rounded-full transition-all relative flex-shrink-0', use2fa ? 'bg-brand-600' : 'bg-slate-700')}>
                        <div className={clsx('absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all', use2fa ? 'left-4' : 'left-0.5')} />
                      </div>
                    </button>
                  )}

                  {error && <div className="px-4 py-3 bg-red-950/60 border border-red-700/40 rounded-xl text-red-300 text-sm">{error}</div>}

                  <button type="submit" disabled={loading}
                    className="w-full btn-primary justify-center py-3.5 mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                      : tab === 'login'
                        ? (use2fa ? <><ShieldCheck className="w-4 h-4" /> Sign In with 2FA</> : '🔑 Sign In')
                        : '🚀 Create Account'}
                  </button>
                </form>

                <p className="text-center text-slate-500 text-xs mt-6">
                  {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
                  <button onClick={() => switchTab(tab === 'login' ? 'register' : 'login')}
                    className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
                    {tab === 'login' ? 'Register here' : 'Sign in here'}
                  </button>
                </p>
              </motion.div>
            )}

            {/* ═══ 2FA VERIFY ═══ */}
            {mode === '2fa-verify' && (
              <motion.div key="2fa" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-7 h-7 text-brand-400" />
                  </div>
                  <h2 className="text-white font-bold text-xl">Two-Factor Verification</h2>
                  <p className="text-slate-400 text-sm mt-1">Code sent to <span className="text-brand-400">{pendingEmail}</span></p>
                </div>
                <DemoCodeBox code={demoCode} />
                <form onSubmit={submit2fa} className="space-y-4">
                  <OtpInput />
                  {error && <div className="px-4 py-3 bg-red-950/60 border border-red-700/40 rounded-xl text-red-300 text-sm">{error}</div>}
                  <button type="submit" disabled={loading || otp.length !== 6}
                    className="w-full btn-primary justify-center py-3.5 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</> : <><ShieldCheck className="w-4 h-4" /> Verify &amp; Sign In</>}
                  </button>
                </form>
                <button onClick={() => resetState('login')} className="w-full text-center text-slate-500 text-xs mt-4 hover:text-slate-400 transition-colors">← Back to sign in</button>
              </motion.div>
            )}

            {/* ═══ FORGOT — email step ═══ */}
            {mode === 'forgot' && (
              <motion.div key="forgot" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-4">
                    <KeyRound className="w-7 h-7 text-blue-400" />
                  </div>
                  <h2 className="text-white font-bold text-xl">Reset Password</h2>
                  <p className="text-slate-400 text-sm mt-1">We'll send a 6-digit code to your email</p>
                </div>
                <form onSubmit={submitForgot} className="space-y-4">
                  <div>
                    <label className="block text-slate-400 text-xs font-medium mb-1.5">Email Address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@company.com" className={inputCls} />
                  </div>
                  {error && <div className="px-4 py-3 bg-red-950/60 border border-red-700/40 rounded-xl text-red-300 text-sm">{error}</div>}
                  <button type="submit" disabled={loading}
                    className="w-full btn-primary justify-center py-3.5 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><KeyRound className="w-4 h-4" /> Send Reset Code</>}
                  </button>
                </form>
                <button onClick={() => resetState('login')} className="w-full text-center text-slate-500 text-xs mt-4 hover:text-slate-400 transition-colors">← Back to sign in</button>
              </motion.div>
            )}

            {/* ═══ FORGOT — OTP + new password ═══ */}
            {mode === 'forgot-reset' && (
              <motion.div key="forgot-reset" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                    <RotateCcw className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h2 className="text-white font-bold text-xl">Set New Password</h2>
                  <p className="text-slate-400 text-sm mt-1">Code sent to <span className="text-brand-400">{pendingEmail}</span></p>
                </div>
                <DemoCodeBox code={demoCode} />
                <form onSubmit={submitReset} className="space-y-4">
                  <OtpInput />
                  <div>
                    <label className="block text-slate-400 text-xs font-medium mb-1.5">New Password</label>
                    <div className="relative">
                      <input type={showNewPw ? 'text' : 'password'} value={newPassword} onChange={e => setNewPw(e.target.value)} required
                        placeholder="Min 8 chars · Uppercase · Number · Special"
                        className={clsx(inputCls, 'pr-11')} />
                      <button type="button" onClick={() => setShowNewPw(!showNewPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                        {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {newPassword && (
                      <>
                        <div className="mt-2 flex gap-1.5">
                          {[0,1,2,3].map(i => <div key={i} className={clsx('h-1 flex-1 rounded-full transition-all', i < npStrength ? strengthColor[npStrength] : 'bg-slate-700')} />)}
                        </div>
                        <div className="mt-1.5 grid grid-cols-2 gap-1">
                          {checks.map(c => (
                            <div key={c.label} className="flex items-center gap-1.5 text-xs">
                              {c.test(newPassword) ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <XCircle className="w-3 h-3 text-slate-600" />}
                              <span className={c.test(newPassword) ? 'text-emerald-400' : 'text-slate-500'}>{c.label}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  {error && <div className="px-4 py-3 bg-red-950/60 border border-red-700/40 rounded-xl text-red-300 text-sm">{error}</div>}
                  <button type="submit" disabled={loading || npStrength < 4}
                    className="w-full btn-primary justify-center py-3.5 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Resetting...</> : <><RotateCcw className="w-4 h-4" /> Reset Password</>}
                  </button>
                </form>
                <button onClick={() => resetState('forgot')} className="w-full text-center text-slate-500 text-xs mt-4 hover:text-slate-400 transition-colors">← Re-send code</button>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>

        <p className="text-center text-slate-600 text-xs mt-6">
          By signing in, you agree to our{' '}
          <Link to="/privacy" className="text-slate-500 hover:text-slate-400">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}
