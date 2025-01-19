/**
 * Authentication Guard
 * Protects routes and actions based on permissions
 */
import { Permission, AccessControl } from './accessControl';

export class AuthGuard {
  private accessControl: AccessControl;

  constructor(accessControl: AccessControl) {
    this.accessControl = accessControl;
  }

  // Higher-order function to protect routes/actions
  requirePermission(permission: Permission) {
    return (userId: string): boolean => {
      return this.accessControl.hasPermission(userId, permission);
    };
  }

  // Require multiple permissions
  requirePermissions(permissions: Permission[]) {
    return (userId: string): boolean => {
      return this.accessControl.validatePermissions(userId, permissions);
    };
  }

  // Require admin role
  requireAdmin() {
    return (userId: string): boolean => {
      return this.accessControl.isAdmin(userId);
    };
  }

  // Validate resource ownership
  validateOwnership(resourceOwnerId: string, userId: string): boolean {
    return resourceOwnerId === userId || this.accessControl.isAdmin(userId);
  }
}