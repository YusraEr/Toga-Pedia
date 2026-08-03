import { Link } from 'react-router-dom'
import { LeafIcon } from './Icons'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        {/* Brand Column */}
        <div className="footer-col footer-col--brand">
          <div className="brand footer-brand">
            <span className="brand-mark" aria-hidden="true">
              <LeafIcon size={22} />
            </span>
            <span>
              <strong>TOGA Pedia Desa</strong>
              <small>Ensiklopedia Tanaman Obat Keluarga</small>
            </span>
          </div>
          <p className="footer-desc">
            Platform edukasi digital tanaman obat keluarga untuk membantu warga desa mengenal khasiat kesehatan dan takaran konsumsi aman.
          </p>
        </div>

        {/* Essential Navigation Links */}
        <div className="footer-col">
          <h4 className="footer-heading">Navigasi Utama</h4>
          <ul className="footer-links">
            <li>
              <Link to="/">Beranda</Link>
            </li>
            <li>
              <Link to="/katalog">Katalog Tanaman</Link>
            </li>
            <li>
              <Link to="/admin">Dashboard Admin</Link>
            </li>
          </ul>
        </div>

        {/* Essential KKN & Location Info */}
        <div className="footer-col">
          <h4 className="footer-heading">Informasi Program</h4>
          <ul className="footer-info-list">
            <li>KKN-T 116 Universitas Hasanuddin</li>
            <li>Desa Benteng Palioi</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} TOGA Pedia Desa. Hak Cipta Dilindungi.</p>
        <span className="footer-tagline">KKN-T 116 Unhas Benteng Palioi</span>
      </div>
    </footer>
  )
}

export default Footer
