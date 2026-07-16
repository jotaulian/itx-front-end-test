export const BASE_URL = 'https://itx-frontend-test.onrender.com'

// Minimal fetch wrapper: resolves JSON on success, throws on non-2xx so
// TanStack Query's isError flags react correctly.
export async function apiClient(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`Request to ${path} failed with status ${response.status}`)
  }

  return response.json()
}
