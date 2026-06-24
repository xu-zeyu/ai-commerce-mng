export interface FileUploadResult {
  url: string
}

export interface FileUploadOptions {
  maxSizeMb?: number
  accept?: string
}

export type FileUploadStatus = 'uploading' | 'done' | 'error'

export interface FileUploadItem {
  uid: string
  name: string
  status: FileUploadStatus
  url?: string
  thumbUrl?: string
  percent?: number
}
