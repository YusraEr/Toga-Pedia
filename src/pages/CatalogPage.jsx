import TanamanCollectionView from '../components/TanamanCollectionView'

function CatalogPage() {
  return (
    <TanamanCollectionView
      eyebrow="Daftar tanaman"
      title="Katalog lengkap tanaman obat keluarga"
      description="Jelajahi semua tanaman yang terdata dalam format katalog yang rapi, tanpa distraksi pencarian, agar warga bisa membaca lebih tenang."
      sectionEyebrow="Seluruh koleksi"
      sectionTitle="Semua tanaman terdata"
      searchable={false}
      emptyTitle="Belum ada data tanaman"
      emptyDescription="Tambahkan data di Supabase agar katalog publik langsung terisi."
    />
  )
}

export default CatalogPage