import { supabase } from '../supabaseClient'

const demoTanaman = [
  {
    id: 'jahe',
    slug: 'jahe',
    nama_lokal: 'Jahe',
    nama_latin: 'Zingiber officinale',
    khasiat_medis: 'Menghangatkan tubuh, membantu meredakan mual, dan mendukung daya tahan.',
    deskripsi:
      'Tanaman rempah yang mudah ditemukan di kebun rumah dan sering diolah menjadi minuman herbal.',
    takaran_konsumsi: '1-2 gelas per hari dalam bentuk wedang atau rebusan ringan.',
    panduan_olah: 'Kupas, iris tipis, lalu rebus dengan air secukupnya selama 10-15 menit.',
    panduan_tanam: 'Tanam rimpang pada tanah gembur, lembap, dan terkena sinar matahari tidak langsung.',
    image_url:
      'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?auto=format&fit=crop&w=1200&q=80',
    kategori: { nama_kategori: 'Pencernaan & Penghangat' },
  },
  {
    id: 'kunyit',
    slug: 'kunyit',
    nama_lokal: 'Kunyit',
    nama_latin: 'Curcuma longa',
    khasiat_medis: 'Mendukung kesehatan pencernaan dan membantu menjaga kebugaran harian.',
    deskripsi:
      'Bahan utama jamu tradisional yang kaya warna dan dikenal luas dalam perawatan herbal keluarga.',
    takaran_konsumsi: '1 gelas per hari atau sesuai kebutuhan konsumsi ringan.',
    panduan_olah: 'Parut atau iris kunyit, lalu seduh dengan air hangat dan saring sebelum diminum.',
    panduan_tanam: 'Gunakan media tanam porous dan siram secukupnya agar rimpang tidak busuk.',
    image_url:
      'https://images.unsplash.com/photo-1581093806997-124204d9fa9d?auto=format&fit=crop&w=1200&q=80',
    kategori: { nama_kategori: 'Jamu Tradisional' },
  },
  {
    id: 'sirih',
    slug: 'sirih',
    nama_lokal: 'Sirih',
    nama_latin: 'Piper betle',
    khasiat_medis: 'Sering digunakan untuk perawatan kebersihan mulut dan pemakaian luar tradisional.',
    deskripsi:
      'Daunnya mudah dikenali dan populer sebagai salah satu tanaman obat paling akrab di lingkungan desa.',
    takaran_konsumsi: 'Pemakaian secukupnya, umumnya sebagai rebusan untuk pemakaian luar atau berkumur.',
    panduan_olah: 'Cuci bersih daun sirih, lalu rebus singkat untuk pemakaian luar atau berkumur.',
    panduan_tanam: 'Sirih tumbuh baik pada media lembap dengan penopang rambat dan cahaya cukup.',
    image_url:
      'https://images.unsplash.com/photo-1594282486552-05f3a1f7d8f9?auto=format&fit=crop&w=1200&q=80',
    kategori: { nama_kategori: 'Perawatan Harian' },
  },
  {
    id: 'temulawak',
    slug: 'temulawak',
    nama_lokal: 'Temulawak',
    nama_latin: 'Curcuma xanthorrhiza',
    khasiat_medis: 'Mendukung nafsu makan dan kebugaran tubuh secara tradisional.',
    deskripsi:
      'Rempah herbal dengan warna khas yang sering dijadikan ramuan keluarga di pedesaan.',
    takaran_konsumsi: '1 gelas per hari setelah makan atau sesuai anjuran ramuan tradisional.',
    panduan_olah: 'Iris rimpang temulawak lalu rebus hingga sari larut, kemudian saring.',
    panduan_tanam: 'Tanam pada lahan gembur dengan drainase baik dan penyiraman teratur.',
    image_url:
      'https://images.unsplash.com/photo-1594482322100-3d99d3f5b9d1?auto=format&fit=crop&w=1200&q=80',
    kategori: { nama_kategori: 'Nutrisi & Kebugaran' },
  },
]

function normalizeTanaman(item) {
  const generatedSlug = item.nama_lokal?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') ?? String(item.id)

  return {
    id: item.id,
    nama_lokal: item.nama_lokal ?? 'Tanaman belum diberi nama',
    nama_latin: item.nama_latin ?? '-',
    khasiat_medis: item.khasiat_medis ?? 'Khasiat belum diisi.',
    deskripsi: item.deskripsi ?? 'Deskripsi belum tersedia.',
    takaran_konsumsi: item.takaran_konsumsi ?? 'Takaran konsumsi belum tersedia.',
    panduan_olah: item.panduan_olah ?? 'Panduan olah belum tersedia.',
    panduan_tanam: item.panduan_tanam ?? 'Panduan tanam belum tersedia.',
    image_url: item.image_url ?? '',
    kategori: item.kategori ?? null,
    slug: generatedSlug,
  }
}

export async function getTanamanCatalog() {
  const { data, error } = await supabase
    .from('tanaman_toga')
    .select(
      `
        id,
        nama_lokal,
        nama_latin,
        khasiat_medis,
        takaran_konsumsi,
        panduan_olah,
        panduan_tanam,
        deskripsi,
        image_url,
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
  const tanaman = catalog.data.find((item) => item.slug === slug) ?? null

  if (tanaman) {
    return { data: tanaman, source: catalog.source, error: catalog.error }
  }

  const fallback = demoTanaman.find((item) => item.slug === slug) ?? null

  if (fallback) {
    return {
      data: normalizeTanaman(fallback),
      source: 'demo',
      error: new Error('Tanaman tidak ditemukan di database, memakai data demo.'),
    }
  }

  return { data: null, source: catalog.source, error: new Error('Tanaman tidak ditemukan.') }
}