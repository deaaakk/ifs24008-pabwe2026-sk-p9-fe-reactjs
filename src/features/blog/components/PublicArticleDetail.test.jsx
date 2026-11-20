import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PublicArticleDetail from './PublicArticleDetail'
import { getPublicPost } from '../api/blogApi'
import { alertError } from '../../../helpers/toolsHelper'

vi.mock('../api/blogApi', () => ({ getPublicPost: vi.fn() }))
vi.mock('../../../helpers/toolsHelper', () => ({ alertError: vi.fn(), formatDate: () => 'tgl' }))
vi.mock('../../../components/MarkdownViewer', () => ({ default: ({ content }) => <div>{content}</div> }))
const post = { title: 'Judul', category: 'Umum', content: 'ISI-ARTIKEL', reading_time: 3, published_at: 'x', author: { username: 'budi' }, cover_image_path: '' }
beforeEach(() => vi.clearAllMocks())

describe('PublicArticleDetail', () => {
  it('menampilkan artikel tanpa & dengan sampul, serta tautan kembali', async () => {
    getPublicPost.mockResolvedValueOnce({ data: post })
    const onNavigate = vi.fn()
    const { unmount } = render(<PublicArticleDetail slug="a" onNavigate={onNavigate} />)
    expect(screen.getByText('Memuat...')).toBeInTheDocument()
    expect(await screen.findByText('ISI-ARTIKEL')).toBeInTheDocument()
    expect(screen.queryByRole('img')).toBeNull()
    await userEvent.setup().click(screen.getByText('← Semua artikel'))
    expect(onNavigate).toHaveBeenCalledWith('/')
    unmount()
    getPublicPost.mockResolvedValueOnce({ data: { ...post, cover_image_path: 'http://x/c.png' } })
    render(<PublicArticleDetail slug="b" onNavigate={onNavigate} />)
    expect(await screen.findByRole('img')).toBeInTheDocument()
  })
  it('artikel tidak ditemukan', async () => {
    getPublicPost.mockRejectedValueOnce(new Error('Artikel tidak ditemukan'))
    render(<PublicArticleDetail slug="x" onNavigate={() => {}} />)
    expect(await screen.findByText('Artikel tidak ditemukan.')).toBeInTheDocument()
    await waitFor(() => expect(alertError).toHaveBeenCalled())
  })
})
