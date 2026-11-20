import { useEffect, useState } from 'react'
import { getAllPosts, getUserPosts, getUsers } from '../api/adminApi'
import { alertError, formatDate } from '../../../helpers/toolsHelper'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [posts, setPosts] = useState([])
  const [filterUser, setFilterUser] = useState(null)

  useEffect(() => {
    Promise.all([getUsers(), getAllPosts()])
      .then(([u, p]) => { setUsers(u.data); setPosts(p.data) })
      .catch((e) => alertError(e.message))
  }, [])

  const showUser = (u) =>
    getUserPosts(u.id).then((r) => { setPosts(r.data); setFilterUser(u) }).catch((e) => alertError(e.message))
  const showAll = () =>
    getAllPosts().then((r) => { setPosts(r.data); setFilterUser(null) }).catch((e) => alertError(e.message))

  const sum = (key) => users.reduce((n, u) => n + u[key], 0)
  const cards = [['Total Pengguna', users.length], ['Total Artikel', sum('total_posts')], ['Total Terbit', sum('total_published')]]
  const th = 'p-3'

  return (
    <main className="w-full px-4 py-8 sm:px-8">
      <h1 className="mb-6 text-3xl font-bold">Panel Admin</h1>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {cards.map(([label, n]) => (
          <div key={label} className="rounded-2xl bg-white p-5 shadow dark:bg-slate-800">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>{n}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-2 text-xl font-bold">Direktori Pengguna</h2>
      <div className="mb-8 overflow-x-auto rounded-2xl bg-white shadow dark:bg-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 dark:bg-slate-700">
            <tr><th className={th}>ID</th><th className={th}>Username</th><th className={th}>Email</th><th className={th}>Role</th><th className={th}>Artikel</th><th className={th}>Terbit</th><th className={th}>Aksi</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-slate-200 dark:border-slate-700">
                <td className="p-3">{u.id}</td><td className="p-3 font-medium">{u.username}</td><td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td><td className="p-3">{u.total_posts}</td><td className="p-3">{u.total_published}</td>
                <td className="p-3"><button aria-label={`Artikel ${u.username}`} onClick={() => showUser(u)} className="underline">Lihat artikel</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xl font-bold">{filterUser ? `Artikel oleh ${filterUser.username}` : 'Arsip Seluruh Artikel'}</h2>
        {filterUser && <button onClick={showAll} className="text-sm underline">Tampilkan semua</button>}
      </div>
      <div className="overflow-x-auto rounded-2xl bg-white shadow dark:bg-slate-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 dark:bg-slate-700">
            <tr><th className={th}>Judul</th><th className={th}>Penulis</th><th className={th}>Kategori</th><th className={th}>Status</th><th className={th}>Terbit</th></tr>
          </thead>
          <tbody>
            {posts.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-slate-500">Belum ada artikel.</td></tr>}
            {posts.map((p) => (
              <tr key={p.id} className="border-t border-slate-200 dark:border-slate-700">
                <td className="p-3 font-medium">{p.title}</td><td className="p-3">{p.author.username}</td><td className="p-3">{p.category}</td>
                <td className="p-3">{p.is_published ? 'Terbit' : 'Draf'}</td><td className="p-3">{formatDate(p.published_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
