import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CategoryForm from '../components/CategoryForm'
import TanamanForm from '../components/TanamanForm'
import useAuth from '../auth/useAuth'
import { createCategory, deleteCategory, fetchCategoriesAdmin, updateCategory } from '../services/adminCategoryService'
import { createTanaman, deleteTanaman, fetchTanamanAdmin, updateTanaman } from '../services/adminTanamanService'
import { LeafIcon, SearchIcon, SproutIcon, WarningIcon } from '../components/Icons'
import { useDebounce } from '../hooks/useDebounce'

const ITEMS_PER_PAGE = 6
const DEFAULT_PLANT_IMAGE = 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=400&q=80'

function AdminDashboardPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  // State Management
  const [tanaman, setTanaman] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categorySaving, setCategorySaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Main Active Tab: 'tanaman' | 'kategori'
  const [activeTab, setActiveTab] = useState('tanaman')

  // Search, Filter & Pagination for Tanaman
  const [tanamanQuery, setTanamanQuery] = useState('')
  const debouncedTanamanQuery = useDebounce(tanamanQuery, 300)
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortMode, setSortMode] = useState('newest')
  const [page, setPage] = useState(1)

  // Modal / Form States
  const [showTanamanForm, setShowTanamanForm] = useState(false)
  const [editingTanaman, setEditingTanaman] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState(null)

  // Auth logout
  async function handleLogout() {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  // Load Data
  async function loadData() {
    try {
      setLoading(true)
      const [tanamanData, categoryData] = await Promise.all([fetchTanamanAdmin(), fetchCategoriesAdmin()])
      setTanaman(tanamanData)
      setCategories(categoryData)
      setErrorMessage('')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Gagal memuat data admin.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [])

  // Plant Handlers
  function handleOpenCreateTanaman() {
    setErrorMessage('')
    setSuccessMessage('')
    setEditingTanaman(null)
    setShowTanamanForm(true)
  }

  function handleOpenEditTanaman(item) {
    setErrorMessage('')
    setSuccessMessage('')
    setEditingTanaman(item)
    setShowTanamanForm(true)
  }

  function handleCloseTanamanForm() {
    setShowTanamanForm(false)
    setEditingTanaman(null)
  }

  async function handleSaveTanaman(payload) {
    try {
      setSaving(true)

      if (editingTanaman) {
        const updated = await updateTanaman(editingTanaman.id, payload)
        setTanaman((current) => current.map((item) => (item.id === updated.id ? updated : item)))
        setSuccessMessage(`Data tanaman "${updated.nama_lokal}" berhasil diperbarui.`)
      } else {
        const created = await createTanaman(payload)
        setTanaman((current) => [created, ...current])
        setSuccessMessage(`Tanaman baru "${created.nama_lokal}" berhasil ditambahkan.`)
      }

      setShowTanamanForm(false)
      setEditingTanaman(null)
      setErrorMessage('')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Gagal menyimpan data tanaman.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteTanamanConfirmed() {
    if (!deleteTarget) return
    try {
      await deleteTanaman(deleteTarget.id)
      setTanaman((current) => current.filter((item) => item.id !== deleteTarget.id))
      setSuccessMessage(`Tanaman "${deleteTarget.nama_lokal}" berhasil dihapus.`)
      setDeleteTarget(null)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Gagal menghapus tanaman.')
    }
  }

  // Category Handlers
  function handleOpenCreateCategory() {
    setErrorMessage('')
    setSuccessMessage('')
    setEditingCategory(null)
    setShowCategoryForm(true)
  }

  function handleOpenEditCategory(item) {
    setErrorMessage('')
    setSuccessMessage('')
    setEditingCategory(item)
    setShowCategoryForm(true)
  }

  function handleCloseCategoryForm() {
    setShowCategoryForm(false)
    setEditingCategory(null)
  }

  async function handleSaveCategory(payload) {
    try {
      setCategorySaving(true)

      if (editingCategory) {
        const updated = await updateCategory(editingCategory.id, payload)
        setCategories((current) => current.map((item) => (item.id === updated.id ? updated : item)))
        setSuccessMessage(`Kategori "${updated.nama_kategori}" berhasil diperbarui.`)
      } else {
        const created = await createCategory(payload)
        setCategories((current) => [...current, created].sort((a, b) => a.nama_kategori.localeCompare(b.nama_kategori)))
        setSuccessMessage(`Kategori baru "${created.nama_kategori}" berhasil ditambahkan.`)
      }

      setShowCategoryForm(false)
      setEditingCategory(null)
      setErrorMessage('')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Gagal menyimpan kategori.')
    } finally {
      setCategorySaving(false)
    }
  }

  async function handleDeleteCategoryConfirmed() {
    if (!deleteCategoryTarget) return
    try {
      await deleteCategory(deleteCategoryTarget.id)
      setCategories((current) => current.filter((item) => item.id !== deleteCategoryTarget.id))
      setSuccessMessage(`Kategori "${deleteCategoryTarget.nama_kategori}" berhasil dihapus.`)
      setDeleteCategoryTarget(null)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Gagal menghapus kategori.')
    }
  }

  // Filters & Computations
  const categoryOptions = useMemo(
    () => categories.map((cat) => ({ value: String(cat.id), label: cat.nama_kategori })),
    [categories]
  )

  const filteredTanaman = useMemo(() => {
    const normalizedQuery = debouncedTanamanQuery.trim().toLowerCase()
    let list = tanaman

    if (categoryFilter !== 'all') {
      list = list.filter((item) => String(item.kategori?.id ?? '') === categoryFilter)
    }

    if (normalizedQuery) {
      list = list.filter((item) => {
        const text = [item.nama_lokal, item.nama_latin, item.kategori?.nama_kategori]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return text.includes(normalizedQuery)
      })
    }

    if (sortMode === 'alphabetical') {
      return [...list].sort((a, b) => a.nama_lokal.localeCompare(b.nama_lokal))
    }

    return list
  }, [categoryFilter, sortMode, tanaman, debouncedTanamanQuery])

  const totalPages = Math.max(1, Math.ceil(filteredTanaman.length / ITEMS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const paginatedTanaman = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredTanaman.slice(start, start + ITEMS_PER_PAGE)
  }, [currentPage, filteredTanaman])

  const resetFilters = () => {
    setTanamanQuery('')
    setCategoryFilter('all')
    setSortMode('newest')
    setPage(1)
  }

  return (
    <div className="admin-dashboard-container">
      {/* CMS Header Banner */}
      <header className="admin-header-card">
        <div className="admin-header-main">
          <div>
            <span className="eyebrow admin-badge">
              <span className="admin-badge__dot" /> CMS Portal Admin
            </span>
            <h1 className="admin-title">Pengelolaan Data TOGA Pedia</h1>
            <p className="admin-subtitle">
              Sistem manajemen konten terstruktur untuk mengelola katalog tanaman obat, kategori kesehatan, dan media edukasi desa.
            </p>
          </div>

          <div className="admin-user-box">
            <span className="user-email">{user?.email ?? 'admin@togapedia.id'}</span>
            <button className="button secondary logout-btn" type="button" onClick={handleLogout}>
              Keluar
            </button>
          </div>
        </div>

        {/* System Stats Bar */}
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <span className="stat-label">Total Tanaman</span>
            <strong className="stat-value">{tanaman.length}</strong>
          </div>
          <div className="admin-stat-card">
            <span className="stat-label">Total Kategori</span>
            <strong className="stat-value">{categories.length}</strong>
          </div>
          <div className="admin-stat-card">
            <span className="stat-label">Hasil Tampilan</span>
            <strong className="stat-value">{filteredTanaman.length}</strong>
          </div>
        </div>
      </header>

      {/* Alert Notices */}
      {successMessage && (
        <aside className="notice notice--success notice--actionable" role="status">
          <div className="notice__content">
            <strong>Berhasil:</strong> <span>{successMessage}</span>
          </div>
          <button className="button secondary notice__button" type="button" onClick={() => setSuccessMessage('')}>
            Tutup
          </button>
        </aside>
      )}

      {errorMessage && (
        <aside className="notice notice--actionable" role="alert">
          <div className="notice__content">
            <strong>Catatan:</strong> <span>{errorMessage}</span>
          </div>
          <button className="button secondary notice__button" type="button" onClick={() => setErrorMessage('')}>
            Tutup
          </button>
        </aside>
      )}

      {/* Main Modular Navigation Tabs */}
      <div className="admin-nav-tabs">
        <button
          className={`admin-tab-btn ${activeTab === 'tanaman' ? 'active' : ''}`}
          type="button"
          onClick={() => setActiveTab('tanaman')}
        >
          <LeafIcon size={18} /> Kelola Data Tanaman ({tanaman.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'kategori' ? 'active' : ''}`}
          type="button"
          onClick={() => setActiveTab('kategori')}
        >
          <SproutIcon size={18} /> Kelola Kategori ({categories.length})
        </button>

        <button className="button secondary refresh-btn" type="button" onClick={loadData} disabled={loading}>
          {loading ? 'Menyegarkan...' : 'Muat Ulang Data'}
        </button>
      </div>

      {/* TAB 1: Kelola Data Tanaman */}
      {activeTab === 'tanaman' && (
        <section className="admin-module-section">
          <div className="module-header-bar">
            <div>
              <h2 className="module-title">Katalog Data Tanaman Obat</h2>
              <p className="module-desc">Tambah, perbarui, atau hapus data tanaman yang tampil di publik.</p>
            </div>

            <button className="button primary add-btn" type="button" onClick={handleOpenCreateTanaman}>
              + Tambah Tanaman Baru
            </button>
          </div>

          {/* Form Modal / Collapsible Section for Tanaman */}
          {showTanamanForm && (
            <div className="form-card-overlay">
              <div className="form-card-header">
                <h3>{editingTanaman ? `Edit Data: ${editingTanaman.nama_lokal}` : 'Input Tanaman Obat Baru'}</h3>
                <button className="button secondary" type="button" onClick={handleCloseTanamanForm}>
                  Batal
                </button>
              </div>

              <TanamanForm
                categories={categories}
                initialValue={editingTanaman}
                onCancel={handleCloseTanamanForm}
                onSubmit={handleSaveTanaman}
                submitting={saving}
                key={editingTanaman?.id ?? 'create-plant'}
              />
            </div>
          )}

          {/* Search & Filter Toolbar */}
          <div className="admin-toolbar-card">
            <div className="search-box">
              <span className="search-box__icon">
                <SearchIcon size={18} />
              </span>
              <input
                type="search"
                value={tanamanQuery}
                onChange={(e) => {
                  setTanamanQuery(e.target.value)
                  setPage(1)
                }}
                placeholder="Cari berdasarkan nama lokal, latin, atau kategori..."
              />
            </div>

            <div className="toolbar-controls">
              <label className="select-field">
                <span>Filter Kategori</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value)
                    setPage(1)
                  }}
                >
                  <option value="all">Semua Kategori</option>
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="select-field">
                <span>Urutkan</span>
                <select
                  value={sortMode}
                  onChange={(e) => {
                    setSortMode(e.target.value)
                    setPage(1)
                  }}
                >
                  <option value="newest">Terbaru Dulu</option>
                  <option value="alphabetical">A-Z (Nama Lokal)</option>
                </select>
              </label>

              {(tanamanQuery || categoryFilter !== 'all') && (
                <button className="reset-filter-btn" type="button" onClick={resetFilters}>
                  Reset Filter
                </button>
              )}
            </div>
          </div>

          {/* Plant Data Table */}
          {loading ? (
            <div className="admin-loading-card">Memuat data tanaman...</div>
          ) : paginatedTanaman.length > 0 ? (
            <div className="admin-table-wrapper">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Preview</th>
                    <th>Nama Tanaman</th>
                    <th>Kategori</th>
                    <th>Khasiat Ringkas</th>
                    <th className="text-right">Aksi Management</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTanaman.map((item) => (
                    <tr key={item.id}>
                      <td className="cell-thumb">
                        <img
                          src={item.image_url || DEFAULT_PLANT_IMAGE}
                          alt={item.nama_lokal}
                          className="table-plant-thumb"
                          onError={(e) => {
                            e.currentTarget.src = DEFAULT_PLANT_IMAGE
                          }}
                        />
                      </td>
                      <td className="cell-name">
                        <strong>{item.nama_lokal}</strong>
                        <small>{item.nama_latin || '-'}</small>
                      </td>
                      <td className="cell-category">
                        <span className="table-badge">{item.kategori?.nama_kategori ?? 'Umum'}</span>
                      </td>
                      <td className="cell-benefit">
                        <p className="line-clamp-2">{item.khasiat_medis || '-'}</p>
                      </td>
                      <td className="cell-actions text-right">
                        <button
                          className="button secondary btn-sm"
                          type="button"
                          onClick={() => handleOpenEditTanaman(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="button danger btn-sm"
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="admin-pagination-bar">
                <span>
                  Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong> ({filteredTanaman.length} data)
                </span>
                <div className="pagination-btns">
                  <button
                    className="button secondary btn-sm"
                    type="button"
                    onClick={() => setPage((v) => Math.max(1, v - 1))}
                    disabled={currentPage === 1}
                  >
                    ← Sebelumnya
                  </button>
                  <button
                    className="button secondary btn-sm"
                    type="button"
                    onClick={() => setPage((v) => Math.min(totalPages, v + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Berikutnya →
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-catalog-state surface-card center">
              <span className="empty-icon" aria-hidden="true">🌱</span>
              <h3>Tanaman Tidak Ditemukan</h3>
              <p>Tidak ada data tanaman yang cocok dengan pencarian atau filter Anda.</p>
              <button className="button primary" type="button" onClick={resetFilters}>
                Reset Filter &amp; Tampilkan Semua
              </button>
            </div>
          )}
        </section>
      )}

      {/* TAB 2: Kelola Data Kategori */}
      {activeTab === 'kategori' && (
        <section className="admin-module-section">
          <div className="module-header-bar">
            <div>
              <h2 className="module-title">Kategori Kesehatan Herbal</h2>
              <p className="module-desc">Kelola kelompok kategori untuk mengelompokkan tanaman obat keluarga.</p>
            </div>

            <button className="button primary add-btn" type="button" onClick={handleOpenCreateCategory}>
              + Tambah Kategori Baru
            </button>
          </div>

          {/* Form Modal / Collapsible Section for Category */}
          {showCategoryForm && (
            <div className="form-card-overlay">
              <div className="form-card-header">
                <h3>{editingCategory ? `Edit Kategori: ${editingCategory.nama_kategori}` : 'Input Kategori Baru'}</h3>
                <button className="button secondary" type="button" onClick={handleCloseCategoryForm}>
                  Batal
                </button>
              </div>

              <CategoryForm
                initialValue={editingCategory}
                onCancel={handleCloseCategoryForm}
                onSubmit={handleSaveCategory}
                submitting={categorySaving}
                key={editingCategory?.id ?? 'create-category'}
              />
            </div>
          )}

          {/* Category Data Table */}
          <div className="admin-table-wrapper">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Nama Kategori</th>
                  <th>Deskripsi Kategori</th>
                  <th>Jumlah Tanaman</th>
                  <th className="text-right">Aksi Management</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => {
                  const plantCount = tanaman.filter((item) => String(item.kategori?.id ?? '') === String(cat.id)).length

                  return (
                    <tr key={cat.id}>
                      <td className="cell-name">
                        <strong>{cat.nama_kategori}</strong>
                      </td>
                      <td className="cell-benefit">
                        <p>{cat.deskripsi || 'Belum ada deskripsi.'}</p>
                      </td>
                      <td className="cell-category">
                        <span className="table-badge">{plantCount} tanaman</span>
                      </td>
                      <td className="cell-actions text-right">
                        <button
                          className="button secondary btn-sm"
                          type="button"
                          onClick={() => handleOpenEditCategory(cat)}
                        >
                          Edit
                        </button>
                        <button
                          className="button danger btn-sm"
                          type="button"
                          onClick={() => setDeleteCategoryTarget(cat)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Delete Plant Confirmation Modal */}
      {deleteTarget && (
        <section className="modal-backdrop" role="presentation" onClick={() => setDeleteTarget(null)}>
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="eyebrow">Konfirmasi Hapus</span>
            <h2 id="delete-title">Hapus Tanaman "{deleteTarget.nama_lokal}"?</h2>
            <p>Tindakan ini akan menghapus data tanaman secara permanen dari database.</p>

            <div className="form-actions">
              <button className="button secondary" type="button" onClick={() => setDeleteTarget(null)}>
                Batal
              </button>
              <button className="button danger" type="button" onClick={handleDeleteTanamanConfirmed}>
                Ya, Hapus Tanaman
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Delete Category Confirmation Modal */}
      {deleteCategoryTarget && (
        <section className="modal-backdrop" role="presentation" onClick={() => setDeleteCategoryTarget(null)}>
          <div
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-cat-title"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="eyebrow">Konfirmasi Hapus</span>
            <h2 id="delete-cat-title">Hapus Kategori "{deleteCategoryTarget.nama_kategori}"?</h2>
            <p>Kategori yang dihapus akan dilepas dari tanaman yang menggunakannya.</p>

            <div className="form-actions">
              <button className="button secondary" type="button" onClick={() => setDeleteCategoryTarget(null)}>
                Batal
              </button>
              <button className="button danger" type="button" onClick={handleDeleteCategoryConfirmed}>
                Ya, Hapus Kategori
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default AdminDashboardPage