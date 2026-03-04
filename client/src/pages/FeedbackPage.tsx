import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Loader2, MessageSquare, Send } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import clsx from 'clsx'

const AGE_GROUPS = ['Under 18', '18–24', '25–34', '35–44', '45–54', '55 and above']

const INDUSTRIES = [
  'Banking & Finance',
  'Insurance',
  'Technology / IT',
  'Healthcare',
  'Education',
  'Government / Public Sector',
  'Retail & E-Commerce',
  'Legal & Compliance',
  'Other',
]

export default function FeedbackPage() {
  const { isDark } = useTheme()
  const [form, setForm] = useState({
    name: '', email: '', age_group: '', industry: '', remarks: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const inputCls = clsx(
    'w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/30 transition-all border',
    isDark
      ? 'bg-slate-800/60 border-slate-700/50 text-white placeholder:text-slate-500'
      : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
  )

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.age_group || !form.industry) {
      return setError('Please fill in all required fields.')
    }
    setLoading(true)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) return setError(data.error || 'Something went wrong. Please try again.')
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={clsx('min-h-[calc(100vh-3.5rem)] py-16 px-4', isDark ? 'bg-slate-950' : 'bg-slate-50')}>
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-brand-400" />
          </div>
          <h1 className={clsx('text-3xl font-extrabold mb-3', isDark ? 'text-white' : 'text-slate-900')}>
            Share Your Feedback
          </h1>
          <p className={clsx('text-sm leading-relaxed', isDark ? 'text-slate-400' : 'text-slate-600')}>
            Help us improve the GuardYourData training platform. Your response takes less than 2 minutes
            and is completely optional to identify.
          </p>
        </motion.div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            className={clsx(
              'rounded-3xl p-10 text-center shadow-2xl border',
              isDark ? 'bg-slate-900/60 border-slate-700/50' : 'bg-white border-slate-200',
            )}
          >
            <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h2 className={clsx('text-2xl font-bold mb-2', isDark ? 'text-white' : 'text-slate-900')}>
              Thank you! 🎉
            </h2>
            <p className={clsx('text-sm', isDark ? 'text-slate-400' : 'text-slate-600')}>
              Your feedback has been recorded. We appreciate you taking the time to help us improve.
            </p>
            <button
              onClick={() => { setSubmitted(false); setForm({ name: '', email: '', age_group: '', industry: '', remarks: '' }) }}
              className="mt-6 px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-sm font-semibold transition-all"
            >
              Submit another response
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className={clsx(
              'rounded-3xl p-8 shadow-2xl border',
              isDark ? 'bg-slate-900/60 border-slate-700/50' : 'bg-white border-slate-200',
            )}
          >
            <form onSubmit={submit} className="space-y-5">

              {/* Name */}
              <div>
                <label className={clsx('block text-xs font-semibold mb-1.5', isDark ? 'text-slate-400' : 'text-slate-600')}>
                  Full Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text" value={form.name} onChange={set('name')} required
                  placeholder="Your name" className={inputCls}
                />
              </div>

              {/* Email */}
              <div>
                <label className={clsx('block text-xs font-semibold mb-1.5', isDark ? 'text-slate-400' : 'text-slate-600')}>
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="email" value={form.email} onChange={set('email')} required
                  placeholder="you@example.com" className={inputCls}
                />
              </div>

              {/* Age group + Industry side by side */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={clsx('block text-xs font-semibold mb-1.5', isDark ? 'text-slate-400' : 'text-slate-600')}>
                    Age Group <span className="text-red-400">*</span>
                  </label>
                  <select value={form.age_group} onChange={set('age_group')} required className={inputCls}>
                    <option value="">Select…</option>
                    {AGE_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className={clsx('block text-xs font-semibold mb-1.5', isDark ? 'text-slate-400' : 'text-slate-600')}>
                    Industry <span className="text-red-400">*</span>
                  </label>
                  <select value={form.industry} onChange={set('industry')} required className={inputCls}>
                    <option value="">Select…</option>
                    {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className={clsx('block text-xs font-semibold mb-1.5', isDark ? 'text-slate-400' : 'text-slate-600')}>
                  Remarks <span className={isDark ? 'text-slate-600' : 'text-slate-400'}>(optional)</span>
                </label>
                <textarea
                  value={form.remarks} onChange={set('remarks')} rows={4}
                  placeholder="What did you find most useful? Any suggestions to improve the platform?"
                  className={clsx(inputCls, 'resize-none leading-relaxed')}
                />
              </div>

              {error && (
                <div className="px-4 py-3 bg-red-950/60 border border-red-700/40 rounded-xl text-red-300 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
                  : <><Send className="w-4 h-4" /> Submit Feedback</>}
              </button>

            </form>
          </motion.div>
        )}

        <p className={clsx('text-center text-xs mt-6', isDark ? 'text-slate-600' : 'text-slate-400')}>
          Your feedback is stored securely and only visible to administrators.
        </p>
      </div>
    </div>
  )
}
