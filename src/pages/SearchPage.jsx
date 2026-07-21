import TanamanCollectionView from '../components/TanamanCollectionView'

function SearchPage() {
  return (
    <TanamanCollectionView
      eyebrow="Pencarian tanaman"
      title="Cari tanaman berdasarkan nama"
      description="Gunakan route pencarian khusus untuk menemukan tanaman lebih cepat, tanpa bercampur dengan tampilan daftar lengkap."
      sectionEyebrow="Cari cepat"
      sectionTitle="Temukan tanaman yang dibutuhkan"
      searchable
      searchLabel="Cari nama tanaman"
      searchPlaceholder="Contoh: jahe, kunyit, sirih"
      emptyTitle="Tanaman tidak ditemukan"
      emptyDescription="Coba gunakan nama tanaman yang lebih umum atau hapus kata kunci pencarian."
      emptyActionLabel="Hapus pencarian"
      emptyActionTo="/pencarian"
    />
  )
}

export default SearchPage