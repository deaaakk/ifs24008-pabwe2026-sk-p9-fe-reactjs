import { useEffect, useRef } from 'react'
import { Editor } from '@toast-ui/editor'
import '@toast-ui/editor/dist/toastui-editor.css'
import '@toast-ui/editor/dist/theme/toastui-editor-dark.css'

export default function MarkdownEditor({ value = '', onChange, dark = false }) {
  const el = useRef(null)
  const latest = useRef({ value, onChange })
  latest.current = { value, onChange }
  useEffect(() => {
    const editor = new Editor({
      el: el.current,
      height: '420px',
      initialEditType: 'wysiwyg',
      previewStyle: 'vertical',
      initialValue: latest.current.value,
      theme: dark ? 'dark' : 'light',
    })
    editor.on('change', () => latest.current.onChange(editor.getMarkdown()))
    return () => editor.destroy()
  }, [dark])
  return <div ref={el} data-testid="md-editor" />
}
