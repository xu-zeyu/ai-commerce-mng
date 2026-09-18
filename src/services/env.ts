const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '')

/** Java 服务仅用于登录、验证码和当前用户校验。 */
export const JAVA_API_BASE_URL = trimTrailingSlash(
  process.env.NEXT_PUBLIC_JAVA_API_BASE_URL ?? '/api',
)

/** Python Agent 通过 Next.js 同源代理访问，避免浏览器 CORS 与混合内容问题。 */
export const AGENT_API_BASE_URL = trimTrailingSlash(
  process.env.NEXT_PUBLIC_AGENT_API_BASE_URL ?? '/agent-api',
)

export const AGENT_V1_BASE_URL = `${AGENT_API_BASE_URL}/api/v1`
export const AGENT_DOCUMENT_UPLOAD_PATH =
  process.env.NEXT_PUBLIC_AGENT_DOCUMENT_UPLOAD_PATH ?? '/documents'

// 保留别名，供登录请求层使用。
export const API_BASE_URL = JAVA_API_BASE_URL
