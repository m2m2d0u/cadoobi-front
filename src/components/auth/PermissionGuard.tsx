import React, { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';

interface PermissionGuardProps {
  children: ReactNode;
  permission?: string;
  anyPermission?: string[];
  allPermissions?: string[];
  fallback?: ReactNode;
  requireAdmin?: boolean;
}

/**
 * PermissionGuard Component
 *
 * Conditionally renders children based on user permissions.
 *
 * @param permission - Single permission required
 * @param anyPermission - Array of permissions, user needs at least one
 * @param allPermissions - Array of permissions, user needs all of them
 * @param requireAdmin - Requires system:admin permission
 * @param fallback - Optional fallback content to show if permission check fails
 *
 * @example
 * // Single permission
 * <PermissionGuard permission="merchant:create">
 *   <Button>Create Merchant</Button>
 * </PermissionGuard>
 *
 * @example
 * // Any permission
 * <PermissionGuard anyPermission={["merchant:create", "merchant:update"]}>
 *   <Button>Manage Merchant</Button>
 * </PermissionGuard>
 *
 * @example
 * // All permissions
 * <PermissionGuard allPermissions={["merchant:read", "merchant:update"]}>
 *   <Button>Edit Merchant</Button>
 * </PermissionGuard>
 *
 * @example
 * // Admin only
 * <PermissionGuard requireAdmin>
 *   <Button>Admin Settings</Button>
 * </PermissionGuard>
 */
export function PermissionGuard({
  children,
  permission,
  anyPermission,
  allPermissions,
  fallback = null,
  requireAdmin = false
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, isAdmin } = useAuth();

  // Check admin requirement
  if (requireAdmin && !isAdmin()) {
    return <>{fallback}</>;
  }

  // Check single permission
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  // Check any permission
  if (anyPermission && !hasAnyPermission(anyPermission)) {
    return <>{fallback}</>;
  }

  // Check all permissions
  if (allPermissions && !hasAllPermissions(allPermissions)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
