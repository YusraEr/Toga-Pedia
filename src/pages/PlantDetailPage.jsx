import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import QRCode from 'qrcode'
import PlantCard from '../components/PlantCard'
import { getTanamanBySlug, getTanamanCatalog } from '../services/tanamanService'
import {
  BookIcon,
  HealthIcon,
  TeaIcon,
  SproutIcon,
  WarningIcon,
  ArrowRightIcon,
  QRIcon,
  DownloadIcon,
} from '../components/Icons'

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=1200&q=80'

function PlantDetailPage() {
  const { slug } = useParams()
  const [tanaman, setTanaman] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [imgSrc, setImgSrc] = useState(DEFAULT_IMAGE)
  const [qrDataUrl, setQrDataUrl] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadTanaman() {
      setLoading(true)
      try {
        const result = await getTanamanBySlug(slug)

        if (!isMounted) {
          return
        }

        setTanaman(result.data)
        if (result.data?.image_url) {
          setImgSrc(result.data.image_url)
        } else {
          setImgSrc(DEFAULT_IMAGE)
        }

        if (result.error && !result.data) {
          setErrorMessage('Data tanaman tidak ditemukan.')
        } else {
          setErrorMessage(result.error ? 'Menggunakan data cadangan.' : '')
        }

        // Generate QR Code data URL for current page URL
        if (result.data) {
          const pageUrl = window.location.href
          QRCode.toDataURL(
            pageUrl,
            {
              width: 340,
              margin: 2,
              color: {
                dark: '#215131',
                light: '#ffffff',
              },
            },
            (err, url) => {
              if (!err && url && isMounted) {
                setQrDataUrl(url)
              }
            }
          )
        }

        // Load recommendations
        const catalogResult = await getTanamanCatalog()
        if (isMounted && catalogResult.data) {
          const filteredRecs = catalogResult.data
            .filter((item) => item.slug !== slug)
            .slice(0, 2)
          setRecommendations(filteredRecs)
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

  const handleImageError = () => {
    if (imgSrc !== DEFAULT_IMAGE) {
      setImgSrc(DEFAULT_IMAGE)
    }
  }

  // Handle Download High-Res Branded QR Sticker Card
  const handleDownloadQR = () => {
    if (!tanaman || !qrDataUrl) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const width = 600
    const height = 740

    canvas.width = width
    canvas.height = height

    // Background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    // Border outer line
    ctx.lineWidth = 8
    ctx.strokeStyle = '#215131'
    ctx.strokeRect(16, 16, width - 32, height - 32)

    // Top Header Banner
    ctx.fillStyle = '#215131'
    ctx.fillRect(16, 16, width - 32, 100)

    // Header Title
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 24px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('TOGA PEDIA DESA', width / 2, 58)

    ctx.fillStyle = '#e5ede0'
    ctx.font = '15px sans-serif'
    ctx.fillText('Ensiklopedia Tanaman Obat Keluarga Digital', width / 2, 86)

    // Draw QR Image
    const qrImg = new Image()
    qrImg.onload = () => {
      const qrSize = 340
      const qrX = (width - qrSize) / 2
      const qrY = 140
      ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize)

      // Plant Title
      ctx.fillStyle = '#215131'
      ctx.font = 'bold 30px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(tanaman.nama_lokal, width / 2, 520)

      // Latin Name
      ctx.fillStyle = '#916b4b'
      ctx.font = 'italic 20px sans-serif'
      ctx.fillText(tanaman.nama_latin || '-', width / 2, 552)

      // Category Tag Box
      const catText = tanaman.kategori?.nama_kategori || 'Herbal Desa'
      ctx.fillStyle = '#eff7eb'
      ctx.fillRect(width / 2 - 140, 580, 280, 38)
      ctx.lineWidth = 1
      ctx.strokeStyle = '#215131'
      ctx.strokeRect(width / 2 - 140, 580, 280, 38)

      ctx.fillStyle = '#215131'
      ctx.font = 'bold 15px sans-serif'
      ctx.fillText(catText, width / 2, 604)

      // Footer Instructions
      ctx.fillStyle = '#5b6b5e'
      ctx.font = '14px sans-serif'
      ctx.fillText('Pindai QR ini untuk membuka informasi khasiat & dosis lengkap', width / 2, 656)

      ctx.fillStyle = '#215131'
      ctx.font = '12px monospace'
      ctx.fillText(window.location.href, width / 2, 690)

      // Trigger automatic file download
      const link = document.createElement('a')
      link.download = `QR-TOGA-${tanaman.slug || 'tanaman'}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
    qrImg.src = qrDataUrl
  }

  if (loading) {
    return (
      <section className="wiki-page-container">
        <div className="wiki-skeleton-card">
          <div className="skeleton-line skeleton-line--short" />
          <div className="skeleton-line skeleton-line--title" />
          <div className="wiki-skeleton-grid">
            <div className="skeleton-box" />
            <div className="skeleton-box" />
          </div>
        </div>
      </section>
    )
  }

  if (!tanaman) {
    return (
      <section className="wiki-page-container">
        <div className="empty-catalog-state surface-card center">
          <span className="empty-icon" aria-hidden="true">
            <SproutIcon size={48} />
          </span>
          <h2>Data Tanaman Tidak Ditemukan</h2>
          <p>{errorMessage || 'Tanaman yang diminta belum tersedia dalam katalog.'}</p>
          <Link className="button primary" to="/katalog">
            Kembali ke Katalog Tanaman
          </Link>
        </div>
      </section>
    )
  }

  return (
    <article className="wiki-page-container">
      {/* Breadcrumb Navigation Bar */}
      <nav className="wiki-breadcrumb" aria-label="Breadcrumb Navigasi">
        <Link to="/katalog" className="wiki-back-btn">
          ← Kembali ke Katalog
        </Link>
        <span className="breadcrumb-divider">/</span>
        <Link to="/" className="breadcrumb-link">
          Beranda
        </Link>
        <span className="breadcrumb-divider">/</span>
        <Link to="/katalog" className="breadcrumb-link">
          Katalog
        </Link>
        <span className="breadcrumb-divider">/</span>
        <span className="breadcrumb-current">{tanaman.nama_lokal}</span>
      </nav>

      {/* Hero Header Section */}
      <header className="wiki-header-card">
        <div className="wiki-header-content">
          <div className="wiki-header-badges">
            <span className="eyebrow wiki-badge">
              <span className="wiki-badge__dot" /> Ensiklopedia TOGA
            </span>
            <span className="wiki-category-pill">
              {tanaman.kategori?.nama_kategori ?? 'Kategori Umum'}
            </span>
          </div>

          <h1 className="wiki-title">{tanaman.nama_lokal}</h1>
          <p className="wiki-latin-name">
            <em>{tanaman.nama_latin}</em>
          </p>
        </div>

        <div className="wiki-header-actions">
          <button className="button primary qr-header-btn" type="button" onClick={handleDownloadQR}>
            <DownloadIcon size={18} /> Unduh QR Code Stiker
          </button>
        </div>
      </header>

      {/* Main Wiki 2-Column Grid */}
      <div className="wiki-layout">
        {/* Main Content Column */}
        <div className="wiki-main-column">
          {/* Section 1: Overview */}
          <section className="wiki-section">
            <h2 className="wiki-section-title">
              <span className="wiki-icon" aria-hidden="true">
                <BookIcon size={22} />
              </span>{' '}
              Gambaran Umum
            </h2>
            <p className="wiki-paragraph">{tanaman.deskripsi}</p>
          </section>

          {/* Section 2: Medical Benefits */}
          <section className="wiki-section wiki-section--highlight">
            <h2 className="wiki-section-title">
              <span className="wiki-icon" aria-hidden="true">
                <HealthIcon size={22} />
              </span>{' '}
              Khasiat &amp; Manfaat Medis
            </h2>
            <div className="wiki-benefit-box">
              <p className="wiki-benefit-text">{tanaman.khasiat_medis}</p>
            </div>
          </section>

          {/* Section 3: Dosage */}
          <section className="wiki-section">
            <h2 className="wiki-section-title">
              <span className="wiki-icon" aria-hidden="true">
                <HealthIcon size={22} />
              </span>{' '}
              Dosis &amp; Takaran Konsumsi Aman
            </h2>
            <p className="wiki-paragraph">{tanaman.takaran_konsumsi}</p>
          </section>

          {/* Section 4: Preparation */}
          <section className="wiki-section">
            <h2 className="wiki-section-title">
              <span className="wiki-icon" aria-hidden="true">
                <TeaIcon size={22} />
              </span>{' '}
              Panduan Pengolahan &amp; Penyajian
            </h2>
            <p className="wiki-paragraph">{tanaman.panduan_olah}</p>
          </section>

          {/* Section 4: Cultivation Guide */}
          <section className="wiki-section">
            <h2 className="wiki-section-title">
              <span className="wiki-icon" aria-hidden="true">
                <SproutIcon size={22} />
              </span>{' '}
              Panduan Budidaya Pekarangan
            </h2>
            <p className="wiki-paragraph">{tanaman.panduan_tanam}</p>
          </section>

          {/* Notice Banner if any error or fallback */}
          {errorMessage && (
            <aside className="notice" role="status">
              <strong>Catatan:</strong> <span>{errorMessage}</span>
            </aside>
          )}
        </div>

        {/* Sidebar Infobox Column (Wiki Sidebar) */}
        <aside className="wiki-sidebar">
          <div className="wiki-infobox">
            <div className="wiki-infobox-header">
              <h3>Spesifikasi Tanaman</h3>
            </div>

            <figure className="wiki-infobox-photo">
              <img
                src={imgSrc}
                alt={`Foto Spesimen ${tanaman.nama_lokal}`}
                onError={handleImageError}
              />
              <figcaption>Spesimen foto {tanaman.nama_lokal}</figcaption>
            </figure>

            <dl className="wiki-infobox-grid">
              <div className="infobox-row">
                <dt>Nama Lokal</dt>
                <dd>
                  <strong>{tanaman.nama_lokal}</strong>
                </dd>
              </div>

              <div className="infobox-row">
                <dt>Nama Latin</dt>
                <dd>
                  <em>{tanaman.nama_latin}</em>
                </dd>
              </div>

              <div className="infobox-row">
                <dt>Kategori Herbal</dt>
                <dd>{tanaman.kategori?.nama_kategori ?? 'Umum'}</dd>
              </div>

              <div className="infobox-row">
                <dt>Penggunaan</dt>
                <dd>Obat Tradisional Keluarga</dd>
              </div>

              <div className="infobox-row">
                <dt>Aksesibilitas</dt>
                <dd>Pekarangan Desa</dd>
              </div>
            </dl>

            <div className="wiki-infobox-disclaimer">
              <span className="disclaimer-icon" aria-hidden="true">
                <WarningIcon size={18} />
              </span>
              <p>
                Gunakan resep obat tradisional ini sesuai dosis yang disarankan. Jika sakit berlanjut, segera hubungi fasilitas kesehatan terdekat.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Recommendations / Other Plants */}
      {recommendations.length > 0 && (
        <section className="wiki-recommendations">
          <div className="section-header">
            <div>
              <span className="eyebrow">Eksplorasi Lainnya</span>
              <h2 className="section-title">Tanaman Obat Terkait</h2>
            </div>
            <Link to="/katalog" className="button secondary desktop-only-btn">
              Lihat Seluruh Katalog <ArrowRightIcon size={16} />
            </Link>
          </div>

          <div className="catalog-grid">
            {recommendations.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </div>
        </section>
      )}
    </article>
  )
}

export default PlantDetailPage