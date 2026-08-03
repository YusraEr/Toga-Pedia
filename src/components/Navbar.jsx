import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { LeafIcon } from './Icons'

const navItems = [
  { label: 'Beranda', to: '/', end: true },
  { label: 'Katalog Tanaman', to: '/katalog' },
  { label: 'Admin', to: '/admin' },
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

        {/* Mobile Toggle Button */}
        <button
          className="mobile-toggle"
          type="button"
          onClick={toggleMobileMenu}
          aria-expanded={mobileMenuOpen}
          aria-label="Buka menu navigasi"
        >
          <span className={`hamburger-icon ${mobileMenuOpen ? 'open' : ''}`} />
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
