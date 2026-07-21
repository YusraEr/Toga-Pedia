import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getTanamanBySlug } from '../services/tanamanService'

function PlantDetailPage() {
  const { slug } = useParams()
  const [tanaman, setTanaman] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadTanaman() {
      try {
        const result = await getTanamanBySlug(slug)

        if (!isMounted) {
          return
        }

        setTanaman(result.data)
        if (result.error && !result.data) {
          setErrorMessage('Data tanaman tidak ditemukan. Kembali ke katalog untuk memilih tanaman lain.')
        } else {
          setErrorMessage(result.error ? 'Data demo ditampilkan karena koneksi Supabase belum siap.' : '')
        }
      } catch (error) {
        if (!isMounted) {
          return
        }

        setTanaman(null)
        setErrorMessage(error instanceof Error ? error.message : 'Gagal memuat detail tanaman.')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadTanaman()

    return () => {
      isMounted = false
    }
  }, [slug])

  if (loading) {
    return (
      <section className="stack section narrow">
        <article className="hero-card detail-hero">
          <div className="skeleton-line skeleton-line--short" />
          <div className="skeleton-line skeleton-line--title" />
          <div className="detail-photo detail-photo--skeleton" />
          <div className="detail-grid">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="detail-skeleton-card">
                <span className="skeleton-line skeleton-line--short" />
                <span className="skeleton-line" />
                <span className="skeleton-line" />
              </div>
            ))}
          </div>
        </article>
      </section>
    )
  }

  if (!tanaman) {
    return (
      <section className="stack section narrow">
        <article className="surface-card empty-state center">
          <span className="eyebrow">Detail tanaman</span>
          <h1>Data tidak tersedia</h1>
          <p>{errorMessage || 'Tanaman yang diminta belum tersedia.'}</p>
          <Link className="button primary" to="/">
            Kembali ke katalog
          </Link>
        </article>
      </section>
    )
  }

  const photoSource = tanaman.foto_url || 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=1200&q=80'

  return (
    <section className="stack section">
      <article className="hero-card detail-hero">
        <div className="detail-hero__header">
          <div>
            <div className="eyebrow">Detail tanaman</div>
            <h1>{tanaman.nama_lokal}</h1>
            <p className="detail-hero__latin">{tanaman.nama_latin}</p>
          </div>

          <span className="plant-card__tag">{tanaman.kategori?.nama_kategori ?? 'Kategori umum'}</span>
        </div>

        <p className="hero-copy">
          Halaman ini menyusun informasi tanaman secara jelas agar warga desa mudah memahami identitas,
          manfaat, dosis konsumsi, cara pengolahan, dan panduan tanam.
        </p>

        {errorMessage ? (
          <aside className="notice" role="status">
            <strong>Catatan data:</strong>
            <span>{errorMessage}</span>
          </aside>
        ) : null}

        <div className="detail-layout">
          <figure className="detail-photo">
            <img src={photoSource} alt={`Foto ${tanaman.nama_lokal}`} />
          </figure>

          <dl className="detail-grid detail-grid--stacked">
            <div>
              <dt>Identitas</dt>
              <dd>
                <strong>{tanaman.nama_lokal}</strong> ({tanaman.nama_latin})
              </dd>
            </div>
            <div>
              <dt>Manfaat</dt>
              <dd>{tanaman.khasiat_medis}</dd>
            </div>
            <div>
              <dt>Dosis</dt>
              <dd>{tanaman.dosis_konsumsi}</dd>
            </div>
            <div>
              <dt>Cara olah</dt>
              <dd>{tanaman.cara_olah}</dd>
            </div>
            <div>
              <dt>Cara tanam</dt>
              <dd>{tanaman.cara_tanam}</dd>
            </div>
            <div>
              <dt>Deskripsi</dt>
              <dd>{tanaman.deskripsi}</dd>
            </div>
          </dl>
        </div>
      </article>
    </section>
  )
}

export default PlantDetailPage