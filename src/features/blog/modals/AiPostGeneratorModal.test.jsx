import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AiPostGeneratorModal from './AiPostGeneratorModal'
import { aiGenerate } from '../api/blogApi'
import { alertError } from '../../../helpers/toolsHelper'

vi.mock('../api/blogApi', () => ({ aiGenerate: vi.fn() }))
vi.mock('../../../helpers/toolsHelper', () => ({ alertError: vi.fn() }))
beforeEach(() => vi.clearAllMocks())

describe('AiPostGeneratorModal', () => {
  it('generate dengan sumber, tinjau, dan tanpa sumber', async () => {
    const onGenerated = vi.fn(), u = userEvent.setup()
    const draft = { title: 'Judul AI', excerpt: 'e', sources: [{ title: 'Sumber 1', url: 'http://a' }] }
    aiGenerate.mockResolvedValueOnce({ data: draft })
    render(<AiPostGeneratorModal categories={['Umum', 'Bisnis']} onClose={() => {}} onGenerated={onGenerated} />)
    await u.type(screen.getByLabelText('Topik'), 'ai')
    await u.click(screen.getByText('Generate'))
    expect(await screen.findByText('Sumber 1')).toBeInTheDocument()
    expect(aiGenerate).toHaveBeenCalledWith({ topic: 'ai', category: 'Umum', include_web_search: true })
    await u.click(screen.getByText('Tinjau di Editor')); expect(onGenerated).toHaveBeenCalledWith(draft)
    aiGenerate.mockResolvedValueOnce({ data: { title: 'T2', excerpt: 'e', sources: null } })
    await u.selectOptions(screen.getByLabelText('Kategori'), 'Bisnis')
    await u.click(screen.getByLabelText('Sertakan penelusuran Search Engine'))
    await u.click(screen.getByText('Generate'))
    expect(await screen.findByText('T2')).toBeInTheDocument()
    expect(aiGenerate).toHaveBeenLastCalledWith({ topic: 'ai', category: 'Bisnis', include_web_search: false })
  })
  it('error dan batal', async () => {
    aiGenerate.mockRejectedValueOnce(new Error('ai gagal'))
    const onClose = vi.fn(), u = userEvent.setup()
    render(<AiPostGeneratorModal onClose={onClose} onGenerated={() => {}} />)
    await u.click(screen.getByText('Generate'))
    await waitFor(() => expect(alertError).toHaveBeenCalledWith('ai gagal'))
    await u.click(screen.getByText('Batal')); expect(onClose).toHaveBeenCalled()
  })
})
