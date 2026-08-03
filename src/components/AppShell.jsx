import Navbar from './Navbar'
import Footer from './Footer'
import { useScrollReveal } from '../hooks/useScrollReveal'

function AppShell({ children }) {
  useScrollReveal()

  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-content">{children}</main>
      <Footer />
    </div>
  )
}

export default AppShell