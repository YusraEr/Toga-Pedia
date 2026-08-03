import { useEffect, useState } from 'react'

/**
 * Custom hook to debounce any rapidly changing value (e.g. search input).
 * @param value The value to debounce.
 * @param delay Delay in milliseconds (default: 300ms).
 * @returns The debounced value.
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
