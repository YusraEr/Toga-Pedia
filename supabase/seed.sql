-- Seed data awal untuk katalog TOGA.

insert into public.kategori (nama_kategori, deskripsi)
values
  ('Pencernaan & Penghangat', 'Tanaman untuk membantu rasa hangat dan pencernaan.'),
  ('Jamu Tradisional', 'Rempah yang umum dipakai dalam ramuan jamu keluarga.'),
  ('Perawatan Harian', 'Tanaman yang sering dipakai untuk kebersihan dan perawatan ringan.'),
  ('Nutrisi & Kebugaran', 'Tanaman untuk mendukung stamina dan kebugaran.')
on conflict do nothing;

insert into public.tanaman_toga (
  nama_lokal,
  nama_latin,
  kategori_id,
  deskripsi,
  khasiat_medis,
  takaran_konsumsi,
  panduan_tanam,
  panduan_olah,
  image_url
)
select
  'Jahe',
  'Zingiber officinale',
  k.id,
  'Tanaman rempah yang mudah ditemukan di kebun rumah dan sering diolah menjadi minuman herbal.',
  'Menghangatkan tubuh, membantu meredakan mual, dan mendukung daya tahan.',
  '1-2 gelas per hari dalam bentuk wedang atau rebusan ringan.',
  'Tanam rimpang pada tanah gembur, lembap, dan terkena sinar matahari tidak langsung.',
  'Kupas, iris tipis, lalu rebus dengan air secukupnya selama 10-15 menit.',
  'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?auto=format&fit=crop&w=1200&q=80'
from public.kategori k
where k.nama_kategori = 'Pencernaan & Penghangat';

insert into public.tanaman_toga (
  nama_lokal,
  nama_latin,
  kategori_id,
  deskripsi,
  khasiat_medis,
  takaran_konsumsi,
  panduan_tanam,
  panduan_olah,
  image_url
)
select
  'Kunyit',
  'Curcuma longa',
  k.id,
  'Bahan utama jamu tradisional yang kaya warna dan dikenal luas dalam perawatan herbal keluarga.',
  'Mendukung kesehatan pencernaan dan membantu menjaga kebugaran harian.',
  '1 gelas per hari atau sesuai kebutuhan konsumsi ringan.',
  'Gunakan media tanam porous dan siram secukupnya agar rimpang tidak busuk.',
  'Parut atau iris kunyit, lalu seduh dengan air hangat dan saring sebelum diminum.',
  'https://images.unsplash.com/photo-1581093806997-124204d9fa9d?auto=format&fit=crop&w=1200&q=80'
from public.kategori k
where k.nama_kategori = 'Jamu Tradisional';

insert into public.tanaman_toga (
  nama_lokal,
  nama_latin,
  kategori_id,
  deskripsi,
  khasiat_medis,
  takaran_konsumsi,
  panduan_tanam,
  panduan_olah,
  image_url
)
select
  'Sirih',
  'Piper betle',
  k.id,
  'Daunnya mudah dikenali dan populer sebagai salah satu tanaman obat paling akrab di lingkungan desa.',
  'Sering digunakan untuk perawatan kebersihan mulut dan pemakaian luar tradisional.',
  'Pemakaian secukupnya, umumnya sebagai rebusan untuk pemakaian luar atau berkumur.',
  'Sirih tumbuh baik pada media lembap dengan penopang rambat dan cahaya cukup.',
  'Cuci bersih daun sirih, lalu rebus singkat untuk pemakaian luar atau berkumur.',
  'https://images.unsplash.com/photo-1594282486552-05f3a1f7d8f9?auto=format&fit=crop&w=1200&q=80'
from public.kategori k
where k.nama_kategori = 'Perawatan Harian';

insert into public.tanaman_toga (
  nama_lokal,
  nama_latin,
  kategori_id,
  deskripsi,
  khasiat_medis,
  takaran_konsumsi,
  panduan_tanam,
  panduan_olah,
  image_url
)
select
  'Temulawak',
  'Curcuma xanthorrhiza',
  k.id,
  'Rempah herbal dengan warna khas yang sering dijadikan ramuan keluarga di pedesaan.',
  'Mendukung nafsu makan dan kebugaran tubuh secara tradisional.',
  '1 gelas per hari setelah makan atau sesuai anjuran ramuan tradisional.',
  'Tanam pada lahan gembur dengan drainase baik dan penyiraman teratur.',
  'Iris rimpang temulawak lalu rebus hingga sari larut, kemudian saring.',
  'https://images.unsplash.com/photo-1594482322100-3d99d3f5b9d1?auto=format&fit=crop&w=1200&q=80'
from public.kategori k
where k.nama_kategori = 'Nutrisi & Kebugaran';