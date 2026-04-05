/**
 * Permission constants for the application
 * These must match the backend permission codes
 */

// Payment permissions
export const PAYMENT_CREATE = 'payment:create';
export const PAYMENT_READ = 'payment:read';
export const PAYMENT_UPDATE = 'payment:update';
export const PAYMENT_DELETE = 'payment:delete';

// Merchant permissions
export const MERCHANT_CREATE = 'merchant:create';
export const MERCHANT_READ = 'merchant:read';
export const MERCHANT_UPDATE = 'merchant:update';
export const MERCHANT_DELETE = 'merchant:delete';

// Operator permissions
export const OPERATOR_CREATE = 'operator:create';
export const OPERATOR_READ = 'operator:read';
export const OPERATOR_UPDATE = 'operator:update';
export const OPERATOR_DELETE = 'operator:delete';

// User permissions
export const USER_CREATE = 'user:create';
export const USER_READ = 'user:read';
export const USER_UPDATE = 'user:update';
export const USER_DELETE = 'user:delete';

// Role permissions
export const ROLE_CREATE = 'role:create';
export const ROLE_READ = 'role:read';
export const ROLE_UPDATE = 'role:update';
export const ROLE_DELETE = 'role:delete';

// Permission permissions
export const PERMISSION_READ = 'permission:read';
export const PERMISSION_CREATE = 'permission:create';
export const PERMISSION_UPDATE = 'permission:update';
export const PERMISSION_DELETE = 'permission:delete';

// Payout permissions
export const PAYOUT_CREATE = 'payout:create';
export const PAYOUT_READ = 'payout:read';
export const PAYOUT_UPDATE = 'payout:update';
export const PAYOUT_DELETE = 'payout:delete';

// Ledger permissions
export const LEDGER_READ = 'ledger:read';
export const LEDGER_WRITE = 'ledger:write';

// System Account permissions
export const SYSTEM_ACCOUNT_READ = 'system-account:read';
export const SYSTEM_ACCOUNT_WRITE = 'system-account:write';

// Parameter permissions
export const PARAMETER_READ = 'parameter:read';
export const PARAMETER_CREATE = 'parameter:create';
export const PARAMETER_UPDATE = 'parameter:update';
export const PARAMETER_DELETE = 'parameter:delete';

// System permissions
export const SYSTEM_ADMIN = 'system:admin';

// Reports permissions
export const REPORTS_VIEW = 'reports:view';

/**
 * Permission groups for easier management
 */
export const PermissionGroups = {
  PAYMENTS: [PAYMENT_CREATE, PAYMENT_READ, PAYMENT_UPDATE, PAYMENT_DELETE],
  PAYOUTS: [PAYOUT_CREATE, PAYOUT_READ, PAYOUT_UPDATE, PAYOUT_DELETE],
  MERCHANTS: [MERCHANT_CREATE, MERCHANT_READ, MERCHANT_UPDATE, MERCHANT_DELETE],
  OPERATORS: [OPERATOR_CREATE, OPERATOR_READ, OPERATOR_UPDATE, OPERATOR_DELETE],
  USERS: [USER_CREATE, USER_READ, USER_UPDATE, USER_DELETE],
  ROLES: [ROLE_CREATE, ROLE_READ, ROLE_UPDATE, ROLE_DELETE],
  PERMISSIONS: [PERMISSION_READ, PERMISSION_CREATE, PERMISSION_UPDATE, PERMISSION_DELETE],
  LEDGER: [LEDGER_READ, LEDGER_WRITE],
  SYSTEM_ACCOUNT: [SYSTEM_ACCOUNT_READ, SYSTEM_ACCOUNT_WRITE],
  PARAMETERS: [PARAMETER_READ, PARAMETER_CREATE, PARAMETER_UPDATE, PARAMETER_DELETE],
  REPORTS: [REPORTS_VIEW],
};

/**
 * Navigation permissions - maps routes to required permissions
 */
export const NavigationPermissions = {
  '/dashboard': [], // Dashboard is accessible to all authenticated users
  '/transactions': [PAYMENT_READ],
  '/payouts': [PAYOUT_READ], // Payouts require payout read permission
  '/merchants': [MERCHANT_READ],
  '/operators': [OPERATOR_READ],
  '/users': [USER_READ],
  '/roles': [ROLE_READ],
  '/permissions': [PERMISSION_READ],
  '/ledger-entries': [LEDGER_READ], // Ledger entries require ledger read permission
  '/system-account': [SYSTEM_ACCOUNT_READ], // System account requires system account read permission
  '/parameters': [PARAMETER_READ], // Parameters require parameter read permission
  '/reports': [REPORTS_VIEW],
  '/settings': [], // Settings accessible to all
};

/**
 * Helper function to check if a user can access a route
 */
export function canAccessRoute(route: string, userPermissions: string[]): boolean {
  const requiredPermissions = NavigationPermissions[route as keyof typeof NavigationPermissions];

  // If no permissions required, allow access
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }

  // System admin has access to everything
  if (userPermissions.includes(SYSTEM_ADMIN)) {
    return true;
  }

  // Check if user has any of the required permissions
  return requiredPermissions.some(permission => userPermissions.includes(permission));
}
