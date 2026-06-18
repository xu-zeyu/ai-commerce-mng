/**
 * RBAC 权限常量与工具函数。
 *
 * 权限来源：
 * - 后端 /admin/self 返回的 authorities 字段（string[]）
 * - 权限编码由后端 AdminPermission 表维护，通过 /admin/permission/batchSync 同步
 *
 * 常用权限编码（与后端 AdminPermissionConst 对齐）：
 */
export const Permissions = {
  DASHBOARD_VIEW: "dashboard:view",
  SUB_ADMIN: "sub:admin",
  PERMISSION_MANAGE: "permission:manage",
  ROLE_MANAGE: "role:manage",
  PRODUCT_VIEW: "product:view",
  PRODUCT_MANAGE: "product:manage",
  ORDER_VIEW: "order:view",
  ORDER_MANAGE: "order:manage",
  STORE_VIEW: "store:view",
  STORE_MANAGE: "store:manage",
  CATEGORY_VIEW: "category:view",
  CATEGORY_MANAGE: "category:manage",
  SETTINGS_MANAGE: "settings:manage",
} as const;

export type PermissionCode = string;

/**
 * 检查权限列表是否包含指定权限。
 */
export function hasPermission(
  authorities: string[],
  permission: PermissionCode,
): boolean {
  return authorities.includes(permission);
}

/**
 * 检查是否拥有任一权限。
 */
export function hasAnyPermission(
  authorities: string[],
  permissions: PermissionCode[],
): boolean {
  return permissions.some((p) => authorities.includes(p));
}

/**
 * 检查是否拥有全部权限。
 */
export function hasAllPermissions(
  authorities: string[],
  permissions: PermissionCode[],
): boolean {
  return permissions.every((p) => authorities.includes(p));
}
