export function isLocalStorageNearLimit(forceCheck: boolean = false, threshold: number = 0.85): boolean {
  // Si se fuerza la verificación, siempre retorna true (para tests)
  if (forceCheck) {
    return true
  }

  if (typeof window === 'undefined' || !window.localStorage) {
    return false
  }

  const MAX_SIZE = 5 * 1024 * 1024 // 5MB
  let totalSize = 0

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i) || ''
    const value = localStorage.getItem(key) || ''
    totalSize += (key.length + value.length) * 2
  }

  return totalSize >= MAX_SIZE * threshold
}

export function isLocalStorageFull(): boolean {
  
  if (typeof window === 'undefined' || !window.localStorage) {
    return false
  }

  const MAX_SIZE = 5 * 1024 * 1024 // 5MB
  let totalSize = 0

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i) || ''
    const value = localStorage.getItem(key) || ''
    totalSize += (key.length + value.length) * 2
  }

  return totalSize >= MAX_SIZE
}