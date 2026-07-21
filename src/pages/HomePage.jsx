import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <section className="stack section">
      <section className="hero-card catalog-hero">
        <div className="catalog-hero__content">
          <div className="eyebrow">Beranda TOGA Pedia</div>
          <h1>Ruang utama untuk mengenal keunggulan TOGA, melihat ringkasan platform, dan masuk ke katalog.</h1>
          <p className="hero-copy">
            Beranda ini sengaja difokuskan sebagai landing page agar warga desa langsung melihat nilai utama
            platform, lalu melanjutkan ke daftar tanaman atau pencarian khusus.
          </p>

          <div className="hero-actions">
            <Link className="button primary" to="/katalog">
              Lihat katalog tanaman
            </Link>
            <Link className="button secondary" to="/pencarian">
              Cari tanaman
            </Link>
          </div>

          <div className="catalog-hero__meta">
            <span className="catalog-stat">
              <strong>Overview</strong>
              Ringkasan platform
            </span>
            <span className="catalog-stat">
              <strong>Detail</strong>
              Foto dan khasiat
            </span>
            <span className="catalog-stat catalog-stat--accent">Jalur cepat ke katalog dan pencarian</span>
          </div>
        </div>

        <div className="catalog-hero__panel" aria-hidden="true">
          <div className="catalog-orb catalog-orb--one" />
          <div className="catalog-orb catalog-orb--two" />
          <div className="catalog-panel-card">
            <span className="eyebrow eyebrow--soft">Keunggulan platform</span>
            <p>
              Informasi tanaman disajikan dengan bahasa yang lebih mudah dipahami, tampilan yang ringan,
              dan alur yang jelas untuk pengguna desa.
            </p>
          </div>
        </div>
      </section>

      <section className="grid two-up">
        <article className="surface-card">
          <span className="eyebrow">Overview</span>
          <h2>Apa isi platform ini</h2>
          <p>
            TOGA Pedia Desa memuat katalog tanaman obat, detail manfaat, cara olah, cara tanam, dan
            pengelolaan konten untuk admin desa.
          </p>
        </article>

        <article className="surface-card">
          <span className="eyebrow">Akses cepat</span>
          <h2>Masuk ke jalur yang tepat</h2>
          <p>
            Gunakan katalog untuk melihat semua tanaman, atau pencarian untuk langsung mencari nama yang
            dibutuhkan.
          </p>
        </article>
      </section>

      <section className="surface-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Mengapa TOGA Pedia</span>
            <h2>Keunggulan utama</h2>
          </div>
        </div>
        <ul className="checklist">
          <li>Beranda menonjolkan nilai, manfaat, dan arah penggunaan aplikasi.</li>
          <li>Katalog dan pencarian dipisahkan agar navigasi lebih jelas.</li>
          <li>Admin tetap punya jalur login dan pengelolaan data yang terpisah.</li>
        </ul>
      </section>

      <section className="surface-card">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Langkah penggunaan</span>
            <h2>Alur singkat untuk warga</h2>
          </div>
        </div>

        <div className="detail-grid detail-grid--stacked">
          <article className="surface-card">
            <h3>1. Buka katalog</h3>
            <p>Lihat semua tanaman yang terdata dalam format kartu yang rapi dan responsif.</p>
          </article>
          <article className="surface-card">
            <h3>2. Gunakan pencarian</h3>
            <p>Masukkan nama tanaman untuk menemukan informasi dengan lebih cepat.</p>
          </article>
        </div>
      </section>
    </section>
  )
}

export default HomePage