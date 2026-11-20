import { useEffect, useState } from 'react'
import useTheme from './hooks/useTheme'
import { setToken } from './helpers/apiHelper'
import { logout as apiLogout } from './features/auth/api/authApi'
import AuthPage from './features/auth/components/AuthPage'
import StickyNavbar from './features/blog/components/StickyNavbar'
import AdminDashboard from './features/admin/components/AdminDashboard'
import AuthorDashboard from './features/blog/components/AuthorDashboard'
import PublicArticleList from './features/blog/components/PublicArticleList'
import PublicArticleDetail from './features/blog/components/PublicArticleDetail'

export default function App() {
  const [path, setPath] = useState(window.location.pathname)
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'))
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const sync = () => setPath(window.location.pathname)
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  const navigate = (to) => { window.history.pushState({}, '', to); setPath(to) }
  const onSuccess = ({ token, user: u }) => {
    setToken(token)
    localStorage.setItem('user', JSON.stringify(u))
    setUser(u)
    navigate(u.role === 'admin' ? '/admin' : '/author')
  }
  const onLogout = async () => {
    try { await apiLogout() } catch { /* sesi lokal tetap dibersihkan */ }
    setToken(null)
    localStorage.removeItem('user')
    setUser(null)
    navigate('/')
  }

  const isAuth = path === '/login' || path === '/register' || ((path === '/author' || path === '/admin') && !user)
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <StickyNavbar user={user} theme={theme} onToggleTheme={toggleTheme} onNavigate={navigate} onLogout={onLogout} />
      {isAuth ? (
        <AuthPage key={path} mode={path === '/register' ? 'register' : 'login'} onNavigate={navigate} onSuccess={onSuccess} />
      ) : path === '/admin' ? (
        user.role === 'admin' ? <AdminDashboard /> : <main className="mx-auto max-w-4xl px-4 py-10"><p>Akses ditolak.</p></main>
      ) : path === '/author' ? (
        <AuthorDashboard dark={theme === 'dark'} />
      ) : path.startsWith('/posts/') ? (
        <PublicArticleDetail slug={path.slice('/posts/'.length)} onNavigate={navigate} />
      ) : (
        <PublicArticleList onNavigate={navigate} />
      )}
    </div>
  )
}
