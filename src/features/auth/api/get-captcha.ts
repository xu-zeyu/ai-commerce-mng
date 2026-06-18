import { api } from "@/services/api-client";

/**
 * 为指定用户名生成登录验证码。
 * 后端路径：POST /public/captcha/login/{name}
 */
export async function getCaptcha(username: string): Promise<string> {
  return api.post<string>(`/public/captcha/login/${username}`);
}
