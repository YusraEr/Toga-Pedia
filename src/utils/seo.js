/**
 * Dynamically updates document title, meta description, and OpenGraph tags for SEO and link sharing.
 */
export function setPageMeta({ title, description, url }) {
  const siteName = 'TOGA Pedia Desa'
  const fullTitle = title ? `${title} | ${siteName}` : siteName

  document.title = fullTitle

  const setMetaTag = (selector, attributeName, attributeValue, content) => {
    let element = document.querySelector(selector)
    if (!element) {
      element = document.createElement('meta')
      element.setAttribute(attributeName, attributeValue)
      document.head.appendChild(element)
    }
    element.setAttribute('content', content || '')
  }

  if (description) {
    setMetaTag('meta[name="description"]', 'name', 'description', description)
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description)
  }

  if (title) {
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', fullTitle)
  }

  setMetaTag('meta[property="og:url"]', 'property', 'og:url', url || window.location.href)
}
