import { IconMoon, IconSun } from '@tabler/icons-react'

export default function StickyNavbar({ user, theme, onToggleTheme, onNavigate, onLogout }) {
  const go = (to) => (e) => { e.preventDefault(); onNavigate(to) }
  const link = 'rounded-lg px-3 py-1.5 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700'
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="/" onClick={go('/')} className="text-lg font-bold" style={{ color: 'var(--accent)' }}>Delcom Blog</a>
        <div className="flex items-center gap-1">
          <button aria-label="Ganti tema" onClick={onToggleTheme} className={link}>
            {theme === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
          </button>
          {user ? (
            <>
              <a href={user.role === 'admin' ? '/admin' : '/author'} onClick={go(user.role === 'admin' ? '/admin' : '/author')} className={link}>
                {user.role === 'admin' ? 'Admin' : 'Workspace'}
              </a>
              <button onClick={onLogout} className={link}>Keluar</button>
            </>
          ) : (
            <>
              <a href="/login" onClick={go('/login')} className={link}>Login</a>
              <a href="/register" onClick={go('/register')} className={link}>Register</a>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
