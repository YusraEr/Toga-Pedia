import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import PlantCard from './PlantCard'
import { getTanamanCatalog } from '../services/tanamanService'

function buildSummary(total, source, hasError, isSearching, searchTerm, filteredTotal) {
  const sourceLabel = source === 'supabase' ? 'data live dari Supabase' : 'data cadangan dari demo'

  if (hasError) {
    return `${total} tanaman ditampilkan dari ${sourceLabel}.`
  }

  if (isSearching && searchTerm.trim()) {
    return `${filteredTotal} hasil pencarian dari ${total} tanaman.`
  }

  return `${total} tanaman tersedia dari ${sourceLabel}.`
}

function TanamanCollectionView({
  eyebrow,
  title,
  description,
  sectionEyebrow,
  sectionTitle,
  searchable,
  searchLabel = 'Cari nama tanaman',
  searchPlaceholder = 'Contoh: jahe, kunyit, sirih',
  emptyTitle,
  emptyDescription,
  emptyActionLabel = 'Hapus pencarian',
  emptyActionTo = '/',
}) {
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

  const filteredTanaman = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase()

    if (!searchable || !normalizedTerm) {
      return tanaman
    }

    return tanaman.filter((item) => item.nama_lokal.toLowerCase().includes(normalizedTerm))
  }, [searchTerm, searchable, tanaman])

  const summary = useMemo(
    () => buildSummary(tanaman.length, source, Boolean(errorMessage), searchable, searchTerm, filteredTanaman.length),
    [errorMessage, filteredTanaman.length, searchTerm, searchable, source, tanaman.length],
  )

  return (
    <section className="stack section">
      <section className="hero-card catalog-hero">
        <div className="catalog-hero__content">
          <div className="eyebrow">{eyebrow}</div>
          <h1>{title}</h1>
          <p className="hero-copy">{description}</p>

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
            <span className="eyebrow eyebrow--soft">Sorotan cepat</span>
            <p>
              {searchable
                ? 'Gunakan pencarian untuk menemukan tanaman berdasarkan nama dengan tampilan yang tetap ringan.'
                : 'Beranda ini menampilkan ringkasan platform, keunggulan, dan jalur cepat menuju katalog.'}
            </p>
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
            <span className="eyebrow">{sectionEyebrow}</span>
            <h2>{sectionTitle}</h2>
          </div>
          <div className="catalog-tools">
            {searchable ? (
              <label className="search-field" htmlFor="catalog-search">
                <span className="search-field__label">{searchLabel}</span>
                <input
                  id="catalog-search"
                  type="search"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={searchPlaceholder}
                />
              </label>
            ) : null}
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
            <h2>{emptyTitle}</h2>
            <p>{emptyDescription}</p>
            {searchable ? (
              <Link className="button primary" to={emptyActionTo} onClick={() => setSearchTerm('')}>
                {emptyActionLabel}
              </Link>
            ) : null}
          </div>
        )}
      </section>
    </section>
  )
}

export default TanamanCollectionView