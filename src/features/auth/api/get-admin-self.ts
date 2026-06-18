import { api } from "@/services/api-client";
import type { AdminSelf } from "../types";

/**
 * 获取当前管理员基础信息（头像、用户名、权限列表）。
 * 后端路径：GET /admin/self
 */
export async function getAdminSelf(): Promise<AdminSelf> {
  return api.get<AdminSelf>("/admin/self");
}
