import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="stack section narrow">
      <article className="surface-card center">
        <span className="eyebrow">404</span>
        <h1>Halaman tidak ditemukan</h1>
        <p>Gunakan navigasi utama untuk kembali ke beranda atau area admin.</p>
        <Link className="button primary" to="/">
          Kembali ke beranda
        </Link>
      </article>
    </section>
  )
}

export default NotFoundPage