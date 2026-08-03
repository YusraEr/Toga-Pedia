/**
 * Sanitizes input string by stripping script tags, HTML tags, and trimming.
 */
export function sanitizeInput(text) {
  if (!text || typeof text !== 'string') return ''
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim()
}

/**
 * Validates whether a string is a valid HTTP/HTTPS URL.
 */
export function isValidHttpUrl(string) {
  if (!string || typeof string !== 'string') return false
  const trimmed = string.trim()
  if (!trimmed) return false

  try {
    const url = new URL(trimmed)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch (_) {
    return false
  }
}
