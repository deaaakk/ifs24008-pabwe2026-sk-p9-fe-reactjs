import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { logout } from './features/auth/api/authApi'

vi.mock('./features/blog/components/PublicArticleList', () => ({ default: () => <span>list-stub</span> }))
vi.mock('./features/blog/components/PublicArticleDetail', () => ({ default: ({ slug }) => <span>detail-{slug}</span> }))
vi.mock('./features/blog/components/AuthorDashboard', () => ({ default: () => <span>author-stub</span> }))
vi.mock('./features/admin/components/AdminDashboard', () => ({ default: () => <span>admin-stub</span> }))
vi.mock('./features/auth/api/authApi', () => ({ logout: vi.fn() }))
vi.mock('./features/auth/components/AuthPage', () => ({
  default: ({ mode, onSuccess }) => (
    <div>
      <span>auth-{mode}</span>
      <button onClick={() => onSuccess({ token: 't', user: { role: 'member' } })}>ok-member</button>
      <button onClick={() => onSuccess({ token: 't', user: { role: 'admin' } })}>ok-admin</button>
    </div>
  ),
}))

beforeEach(() => { localStorage.clear(); window.history.pushState({}, '', '/'); vi.clearAllMocks() })

describe('App', () => {
  it('beranda untuk tamu & navigasi ke login/register', async () => {
    const u = userEvent.setup()
    render(<App />)
    expect(screen.getByText('list-stub')).toBeInTheDocument()
    await u.click(screen.getByText('Login')); expect(screen.getByText('auth-login')).toBeInTheDocument()
    await u.click(screen.getByText('Register')); expect(screen.getByText('auth-register')).toBeInTheDocument()
  })
  it('/author: tamu diarahkan ke login, penulis melihat dashboard', () => {
    window.history.pushState({}, '', '/author')
    const { unmount } = render(<App />)
    expect(screen.getByText('auth-login')).toBeInTheDocument()
    unmount()
    localStorage.setItem('user', JSON.stringify({ role: 'member' }))
    render(<App />)
    expect(screen.getByText('author-stub')).toBeInTheDocument()
  })
  it('/admin: tamu ke login, admin melihat panel, penulis ditolak', () => {
    window.history.pushState({}, '', '/admin')
    const { unmount } = render(<App />)
    expect(screen.getByText('auth-login')).toBeInTheDocument()
    unmount()
    localStorage.setItem('user', JSON.stringify({ role: 'admin' }))
    const r2 = render(<App />)
    expect(screen.getByText('admin-stub')).toBeInTheDocument()
    r2.unmount()
    localStorage.setItem('user', JSON.stringify({ role: 'member' }))
    render(<App />)
    expect(screen.getByText('Akses ditolak.')).toBeInTheDocument()
  })
  it('rute detail artikel', () => {
    window.history.pushState({}, '', '/posts/halo-dunia')
    render(<App />)
    expect(screen.getByText('detail-halo-dunia')).toBeInTheDocument()
  })
  it('popstate menyinkronkan rute', () => {
    render(<App />)
    act(() => { window.history.pushState({}, '', '/login'); window.dispatchEvent(new PopStateEvent('popstate')) })
    expect(screen.getByText('auth-login')).toBeInTheDocument()
  })
  it('login penulis & admin, lalu logout (sukses & gagal)', async () => {
    const u = userEvent.setup()
    window.history.pushState({}, '', '/login')
    render(<App />)
    await u.click(screen.getByText('ok-member'))
    expect(window.location.pathname).toBe('/author'); expect(localStorage.getItem('token')).toBe('t')
    await u.click(screen.getByText('Keluar'))
    await waitFor(() => expect(localStorage.getItem('user')).toBeNull())
    window.history.pushState({}, '', '/login'); act(() => { window.dispatchEvent(new PopStateEvent('popstate')) })
    await u.click(screen.getByText('ok-admin')); expect(window.location.pathname).toBe('/admin')
    logout.mockRejectedValueOnce(new Error('x'))
    await u.click(screen.getByText('Keluar'))
    await waitFor(() => expect(window.location.pathname).toBe('/'))
  })
  it('membaca sesi tersimpan & ganti tema', async () => {
    localStorage.setItem('user', JSON.stringify({ role: 'member' }))
    render(<App />)
    expect(screen.getByText('Workspace')).toBeInTheDocument()
    await userEvent.setup().click(screen.getByLabelText('Ganti tema'))
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})
