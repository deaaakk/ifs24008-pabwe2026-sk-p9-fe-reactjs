import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PublicArticleList from './PublicArticleList'
import { getCategories, getPublicPosts } from '../api/blogApi'
import { alertError } from '../../../helpers/toolsHelper'

vi.mock('../api/blogApi', () => ({ getCategories: vi.fn(), getPublicPosts: vi.fn() }))
vi.mock('../../../helpers/toolsHelper', () => ({ alertError: vi.fn(), formatDate: () => 'tgl' }))
const post = { id: 1, slug: 's1', title: 'Judul Satu', category: 'Opini', excerpt: 'ringkas', reading_time: 2, published_at: 'x', author: { username: 'budi' } }
beforeEach(() => vi.clearAllMocks())

describe('PublicArticleList', () => {
  it('memuat artikel, mencari, memfilter, dan membuka detail', async () => {
    getCategories.mockResolvedValue({ data: ['Opini', 'Bisnis'] })
    getPublicPosts.mockResolvedValue({ data: [post] })
    const onNavigate = vi.fn(), u = userEvent.setup()
    render(<PublicArticleList onNavigate={onNavigate} />)
    expect(await screen.findByText('Judul Satu')).toBeInTheDocument()
    await u.click(await screen.findByText('Opini', { selector: 'button' }))
    await waitFor(() => expect(getPublicPosts).toHaveBeenLastCalledWith('', 'Opini'))
    await u.type(screen.getByLabelText('Cari artikel'), 'x')
    await waitFor(() => expect(getPublicPosts).toHaveBeenLastCalledWith('x', 'Opini'))
    await u.click(screen.getByText('Semua'))
    await waitFor(() => expect(getPublicPosts).toHaveBeenLastCalledWith('x', ''))
    await u.click(screen.getByText('Judul Satu'))
    expect(onNavigate).toHaveBeenCalledWith('/posts/s1')
  })
  it('data kosong/null dan error API', async () => {
    getCategories.mockRejectedValue(new Error('kategori gagal'))
    getPublicPosts.mockResolvedValue({ data: null })
    render(<PublicArticleList onNavigate={() => {}} />)
    expect(await screen.findByText('Belum ada artikel.')).toBeInTheDocument()
    await waitFor(() => expect(alertError).toHaveBeenCalledWith('kategori gagal'))
    getPublicPosts.mockRejectedValue(new Error('artikel gagal'))
    await userEvent.setup().type(screen.getByLabelText('Cari artikel'), 'a')
    await waitFor(() => expect(alertError).toHaveBeenCalledWith('artikel gagal'))
  })
})
