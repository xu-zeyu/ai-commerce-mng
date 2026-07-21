import 'server-only'

const FALLBACK_MODEL_ID = 1

export function getAiChatModelId(): number {
  const modelId = Number(process.env.AI_CHAT_MODEL_ID ?? FALLBACK_MODEL_ID)

  if (!Number.isSafeInteger(modelId) || modelId <= 0) {
    return FALLBACK_MODEL_ID
  }

  return modelId
}
