import { Navigate, useLocation } from 'react-router-dom'
import useAuth from '../auth/useAuth'

function ProtectedRoute({ children }) {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <section className="stack section narrow">
        <article className="surface-card center auth-loading">
          <span className="eyebrow">Proteksi dashboard</span>
          <h1>Memeriksa akses admin</h1>
          <p>Mohon tunggu sebentar saat sesi Supabase diverifikasi.</p>
        </article>
      </section>
    )
  }

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute