import { apiFetch } from '../../../helpers/apiHelper'

export const login = (body) => apiFetch('/api/auth/login', { method: 'POST', body, auth: false })
export const register = (body) => apiFetch('/api/auth/register', { method: 'POST', body, auth: false })
export const logout = () => apiFetch('/api/auth/logout', { method: 'POST' })
export const getProfile = () => apiFetch('/api/auth/profile')
export const updateProfile = (body) => apiFetch('/api/auth/profile', { method: 'PUT', body })
