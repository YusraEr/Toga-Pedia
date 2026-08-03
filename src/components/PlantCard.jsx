import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon } from './Icons'

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=800&q=80'

function PlantCard({ plant }) {
  const [imgSrc, setImgSrc] = useState(plant.image_url || DEFAULT_IMAGE)

  const handleImageError = () => {
    if (imgSrc !== DEFAULT_IMAGE) {
      setImgSrc(DEFAULT_IMAGE)
    }
  }

  return (
    <Link to={`/tanaman/${plant.slug}`} className="plant-card" title={`Lihat detail ${plant.nama_lokal}`}>
      <div className="plant-card__media">
        <img
          src={imgSrc}
          alt={`Foto preview ${plant.nama_lokal}`}
          className="plant-card__img"
          onError={handleImageError}
          loading="lazy"
        />
        <div className="plant-card__media-overlay" />
        <span className="eyebrow eyebrow--soft plant-card__category">
          {plant.kategori?.nama_kategori ?? 'Kategori umum'}
        </span>
      </div>

      <div className="plant-card__body">
        <div className="plant-card__header">
          <div>
            <h3 className="plant-card__title">{plant.nama_lokal}</h3>
            <p className="plant-card__latin">{plant.nama_latin}</p>
          </div>
          <span className="plant-card__tag">Detail lengkap</span>
        </div>

        <p className="plant-card__description">{plant.deskripsi}</p>

        <div className="plant-card__footer">
          <p className="plant-card__benefit">
            <strong>Khasiat:</strong> {plant.khasiat_medis}
          </p>

          <span className="plant-card__link">
            Lihat detail <span className="plant-card__arrow" aria-hidden="true"><ArrowRightIcon size={16} /></span>
          </span>
        </div>
      </div>
    </Link>
  )
}

export default PlantCard