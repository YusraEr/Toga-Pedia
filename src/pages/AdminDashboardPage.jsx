import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CategoryForm from '../components/CategoryForm'
import TanamanForm from '../components/TanamanForm'
import useAuth from '../auth/useAuth'
import { createCategory, deleteCategory, fetchCategoriesAdmin, updateCategory } from '../services/adminCategoryService'
import { createTanaman, deleteTanaman, fetchTanamanAdmin, updateTanaman } from '../services/adminTanamanService'

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
  const [editingTanaman, setEditingTanaman] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [editingCategory, setEditingCategory] = useState(null)
  const [deleteCategoryTarget, setDeleteCategoryTarget] = useState(null)

  async function handleLogout() {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  function handleStartTanamanEdit(item) {
    setErrorMessage('')
    setSuccessMessage('')
    setEditingCategory(null)
    setDeleteCategoryTarget(null)
    setEditingTanaman(item)
  }

  function handleStartTanamanCreate() {
    setErrorMessage('')
    setSuccessMessage('')
    setEditingTanaman(null)
  }

  function handleStartCategoryEdit(item) {
    setErrorMessage('')
    setSuccessMessage('')
    setEditingTanaman(null)
    setDeleteTarget(null)
    setEditingCategory(item)
  }

  function handleStartCategoryCreate() {
    setErrorMessage('')
    setSuccessMessage('')
    setEditingCategory(null)
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
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Gagal memuat data tanaman.')
    } finally {
      setLoading(false)
    }
  }

  const editingId = useMemo(() => editingTanaman?.id ?? null, [editingTanaman])

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
    <section className="stack section">
      <article className="surface-card auth-card">
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

      <section className="admin-panel surface-card">
        <div className="admin-panel__header">
          <div>
            <span className="eyebrow">Daftar data tanaman</span>
            <h2>{editingTanaman ? 'Edit tanaman' : 'Tambah tanaman baru'}</h2>
            <p>Kelola data katalog utama, lalu simpan perubahan ke Supabase.</p>
          </div>

          <div className="admin-panel__actions">
            {editingTanaman ? (
              <button className="button secondary" type="button" onClick={handleStartTanamanCreate}>
                Batalkan edit
              </button>
            ) : null}

            <button className="button secondary" type="button" onClick={handleReload} disabled={loading}>
              {loading ? 'Menyegarkan...' : 'Muat ulang'}
            </button>
          </div>
        </div>

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

        <TanamanForm
          categories={categories}
          initialValue={editingTanaman}
          onCancel={handleStartTanamanCreate}
          onSubmit={handleSave}
          submitting={saving}
          key={editingId ?? 'create'}
        />
      </section>

      <section className="admin-panel surface-card">
        <div className="admin-panel__header">
          <div>
            <span className="eyebrow">Data kategori</span>
            <h2>{editingCategory ? 'Edit kategori' : 'Tambah kategori baru'}</h2>
            <p>Kategori dipakai untuk mengelompokkan tanaman secara terstruktur.</p>
          </div>

          {editingCategory ? (
            <button className="button secondary" type="button" onClick={handleStartCategoryCreate}>
              Batalkan edit
            </button>
          ) : (
            <button className="button secondary" type="button" onClick={handleStartCategoryCreate}>
              Form baru
            </button>
          )}
        </div>

        <CategoryForm
          initialValue={editingCategory}
          onCancel={handleStartCategoryCreate}
          onSubmit={handleCategorySave}
          submitting={categorySaving}
          key={editingCategory?.id ?? 'create-category'}
        />

        <div className="admin-table">
          {categories.length > 0 ? (
            categories.map((category) => (
              <article key={category.id} className="admin-row">
                <div>
                  <h3>{category.nama_kategori}</h3>
                  <p>{category.deskripsi || 'Deskripsi kategori belum diisi.'}</p>
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

      <section className="surface-card admin-list">
        {loading ? (
          <div className="admin-loading">Memuat data tanaman...</div>
        ) : tanaman.length > 0 ? (
          <div className="admin-table">
            {tanaman.map((item) => (
              <article key={item.id} className="admin-row">
                <div>
                  <h3>{item.nama_lokal}</h3>
                  <p>{item.nama_latin || 'Nama latin belum diisi'}</p>
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
        ) : (
          <div className="empty-state center">
            <h2>Belum ada data tanaman</h2>
            <p>Gunakan form di atas untuk menambahkan data pertama.</p>
          </div>
        )}
      </section>

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