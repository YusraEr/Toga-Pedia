import { Link, NavLink } from 'react-router-dom'

const navItems = [
  { label: 'Beranda', to: '/', end: true },
  { label: 'Katalog', to: '/katalog' },
  { label: 'Pencarian', to: '/pencarian' },
  { label: 'Admin', to: '/admin' },
]

function AppShell({ children }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand" aria-label="TOGA Pedia Desa beranda">
          <span className="brand-mark">T</span>
          <span>
            <strong>TOGA Pedia Desa</strong>
            <small>Ensiklopedia tanaman obat keluarga</small>
          </span>
        </Link>

        <nav className="nav" aria-label="Navigasi utama">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="page-content">{children}</main>

      <footer className="site-footer">
        <p>Dirancang untuk edukasi warga desa, dokumentasi TOGA, dan pengelolaan konten yang rapi.</p>
      </footer>
    </div>
  )
}

export default AppShell