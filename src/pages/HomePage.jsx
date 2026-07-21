const roadmapItems = [
  'Katalog ensiklopedia TOGA yang mudah dipahami warga desa',
  'Pencarian tanaman berdasarkan nama, gejala, dan kategori',
  'Dashboard admin yang aman untuk perangkat desa',
  'Arsitektur modern React + Supabase + Vercel',
]

const foundationCards = [
  {
    title: 'Struktur data yang jelas',
    description: 'Menyiapkan relasi tanaman, kategori, manfaat, dan media agar query tetap sederhana.',
  },
  {
    title: 'UI natural dan terbaca',
    description: 'Menerapkan warna hijau, kontras tinggi, dan layout responsif untuk semua usia.',
  },
  {
    title: 'Route yang siap tumbuh',
    description: 'Memisahkan beranda, detail, login admin, dan dashboard sejak fondasi pertama.',
  },
]

function HomePage() {
  return (
    <section className="stack section">
      <div className="hero-card">
        <div className="eyebrow">TOGA Pedia Desa V2</div>
        <h1>Fondasi website ensiklopedia tanaman obat keluarga yang rapi, modern, dan mudah dikembangkan.</h1>
        <p className="hero-copy">
          Tahap awal fokus pada arsitektur frontend, sistem tampilan, dan struktur navigasi agar fitur
          katalog, pencarian, dan admin CMS bisa dibangun tanpa utang teknis.
        </p>

        <div className="hero-actions">
          <a className="button primary" href="#roadmap">
            Lihat roadmap
          </a>
          <a className="button secondary" href="#fondasi">
            Lihat fondasi
          </a>
        </div>
      </div>

      <div className="grid two-up" id="fondasi">
        {foundationCards.map((card) => (
          <article key={card.title} className="surface-card">
            <h2>{card.title}</h2>
            <p>{card.description}</p>
          </article>
        ))}
      </div>

      <section className="surface-card" id="roadmap">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Langkah kerja</span>
            <h2>Urutan pengerjaan fondasi</h2>
          </div>
        </div>

        <ul className="checklist">
          {roadmapItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </section>
  )
}

export default HomePage