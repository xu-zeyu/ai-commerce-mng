import { NextResponse, type NextRequest } from "next/server";

/**
 * 客户端路由保护主要由 AuthProvider 负责。
 * 此处仅做基础的路径规范化。
 */
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 匹配除以下路径外的所有请求路径:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
