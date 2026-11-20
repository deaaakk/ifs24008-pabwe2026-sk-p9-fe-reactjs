import { useEffect, useState } from 'react'
import { IconClock, IconSearch } from '@tabler/icons-react'
import { getCategories, getPublicPosts } from '../api/blogApi'
import { alertError, formatDate } from '../../../helpers/toolsHelper'

export default function PublicArticleList({ onNavigate }) {
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [posts, setPosts] = useState([])

  useEffect(() => {
    getCategories().then((r) => setCategories(r.data)).catch((e) => alertError(e.message))
  }, [])
  useEffect(() => {
    getPublicPosts(q, category).then((r) => setPosts(r.data ?? [])).catch((e) => alertError(e.message))
  }, [q, category])

  const pill = (active) =>
    `rounded-full px-4 py-1.5 text-sm font-medium border ${active ? 'text-white border-transparent' : 'border-slate-300 dark:border-slate-600'}`

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold">Artikel Terbaru</h1>
      <div className="relative mb-4">
        <IconSearch size={18} className="absolute left-3 top-3 text-slate-400" />
        <input
          aria-label="Cari artikel" placeholder="Cari kata kunci..." value={q} onChange={(e) => setQ(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-10 pr-3 dark:border-slate-600 dark:bg-slate-800"
        />
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        {['Semua', ...categories].map((c) => {
          const value = c === 'Semua' ? '' : c
          const active = category === value
          return (
            <button key={c} onClick={() => setCategory(value)} className={pill(active)} style={active ? { background: 'var(--accent)' } : undefined}>{c}</button>
          )
        })}
      </div>
      {posts.length === 0 ? (
        <p className="py-10 text-center text-slate-500">Belum ada artikel.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <article key={p.id} className="flex flex-col rounded-2xl bg-white p-5 shadow dark:bg-slate-800">
              <span className="mb-2 text-xs font-semibold uppercase" style={{ color: 'var(--accent)' }}>{p.category}</span>
              <h2 className="mb-2 text-lg font-bold">
                <a href={`/posts/${p.slug}`} onClick={(e) => { e.preventDefault(); onNavigate(`/posts/${p.slug}`) }}>{p.title}</a>
              </h2>
              <p className="mb-4 flex-1 text-sm text-slate-600 dark:text-slate-300">{p.excerpt}</p>
              <footer className="flex items-center justify-between text-xs text-slate-500">
                <span>{p.author.username} · {formatDate(p.published_at)}</span>
                <span className="flex items-center gap-1"><IconClock size={14} />{p.reading_time} mnt</span>
              </footer>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
