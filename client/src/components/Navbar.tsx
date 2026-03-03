import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Shield, ChevronRight, Sun, Moon, ChevronDown, Globe } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useLang } from '../context/LanguageContext'
import clsx from 'clsx'

const MODULE_ITEMS = [
  { path: '/module/1', label: 'Module 1: What is a Data Breach?',        icon: '📖', color: 'text-blue-600 dark:text-blue-400' },
  { path: '/module/2', label: 'Module 2: Attack Vectors and Techniques', icon: '🔍', color: 'text-red-600 dark:text-red-400' },
  { path: '/module/3', label: 'Module 3: Regulatory Environment',        icon: '📊', color: 'text-amber-600 dark:text-amber-400' },
  { path: '/module/4', label: 'Module 4: Security Controls and Defences', icon: '🛡️', color: 'text-emerald-600 dark:text-emerald-400' },
  { path: '/module/5', label: 'Module 5: Case Studies and Governance',   icon: '📋', color: 'text-purple-600 dark:text-purple-400' },
]

const NAV_ITEMS: { path: string; label: string; icon: string; live?: boolean }[] = [
  { path: '/',           label: 'Overview',   icon: '🏠' },
  { path: '/quiz',       label: 'MCQ Quiz',   icon: '🧠' },
  { path: '/game',       label: 'Game',       icon: '🎮' },
  { path: '/glossary',   label: 'Glossary',   icon: '📚' },
  { path: '/laws',       label: 'Laws',       icon: '⚖️' },
  { path: '/live',       label: 'Live Threats', icon: '🔴', live: true },
  { path: '/dashboard',  label: 'Dashboard',  icon: '📈' },
  { path: '/references', label: 'References', icon: '📑' },
  { path: '/privacy',    label: 'Privacy',    icon: '🔏' },
  { path: '/thankyou',   label: 'Thank You',  icon: '🎉' },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen]     = useState(false)
  const [modulesOpen, setModulesOpen]   = useState(false)
  const [langOpen, setLangOpen]         = useState(false)
  const [scrolled, setScrolled]         = useState(false)
  const [progress, setProgress]         = useState(0)
  const { user, logout }                = useAuth()
  const { isDark, toggle }              = useTheme()
  const { t, lang, setLang, langMeta }  = useLang()
  const location                        = useLocation()
  const dropdownRef                     = useRef<HTMLLIElement>(null)
  const langRef                         = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      const doc = document.documentElement
      const pct = (window.scrollY / (doc.scrollHeight - doc.clientHeight)) * 100
      setProgress(Math.min(100, Math.max(0, pct)))
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close module dropdown when navigating
  useEffect(() => {
    setMobileOpen(false)
    setModulesOpen(false)
    setLangOpen(false)
  }, [location.pathname])

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setModulesOpen(false)
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Label helpers — use translations, fall back to English
  const navLabel = (path: string, fallback: string) => {
    const map: Record<string, string> = {
      '/': t.nav_overview, '/quiz': t.nav_quiz, '/game': t.nav_game,
      '/glossary': t.nav_glossary, '/laws': t.nav_laws, '/live': t.nav_live,
      '/dashboard': t.nav_dashboard, '/references': t.nav_references,
      '/privacy': t.nav_privacy, '/thankyou': t.nav_thankyou,
    }
    return map[path] ?? fallback
  }
  const modLabel = (path: string, fallback: string) => {
    const map: Record<string, string> = {
      '/module/1': t.mod1, '/module/2': t.mod2, '/module/3': t.mod3,
      '/module/4': t.mod4, '/module/5': t.mod5,
    }
    return map[path] ?? fallback
  }

  const isModuleActive = MODULE_ITEMS.some(m => location.pathname === m.path)

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const baseLinkCls = 'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap'
  const activeCls   = 'bg-brand-50 dark:bg-brand-600/20 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-600/30'
  const idleCls     = 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'

  return (
    <>
      <nav
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/97 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700/60 shadow-sm dark:shadow-xl'
            : 'bg-white/92 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200/60 dark:border-slate-800/50',
        )}
      >
        <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center gap-2">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group mr-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center group-hover:bg-brand-500 transition-colors">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-[11px] font-extrabold text-slate-900 dark:text-white leading-none tracking-tight">FinTech</div>
              <div className="text-[10px] text-brand-600 dark:text-brand-400 leading-none font-semibold">Security</div>
            </div>
          </Link>

          {/* Desktop nav — fixed (no scroll) */}
          <ul className="hidden lg:flex items-center gap-0.5 flex-1">
            {/* Home */}
            <li>
              <Link to="/" className={clsx(baseLinkCls, isActive('/') && location.pathname === '/' ? activeCls : idleCls)}>
                <span className="text-sm">🏠</span>
                <span>{t.nav_overview}</span>
              </Link>
            </li>

            {/* Modules dropdown */}
            <li className="relative" ref={dropdownRef}>
              <button
                onClick={() => setModulesOpen(o => !o)}
                className={clsx(
                  baseLinkCls,
                  isModuleActive ? activeCls : idleCls,
                )}
              >
                <span className="text-sm">📚</span>
                <span>{t.nav_modules}</span>
                <ChevronDown className={clsx('w-3 h-3 transition-transform duration-200', modulesOpen && 'rotate-180')} />
              </button>

              <AnimatePresence>
                {modulesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1.5 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-1.5">
                      {MODULE_ITEMS.map(m => (
                        <Link
                          key={m.path}
                          to={m.path}
                          className={clsx(
                            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                            location.pathname === m.path
                              ? 'bg-brand-50 dark:bg-brand-600/15 text-brand-700 dark:text-brand-300'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800',
                          )}
                        >
                          <span className="text-base w-6 text-center">{m.icon}</span>
                          <span className={clsx('flex-1 text-xs leading-snug')}>{modLabel(m.path, m.label)}</span>
                          {location.pathname === m.path && <ChevronRight className="w-3 h-3 text-brand-500" />}
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-slate-100 dark:border-slate-800 px-4 py-2">
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">{t.nav_modules_hint}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {/* Rest of nav */}
            {NAV_ITEMS.slice(1).map(item => (
              <li key={item.path}>
                <Link to={item.path} className={clsx(baseLinkCls, isActive(item.path) ? activeCls : idleCls)}>
                  <span className="text-sm">{item.icon}</span>
                  <span>{navLabel(item.path, item.label)}</span>
                  {item.live && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 shrink-0 ml-auto">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-600/20 dark:hover:bg-amber-600/30 text-amber-700 dark:text-amber-300 text-xs font-semibold rounded-lg border border-amber-200 dark:border-amber-600/30 transition-all"
                  >
                    ⚙️ {t.nav_admin}
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-all"
                >
                  {t.nav_signout}
                </button>
                <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              </>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-1 px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg transition-all"
              >
                {t.nav_signin} <ChevronRight className="w-3 h-3" />
              </Link>
            )}

            {/* Language switcher */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(o => !o)}
                title={t.lang_label}
                className="flex items-center gap-1 p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700 transition-all text-xs font-semibold"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{langMeta[lang].flag}</span>
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-1.5 w-40 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-xl shadow-xl dark:shadow-2xl overflow-hidden z-50"
                  >
                    {(Object.entries(langMeta) as [import('../context/LanguageContext').Lang, { label: string; flag: string }][]).map(([code, meta]) => (
                      <button
                        key={code}
                        onClick={() => { setLang(code); setLangOpen(false) }}
                        className={clsx(
                          'w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium transition-all',
                          lang === code
                            ? 'bg-brand-50 dark:bg-brand-600/15 text-brand-700 dark:text-brand-300'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800',
                        )}
                      >
                        <span className="text-base">{meta.flag}</span>
                        <span>{meta.label}</span>
                        {lang === code && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggle}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700 transition-all"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-all"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-800">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-500 to-accent-500"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-14 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700/60 max-h-[80vh] overflow-y-auto shadow-lg dark:shadow-2xl"
          >
            {/* Modules section */}
            <div className="p-3 border-b border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-2">{t.nav_modules}</p>
              <ul className="space-y-0.5">
                {MODULE_ITEMS.map(m => (
                  <li key={m.path}>
                    <Link
                      to={m.path}
                      className={clsx(
                        'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-all',
                        location.pathname === m.path
                          ? 'bg-brand-50 dark:bg-brand-600/20 text-brand-700 dark:text-brand-300'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800',
                      )}
                    >
                      <span>{m.icon}</span>
                      <span className="text-xs">{modLabel(m.path, m.label)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Other pages */}
            <div className="p-3">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-3 mb-2">Pages</p>
              <ul className="grid grid-cols-2 gap-1">
                {NAV_ITEMS.map(item => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={clsx(
                        'flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                        isActive(item.path)
                          ? 'bg-brand-50 dark:bg-brand-600/20 text-brand-700 dark:text-brand-300 border border-brand-100 dark:border-brand-600/30'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800',
                      )}
                    >
                      <span>{item.icon}</span>
                      <span>{navLabel(item.path, item.label)}</span>
                      {item.live && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse ml-auto" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {user && (
              <div className="px-3 pb-3 flex gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                {user.role === 'admin' && (
                  <Link to="/admin" className="flex-1 btn-secondary text-center justify-center text-sm py-2">⚙️ Admin</Link>
                )}
                <button onClick={logout} className="flex-1 btn-secondary text-sm py-2">Sign out</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
