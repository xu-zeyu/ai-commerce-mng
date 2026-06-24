import type { FileUploadItem } from '../types'

export function createPendingItems(files: File[]): FileUploadItem[] {
  const stamp = Date.now()

  return files.map((file, index) => ({
    uid: `${file.name}-${file.size}-${file.lastModified}-${stamp}-${index}`,
    name: file.name,
    status: 'uploading',
    thumbUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
    percent: 68,
  }))
}

export function getFileNameFromUrl(url: string) {
  try {
    const pathname = new URL(url, 'http://local').pathname
    const name = pathname.split('/').filter(Boolean).pop()
    return name ? decodeURIComponent(name) : '已上传图片'
  } catch {
    return '已上传图片'
  }
}

export function revokePreviewUrls(items: FileUploadItem[]) {
  items.forEach((item) => {
    if (item.thumbUrl?.startsWith('blob:')) URL.revokeObjectURL(item.thumbUrl)
  })
}
