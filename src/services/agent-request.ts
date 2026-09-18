import axios from 'axios'
import { AGENT_V1_BASE_URL } from './env'

/** Python Agent 业务接口；不携带 Java 登录服务的 token。 */
export const agentRequest = axios.create({
  baseURL: AGENT_V1_BASE_URL,
  timeout: 60_000,
})
