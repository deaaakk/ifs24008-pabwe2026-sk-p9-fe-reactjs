import { useEffect, useState } from 'react'
import { getPublicPost } from '../api/blogApi'
import { alertError, formatDate } from '../../../helpers/toolsHelper'
import MarkdownViewer from '../../../components/MarkdownViewer'

export default function PublicArticleDetail({ slug, onNavigate }) {
  const [post, setPost] = useState(null)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    setPost(null)
    setMissing(false)
    getPublicPost(slug).then((r) => setPost(r.data)).catch((e) => { setMissing(true); alertError(e.message) })
  }, [slug])

  const back = (
    <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('/') }} className="mb-4 inline-block text-sm underline">← Semua artikel</a>
  )
  if (missing) return <main className="mx-auto max-w-4xl px-4 py-8">{back}<p>Artikel tidak ditemukan.</p></main>
  if (!post) return <main className="mx-auto max-w-4xl px-4 py-8"><p>Memuat...</p></main>
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8">
      {back}
      <article>
        <span className="text-xs font-semibold uppercase" style={{ color: 'var(--accent)' }}>{post.category}</span>
        <h1 className="mb-2 text-4xl font-bold">{post.title}</h1>
        <p className="mb-6 text-sm text-slate-500">{post.author.username} · {formatDate(post.published_at)} · {post.reading_time} menit baca</p>
        {post.cover_image_path && <img src={post.cover_image_path} alt={post.title} className="mb-6 w-full rounded-2xl" />}
        <MarkdownViewer content={post.content} />
      </article>
    </main>
  )
}
