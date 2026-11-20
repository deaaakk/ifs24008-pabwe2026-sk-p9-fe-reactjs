import { useState } from 'react'
import useInput from '../../../hooks/useInput'
import MarkdownEditor from '../../../components/MarkdownEditor'
import { createPost, updatePost } from '../api/blogApi'
import { alertError, alertSuccess } from '../../../helpers/toolsHelper'

const BLANK = { title: '', category: 'Umum', excerpt: '', content: '', cover_image_path: '', is_published: false }
const field = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800'

export default function PostModal({ post = {}, categories = [], dark = false, onClose, onSaved }) {
  const { values, setValues, onChange } = useInput({ ...BLANK, ...post })
  const [saving, setSaving] = useState(false)

  const save = async () => {
    const { title, category, excerpt, content, cover_image_path, is_published } = values
    const body = { title, category, excerpt, content, cover_image_path, is_published }
    setSaving(true)
    try {
      if (post.id) await updatePost(post.id, body)
      else await createPost(body)
      alertSuccess('Artikel berhasil disimpan')
      onSaved()
    } catch (e) {
      alertError(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2">
      <div className="flex h-[96vh] w-full max-w-[96vw] flex-col overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-900">
        <header className="bg-blue-700 px-6 py-4 text-lg font-bold text-white">{post.id ? 'Ubah Artikel' : 'Artikel Baru'}</header>
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          <label className="block text-sm">Judul
            <input name="title" value={values.title} onChange={onChange} className={field} />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">Kategori
              <select name="category" value={values.category} onChange={onChange} className={field}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="block text-sm">Path Gambar Sampul
              <input name="cover_image_path" value={values.cover_image_path} onChange={onChange} className={field} />
            </label>
          </div>
          <label className="block text-sm">Ringkasan
            <textarea name="excerpt" rows={2} value={values.excerpt} onChange={onChange} className={field} />
          </label>
          <MarkdownEditor value={values.content} dark={dark} onChange={(md) => setValues((v) => ({ ...v, content: md }))} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={values.is_published} onChange={(e) => setValues((v) => ({ ...v, is_published: e.target.checked }))} />
            Terbitkan sekarang
          </label>
        </div>
        <footer className="flex justify-end gap-3 bg-slate-200 px-6 py-4 dark:bg-slate-800">
          <button onClick={onClose} className="rounded-lg border border-slate-400 px-4 py-2">Batal</button>
          <button onClick={save} disabled={saving} className="rounded-lg px-5 py-2 font-semibold text-white disabled:opacity-60" style={{ background: 'var(--accent)' }}>Simpan</button>
        </footer>
      </div>
    </div>
  )
}
