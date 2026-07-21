import { useState } from 'react'

const initialState = {
  nama_kategori: '',
  deskripsi: '',
}

function CategoryForm({ initialValue, onCancel, onSubmit, submitting }) {
  const [formData, setFormData] = useState(
    () => ({
      ...initialState,
      ...initialValue,
    }),
  )
  const [errors, setErrors] = useState({})

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  function validate() {
    const nextErrors = {}

    if (!formData.nama_kategori.trim()) {
      nextErrors.nama_kategori = 'Nama kategori harus diisi.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!validate()) {
      return
    }

    onSubmit(formData)
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="grid form-grid">
        <label className="field field--full">
          <span>Nama kategori</span>
          <input name="nama_kategori" value={formData.nama_kategori} onChange={handleChange} required />
          {errors.nama_kategori ? <small className="field-error">{errors.nama_kategori}</small> : null}
        </label>

        <label className="field field--full">
          <span>Deskripsi</span>
          <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows="3" />
          <small className="field-hint">Contoh: tanaman untuk penghangat badan atau jamu tradisional.</small>
        </label>
      </div>

      <div className="form-actions">
        <button className="button secondary" type="button" onClick={onCancel}>
          Batal
        </button>
        <button className="button primary" type="submit" disabled={submitting}>
          {submitting ? 'Menyimpan...' : 'Simpan kategori'}
        </button>
      </div>
    </form>
  )
}

export default CategoryForm