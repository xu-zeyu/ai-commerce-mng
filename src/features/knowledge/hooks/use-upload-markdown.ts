'use client'

import { useMutation } from '@tanstack/react-query'
import { uploadMarkdownDocument } from '../api/upload-markdown-document'

export function useUploadMarkdown() {
  return useMutation({ mutationFn: uploadMarkdownDocument })
}
