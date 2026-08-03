import { useState } from 'react'
import { sanitizeInput } from '../utils/sanitize'

const initialState = {
  nama_kategori: '',
  deskripsi: '',
}

function CategoryForm({ initialValue, onCancel, onSubmit, submitting }) {
  const [formData, setFormData] = useState(() => ({
    ...initialState,
    ...initialValue,
  }))
  const [errors, setErrors] = useState({})

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  function validate() {
    const nextErrors = {}
    const cleanNama = sanitizeInput(formData.nama_kategori)

    if (!cleanNama || cleanNama.length < 2) {
      nextErrors.nama_kategori = 'Nama kategori minimal 2 karakter.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!validate()) {
      return
    }

    const sanitizedPayload = {
      nama_kategori: sanitizeInput(formData.nama_kategori),
      deskripsi: sanitizeInput(formData.deskripsi),
    }

    onSubmit(sanitizedPayload)
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="grid form-grid">
        <label className="field field--full">
          <span>
            Nama kategori <strong className="required-star">*</strong>
          </span>
          <input
            name="nama_kategori"
            value={formData.nama_kategori}
            onChange={handleChange}
            placeholder="cth: Pencernaan, Perawatan Harian, Jamu Tradisional"
            required
          />
          {errors.nama_kategori ? <small className="field-error">{errors.nama_kategori}</small> : null}
        </label>

        <label className="field field--full">
          <span>Deskripsi Kategori</span>
          <textarea
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
            rows="3"
            placeholder="Contoh: Tanaman obat herbal yang berkhasiat untuk penghangat badan dan kesehatan pencernaan..."
          />
          <small className="field-hint">
            Deskripsi singkat kelompok kategori untuk memudahkan klasifikasi tanaman.
          </small>
        </label>
      </div>

      <div className="form-actions">
        <button className="button secondary" type="button" onClick={onCancel} disabled={submitting}>
          Batal
        </button>
        <button className="button primary" type="submit" disabled={submitting}>
          {submitting ? 'Menyimpan...' : '✓ Simpan Kategori'}
        </button>
      </div>
    </form>
  )
}

export default CategoryForm