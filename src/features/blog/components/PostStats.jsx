export default function PostStats({ stats = { total: 0, published: 0, draft: 0 } }) {
  const cards = [
    ['Total Artikel', stats.total],
    ['Total Terbit', stats.published],
    ['Belum Selesai/Draf', stats.draft],
  ]
  return (
    <div className="mb-6 grid gap-4 sm:grid-cols-3">
      {cards.map(([label, n]) => (
        <div key={label} className="rounded-2xl bg-white p-5 shadow dark:bg-slate-800">
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>{n}</p>
        </div>
      ))}
    </div>
  )
}
