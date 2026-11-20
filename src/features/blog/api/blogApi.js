import { apiFetch } from '../../../helpers/apiHelper'

export const getCategories = () => apiFetch('/api/public/categories', { auth: false })
export function getPublicPosts(q = '', category = '') {
  const p = new URLSearchParams()
  if (q) p.set('q', q)
  if (category) p.set('category', category)
  const s = p.toString()
  return apiFetch('/api/public/posts' + (s ? `?${s}` : ''), { auth: false })
}
export const getPublicPost = (slug) => apiFetch(`/api/public/posts/${slug}`, { auth: false })
export const getMyPosts = () => apiFetch('/api/posts')
export const getStats = () => apiFetch('/api/posts/stats')
export const getMyPost = (id) => apiFetch(`/api/posts/${id}`)
export const createPost = (body) => apiFetch('/api/posts', { method: 'POST', body })
export const updatePost = (id, body) => apiFetch(`/api/posts/${id}`, { method: 'PUT', body })
export const togglePublish = (id) => apiFetch(`/api/posts/${id}/toggle-publish`, { method: 'PATCH' })
export const deletePost = (id) => apiFetch(`/api/posts/${id}`, { method: 'DELETE' })
export const aiGenerate = (body) => apiFetch('/api/posts/ai-generate', { method: 'POST', body })
