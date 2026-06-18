import { request } from "@/services/request"
import {ApiResult} from "@/services/types";

/**
 * 为指定用户名生成登录验证码。
 * 后端路径：POST /public/captcha/login/{name}
 */
export async function getCaptcha(username: string): Promise<ApiResult<string>> {
  return request.post(`/public/captcha/login/${username}`);
}
