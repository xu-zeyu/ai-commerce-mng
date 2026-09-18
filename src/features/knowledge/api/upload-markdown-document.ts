import { isAxiosError } from 'axios'
import { agentRequest } from '@/services/agent-request'
import { AGENT_DOCUMENT_UPLOAD_PATH } from '@/services/env'

function getErrorMessage(error: unknown): string {
  if (!isAxiosError(error)) {
    return error instanceof Error ? error.message : '文档上传失败'
  }

  const data: unknown = error.response?.data
  if (typeof data === 'string' && data.trim()) return data
  if (data && typeof data === 'object') {
    const payload = data as Record<string, unknown>
    for (const key of ['detail', 'message', 'msg']) {
      if (typeof payload[key] === 'string') return payload[key]
    }
  }
  return error.message || '文档上传失败'
}

export async function uploadMarkdownDocument(file: File): Promise<unknown> {
  const body = new FormData()
  body.append('file', file)

  try {
    const response = await agentRequest.post<unknown>(AGENT_DOCUMENT_UPLOAD_PATH, body)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
