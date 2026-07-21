export interface SendChatMessageRequest {
  modelId: number
  message: string
}

export interface SendChatMessageResponse {
  content: string
}
