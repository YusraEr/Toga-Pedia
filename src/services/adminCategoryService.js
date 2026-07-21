import { supabase } from '../supabaseClient'

function mapCategoryRow(row) {
  return {
    id: row.id,
    nama_kategori: row.nama_kategori ?? '',
    deskripsi: row.deskripsi ?? '',
  }
}

export async function fetchCategoriesAdmin() {
  const { data, error } = await supabase
    .from('kategori')
    .select('id, nama_kategori, deskripsi')
    .order('nama_kategori', { ascending: true })

  if (error) {
    throw error
  }

  return (data ?? []).map(mapCategoryRow)
}

export async function createCategory(payload) {
  const { data, error } = await supabase
    .from('kategori')
    .insert({
      nama_kategori: payload.nama_kategori,
      deskripsi: payload.deskripsi || null,
    })
    .select('id, nama_kategori, deskripsi')
    .single()

  if (error) {
    throw error
  }

  return mapCategoryRow(data)
}

export async function updateCategory(id, payload) {
  const { data, error } = await supabase
    .from('kategori')
    .update({
      nama_kategori: payload.nama_kategori,
      deskripsi: payload.deskripsi || null,
    })
    .eq('id', id)
    .select('id, nama_kategori, deskripsi')
    .single()

  if (error) {
    throw error
  }

  return mapCategoryRow(data)
}

export async function deleteCategory(id) {
  const { error } = await supabase.from('kategori').delete().eq('id', id)

  if (error) {
    throw error
  }
}