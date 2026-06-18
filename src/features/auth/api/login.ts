import { request } from '@/services/request'
import type { LoginRequest } from "../types"
import type { ApiResult } from "@/services/types"

export async function login(body: LoginRequest): Promise<string> {
  const res: ApiResult<string> = await request.post("/login/sms", body)
  return res.data
}
