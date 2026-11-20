import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminDashboard from './AdminDashboard'
import * as api from '../api/adminApi'
import { alertError } from '../../../helpers/toolsHelper'

vi.mock('../api/adminApi', () => ({ getUsers: vi.fn(), getAllPosts: vi.fn(), getUserPosts: vi.fn() }))
vi.mock('../../../helpers/toolsHelper', () => ({ alertError: vi.fn(), formatDate: () => 'tgl' }))
const users = [{ id: 2, username: 'budi', email: 'b@x.id', role: 'member', total_posts: 3, total_published: 1 }, { id: 1, username: 'admin', email: 'a@x.id', role: 'admin', total_posts: 0, total_published: 0 }]
const post = (id, title, pub) => ({ id, title, category: 'Umum', is_published: pub, published_at: 'x', author: { username: 'budi' } })
beforeEach(() => {
  vi.clearAllMocks()
  api.getUsers.mockResolvedValue({ data: users })
  api.getAllPosts.mockResolvedValue({ data: [post(1, 'Satu', true), post(2, 'Dua', false)] })
})

describe('AdminDashboard', () => {
  it('statistik, direktori, filter per pengguna, dan tampilkan semua', async () => {
    const u = userEvent.setup()
    render(<AdminDashboard />)
    expect(await screen.findByText('Satu')).toBeInTheDocument()
    expect(screen.getByText('Total Pengguna').nextSibling).toHaveTextContent('2')
    expect(screen.getByText('Total Artikel').nextSibling).toHaveTextContent('3')
    expect(screen.getByText('Arsip Seluruh Artikel')).toBeInTheDocument()
    api.getUserPosts.mockResolvedValueOnce({ data: [post(3, 'Milik Budi', true)] })
    await u.click(screen.getByLabelText('Artikel budi'))
    expect(await screen.findByText('Artikel oleh budi')).toBeInTheDocument()
    expect(screen.getByText('Milik Budi')).toBeInTheDocument()
    await u.click(screen.getByText('Tampilkan semua'))
    expect(await screen.findByText('Satu')).toBeInTheDocument()
    expect(screen.queryByText('Artikel oleh budi')).toBeNull()
  })
  it('data kosong dan error API', async () => {
    api.getAllPosts.mockResolvedValueOnce({ data: [] })
    const { unmount } = render(<AdminDashboard />)
    expect(await screen.findByText('Belum ada artikel.')).toBeInTheDocument()
    api.getUserPosts.mockRejectedValueOnce(new Error('filter gagal'))
    await userEvent.setup().click(screen.getByLabelText('Artikel budi'))
    await waitFor(() => expect(alertError).toHaveBeenCalledWith('filter gagal'))
    api.getAllPosts.mockRejectedValueOnce(new Error('semua gagal'))
    unmount()
    render(<AdminDashboard />)
    await waitFor(() => expect(alertError).toHaveBeenCalledWith('semua gagal'))
  })
  it('gagal memuat semua artikel setelah filter', async () => {
    const u = userEvent.setup()
    render(<AdminDashboard />)
    api.getUserPosts.mockResolvedValueOnce({ data: [] })
    await u.click(await screen.findByLabelText('Artikel budi'))
    api.getAllPosts.mockRejectedValueOnce(new Error('reset gagal'))
    await u.click(await screen.findByText('Tampilkan semua'))
    await waitFor(() => expect(alertError).toHaveBeenCalledWith('reset gagal'))
  })
})
