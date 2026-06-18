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
  SUB_ADMIN: "SUB_ADMIN",
  PERMISSION_MANAGE: "permission:manage",
  PERMISSION_MANAGE_LEGACY: "PERMISSION_MANAGE",
  ROLE_MANAGE: "role:manage",
  ROLE_MANAGE_LEGACY: "ROLE_MANAGE",
  PRODUCT_VIEW: "product:view",
  PRODUCT_MANAGE: "product:manage",
  ORDER_VIEW: "order:view",
  ORDER_MANAGE: "order:manage",
  STORE_VIEW: "store:view",
  STORE_MANAGE: "store:manage",
  CATEGORY_VIEW: "category:view",
  CATEGORY_MANAGE: "category:manage",
  SETTINGS_MANAGE: "settings:manage",
  SETTINGS_MANAGE_LEGACY: "SETTINGS_MANAGE",
} as const;

export type PermissionCode = string | readonly string[];

const SUPER_ADMIN_CODES = new Set<string>([Permissions.SUB_ADMIN, "sub:admin"]);

export function isSuperAdmin(authorities: string[]): boolean {
  return authorities.some((code) => SUPER_ADMIN_CODES.has(code));
}

function matchesPermission(authorities: string[], permission: string): boolean {
  return authorities.includes(permission);
}

/**
 * 检查权限列表是否包含指定权限。
 */
export function hasPermission(
  authorities: string[],
  permission: PermissionCode,
): boolean {
  if (isSuperAdmin(authorities)) return true;
  if (typeof permission !== "string") {
    return permission.some((code) => matchesPermission(authorities, code));
  }
  return matchesPermission(authorities, permission);
}

/**
 * 检查是否拥有任一权限。
 */
export function hasAnyPermission(
  authorities: string[],
  permissions: PermissionCode[],
): boolean {
  return permissions.some((p) => hasPermission(authorities, p));
}

/**
 * 检查是否拥有全部权限。
 */
export function hasAllPermissions(
  authorities: string[],
  permissions: PermissionCode[],
): boolean {
  return permissions.every((p) => hasPermission(authorities, p));
}
