import { Link } from 'react-router-dom'

function PlantCard({ plant }) {
  return (
    <article className="plant-card">
      <div className="plant-card__media" aria-hidden="true">
        <div className="plant-card__leaf plant-card__leaf--one" />
        <div className="plant-card__leaf plant-card__leaf--two" />
      </div>

      <div className="plant-card__body">
        <div className="plant-card__header">
          <span className="eyebrow eyebrow--soft">{plant.kategori?.nama_kategori ?? 'Kategori umum'}</span>
          <span className="plant-card__tag">Detail lengkap</span>
        </div>

        <div>
          <h2 className="plant-card__title">{plant.nama_lokal}</h2>
          <p className="plant-card__latin">{plant.nama_latin}</p>
        </div>

        <p className="plant-card__description">{plant.deskripsi}</p>

        <div className="plant-card__footer">
          <p className="plant-card__benefit">
            <strong>Khasiat:</strong> {plant.khasiat_medis}
          </p>

          <Link className="plant-card__link" to={`/tanaman/${plant.slug}`}>
            Lihat detail
          </Link>
        </div>
      </div>
    </article>
  )
}

export default PlantCard