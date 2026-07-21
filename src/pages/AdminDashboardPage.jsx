import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CategoryForm from '../components/CategoryForm'
import TanamanForm from '../components/TanamanForm'
import useAuth from '../auth/useAuth'
import { createCategory, deleteCategory, fetchCategoriesAdmin, updateCategory } from '../services/adminCategoryService'
import { createTanaman, deleteTanaman, fetchTanamanAdmin, updateTanaman } from '../services/adminTanamanService'

const ITEMS_PER_PAGE = 6

function AdminDashboardPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [tanaman, setTanaman] = useState([])
  const [categories, setCategories] = useState([])
  const [categorySaving, setCategorySaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [tanamanQuery, setTanamanQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortMode, setSortMode] = useState('newest')
  const [page, setPage] = useState(1)
  const [editingTanaman, setEditingTanaman] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState(null)
  const [activeFormTab, setActiveFormTab] = useState('tanaman')

  async function handleLogout() {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  function handleStartTanamanEdit(item) {
    setErrorMessage('')
    setSuccessMessage('')
    setActiveFormTab('tanaman')
    setEditingCategory(null)
    setDeleteCategoryTarget(null)
    setEditingTanaman(item)
  }

  function handleStartTanamanCreate() {
    setErrorMessage('')
    setSuccessMessage('')
    setActiveFormTab('tanaman')
    setEditingTanaman(null)
    setDeleteTarget(null)
  }

  function handleStartCategoryEdit(item) {
    setErrorMessage('')
    setSuccessMessage('')
    setActiveFormTab('kategori')
    setEditingTanaman(null)
    setDeleteTarget(null)
    setEditingCategory(item)
  }

  function handleStartCategoryCreate() {
    setErrorMessage('')
    setSuccessMessage('')
    setActiveFormTab('kategori')
    setEditingCategory(null)
  }

  function resetTanamanFilters() {
    setTanamanQuery('')
    setCategoryFilter('all')
    setSortMode('newest')
    setPage(1)
  }

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      try {
        setLoading(true)
        const [tanamanData, categoryData] = await Promise.all([fetchTanamanAdmin(), fetchCategoriesAdmin()])

        if (!isMounted) {
          return
        }

        setTanaman(tanamanData)
        setCategories(categoryData)
        setErrorMessage('')
      } catch (error) {
        if (!isMounted) {
          return
        }

        setErrorMessage(error instanceof Error ? error.message : 'Gagal memuat data tanaman.')
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void loadData()

    return () => {
      isMounted = false
    }
  }, [])

  async function handleReload() {
    try {
      setLoading(true)
      const [tanamanData, categoryData] = await Promise.all([fetchTanamanAdmin(), fetchCategoriesAdmin()])
      setTanaman(tanamanData)
      setCategories(categoryData)
      setErrorMessage('')
      setPage(1)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Gagal memuat data tanaman.')
    } finally {
      setLoading(false)
    }
  }

  const editingId = useMemo(() => editingTanaman?.id ?? null, [editingTanaman])

  const categoryOptions = useMemo(() => categories.map((category) => ({ value: String(category.id), label: category.nama_kategori })), [categories])

  const filteredTanaman = useMemo(() => {
    const normalizedQuery = tanamanQuery.trim().toLowerCase()

    let nextTanaman = tanaman

    if (categoryFilter !== 'all') {
      nextTanaman = nextTanaman.filter((item) => String(item.kategori?.id ?? '') === categoryFilter)
    }

    if (normalizedQuery) {
      nextTanaman = nextTanaman.filter((item) => {
        const searchableText = [item.nama_lokal, item.nama_latin, item.kategori?.nama_kategori]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        return searchableText.includes(normalizedQuery)
      })
    }

    if (sortMode === 'alphabetical') {
      return [...nextTanaman].sort((left, right) => left.nama_lokal.localeCompare(right.nama_lokal))
    }

    return nextTanaman
  }, [categoryFilter, sortMode, tanaman, tanamanQuery])

  const totalPages = Math.max(1, Math.ceil(filteredTanaman.length / ITEMS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)
  const paginatedTanaman = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredTanaman.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [currentPage, filteredTanaman])

  const visibleRangeLabel = useMemo(() => {
    if (filteredTanaman.length === 0) {
      return '0 data'
    }

    const start = (currentPage - 1) * ITEMS_PER_PAGE + 1
    const end = Math.min(currentPage * ITEMS_PER_PAGE, filteredTanaman.length)
    return `${start}-${end} dari ${filteredTanaman.length}`
  }, [currentPage, filteredTanaman.length])

  async function handleSave(payload) {
    try {
      setSaving(true)

      if (editingTanaman) {
        const updated = await updateTanaman(editingTanaman.id, payload)
        setTanaman((current) => current.map((item) => (item.id === updated.id ? updated : item)))
      } else {
        const created = await createTanaman(payload)
        setTanaman((current) => [created, ...current])
      }

      setEditingTanaman(null)
      setErrorMessage('')
      setSuccessMessage(editingTanaman ? 'Data tanaman berhasil diperbarui.' : 'Data tanaman berhasil ditambahkan.')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Gagal menyimpan data tanaman.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteConfirmed() {
    if (!deleteTarget) {
      return
    }

    try {
      await deleteTanaman(deleteTarget.id)
      setTanaman((current) => current.filter((item) => item.id !== deleteTarget.id))
      setDeleteTarget(null)
      setSuccessMessage('Data tanaman berhasil dihapus.')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Gagal menghapus data tanaman.')
    }
  }

  async function handleCategorySave(payload) {
    try {
      setCategorySaving(true)

      if (editingCategory) {
        const updated = await updateCategory(editingCategory.id, payload)
        setCategories((current) => current.map((item) => (item.id === updated.id ? updated : item)))
      } else {
        const created = await createCategory(payload)
        setCategories((current) => [...current, created].sort((left, right) => left.nama_kategori.localeCompare(right.nama_kategori)))
      }

      setEditingCategory(null)
      setErrorMessage('')
      setSuccessMessage(editingCategory ? 'Kategori berhasil diperbarui.' : 'Kategori berhasil ditambahkan.')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Gagal menyimpan kategori.')
    } finally {
      setCategorySaving(false)
    }
  }

  async function handleDeleteCategoryConfirmed() {
    if (!deleteCategoryTarget) {
      return
    }

    try {
      await deleteCategory(deleteCategoryTarget.id)
      setCategories((current) => current.filter((item) => item.id !== deleteCategoryTarget.id))
      setDeleteCategoryTarget(null)
      setSuccessMessage('Kategori berhasil dihapus.')
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Gagal menghapus kategori.')
    }
  }

  return (
    <section className="stack section admin-workspace">
      <article className="surface-card auth-card admin-hero">
        <div className="dashboard-header">
          <div>
            <span className="eyebrow">Dashboard admin</span>
            <h1>CMS pengelolaan konten</h1>
            <p>
              Masuk sebagai <strong>{user?.email ?? 'admin'}</strong> untuk mengelola data tanaman,
              kategori, dan media.
            </p>
          </div>

          <button className="button secondary" type="button" onClick={handleLogout}>
            Keluar
          </button>
        </div>

        <div className="admin-stats">
          <article className="admin-stat">
            <strong>{tanaman.length}</strong>
            <span>Total tanaman</span>
          </article>
          <article className="admin-stat">
            <strong>{categories.length}</strong>
            <span>Total kategori</span>
          </article>
          <article className="admin-stat">
            <strong>{loading ? '...' : filteredTanaman.length}</strong>
            <span>Hasil tampilan</span>
          </article>
        </div>
      </article>

      {successMessage ? (
        <aside className="notice notice--success notice--actionable" role="status" aria-live="polite">
          <div className="notice__content">
            <strong>Berhasil:</strong>
            <span>{successMessage}</span>
          </div>
          <button className="button secondary notice__button" type="button" onClick={() => setSuccessMessage('')}>
            Tutup
          </button>
        </aside>
      ) : null}

      {errorMessage ? (
        <aside className="notice notice--actionable" role="alert">
          <div className="notice__content">
            <strong>Catatan:</strong>
            <span>{errorMessage}</span>
          </div>
          <button className="button secondary notice__button" type="button" onClick={() => setErrorMessage('')}>
            Tutup
          </button>
        </aside>
      ) : null}

      <div className="admin-grid">
        <aside className="admin-sidebar">
          <section className="admin-panel surface-card admin-panel--sticky">
            <div className="admin-panel__header admin-panel__header--stacked">
              <div>
                <span className="eyebrow">Area form</span>
                <h2>Kelola data tanpa menumpuk</h2>
                <p>Pilih tab untuk membuka form tanaman atau kategori, sehingga panel tetap ringkas.</p>
              </div>

              <button className="button secondary" type="button" onClick={handleReload} disabled={loading}>
                {loading ? 'Menyegarkan...' : 'Muat ulang'}
              </button>
            </div>

            <div className="admin-form-tabs" role="tablist" aria-label="Pilihan form admin">
              <button
                className={activeFormTab === 'tanaman' ? 'admin-form-tab active' : 'admin-form-tab'}
                type="button"
                role="tab"
                aria-selected={activeFormTab === 'tanaman'}
                onClick={() => setActiveFormTab('tanaman')}
              >
                Tanaman
              </button>
              <button
                className={activeFormTab === 'kategori' ? 'admin-form-tab active' : 'admin-form-tab'}
                type="button"
                role="tab"
                aria-selected={activeFormTab === 'kategori'}
                onClick={() => setActiveFormTab('kategori')}
              >
                Kategori
              </button>
            </div>

            {activeFormTab === 'tanaman' ? (
              <div className="admin-form-panel" role="tabpanel" aria-label="Form tanaman">
                <div className="admin-panel__header admin-panel__header--compact">
                  <div>
                    <span className="eyebrow">Form tanaman</span>
                    <h3>{editingTanaman ? 'Edit tanaman' : 'Tambah tanaman baru'}</h3>
                    <p>Panel input dibuat terpisah supaya daftar data tetap lega walau kontennya banyak.</p>
                  </div>

                  {editingTanaman ? (
                    <button className="button secondary" type="button" onClick={handleStartTanamanCreate}>
                      Batalkan edit
                    </button>
                  ) : null}
                </div>

                <TanamanForm
                  categories={categories}
                  initialValue={editingTanaman}
                  onCancel={handleStartTanamanCreate}
                  onSubmit={handleSave}
                  submitting={saving}
                  key={editingId ?? 'create'}
                />
              </div>
            ) : (
              <div className="admin-form-panel" role="tabpanel" aria-label="Form kategori">
                <div className="admin-panel__header admin-panel__header--compact">
                  <div>
                    <span className="eyebrow">Form kategori</span>
                    <h3>{editingCategory ? 'Edit kategori' : 'Tambah kategori baru'}</h3>
                    <p>Kategori dipisahkan agar pengelolaannya tidak bercampur dengan daftar tanaman.</p>
                  </div>

                  <button className="button secondary" type="button" onClick={handleStartCategoryCreate}>
                    {editingCategory ? 'Batalkan edit' : 'Form baru'}
                  </button>
                </div>

                <CategoryForm
                  initialValue={editingCategory}
                  onCancel={handleStartCategoryCreate}
                  onSubmit={handleCategorySave}
                  submitting={categorySaving}
                  key={editingCategory?.id ?? 'create-category'}
                />
              </div>
            )}
          </section>
        </aside>

        <main className="admin-main">
          <section className="admin-panel surface-card">
            <div className="admin-panel__header admin-panel__header--stacked">
              <div>
                <span className="eyebrow">Daftar data tanaman</span>
                <h2>Kelola katalog utama</h2>
                <p>Gunakan pencarian, filter, dan pagination untuk menangani data yang semakin banyak.</p>
              </div>

              <div className="admin-panel__actions">
                <button className="button secondary" type="button" onClick={resetTanamanFilters}>
                  Reset filter
                </button>
              </div>
            </div>

            <div className="admin-toolbar">
              <label className="search-field search-field--wide" htmlFor="admin-search">
                <span className="search-field__label">Cari tanaman</span>
                <input
                  id="admin-search"
                  type="search"
                  value={tanamanQuery}
                  onChange={(event) => {
                    setTanamanQuery(event.target.value)
                    setPage(1)
                  }}
                  placeholder="Cari nama lokal, latin, atau kategori"
                />
              </label>

              <label className="field admin-select">
                <span>Filter kategori</span>
                <select
                  value={categoryFilter}
                  onChange={(event) => {
                    setCategoryFilter(event.target.value)
                    setPage(1)
                  }}
                >
                  <option value="all">Semua kategori</option>
                  {categoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field admin-select">
                <span>Urutkan</span>
                <select
                  value={sortMode}
                  onChange={(event) => {
                    setSortMode(event.target.value)
                    setPage(1)
                  }}
                >
                  <option value="newest">Terbaru dulu</option>
                  <option value="alphabetical">A-Z</option>
                </select>
              </label>
            </div>

            <div className="admin-toolbar__meta">
              <p>{loading ? 'Menyegarkan daftar...' : `${visibleRangeLabel} data ditampilkan`}</p>
              <p>{tanamanQuery || categoryFilter !== 'all' ? 'Filter aktif' : 'Semua data tampil'}</p>
            </div>

            {loading ? (
              <div className="admin-loading">Memuat data tanaman...</div>
            ) : paginatedTanaman.length > 0 ? (
              <>
                <div className="admin-table admin-table--compact">
                  {paginatedTanaman.map((item) => (
                    <article key={item.id} className="admin-row admin-row--compact">
                      <div className="admin-row__main">
                        <div className="admin-row__identity">
                          <h3>{item.nama_lokal}</h3>
                          <p>{item.nama_latin || 'Nama latin belum diisi'}</p>
                        </div>
                        <small>{item.kategori?.nama_kategori ?? 'Tanpa kategori'}</small>
                      </div>

                      <div className="admin-row__actions">
                        <button className="button secondary" type="button" onClick={() => handleStartTanamanEdit(item)}>
                          Edit
                        </button>
                        <button className="button danger" type="button" onClick={() => setDeleteTarget(item)}>
                          Hapus
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="admin-pagination">
                  <p>
                    Halaman <strong>{currentPage}</strong> dari <strong>{totalPages}</strong>
                  </p>

                  <div className="admin-pagination__actions">
                    <button
                      className="button secondary"
                      type="button"
                      onClick={() => setPage((value) => Math.max(1, value - 1))}
                      disabled={currentPage === 1}
                    >
                      Sebelumnya
                    </button>
                    <button
                      className="button secondary"
                      type="button"
                      onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Berikutnya
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-state center">
                <h2>Data tidak ditemukan</h2>
                <p>Coba ubah kata kunci, filter kategori, atau reset tampilan untuk melihat semua data.</p>
              </div>
            )}
          </section>

          <section className="admin-panel surface-card">
            <div className="admin-panel__header">
              <div>
                <span className="eyebrow">Data kategori</span>
                <h2>Daftar kategori</h2>
                <p>Kategori tetap tampil di bawah sebagai referensi cepat saat data mulai banyak.</p>
              </div>
            </div>

            <div className="admin-table admin-table--compact">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <article key={category.id} className="admin-row admin-row--compact">
                    <div className="admin-row__main">
                      <div className="admin-row__identity">
                        <h3>{category.nama_kategori}</h3>
                        <p>{category.deskripsi || 'Deskripsi kategori belum diisi.'}</p>
                      </div>
                    </div>

                    <div className="admin-row__actions">
                      <button className="button secondary" type="button" onClick={() => handleStartCategoryEdit(category)}>
                        Edit
                      </button>
                      <button className="button danger" type="button" onClick={() => setDeleteCategoryTarget(category)}>
                        Hapus
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="empty-state center">
                  <h2>Belum ada kategori</h2>
                  <p>Tambahkan kategori agar data tanaman lebih rapi dan mudah difilter.</p>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      {deleteTarget ? (
        <section className="modal-backdrop" role="presentation" onClick={() => setDeleteTarget(null)}>
          <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="delete-title" onClick={(event) => event.stopPropagation()}>
            <span className="eyebrow">Konfirmasi hapus</span>
            <h2 id="delete-title">Hapus {deleteTarget.nama_lokal}?</h2>
            <p>Tindakan ini akan menghapus data tanaman secara permanen dari database.</p>

            <div className="form-actions">
              <button className="button secondary" type="button" onClick={() => setDeleteTarget(null)}>
                Batal
              </button>
              <button className="button danger" type="button" onClick={handleDeleteConfirmed}>
                Ya, hapus
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {deleteCategoryTarget ? (
        <section className="modal-backdrop" role="presentation" onClick={() => setDeleteCategoryTarget(null)}>
          <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="delete-category-title" onClick={(event) => event.stopPropagation()}>
            <span className="eyebrow">Konfirmasi hapus</span>
            <h2 id="delete-category-title">Hapus kategori {deleteCategoryTarget.nama_kategori}?</h2>
            <p>Kategori yang dihapus akan dilepas dari tanaman yang masih menggunakannya.</p>

            <div className="form-actions">
              <button className="button secondary" type="button" onClick={() => setDeleteCategoryTarget(null)}>
                Batal
              </button>
              <button className="button danger" type="button" onClick={handleDeleteCategoryConfirmed}>
                Ya, hapus
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </section>
  )
}

export default AdminDashboardPage