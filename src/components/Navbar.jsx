import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { LeafIcon } from './Icons'

const navItems = [
  { label: 'Beranda', to: '/', end: true },
  { label: 'Katalog Tanaman', to: '/katalog' },
  { label: 'Dashboard Admin', to: '/admin' },
]

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev)
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header className="navbar-container">
      <div className="navbar">
        <Link to="/" className="brand" onClick={closeMobileMenu} aria-label="TOGA Pedia Desa Beranda">
          <span className="brand-mark" aria-hidden="true">
            <LeafIcon size={22} />
          </span>
          <span className="brand-text">
            <strong>TOGA Pedia Desa</strong>
            <small>Ensiklopedia Tanaman Obat</small>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav desktop-nav" aria-label="Navigasi utama">
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

        {/* Mobile Hamburger Toggle Button */}
        <button
          className="mobile-toggle"
          type="button"
          onClick={toggleMobileMenu}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu navigasi'}
        >
          {mobileMenuOpen ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav className="mobile-nav" aria-label="Navigasi mobile">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={closeMobileMenu}
              className={({ isActive }) => (isActive ? 'mobile-nav-link active' : 'mobile-nav-link')}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}

export default Navbar
