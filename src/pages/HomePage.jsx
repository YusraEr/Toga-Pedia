import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PlantCard from '../components/PlantCard'
import { getTanamanCatalog } from '../services/tanamanService'

function buildSummary(total, source, hasError) {
  const sourceLabel = source === 'supabase' ? 'data live dari Supabase' : 'data cadangan dari demo'

  if (hasError) {
    return `${total} tanaman ditampilkan dari ${sourceLabel}.`
  }

  return `${total} tanaman tersedia dari ${sourceLabel}.`
}

function HomePage() {
  const [tanaman, setTanaman] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('demo')
  const [errorMessage, setErrorMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let isMounted = true

    async function loadTanaman() {
      try {
        const result = await getTanamanCatalog()

        if (!isMounted) {
          return
        }

        setTanaman(result.data)
        setSource(result.source)
        setErrorMessage(result.error ? 'Supabase belum mengembalikan data, sehingga data cadangan ditampilkan dulu.' : '')
      } catch (error) {
        if (!isMounted) {
          return
        }

        setTanaman([])
        setSource('demo')
        setErrorMessage(error instanceof Error ? error.message : 'Gagal memuat katalog tanaman.')
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
  }, [reloadToken])

  function handleRetry() {
    setLoading(true)
    setErrorMessage('')
    setReloadToken((value) => value + 1)
  }

  const summary = useMemo(
    () => buildSummary(tanaman.length, source, Boolean(errorMessage)),
    [errorMessage, source, tanaman.length],
  )

  const filteredTanaman = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase()

    if (!normalizedTerm) {
      return tanaman
    }

    return tanaman.filter((item) => item.nama_lokal.toLowerCase().includes(normalizedTerm))
  }, [searchTerm, tanaman])

  return (
    <section className="stack section">
      <section className="hero-card catalog-hero">
        <div className="catalog-hero__content">
          <div className="eyebrow">Katalog ensiklopedia TOGA</div>
          <h1>Temukan tanaman obat keluarga dalam katalog yang rapi, hangat, dan mudah dijelajahi.</h1>
          <p className="hero-copy">
            Setiap kartu dibuat untuk membantu warga desa mengenali tanaman, khasiat, dan kategori dengan
            cepat tanpa tampilan yang berantakan.
          </p>

          <div className="catalog-hero__meta">
            <span className="catalog-stat">
              <strong>{tanaman.length}</strong>
              Tanaman terdata
            </span>
            <span className="catalog-stat">
              <strong>{source === 'supabase' ? 'Live' : 'Cadangan'}</strong>
              Sumber data
            </span>
            <span className="catalog-stat catalog-stat--accent">Mobile-first dan responsif</span>
          </div>
        </div>

        <div className="catalog-hero__panel" aria-hidden="true">
          <div className="catalog-orb catalog-orb--one" />
          <div className="catalog-orb catalog-orb--two" />
          <div className="catalog-panel-card">
            <span className="eyebrow eyebrow--soft">Pilihan cepat</span>
            <p>Jahe, kunyit, sirih, dan temulawak disusun dengan visual yang jelas dan nyaman dibaca.</p>
          </div>
        </div>
      </section>

      {errorMessage ? (
        <aside className="notice notice--actionable" role="status" aria-live="polite">
          <div className="notice__content">
            <strong>Catatan data:</strong>
            <span>{errorMessage}</span>
          </div>
          <button className="button secondary notice__button" type="button" onClick={handleRetry}>
            Muat ulang
          </button>
        </aside>
      ) : null}

      <section className="catalog-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Daftar tanaman</span>
            <h2>Kartu katalog utama</h2>
          </div>
          <div className="catalog-tools">
            <label className="search-field" htmlFor="catalog-search">
              <span className="search-field__label">Cari nama tanaman</span>
              <input
                id="catalog-search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Contoh: jahe, kunyit, sirih"
              />
            </label>
            <p className="catalog-summary">{loading ? 'Memuat katalog...' : summary}</p>
          </div>
        </div>

        {loading ? (
          <div className="catalog-grid" aria-busy="true" aria-label="Memuat katalog tanaman">
            {Array.from({ length: 4 }).map((_, index) => (
              <article key={index} className="plant-card plant-card--loading">
                <div className="plant-card__media plant-card__media--skeleton" />
                <div className="plant-card__body">
                  <span className="skeleton-line skeleton-line--short" />
                  <span className="skeleton-line skeleton-line--title" />
                  <span className="skeleton-line" />
                  <span className="skeleton-line" />
                </div>
              </article>
            ))}
          </div>
        ) : filteredTanaman.length > 0 ? (
          <div className="catalog-grid">
            {filteredTanaman.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        ) : (
          <div className="empty-state surface-card center">
            <h2>{searchTerm ? 'Tanaman tidak ditemukan' : 'Belum ada data tanaman'}</h2>
            <p>
              {searchTerm
                ? 'Coba gunakan nama tanaman yang lebih umum atau hapus kata kunci pencarian.'
                : 'Tambahkan data di Supabase agar katalog publik langsung terisi.'}
            </p>
            {searchTerm ? (
              <Link className="button primary" to="/" onClick={() => setSearchTerm('')}>
                Hapus pencarian
              </Link>
            ) : null}
          </div>
        )}
      </section>
    </section>
  )
}

export default HomePage