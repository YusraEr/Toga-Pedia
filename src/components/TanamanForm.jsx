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
  const [formData, setFormData] = useState(() => ({
    ...initialState,
    ...initialValue,
    kategori_id: initialValue?.kategori_id ?? initialValue?.kategori?.id ?? '',
  }))
  const [errors, setErrors] = useState({})
  const [imgError, setImgError] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
    if (name === 'image_url') {
      setImgError(false)
    }
  }

  function validate() {
    const nextErrors = {}

    if (!formData.nama_lokal.trim()) {
      nextErrors.nama_lokal = 'Nama lokal tanaman wajib diisi.'
    }

    if (!formData.deskripsi.trim()) {
      nextErrors.deskripsi = 'Deskripsi tanaman wajib diisi.'
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
    <form className="admin-form form-user-friendly" onSubmit={handleSubmit}>
      {/* SECTION 1: Identitas Utama */}
      <fieldset className="form-section-group">
        <legend className="form-section-legend">
          <span className="section-step-num">1</span> 🌿 Identitas Utama Tanaman
        </legend>

        <div className="form-grid-three">
          <label className="field">
            <span>
              Nama Lokal Tanaman <strong className="required-star">*</strong>
            </span>
            <input
              name="nama_lokal"
              value={formData.nama_lokal}
              onChange={handleChange}
              placeholder="cth: Jahe Merah, Kunyit, Sirih"
              required
            />
            {errors.nama_lokal ? <small className="field-error">{errors.nama_lokal}</small> : null}
          </label>

          <label className="field">
            <span>Nama Latin / Ilmiah</span>
            <input
              name="nama_latin"
              value={formData.nama_latin}
              onChange={handleChange}
              placeholder="cth: Zingiber officinale"
            />
          </label>

          <label className="field">
            <span>Kategori Herbal</span>
            <select name="kategori_id" value={formData.kategori_id} onChange={handleChange}>
              <option value="">-- Pilih Kategori --</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nama_kategori}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="field form-field-full">
          <span>URL Foto Spesimen Tanaman</span>
          <input
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="https://images.unsplash.com/photo-..."
          />
          <small className="field-hint">
            Masukkan tautan URL foto spesimen tanaman yang jernih (Unsplash, Supabase Storage, dll).
          </small>
        </div>

        {formData.image_url && (
          <div className="form-media-preview">
            <span className="preview-label">Pratinjau Foto Spesimen:</span>
            <div className="preview-img-wrapper">
              {!imgError ? (
                <img
                  src={formData.image_url}
                  alt={`Pratinjau ${formData.nama_lokal || 'Tanaman'}`}
                  onError={() => setImgError(true)}
                  className="preview-img"
                />
              ) : (
                <div className="preview-img-fallback">URL Gambar Tidak Dapat Dimuat</div>
              )}
            </div>
          </div>
        )}
      </fieldset>

      {/* SECTION 2: Manfaat & Dosis Medis */}
      <fieldset className="form-section-group">
        <legend className="form-section-legend">
          <span className="section-step-num">2</span> 🏥 Informasi Kesehatan &amp; Dosis
        </legend>

        <label className="field form-field-full">
          <span>
            Gambaran / Deskripsi Umum <strong className="required-star">*</strong>
          </span>
          <textarea
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
            rows="3"
            placeholder="Tuliskan gambaran umum mengenai tanaman obat ini, ciri khas, serta penggunaannya di desa..."
            required
          />
          {errors.deskripsi ? <small className="field-error">{errors.deskripsi}</small> : null}
        </label>

        <div className="form-grid-two">
          <label className="field">
            <span>Khasiat &amp; Manfaat Medis</span>
            <textarea
              name="khasiat_medis"
              value={formData.khasiat_medis}
              onChange={handleChange}
              rows="3"
              placeholder="cth: Menghangatkan tubuh, membantu meredakan mual dan mendukung daya tahan tubuh..."
            />
          </label>

          <label className="field">
            <span>Takaran / Dosis Konsumsi Aman</span>
            <textarea
              name="takaran_konsumsi"
              value={formData.takaran_konsumsi}
              onChange={handleChange}
              rows="3"
              placeholder="cth: 1-2 gelas per hari dalam bentuk wedang atau rebusan ringan setelah makan..."
            />
          </label>
        </div>
      </fieldset>

      {/* SECTION 3: Pengolahan & Budidaya */}
      <fieldset className="form-section-group">
        <legend className="form-section-legend">
          <span className="section-step-num">3</span> 🍵 Pengolahan &amp; Budidaya Pekarangan
        </legend>

        <div className="form-grid-two">
          <label className="field">
            <span>Panduan Pengolahan &amp; Penyajian</span>
            <textarea
              name="panduan_olah"
              value={formData.panduan_olah}
              onChange={handleChange}
              rows="3"
              placeholder="cth: Kupas rimpang, iris tipis, lalu rebus dengan air secukupnya selama 10-15 menit..."
            />
          </label>

          <label className="field">
            <span>Panduan Budidaya Pekarangan</span>
            <textarea
              name="panduan_tanam"
              value={formData.panduan_tanam}
              onChange={handleChange}
              rows="3"
              placeholder="cth: Tanam rimpang pada tanah gembur, lembap, dan terkena sinar matahari tidak langsung..."
            />
          </label>
        </div>
      </fieldset>

      {/* FORM ACTION BUTTONS */}
      <div className="form-card-actions">
        <button className="button secondary" type="button" onClick={onCancel} disabled={submitting}>
          Batal
        </button>
        <button className="button primary form-submit-btn" type="submit" disabled={submitting}>
          {submitting ? 'Menyimpan Data...' : '✓ Simpan Informasi Tanaman'}
        </button>
      </div>
    </form>
  )
}

export default TanamanForm