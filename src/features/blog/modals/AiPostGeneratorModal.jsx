import { useState } from 'react'
import useInput from '../../../hooks/useInput'
import { aiGenerate } from '../api/blogApi'
import { alertError } from '../../../helpers/toolsHelper'

const field = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800'

export default function AiPostGeneratorModal({ categories = [], onClose, onGenerated }) {
  const { values, onChange } = useInput({ topic: '', category: 'Umum' })
  const [search, setSearch] = useState(true)
  const [loading, setLoading] = useState(false)
  const [draft, setDraft] = useState(null)

  const generate = async () => {
    setLoading(true)
    try {
      const r = await aiGenerate({ topic: values.topic, category: values.category, include_web_search: search })
      setDraft(r.data)
    } catch (e) {
      alertError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2">
      <div className="flex h-[96vh] w-full max-w-[96vw] flex-col overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-900">
        <header className="bg-violet-700 px-6 py-4 text-lg font-bold text-white">AI Blog Generator</header>
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          <label className="block text-sm">Topik
            <input name="topic" value={values.topic} onChange={onChange} className={field} />
          </label>
          <label className="block text-sm">Kategori
            <select name="category" value={values.category} onChange={onChange} className={field}>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={search} onChange={(e) => setSearch(e.target.checked)} />
            Sertakan penelusuran Search Engine
          </label>
          {draft && (
            <section className="rounded-xl bg-white p-4 shadow dark:bg-slate-800">
              <h2 className="text-xl font-bold">{draft.title}</h2>
              <p className="mb-3 text-sm text-slate-500">{draft.excerpt}</p>
              <h3 className="text-sm font-semibold">Sumber Rujukan</h3>
              <ul className="list-disc pl-5 text-sm">
                {(draft.sources || []).map((s) => (
                  <li key={s.url}><a href={s.url} target="_blank" rel="noreferrer" className="underline">{s.title}</a></li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <footer className="flex justify-end gap-3 bg-slate-200 px-6 py-4 dark:bg-slate-800">
          <button onClick={onClose} className="rounded-lg border border-slate-400 px-4 py-2">Batal</button>
          {draft && <button onClick={() => onGenerated(draft)} className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white">Tinjau di Editor</button>}
          <button onClick={generate} disabled={loading} className="rounded-lg bg-violet-700 px-5 py-2 font-semibold text-white disabled:opacity-60">{loading ? 'Menghasilkan...' : 'Generate'}</button>
        </footer>
      </div>
    </div>
  )
}
