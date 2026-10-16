export function useRateLimit(key = 'rate-limit', limitMs = 5000, maxAttempts = 5) {
  const now = Date.now()
  const record = JSON.parse(localStorage.getItem(key) || '{}')

  // limpia si ya pasó el tiempo
  if (!record.firstAttempt || now - record.firstAttempt > limitMs) {
    const newRecord = { firstAttempt: now, count: 0 }
    localStorage.setItem(key, JSON.stringify(newRecord))
    return () => true
  }

  // cuenta el intento
  record.count = (record.count || 0) + 1
  localStorage.setItem(key, JSON.stringify(record))

  if (record.count > maxAttempts) {
    console.warn('Rate limit alcanzado')
    return () => false
  }

  return () => true
}
