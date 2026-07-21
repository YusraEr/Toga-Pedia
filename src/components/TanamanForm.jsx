import { useState } from 'react'

const initialState = {
  nama_lokal: '',
  nama_latin: '',
  kategori_id: '',
  deskripsi: '',
  khasiat_medis: '',
  takaran_konsumsi: '',
  panduan_tanam: '',
  panduan_olah: '',
  image_url: '',
}

function TanamanForm({ categories, initialValue, onCancel, onSubmit, submitting }) {
  const [formData, setFormData] = useState(
    () => ({
      ...initialState,
      ...initialValue,
      kategori_id: initialValue?.kategori_id ?? initialValue?.kategori?.id ?? '',
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

    if (!formData.nama_lokal.trim()) {
      nextErrors.nama_lokal = 'Nama lokal wajib diisi.'
    }

    if (!formData.deskripsi.trim()) {
      nextErrors.deskripsi = 'Deskripsi wajib diisi.'
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
        <label className="field">
          <span>Nama lokal</span>
          <input name="nama_lokal" value={formData.nama_lokal} onChange={handleChange} required />
          {errors.nama_lokal ? <small className="field-error">{errors.nama_lokal}</small> : null}
        </label>

        <label className="field">
          <span>Nama latin</span>
          <input name="nama_latin" value={formData.nama_latin} onChange={handleChange} />
        </label>

        <label className="field">
          <span>Kategori</span>
          <select name="kategori_id" value={formData.kategori_id} onChange={handleChange}>
            <option value="">Pilih kategori</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nama_kategori}
              </option>
            ))}
          </select>
        </label>

        <label className="field field--full">
          <span>Deskripsi</span>
          <textarea name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows="3" required />
          {errors.deskripsi ? <small className="field-error">{errors.deskripsi}</small> : null}
        </label>

        <label className="field field--full">
          <span>Khasiat medis</span>
          <textarea name="khasiat_medis" value={formData.khasiat_medis} onChange={handleChange} rows="3" />
        </label>

        <label className="field">
          <span>Takaran konsumsi</span>
          <textarea name="takaran_konsumsi" value={formData.takaran_konsumsi} onChange={handleChange} rows="3" />
        </label>

        <label className="field">
          <span>Panduan tanam</span>
          <textarea name="panduan_tanam" value={formData.panduan_tanam} onChange={handleChange} rows="3" />
        </label>

        <label className="field field--full">
          <span>Panduan olah</span>
          <textarea name="panduan_olah" value={formData.panduan_olah} onChange={handleChange} rows="3" />
        </label>

        <label className="field field--full">
          <span>Image URL</span>
          <input name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://..." />
          <small className="field-hint">Gunakan tautan gambar jika ingin menampilkan media tanaman di katalog.</small>
        </label>

        {formData.image_url ? (
          <div className="media-preview field--full">
            <span>Pratinjau media</span>
            <img src={formData.image_url} alt={`Pratinjau ${formData.nama_lokal || 'tanaman'}`} />
          </div>
        ) : null}
      </div>

      <div className="form-actions">
        <button className="button secondary" type="button" onClick={onCancel}>
          Batal
        </button>
        <button className="button primary" type="submit" disabled={submitting}>
          {submitting ? 'Menyimpan...' : 'Simpan tanaman'}
        </button>
      </div>
    </form>
  )
}

export default TanamanForm