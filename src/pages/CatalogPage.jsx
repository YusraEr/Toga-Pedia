import { useEffect } from 'react'
import TanamanCollectionView from '../components/TanamanCollectionView'
import { setPageMeta } from '../utils/seo'

function CatalogPage() {
  useEffect(() => {
    setPageMeta({
      title: 'Katalog Tanaman Obat Keluarga',
      description: 'Jelajahi seluruh koleksi tanaman obat tradisional, cari berdasarkan nama lokal, atau saring berdasarkan kategori kesehatan.',
    })
  }, [])

  return (
    <TanamanCollectionView
      eyebrow="Ensiklopedia Herbal"
      title="Katalog Tanaman Obat Keluarga"
      description="Jelajahi seluruh koleksi tanaman obat tradisional, cari berdasarkan nama lokal, atau saring berdasarkan kategori kesehatan."
    />
  )
}

export default CatalogPage