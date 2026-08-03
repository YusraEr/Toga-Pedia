import { useEffect, useMemo, useState } from 'react'
import PlantCard from './PlantCard'
import { getTanamanCatalog } from '../services/tanamanService'
import { SearchIcon, SproutIcon } from './Icons'
import { useDebounce } from '../hooks/useDebounce'

function TanamanCollectionView({
  eyebrow = 'Ensiklopedia Herbal',
  title = 'Katalog Tanaman Obat Keluarga',
  description = 'Jelajahi seluruh koleksi tanaman obat tradisional, cari berdasarkan nama lokal, atau saring berdasarkan kategori kesehatan.',
}) {
  const [tanaman, setTanaman] = useState([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState('demo')
  const [errorMessage, setErrorMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [reloadToken, setReloadToken] = useState(0)

  // Apply 300ms debouncing to search input
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

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
        setErrorMessage(result.error ? 'Supabase belum mengembalikan data, menggunakan data cadangan.' : '')
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

  // Extract unique category names
  const categories = useMemo(() => {
    const set = new Set()
    tanaman.forEach((item) => {
      const catName = item.kategori?.nama_kategori
      if (catName) {
        set.add(catName)
      }
    })
    return ['Semua', ...Array.from(set)]
  }, [tanaman])

  // Filtered plant list based on debounced search and selected category
  const filteredTanaman = useMemo(() => {
    const normalizedTerm = debouncedSearchTerm.trim().toLowerCase()

    return tanaman.filter((item) => {
      const matchesSearch =
        !normalizedTerm ||
        item.nama_lokal.toLowerCase().includes(normalizedTerm) ||
        item.nama_latin.toLowerCase().includes(normalizedTerm) ||
        item.khasiat_medis.toLowerCase().includes(normalizedTerm)

      const matchesCategory =
        selectedCategory === 'Semua' || item.kategori?.nama_kategori === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [debouncedSearchTerm, selectedCategory, tanaman])

  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedCategory('Semua')
  }

  return (
    <section className="catalog-page-container">
      {/* Hero Section */}
      <section className="catalog-hero-card">
        <div className="catalog-hero__content">
          <span className="eyebrow catalog-badge">
            <span className="catalog-badge__dot" /> {eyebrow}
          </span>
          <h1 className="catalog-hero__title">{title}</h1>
          <p className="catalog-hero__description">{description}</p>

          <div className="catalog-hero__stats">
            <div className="catalog-stat-chip">
              <strong>{tanaman.length}</strong>
              <span>Tanaman Terdata</span>
            </div>
            <div className="catalog-stat-chip">
              <strong>{categories.length - 1}</strong>
              <span>Kategori Kesehatan</span>
            </div>
            <div className="catalog-stat-chip catalog-stat-chip--accent">
              <span>Sumber: {source === 'supabase' ? 'Supabase Live' : 'Demo Mode'}</span>
            </div>
          </div>
        </div>
      </section>

      {errorMessage ? (
        <aside className="notice notice--actionable" role="status" aria-live="polite">
          <div className="notice__content">
            <strong>Catatan Data:</strong>
            <span>{errorMessage}</span>
          </div>
          <button className="button secondary notice__button" type="button" onClick={handleRetry}>
            Muat ulang
          </button>
        </aside>
      ) : null}

      {/* Main Catalog Toolbar & Grid */}
      <section className="catalog-main-section">
        {/* Search & Filter Bar */}
        <div className="catalog-filter-bar">
          {/* Integrated Search Box */}
          <div className="search-box">
            <span className="search-box__icon" aria-hidden="true">
              <SearchIcon size={18} />
            </span>
            <input
              id="catalog-search-input"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari tanaman (contoh: jahe, kunyit, pencernaan...)"
              aria-label="Cari nama atau khasiat tanaman"
            />
            {searchTerm && (
              <button
                className="search-box__clear"
                type="button"
                onClick={() => setSearchTerm('')}
                aria-label="Hapus kata kunci pencarian"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="category-chips" role="group" aria-label="Filter Berdasarkan Kategori">
            {categories.map((cat) => {
              const count =
                cat === 'Semua'
                  ? tanaman.length
                  : tanaman.filter((item) => item.kategori?.nama_kategori === cat).length

              const isActive = selectedCategory === cat

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`category-chip ${isActive ? 'active' : ''}`}
                >
                  {cat} <span className="chip-count">({count})</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Filter Status Line */}
        <div className="catalog-status-bar">
          <span className="catalog-count-info">
            Menampilkan <strong>{filteredTanaman.length}</strong> dari {tanaman.length} tanaman obat
            {selectedCategory !== 'Semua' ? ` dalam kategori "${selectedCategory}"` : ''}
            {debouncedSearchTerm ? ` untuk pencarian "${debouncedSearchTerm}"` : ''}
          </span>

          {(searchTerm || selectedCategory !== 'Semua') && (
            <button className="reset-filter-btn" type="button" onClick={handleResetFilters}>
              Reset Filter &amp; Pencarian
            </button>
          )}
        </div>

        {/* Catalog Grid Display */}
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
          <div className="empty-catalog-state surface-card center">
            <span className="empty-icon" aria-hidden="true">
              <SproutIcon size={48} />
            </span>
            <h2>Tanaman Tidak Ditemukan</h2>
            <p>
              Tidak ada tanaman obat yang cocok dengan pencarian <strong>"{debouncedSearchTerm}"</strong>
              {selectedCategory !== 'Semua' ? ` pada kategori "${selectedCategory}"` : ''}.
            </p>
            <button className="button primary" type="button" onClick={handleResetFilters}>
              Tampilkan Semua Tanaman
            </button>
          </div>
        )}
      </section>
    </section>
  )
}

export default TanamanCollectionView