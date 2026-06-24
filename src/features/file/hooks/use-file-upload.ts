import { useMutation } from '@tanstack/react-query'
import { batchUploadFiles } from '../api/batch-upload-files'
import { uploadFile } from '../api/upload-file'

export function useUploadFile() {
  return useMutation({
    mutationFn: uploadFile,
  })
}

export function useBatchUploadFiles() {
  return useMutation({
    mutationFn: batchUploadFiles,
  })
}
