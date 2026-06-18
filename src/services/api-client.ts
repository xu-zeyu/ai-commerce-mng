import { API_BASE_URL } from "./env";
import { useAuthStore } from "@/stores/use-auth-store";
import type { ApiResult } from "@/features/auth/types";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  /** 查询参数 */
  params?: Record<string, string | number | boolean | undefined | null>;
  /** JSON 请求体，自动序列化 */
  body?: unknown;
  /** 跳过认证 header */
  skipAuth?: boolean;
}

function buildUrl(
  path: string,
  params?: RequestOptions["params"],
): string {
  const base = API_BASE_URL;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${base}${normalized}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

/**
 * 统一 fetch 封装。base_url 由 env 按环境注入。
 * 自动注入 auth token，自动解包 Result<T> 到 data 字段。
 */
export async function apiClient<T>(
  path: string,
  { params, body, headers, skipAuth, ...init }: RequestOptions = {},
): Promise<T> {
  const isJsonBody = body !== undefined && !(body instanceof FormData);

  const authHeaders: Record<string, string> = {};
  if (!skipAuth) {
    const token = useAuthStore.getState().token;
    if (token) {
      authHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(buildUrl(path, params), {
    ...init,
    headers: {
      ...(isJsonBody ? { "Content-Type": "application/json" } : {}),
      ...authHeaders,
      ...headers,
    },
    body: isJsonBody ? JSON.stringify(body) : (body as BodyInit | undefined),
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json().catch(() => null)
    : await response.text();

  if (!response.ok) {
    const message =
      (payload as { message?: string })?.message ??
      `请求失败：${response.status}`;
    throw new ApiError(response.status, message, payload);
  }

  // 自动解包 Result<T> 包装
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as ApiResult<T>).data as T;
  }

  return payload as T;
}

export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    apiClient<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiClient<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiClient<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiClient<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    apiClient<T>(path, { ...options, method: "DELETE" }),
};
