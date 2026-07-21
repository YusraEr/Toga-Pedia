import { Navigate, Route, Routes } from 'react-router-dom'
import AuthProvider from './auth/AuthProvider'
import AppShell from './components/AppShell'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminLoginPage from './pages/AdminLoginPage'
import CatalogPage from './pages/CatalogPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import PlantDetailPage from './pages/PlantDetailPage'
import SearchPage from './pages/SearchPage'

function App() {
  return (
    <AuthProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/katalog" element={<CatalogPage />} />
          <Route path="/pencarian" element={<SearchPage />} />
          <Route path="/tanaman/:slug" element={<PlantDetailPage />} />
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppShell>
    </AuthProvider>
  )
}

export default App