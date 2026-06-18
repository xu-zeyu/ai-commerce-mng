import { api } from "@/services/api-client";
import type { LoginRequest } from "../types";

/**
 * 短信验证码登录。
 * 后端路径：POST /login/sms
 * 返回 token 字符串。
 */
export async function smsLogin(body: LoginRequest): Promise<string> {
  return api.post<string>("/login/sms", body, { skipAuth: true });
}
