import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PostModal from './PostModal'
import { createPost, updatePost } from '../api/blogApi'
import { alertError, alertSuccess } from '../../../helpers/toolsHelper'

vi.mock('../api/blogApi', () => ({ createPost: vi.fn(), updatePost: vi.fn() }))
vi.mock('../../../helpers/toolsHelper', () => ({ alertError: vi.fn(), alertSuccess: vi.fn() }))
vi.mock('../../../components/MarkdownEditor', () => ({
  default: ({ value, onChange }) => <textarea data-testid="ed" value={value} onChange={(e) => onChange(e.target.value)} />,
}))
beforeEach(() => vi.clearAllMocks())

describe('PostModal', () => {
  it('membuat artikel baru', async () => {
    createPost.mockResolvedValueOnce({})
    const onSaved = vi.fn(), u = userEvent.setup()
    render(<PostModal categories={['Umum', 'Opini']} onClose={() => {}} onSaved={onSaved} />)
    expect(screen.getByText('Artikel Baru')).toBeInTheDocument()
    await u.type(screen.getByLabelText('Judul'), 'Halo')
    await u.selectOptions(screen.getByLabelText('Kategori'), 'Opini')
    await u.type(screen.getByLabelText('Ringkasan'), 'ring')
    await u.type(screen.getByLabelText('Path Gambar Sampul'), '/c.png')
    fireEvent.change(screen.getByTestId('ed'), { target: { value: 'isi' } })
    await u.click(screen.getByLabelText('Terbitkan sekarang'))
    await u.click(screen.getByText('Simpan'))
    await waitFor(() => expect(onSaved).toHaveBeenCalled())
    expect(createPost).toHaveBeenCalledWith({ title: 'Halo', category: 'Opini', excerpt: 'ring', content: 'isi', cover_image_path: '/c.png', is_published: true })
    expect(alertSuccess).toHaveBeenCalled()
  })
  it('mengubah artikel, gagal simpan, dan batal', async () => {
    updatePost.mockRejectedValueOnce(new Error('gagal'))
    const onClose = vi.fn(), u = userEvent.setup()
    render(<PostModal post={{ id: 7, title: 'Lama', content: 'x' }} dark onClose={onClose} onSaved={() => {}} />)
    expect(screen.getByText('Ubah Artikel')).toBeInTheDocument()
    await u.click(screen.getByText('Simpan'))
    await waitFor(() => expect(alertError).toHaveBeenCalledWith('gagal'))
    expect(updatePost).toHaveBeenCalledWith(7, expect.objectContaining({ title: 'Lama' }))
    await u.click(screen.getByText('Batal')); expect(onClose).toHaveBeenCalled()
  })
})
