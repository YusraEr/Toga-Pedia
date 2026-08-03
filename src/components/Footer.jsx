import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-col footer-col--brand">
          <div className="brand footer-brand">
            <span className="brand-mark" aria-hidden="true">🌱</span>
            <span>
              <strong>TOGA Pedia Desa</strong>
              <small>Ensiklopedia Tanaman Obat Keluarga</small>
            </span>
          </div>
          <p className="footer-desc">
            Platform digital edukasi tanaman obat keluarga untuk membantu warga desa mengenal manfaat kesehatan, takaran konsumsi aman, dan panduan budidaya alami.
          </p>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Navigasi Cepat</h4>
          <ul className="footer-links">
            <li>
              <Link to="/">Beranda</Link>
            </li>
            <li>
              <Link to="/katalog">Katalog Tanaman</Link>
            </li>
            <li>
              <Link to="/admin">Portal Admin</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Informasi Platform</h4>
          <ul className="footer-info-list">
            <li>🌿 Informasi Herbal Terstruktur</li>
            <li>🍵 Panduan Olahan Sederhana</li>
            <li>📍 Program Pengabdian Desa</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} TOGA Pedia Desa. Hak Cipta Dilindungi.</p>
        <span className="footer-tagline">Mewujudkan Desa Sehat Mandiri Bersama TOGA</span>
      </div>
    </footer>
  )
}

export default Footer
