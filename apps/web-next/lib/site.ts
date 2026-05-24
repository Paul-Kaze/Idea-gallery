const DEFAULT_SITE_URL = 'https://dommi.ai'

export function getSiteUrl() {
  const rawUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.SITE_URL || DEFAULT_SITE_URL
  return rawUrl.replace(/\/+$/, '')
}

export function getAbsoluteUrl(path = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${getSiteUrl()}${normalizedPath}`
}
