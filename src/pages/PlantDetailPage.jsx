function PlantDetailPage() {
  return (
    <section className="stack section">
      <article className="hero-card detail-hero">
        <div className="eyebrow">Detail tanaman</div>
        <h1>Jahe</h1>
        <p className="hero-copy">
          Halaman detail akan menampilkan identitas tanaman, khasiat, dosis, panduan tanam, dan cara
          pengolahan herbal dengan struktur yang konsisten.
        </p>

        <dl className="detail-grid">
          <div>
            <dt>Nama latin</dt>
            <dd>Zingiber officinale</dd>
          </div>
          <div>
            <dt>Bagian dimanfaatkan</dt>
            <dd>Rimpang</dd>
          </div>
          <div>
            <dt>Khasiat utama</dt>
            <dd>Meredakan masuk angin dan membantu menghangatkan tubuh</dd>
          </div>
        </dl>
      </article>
    </section>
  )
}

export default PlantDetailPage