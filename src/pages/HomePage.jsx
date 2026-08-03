import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PlantCard from '../components/PlantCard'
import { getTanamanCatalog } from '../services/tanamanService'
import { LeafIcon, SearchIcon, TeaIcon, SproutIcon, HealthIcon, ArrowRightIcon } from '../components/Icons'

function HomePage() {
  const [featuredPlants, setFeaturedPlants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadFeatured() {
      try {
        const result = await getTanamanCatalog()
        if (isMounted) {
          setFeaturedPlants(result.data.slice(0, 4))
        }
      } catch (error) {
        console.error('Gagal memuat tanaman unggulan:', error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadFeatured()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="home-hero__content">
          <span className="eyebrow hero-badge">
            <span className="hero-badge__dot" /> Ensiklopedia Herbal Digital Desa
          </span>

          <h1 className="home-hero__title">
            Panduan Kesehatan Herbal &amp; Tanaman Obat Keluarga
          </h1>

          <p className="home-hero__subtitle">
            Temukan khasiat medis, takaran konsumsi yang aman, petunjuk pengolahan tradisional, dan panduan budidaya TOGA langsung dari pekarangan rumah.
          </p>

          <div className="hero-actions">
            <Link className="button primary hero-btn" to="/katalog">
              Jelajahi Katalog Tanaman <ArrowRightIcon size={18} />
            </Link>
            <Link className="button secondary hero-btn" to="/katalog">
              <SearchIcon size={18} /> Cari Tanaman Obat
            </Link>
          </div>

          <div className="hero-features-bar">
            <div className="hero-feature-item">
              <span className="hero-feature-icon" aria-hidden="true">
                <LeafIcon size={20} />
              </span>
              <div>
                <strong>Informasi Teruji</strong>
                <small>Khasiat &amp; takaran konsumsi aman</small>
              </div>
            </div>

            <div className="hero-feature-item">
              <span className="hero-feature-icon" aria-hidden="true">
                <TeaIcon size={20} />
              </span>
              <div>
                <strong>Resep Tradisional</strong>
                <small>Panduan rebusan &amp; seduhan harian</small>
              </div>
            </div>

            <div className="hero-feature-item">
              <span className="hero-feature-icon" aria-hidden="true">
                <SproutIcon size={20} />
              </span>
              <div>
                <strong>Budidaya Mandiri</strong>
                <small>Tips tanam di pekarangan desa</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Plants Preview Section */}
      <section className="home-section">
        <div className="section-header">
          <div>
            <span className="eyebrow">Koleksi Pilihan</span>
            <h2 className="section-title">Tanaman Obat Populer</h2>
            <p className="section-desc">
              Tanaman herbal pilihan yang paling sering dimanfaatkan warga untuk menjaga daya tahan dan kebugaran keluarga.
            </p>
          </div>

          <Link className="button secondary desktop-only-btn" to="/katalog">
            Lihat Semua Tanaman <ArrowRightIcon size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="catalog-grid" aria-busy="true" aria-label="Memuat tanaman unggulan">
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
        ) : (
          <div className="catalog-grid">
            {featuredPlants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        )}

        <div className="mobile-only-btn-wrapper">
          <Link className="button secondary full-width-btn" to="/katalog">
            Lihat Seluruh Katalog Tanaman <ArrowRightIcon size={16} />
          </Link>
        </div>
      </section>

      {/* 3 Pillars / Value Proposition */}
      <section className="home-section pillars-section">
        <div className="center-header">
          <span className="eyebrow">Nilai Utama</span>
          <h2 className="section-title">3 Pilar Informasi TOGA Pedia</h2>
          <p className="section-desc">
            Disajikan secara ringkas, jelas, dan dapat dipraktikkan langsung oleh warga desa tanpa istilah rumit.
          </p>
        </div>

        <div className="pillars-grid">
          <article className="pillar-card">
            <div className="pillar-icon pillar-icon--green" aria-hidden="true">
              <HealthIcon size={24} />
            </div>
            <h3>Khasiat &amp; Dosis Aman</h3>
            <p>
              Penjelasan manfaat kesehatan dilengkapi takaran konsumsi harian agar pemanfaatan herbal tetap aman dan berkhasiat optimal.
            </p>
          </article>

          <article className="pillar-card">
            <div className="pillar-icon pillar-icon--amber" aria-hidden="true">
              <TeaIcon size={24} />
            </div>
            <h3>Petunjuk Olah Praktis</h3>
            <p>
              Panduan langkah demi langkah merebus, menyeduh, dan meracik rimpang atau daun obat untuk konsumsi herbal keluarga.
            </p>
          </article>

          <article className="pillar-card">
            <div className="pillar-icon pillar-icon--earth" aria-hidden="true">
              <SproutIcon size={24} />
            </div>
            <h3>Budidaya Pekarangan</h3>
            <p>
              Petunjuk media tanam, pemeliharaan, dan penyiraman untuk membudidayakan bibit tanaman obat mandiri di kebun rumah.
            </p>
          </article>
        </div>
      </section>

      {/* Easy 3-Step Guide */}
      <section className="home-section steps-section">
        <div className="section-header">
          <div>
            <span className="eyebrow">Alur Penggunaan</span>
            <h2 className="section-title">3 Langkah Mudah Menggunakan Platform</h2>
          </div>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <span className="step-number">01</span>
            <h4>Temukan Tanaman</h4>
            <p>Cari berdasarkan nama lokal atau jelajahi katalog tanaman yang tersedia.</p>
          </div>

          <div className="step-card">
            <span className="step-number">02</span>
            <h4>Pelajari Manfaat</h4>
            <p>Baca khasiat spesifik, takaran konsumsi yang disarankan, dan deskripsi lengkapnya.</p>
          </div>

          <div className="step-card">
            <span className="step-number">03</span>
            <h4>Olah &amp; Manfaatkan</h4>
            <p>Praktikkan langkah pembuatan olahan herbal sederhana untuk kesehatan keluarga.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage