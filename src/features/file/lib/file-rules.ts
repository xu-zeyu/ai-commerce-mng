export const DEFAULT_ACCEPT = 'image/*'
export const DEFAULT_MAX_SIZE_MB = 8

export function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export function isFileWithinSize(file: File, maxSizeMb = DEFAULT_MAX_SIZE_MB) {
  return file.size <= maxSizeMb * 1024 * 1024
}

export function isFileAccepted(file: File, accept = DEFAULT_ACCEPT) {
  const rules = accept
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)

  if (rules.length === 0) return true

  const fileName = file.name.toLowerCase()
  const mimeType = file.type.toLowerCase()

  return rules.some((rule) => {
    if (rule.startsWith('.')) return fileName.endsWith(rule)
    if (rule.endsWith('/*')) return mimeType.startsWith(rule.replace('*', ''))
    return mimeType === rule
  })
}
