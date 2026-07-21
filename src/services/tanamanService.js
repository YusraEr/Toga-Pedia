import { hasSupabaseConfig, supabase } from '../supabaseClient'

const demoTanaman = [
  {
    id: 'jahe',
    nama_lokal: 'Jahe',
    nama_latin: 'Zingiber officinale',
    slug: 'jahe',
    bagian_dimanfaatkan: 'Rimpang',
    khasiat_medis: 'Menghangatkan tubuh, membantu meredakan mual, dan mendukung daya tahan.',
    deskripsi:
      'Tanaman rempah yang mudah ditemukan di kebun rumah dan sering diolah menjadi minuman herbal.',
    dosis_konsumsi: '1-2 gelas per hari dalam bentuk wedang atau rebusan ringan.',
    cara_olah: 'Kupas, iris tipis, lalu rebus dengan air secukupnya selama 10-15 menit.',
    cara_tanam: 'Tanam rimpang pada tanah gembur, lembap, dan terkena sinar matahari tidak langsung.',
    foto_url:
      'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?auto=format&fit=crop&w=1200&q=80',
    kategori: { nama_kategori: 'Pencernaan & Penghangat' },
  },
  {
    id: 'kunyit',
    nama_lokal: 'Kunyit',
    nama_latin: 'Curcuma longa',
    slug: 'kunyit',
    bagian_dimanfaatkan: 'Rimpang',
    khasiat_medis: 'Mendukung kesehatan pencernaan dan membantu menjaga kebugaran harian.',
    deskripsi:
      'Bahan utama jamu tradisional yang kaya warna dan dikenal luas dalam perawatan herbal keluarga.',
    dosis_konsumsi: '1 gelas per hari atau sesuai kebutuhan konsumsi ringan.',
    cara_olah: 'Parut atau iris kunyit, lalu seduh dengan air hangat dan saring sebelum diminum.',
    cara_tanam: 'Gunakan media tanam porous dan siram secukupnya agar rimpang tidak busuk.',
    foto_url:
      'https://images.unsplash.com/photo-1581093806997-124204d9fa9d?auto=format&fit=crop&w=1200&q=80',
    kategori: { nama_kategori: 'Jamu Tradisional' },
  },
  {
    id: 'sirih',
    nama_lokal: 'Sirih',
    nama_latin: 'Piper betle',
    slug: 'sirih',
    bagian_dimanfaatkan: 'Daun',
    khasiat_medis: 'Sering digunakan untuk perawatan kebersihan mulut dan pemakaian luar tradisional.',
    deskripsi:
      'Daunnya mudah dikenali dan populer sebagai salah satu tanaman obat paling akrab di lingkungan desa.',
    dosis_konsumsi: 'Pemakaian secukupnya, umumnya sebagai rebusan untuk pemakaian luar atau berkumur.',
    cara_olah: 'Cuci bersih daun sirih, lalu rebus singkat untuk pemakaian luar atau berkumur.',
    cara_tanam: 'Sirih tumbuh baik pada media lembap dengan penopang rambat dan cahaya cukup.',
    foto_url:
      'https://images.unsplash.com/photo-1594282486552-05f3a1f7d8f9?auto=format&fit=crop&w=1200&q=80',
    kategori: { nama_kategori: 'Perawatan Harian' },
  },
  {
    id: 'temulawak',
    nama_lokal: 'Temulawak',
    nama_latin: 'Curcuma xanthorrhiza',
    slug: 'temulawak',
    bagian_dimanfaatkan: 'Rimpang',
    khasiat_medis: 'Mendukung nafsu makan dan kebugaran tubuh secara tradisional.',
    deskripsi:
      'Rempah herbal dengan warna khas yang sering dijadikan ramuan keluarga di pedesaan.',
    dosis_konsumsi: '1 gelas per hari setelah makan atau sesuai anjuran ramuan tradisional.',
    cara_olah: 'Iris rimpang temulawak lalu rebus hingga sari larut, kemudian saring.',
    cara_tanam: 'Tanam pada lahan gembur dengan drainase baik dan penyiraman teratur.',
    foto_url:
      'https://images.unsplash.com/photo-1594482322100-3d99d3f5b9d1?auto=format&fit=crop&w=1200&q=80',
    kategori: { nama_kategori: 'Nutrisi & Kebugaran' },
  },
]

function normalizeTanaman(item) {
  return {
    id: item.id,
    nama_lokal: item.nama_lokal ?? 'Tanaman belum diberi nama',
    nama_latin: item.nama_latin ?? '-',
    slug: item.slug ?? item.nama_lokal?.toLowerCase().replaceAll(' ', '-') ?? String(item.id),
    bagian_dimanfaatkan: item.bagian_dimanfaatkan ?? 'Belum ditentukan',
    khasiat_medis: item.khasiat_medis ?? 'Khasiat belum diisi.',
    deskripsi: item.deskripsi ?? 'Deskripsi belum tersedia.',
    dosis_konsumsi: item.dosis_konsumsi ?? 'Dosis belum tersedia.',
    cara_olah: item.cara_olah ?? 'Cara olah belum tersedia.',
    cara_tanam: item.cara_tanam ?? 'Panduan tanam belum tersedia.',
    foto_url: item.foto_url ?? '',
    kategori: item.kategori ?? null,
  }
}

export async function getTanamanCatalog() {
  if (!hasSupabaseConfig || !supabase) {
    return { data: demoTanaman, source: 'demo', error: null }
  }

  const { data, error } = await supabase
    .from('tanaman_toga')
    .select(
      `
        id,
        nama_lokal,
        nama_latin,
        slug,
        bagian_dimanfaatkan,
        khasiat_medis,
        deskripsi,
        kategori (
          nama_kategori
        )
      `,
    )
    .order('nama_lokal', { ascending: true })

  if (error) {
    return { data: demoTanaman, source: 'demo', error }
  }

  return { data: (data ?? []).map(normalizeTanaman), source: 'supabase', error: null }
}

export async function getTanamanBySlug(slug) {
  const catalog = await getTanamanCatalog()
  const tanaman = catalog.data.find((item) => item.slug === slug)

  if (tanaman) {
    return { data: tanaman, source: catalog.source, error: catalog.error }
  }

  return { data: null, source: catalog.source, error: catalog.error ?? new Error('Tanaman tidak ditemukan.') }
}