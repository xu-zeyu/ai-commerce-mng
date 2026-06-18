/**
 * 运行环境配置。
 *
 * 业务环境 (APP_ENV) 与 base_url 的映射规则：
 *   - dev  -> http://8.163.103.108/
 *   - test -> http://8.163.103.108/
 *   - prod -> 线上正式地址
 *
 * 优先级：显式的 NEXT_PUBLIC_API_BASE_URL > 按 APP_ENV 推断的默认值。
 */

export type AppEnv = "dev" | "test" | "prod";

const BASE_URL_BY_ENV: Record<AppEnv, string> = {
  dev: "http://8.163.103.108/",
  test: "http://8.163.103.108/",
  prod: "https://api.jinhan-commerce.com/",
};

function resolveAppEnv(): AppEnv {
  const raw = process.env.NEXT_PUBLIC_APP_ENV?.toLowerCase();
  if (raw === "test") return "test";
  if (raw === "prod" || raw === "production") return "prod";
  return "dev";
}

export const APP_ENV: AppEnv = resolveAppEnv();

export const API_BASE_URL: string = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? BASE_URL_BY_ENV[APP_ENV]
).replace(/\/+$/, "");

export const IS_DEV = APP_ENV === "dev";
export const IS_TEST = APP_ENV === "test";
export const IS_PROD = APP_ENV === "prod";
