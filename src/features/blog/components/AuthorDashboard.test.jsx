import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AuthorDashboard from './AuthorDashboard'
import * as api from '../api/blogApi'
import { alertError, alertSuccess, confirmDialog } from '../../../helpers/toolsHelper'

vi.mock('../api/blogApi', () => ({ getStats: vi.fn(), getMyPosts: vi.fn(), getCategories: vi.fn(), togglePublish: vi.fn(), deletePost: vi.fn() }))
vi.mock('../../../helpers/toolsHelper', () => ({ alertError: vi.fn(), alertSuccess: vi.fn(), confirmDialog: vi.fn(), formatDate: () => 'tgl' }))
vi.mock('../modals/PostModal', () => ({
  default: ({ post, onClose, onSaved }) => (<div><span>pm-{post.title || 'baru'}</span><button onClick={onClose}>pm-close</button><button onClick={onSaved}>pm-saved</button></div>),
}))
vi.mock('../modals/AiPostGeneratorModal', () => ({
  default: ({ onClose, onGenerated }) => (<div><span>ai-open</span><button onClick={onClose}>ai-close</button><button onClick={() => onGenerated({ title: 'Draf AI' })}>ai-gen</button></div>),
}))
const posts = [
  { id: 1, title: 'Satu', category: 'Umum', is_published: true, published_at: 'x' },
  { id: 2, title: 'Dua', category: 'Opini', is_published: false, published_at: null },
]
beforeEach(() => {
  vi.clearAllMocks()
  api.getStats.mockResolvedValue({ data: { total: 2, published: 1, draft: 1 } })
  api.getMyPosts.mockResolvedValue({ data: posts })
  api.getCategories.mockResolvedValue({ data: ['Umum'] })
})

describe('AuthorDashboard', () => {
  it('menampilkan data & toggle status (sukses dan gagal)', async () => {
    const u = userEvent.setup()
    render(<AuthorDashboard dark />)
    expect(await screen.findByText('Satu')).toBeInTheDocument()
    api.togglePublish.mockResolvedValueOnce({})
    await u.click(screen.getByLabelText('Status Dua'))
    await waitFor(() => expect(api.getMyPosts).toHaveBeenCalledTimes(2))
    api.togglePublish.mockRejectedValueOnce(new Error('toggle gagal'))
    await u.click(screen.getByLabelText('Status Satu'))
    await waitFor(() => expect(alertError).toHaveBeenCalledWith('toggle gagal'))
  })
  it('menu kebab: edit, hapus (batal, sukses, gagal)', async () => {
    const u = userEvent.setup()
    render(<AuthorDashboard />)
    await screen.findByText('Satu')
    await u.click(screen.getByLabelText('Menu Satu')); await u.click(screen.getByLabelText('Menu Satu'))
    expect(screen.queryByText('Edit')).toBeNull()
    await u.click(screen.getByLabelText('Menu Satu')); await u.click(screen.getByText('Edit'))
    expect(screen.getByText('pm-Satu')).toBeInTheDocument()
    await u.click(screen.getByText('pm-saved')); expect(screen.queryByText('pm-Satu')).toBeNull()
    confirmDialog.mockResolvedValueOnce(false)
    await u.click(screen.getByLabelText('Menu Satu')); await u.click(screen.getByText('Hapus'))
    expect(api.deletePost).not.toHaveBeenCalled()
    confirmDialog.mockResolvedValueOnce(true); api.deletePost.mockResolvedValueOnce({})
    await u.click(screen.getByLabelText('Menu Satu')); await u.click(screen.getByText('Hapus'))
    await waitFor(() => expect(alertSuccess).toHaveBeenCalledWith('Artikel dihapus'))
    confirmDialog.mockResolvedValueOnce(true); api.deletePost.mockRejectedValueOnce(new Error('hapus gagal'))
    await u.click(screen.getByLabelText('Menu Satu')); await u.click(screen.getByText('Hapus'))
    await waitFor(() => expect(alertError).toHaveBeenCalledWith('hapus gagal'))
  })
  it('tambah artikel, AI generator, dan tutup modal', async () => {
    const u = userEvent.setup()
    render(<AuthorDashboard />)
    await screen.findByText('Satu')
    await u.click(screen.getByText('Tambah Artikel')); expect(screen.getByText('pm-baru')).toBeInTheDocument()
    await u.click(screen.getByText('pm-close')); expect(screen.queryByText('pm-baru')).toBeNull()
    await u.click(screen.getByText('AI Generator')); await u.click(screen.getByText('ai-close'))
    expect(screen.queryByText('ai-open')).toBeNull()
    await u.click(screen.getByText('AI Generator')); await u.click(screen.getByText('ai-gen'))
    expect(screen.getByText('pm-Draf AI')).toBeInTheDocument()
  })
  it('data kosong & gagal memuat', async () => {
    api.getMyPosts.mockResolvedValueOnce({ data: [] })
    const { unmount } = render(<AuthorDashboard />)
    expect(await screen.findByText('Belum ada artikel.')).toBeInTheDocument()
    unmount()
    api.getStats.mockRejectedValueOnce(new Error('muat gagal'))
    render(<AuthorDashboard />)
    await waitFor(() => expect(alertError).toHaveBeenCalledWith('muat gagal'))
  })
})
