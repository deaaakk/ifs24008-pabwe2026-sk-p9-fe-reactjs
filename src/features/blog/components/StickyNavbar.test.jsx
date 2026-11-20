import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import StickyNavbar from './StickyNavbar'

const setup = (props) => {
  const fn = { onNavigate: vi.fn(), onLogout: vi.fn(), onToggleTheme: vi.fn() }
  render(<StickyNavbar theme="light" {...fn} {...props} />)
  return fn
}

describe('StickyNavbar', () => {
  it('tamu: login, register, brand, tema', async () => {
    const f = setup({ user: null }), u = userEvent.setup()
    await u.click(screen.getByText('Login')); expect(f.onNavigate).toHaveBeenCalledWith('/login')
    await u.click(screen.getByText('Register')); expect(f.onNavigate).toHaveBeenCalledWith('/register')
    await u.click(screen.getByText('Delcom Blog')); expect(f.onNavigate).toHaveBeenCalledWith('/')
    await u.click(screen.getByLabelText('Ganti tema')); expect(f.onToggleTheme).toHaveBeenCalled()
  })
  it('penulis: workspace & keluar', async () => {
    const f = setup({ user: { role: 'member' } }), u = userEvent.setup()
    await u.click(screen.getByText('Workspace')); expect(f.onNavigate).toHaveBeenCalledWith('/author')
    await u.click(screen.getByText('Keluar')); expect(f.onLogout).toHaveBeenCalled()
  })
  it('admin & tema gelap', async () => {
    const f = setup({ user: { role: 'admin' }, theme: 'dark' }), u = userEvent.setup()
    await u.click(screen.getByText('Admin')); expect(f.onNavigate).toHaveBeenCalledWith('/admin')
  })
})
