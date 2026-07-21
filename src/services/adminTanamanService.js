import { supabase } from '../supabaseClient'

function mapTanamanRow(row) {
  return {
    id: row.id,
    nama_lokal: row.nama_lokal ?? '',
    nama_latin: row.nama_latin ?? '',
    kategori_id: row.kategori_id ?? null,
    deskripsi: row.deskripsi ?? '',
    khasiat_medis: row.khasiat_medis ?? '',
    takaran_konsumsi: row.takaran_konsumsi ?? '',
    panduan_tanam: row.panduan_tanam ?? '',
    panduan_olah: row.panduan_olah ?? '',
    image_url: row.image_url ?? '',
    kategori: row.kategori ?? null,
  }
}

export async function fetchTanamanAdmin() {
  const { data, error } = await supabase
    .from('tanaman_toga')
    .select(
      `
        id,
        nama_lokal,
        nama_latin,
        kategori_id,
        deskripsi,
        khasiat_medis,
        takaran_konsumsi,
        panduan_tanam,
        panduan_olah,
        image_url,
        kategori (
          id,
          nama_kategori
        )
      `,
    )
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data ?? []).map(mapTanamanRow)
}

export async function fetchKategoriAdmin() {
  const { data, error } = await supabase
    .from('kategori')
    .select('id, nama_kategori')
    .order('nama_kategori', { ascending: true })

  if (error) {
    throw error
  }

  return data ?? []
}

export async function createTanaman(payload) {
  const { data, error } = await supabase
    .from('tanaman_toga')
    .insert({
      nama_lokal: payload.nama_lokal,
      nama_latin: payload.nama_latin || null,
      kategori_id: payload.kategori_id || null,
      deskripsi: payload.deskripsi,
      khasiat_medis: payload.khasiat_medis || null,
      takaran_konsumsi: payload.takaran_konsumsi || null,
      panduan_tanam: payload.panduan_tanam || null,
      panduan_olah: payload.panduan_olah || null,
      image_url: payload.image_url || null,
    })
    .select(
      `
        id,
        nama_lokal,
        nama_latin,
        kategori_id,
        deskripsi,
        khasiat_medis,
        takaran_konsumsi,
        panduan_tanam,
        panduan_olah,
        image_url,
        kategori (
          id,
          nama_kategori
        )
      `,
    )
    .single()

  if (error) {
    throw error
  }

  return mapTanamanRow(data)
}

export async function updateTanaman(id, payload) {
  const { data, error } = await supabase
    .from('tanaman_toga')
    .update({
      nama_lokal: payload.nama_lokal,
      nama_latin: payload.nama_latin || null,
      kategori_id: payload.kategori_id || null,
      deskripsi: payload.deskripsi,
      khasiat_medis: payload.khasiat_medis || null,
      takaran_konsumsi: payload.takaran_konsumsi || null,
      panduan_tanam: payload.panduan_tanam || null,
      panduan_olah: payload.panduan_olah || null,
      image_url: payload.image_url || null,
    })
    .eq('id', id)
    .select(
      `
        id,
        nama_lokal,
        nama_latin,
        kategori_id,
        deskripsi,
        khasiat_medis,
        takaran_konsumsi,
        panduan_tanam,
        panduan_olah,
        image_url,
        kategori (
          id,
          nama_kategori
        )
      `,
    )
    .single()

  if (error) {
    throw error
  }

  return mapTanamanRow(data)
}

export async function deleteTanaman(id) {
  const { error } = await supabase.from('tanaman_toga').delete().eq('id', id)

  if (error) {
    throw error
  }
}