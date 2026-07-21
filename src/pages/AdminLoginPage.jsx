import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../auth/useAuth'

function AdminLoginPage() {
  const { signIn, session, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const fromPath = location.state?.from?.pathname ?? '/admin/dashboard'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (session && !loading) {
      navigate(fromPath, { replace: true })
    }
  }, [fromPath, loading, navigate, session])

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setErrorMessage('')

    const { error } = await signIn(email, password)

    if (error) {
      setErrorMessage(error.message)
      setSubmitting(false)
      return
    }

    navigate(fromPath, { replace: true })
  }

  if (session && !loading) {
    return <Navigate to={fromPath} replace />
  }

  return (
    <section className="stack section narrow">
      <article className="surface-card auth-card">
        <span className="eyebrow">Akses admin</span>
        <h1>Login perangkat desa</h1>
        <p>
          Gunakan akun Supabase Auth yang sudah didaftarkan untuk perangkat desa.
        </p>

        {errorMessage ? (
          <aside className="notice auth-notice" role="alert">
            <strong>Login gagal:</strong>
            <span>{errorMessage}</span>
          </aside>
        ) : null}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@desa.id"
              autoComplete="email"
              required
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Masukkan password"
              autoComplete="current-password"
              required
            />
          </label>

          <button className="button primary auth-submit" type="submit" disabled={submitting}>
            {submitting ? 'Memproses...' : 'Masuk ke dashboard'}
          </button>
        </form>
      </article>
    </section>
  )
}

export default AdminLoginPage