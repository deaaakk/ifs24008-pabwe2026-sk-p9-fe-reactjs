import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import MarkdownEditor from './MarkdownEditor'
import MarkdownViewer from './MarkdownViewer'

const h = vi.hoisted(() => ({ destroy: vi.fn(), opts: null, vopts: null, handlers: {} }))
vi.mock('@toast-ui/editor', () => ({
  Editor: class { constructor(o) { h.opts = o } on(e, f) { h.handlers[e] = f } getMarkdown() { return 'md' } destroy() { h.destroy() } },
}))
vi.mock('@toast-ui/editor/dist/toastui-editor-viewer', () => ({
  default: class { constructor(o) { h.vopts = o } destroy() { h.destroy() } },
}))

describe('Markdown components', () => {
  it('editor: terang, gelap, change, destroy', () => {
    const onChange = vi.fn()
    const { rerender, unmount } = render(<MarkdownEditor value="a" onChange={onChange} />)
    expect(h.opts.theme).toBe('light'); expect(h.opts.initialValue).toBe('a')
    h.handlers.change(); expect(onChange).toHaveBeenCalledWith('md')
    rerender(<MarkdownEditor value="a" onChange={onChange} dark />)
    expect(h.opts.theme).toBe('dark')
    unmount(); expect(h.destroy).toHaveBeenCalled()
  })
  it('editor: nilai default', () => {
    render(<MarkdownEditor onChange={() => {}} />); expect(h.opts.initialValue).toBe('')
  })
  it('viewer: render & destroy', () => {
    const { unmount } = render(<MarkdownViewer content="# Hai" />)
    expect(h.vopts.initialValue).toBe('# Hai')
    unmount()
    render(<MarkdownViewer />); expect(h.vopts.initialValue).toBe('')
  })
})
