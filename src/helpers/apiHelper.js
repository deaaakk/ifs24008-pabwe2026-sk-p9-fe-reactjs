const base = () => import.meta.env.VITE_API_BASE_URL || ''

export const getToken = () => localStorage.getItem('token')

export const setToken = (token) => (token ? localStorage.setItem('token', token) : localStorage.removeItem('token'))

export async function apiFetch(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (auth && token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(base() + path, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const json = await res.json().catch(() => ({ status: 'error', message: 'Respons tidak valid' }))
  if (!res.ok) throw new Error(json.message || 'Terjadi kesalahan')
  return json
}
