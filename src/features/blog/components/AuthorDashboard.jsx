import { useCallback, useEffect, useState } from 'react'
import { IconDotsVertical, IconPlus, IconSparkles } from '@tabler/icons-react'
import { deletePost, getCategories, getMyPosts, getStats, togglePublish } from '../api/blogApi'
import { alertError, alertSuccess, confirmDialog, formatDate } from '../../../helpers/toolsHelper'
import PostStats from './PostStats'
import PostModal from '../modals/PostModal'
import AiPostGeneratorModal from '../modals/AiPostGeneratorModal'

export default function AuthorDashboard({ dark = false }) {
  const [stats, setStats] = useState(undefined)
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [menuId, setMenuId] = useState(null)
  const [postModal, setPostModal] = useState(null)
  const [aiOpen, setAiOpen] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const [s, p, c] = await Promise.all([getStats(), getMyPosts(), getCategories()])
      setStats(s.data); setPosts(p.data); setCategories(c.data)
    } catch (e) { alertError(e.message) }
  }, [])
  useEffect(() => { refresh() }, [refresh])

  const toggle = async (id) => {
    try { await togglePublish(id); await refresh() } catch (e) { alertError(e.message) }
  }
  const remove = async (id) => {
    setMenuId(null)
    if (!(await confirmDialog('Hapus artikel ini?'))) return
    try { await deletePost(id); alertSuccess('Artikel dihapus'); await refresh() } catch (e) { alertError(e.message) }
  }
  const edit = (p) => { setMenuId(null); setPostModal(p) }
  const saved = () => { setPostModal(null); refresh() }
  const generated = (draft) => { setAiOpen(false); setPostModal(draft) }

  return (
    <main className="w-full px-4 py-8 sm:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Workspace Penulis</h1>
        <div className="flex gap-2">
          <button onClick={() => setAiOpen(true)} className="flex items-center gap-1 rounded-lg bg-violet-700 px-4 py-2 font-semibold text-white"><IconSparkles size={18} />AI Generator</button>
          <button onClick={() => setPostModal({})} className="flex items-center gap-1 rounded-lg px-4 py-2 font-semibold text-white" style={{ background: 'var(--accent)' }}><IconPlus size={18} />Tambah Artikel</button>
        </div>
      </div>
      <PostStats stats={stats} />
      <div className="overflow-x-auto rounded-2xl bg-white shadow dark:bg-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 dark:bg-slate-700">
            <tr><th className="p-3">Judul</th><th className="p-3">Kategori</th><th className="p-3">Status</th><th className="p-3">Terbit</th><th className="p-3">Aksi</th></tr>
          </thead>
          <tbody>
            {posts.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-slate-500">Belum ada artikel.</td></tr>}
            {posts.map((p) => (
              <tr key={p.id} className="border-t border-slate-200 dark:border-slate-700">
                <td className="p-3 font-medium">{p.title}</td>
                <td className="p-3">{p.category}</td>
                <td className="p-3">
                  <button role="switch" aria-checked={p.is_published} aria-label={`Status ${p.title}`} onClick={() => toggle(p.id)} className="rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ background: p.is_published ? '#059669' : '#64748b' }}>
                    {p.is_published ? 'Terbit' : 'Draf'}
                  </button>
                </td>
                <td className="p-3">{formatDate(p.published_at)}</td>
                <td className="relative p-3">
                  <button aria-label={`Menu ${p.title}`} onClick={() => setMenuId(menuId === p.id ? null : p.id)}><IconDotsVertical size={18} /></button>
                  {menuId === p.id && (
                    <div className="absolute right-3 z-10 w-28 rounded-lg border bg-white shadow dark:bg-slate-800">
                      <button className="block w-full px-3 py-2 text-left hover:bg-slate-100 dark:hover:bg-slate-700" onClick={() => edit(p)}>Edit</button>
                      <button className="block w-full px-3 py-2 text-left text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700" onClick={() => remove(p.id)}>Hapus</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {postModal && <PostModal post={postModal} categories={categories} dark={dark} onClose={() => setPostModal(null)} onSaved={saved} />}
      {aiOpen && <AiPostGeneratorModal categories={categories} onClose={() => setAiOpen(false)} onGenerated={generated} />}
    </main>
  )
}
