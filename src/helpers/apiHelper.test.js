import { describe, it, expect, vi, beforeEach } from 'vitest'
import { apiFetch, getToken, setToken } from './apiHelper'

const mock = (ok, json) =>
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok, json: () => (json instanceof Error ? Promise.reject(json) : Promise.resolve(json)) }))

beforeEach(() => { localStorage.clear(); vi.unstubAllEnvs() })

describe('apiHelper', () => {
  it('simpan & hapus token', () => {
    setToken('a'); expect(getToken()).toBe('a')
    setToken(null); expect(getToken()).toBeNull()
  })
  it('GET dengan token & base url', async () => {
    vi.stubEnv('VITE_API_BASE_URL', 'http://x'); setToken('t'); mock(true, { status: 'success' })
    await apiFetch('/api/a')
    expect(fetch).toHaveBeenCalledWith('http://x/api/a', expect.objectContaining({ method: 'GET', body: undefined, headers: expect.objectContaining({ Authorization: 'Bearer t' }) }))
  })
  it('tanpa token & base kosong', async () => {
    mock(true, {}); await apiFetch('/api/a')
    expect(fetch.mock.calls[0][0]).toBe('/api/a')
    expect(fetch.mock.calls[0][1].headers.Authorization).toBeUndefined()
  })
  it('POST tanpa auth', async () => {
    setToken('t'); mock(true, {}); await apiFetch('/p', { method: 'POST', body: { a: 1 }, auth: false })
    const o = fetch.mock.calls[0][1]
    expect(o.headers.Authorization).toBeUndefined(); expect(o.body).toBe('{"a":1}')
  })
  it('error dengan pesan, tanpa pesan, dan JSON rusak', async () => {
    mock(false, { message: 'gagal' }); await expect(apiFetch('/x')).rejects.toThrow('gagal')
    mock(false, {}); await expect(apiFetch('/x')).rejects.toThrow('Terjadi kesalahan')
    mock(false, new Error('x')); await expect(apiFetch('/x')).rejects.toThrow('Respons tidak valid')
    mock(true, new Error('x')); await expect(apiFetch('/x')).resolves.toMatchObject({ status: 'error' })
  })
})
