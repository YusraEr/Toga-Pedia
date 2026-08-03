import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function useScrollReveal() {
  const location = useLocation()

  useEffect(() => {
    // Reset scroll to top cleanly on route change
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname, location.search])
}
