import Navbar from './Navbar'
import Footer from './Footer'

function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-content">{children}</main>
      <Footer />
    </div>
  )
}

export default AppShell