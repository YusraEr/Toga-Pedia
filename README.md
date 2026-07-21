# TOGA Pedia Desa

Frontend React + Vite untuk katalog TOGA, detail tanaman, dan dashboard admin berbasis Supabase.

## Setup Lokal

1. Install dependency.
2. Pastikan file `.env.local` berisi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`.
3. Jalankan `npm run dev`.

## Database Supabase

Skema database ada di [supabase/schema.sql](supabase/schema.sql). File ini membuat dua tabel inti:

1. `kategori` untuk kelompok tanaman.
2. `tanaman_toga` untuk data katalog utama.

Seed awal ada di [supabase/seed.sql](supabase/seed.sql) dan bisa dijalankan setelah schema aktif.

Urutan yang disarankan di Supabase SQL Editor:

1. Jalankan `supabase/schema.sql`.
2. Jalankan `supabase/seed.sql`.

## Catatan Akses Data

Koneksi Supabase dipusatkan di [src/supabaseClient.js](src/supabaseClient.js). Seluruh query katalog dan detail tanaman lewat [src/services/tanamanService.js](src/services/tanamanService.js).

Frontend hanya memakai anon key publik Supabase yang dibaca dari `VITE_SUPABASE_ANON_KEY`.
