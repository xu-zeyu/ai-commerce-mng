import { request } from '@/services/request'
import type {
  SendChatMessageRequest,
  SendChatMessageResponse,
} from '../types'

export async function sendChatMessage(
  body: SendChatMessageRequest,
  signal?: AbortSignal,
): Promise<SendChatMessageResponse> {
  return request.post<
    SendChatMessageResponse,
    SendChatMessageResponse
  >('/chat', undefined, {
    params: body,
    signal,
  })
}
