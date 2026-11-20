import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as auth from './auth/api/authApi'
import * as blog from './blog/api/blogApi'
import * as admin from './admin/api/adminApi'

beforeEach(() => { vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) })) })
const last = () => fetch.mock.calls.at(-1)

describe('lapisan API', () => {
  it('auth', async () => {
    await auth.login({}); await auth.register({}); await auth.logout(); await auth.getProfile(); await auth.updateProfile({})
    expect(fetch).toHaveBeenCalledTimes(5); expect(last()[1].method).toBe('PUT')
  })
  it('blog', async () => {
    await blog.getCategories(); await blog.getPublicPost('s'); await blog.getMyPosts(); await blog.getStats(); await blog.getMyPost(1)
    await blog.createPost({}); await blog.updatePost(1, {}); await blog.togglePublish(1); await blog.deletePost(1); await blog.aiGenerate({})
    expect(fetch).toHaveBeenCalledTimes(10)
  })
  it('getPublicPosts membangun query', async () => {
    await blog.getPublicPosts(); expect(last()[0]).toBe('/api/public/posts')
    await blog.getPublicPosts('halo', 'Opini'); expect(last()[0]).toBe('/api/public/posts?q=halo&category=Opini')
    await blog.getPublicPosts('', 'Bisnis'); expect(last()[0]).toBe('/api/public/posts?category=Bisnis')
  })
  it('admin', async () => {
    await admin.getUsers(); await admin.getAllPosts(); await admin.getUserPosts(2)
    expect(last()[0]).toBe('/api/admin/users/2/posts')
  })
})
