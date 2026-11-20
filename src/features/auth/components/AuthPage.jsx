import { useState } from 'react'
import useInput from '../../../hooks/useInput'
import { login, register } from '../api/authApi'
import { alertError, alertSuccess } from '../../../helpers/toolsHelper'

const field = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'

export default function AuthPage({ mode = 'login', onNavigate, onSuccess }) {
  const isLogin = mode === 'login'
  const { values, onChange } = useInput({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = isLogin ? await login(values) : await register(values)
      if (isLogin) onSuccess(res.data)
      else {
        alertSuccess('Registrasi berhasil, silakan login')
        onNavigate('/login')
      }
    } catch (err) {
      alertError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md items-center px-4">
      <form onSubmit={submit} className="w-full space-y-4 rounded-2xl bg-white p-6 shadow dark:bg-slate-800">
        <h1 className="text-2xl font-bold">{isLogin ? 'Masuk' : 'Daftar Penulis'}</h1>
        <label className="block text-sm">Username
          <input id={`${mode}-username`} name="username" required value={values.username} onChange={onChange} className={field} />
        </label>
        {!isLogin && (
          <label className="block text-sm">Email
            <input id="register-email" name="email" type="email" required value={values.email} onChange={onChange} className={field} />
          </label>
        )}
        <label className="block text-sm">Password
          <input id={`${mode}-password`} name="password" type="password" required value={values.password} onChange={onChange} className={field} />
        </label>
        <button id={`${mode}-submit`} type="submit" disabled={loading} className="w-full rounded-lg px-4 py-2 font-semibold text-white disabled:opacity-60" style={{ background: 'var(--accent)' }}>
          {isLogin ? 'Masuk' : 'Daftar'}
        </button>
        <p className="text-center text-sm">
          <a href={isLogin ? '/register' : '/login'} onClick={(e) => { e.preventDefault(); onNavigate(isLogin ? '/register' : '/login') }} className="underline">
            {isLogin ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
          </a>
        </p>
      </form>
    </main>
  )
}
