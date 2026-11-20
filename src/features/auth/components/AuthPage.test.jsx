import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AuthPage from './AuthPage'
import { login, register } from '../api/authApi'
import { alertError, alertSuccess } from '../../../helpers/toolsHelper'

vi.mock('../api/authApi', () => ({ login: vi.fn(), register: vi.fn() }))
vi.mock('../../../helpers/toolsHelper', () => ({ alertError: vi.fn(), alertSuccess: vi.fn() }))
beforeEach(() => vi.clearAllMocks())

describe('AuthPage', () => {
  it('login sukses, gagal, dan tautan daftar', async () => {
    const onSuccess = vi.fn(), onNavigate = vi.fn(), u = userEvent.setup()
    login.mockResolvedValueOnce({ data: { token: 't' } })
    render(<AuthPage onNavigate={onNavigate} onSuccess={onSuccess} />)
    await u.type(document.getElementById('login-username'), 'budi')
    await u.type(document.getElementById('login-password'), 'rahasia')
    await u.click(document.getElementById('login-submit'))
    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith({ token: 't' }))
    login.mockRejectedValueOnce(new Error('salah'))
    await u.click(document.getElementById('login-submit'))
    await waitFor(() => expect(alertError).toHaveBeenCalledWith('salah'))
    await u.click(screen.getByText('Belum punya akun? Daftar'))
    expect(onNavigate).toHaveBeenCalledWith('/register')
  })
  it('register sukses, gagal, dan tautan masuk', async () => {
    const onNavigate = vi.fn(), u = userEvent.setup()
    register.mockResolvedValueOnce({})
    render(<AuthPage mode="register" onNavigate={onNavigate} onSuccess={vi.fn()} />)
    await u.type(document.getElementById('register-username'), 'budi')
    await u.type(document.getElementById('register-email'), 'b@x.id')
    await u.type(document.getElementById('register-password'), 'rahasia')
    await u.click(document.getElementById('register-submit'))
    await waitFor(() => expect(onNavigate).toHaveBeenCalledWith('/login'))
    expect(alertSuccess).toHaveBeenCalled()
    register.mockRejectedValueOnce(new Error('dup'))
    await u.click(document.getElementById('register-submit'))
    await waitFor(() => expect(alertError).toHaveBeenCalledWith('dup'))
    await u.click(screen.getByText('Sudah punya akun? Masuk'))
    expect(onNavigate).toHaveBeenCalledWith('/login')
  })
})
