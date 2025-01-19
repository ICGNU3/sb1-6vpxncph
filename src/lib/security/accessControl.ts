/**
 * Access Control System
 * Manages roles, permissions, and access checks
 */

// Role definitions
export enum Role {
  ADMIN = 'admin',
  CREATOR = 'creator',
  COLLABORATOR = 'collaborator',
  INVESTOR = 'investor',
  USER = 'user'
}

// Permission definitions
export enum Permission {
  // Project permissions
  CREATE_PROJECT = 'create:project',
  UPDATE_PROJECT = 'update:project',
  DELETE_PROJECT = 'delete:project',
  VIEW_PROJECT = 'view:project',
  
  // Resource permissions
  CREATE_RESOURCE = 'create:resource',
  UPDATE_RESOURCE = 'update:resource',
  DELETE_RESOURCE = 'delete:resource',
  VIEW_RESOURCE = 'view:resource',
  
  // Collaboration permissions
  MANAGE_COLLABORATORS = 'manage:collaborators',
  JOIN_PROJECT = 'join:project',
  
  // Admin permissions
  MANAGE_USERS = 'manage:users',
  MANAGE_ROLES = 'manage:roles',
  VIEW_ANALYTICS = 'view:analytics',
  MANAGE_PLATFORM = 'manage:platform'
}

// Role-Permission mappings
const rolePermissions: Record<Role, Permission[]> = {
  [Role.ADMIN]: Object.values(Permission),
  [Role.CREATOR]: [
    Permission.CREATE_PROJECT,
    Permission.UPDATE_PROJECT,
    Permission.DELETE_PROJECT,
    Permission.VIEW_PROJECT,
    Permission.CREATE_RESOURCE,
    Permission.UPDATE_RESOURCE,
    Permission.DELETE_RESOURCE,
    Permission.VIEW_RESOURCE,
    Permission.MANAGE_COLLABORATORS
  ],
  [Role.COLLABORATOR]: [
    Permission.VIEW_PROJECT,
    Permission.CREATE_RESOURCE,
    Permission.UPDATE_RESOURCE,
    Permission.VIEW_RESOURCE,
    Permission.JOIN_PROJECT
  ],
  [Role.INVESTOR]: [
    Permission.VIEW_PROJECT,
    Permission.VIEW_RESOURCE,
    Permission.VIEW_ANALYTICS
  ],
  [Role.USER]: [
    Permission.VIEW_PROJECT,
    Permission.VIEW_RESOURCE,
    Permission.JOIN_PROJECT
  ]
};

export class AccessControl {
  private userRoles: Map<string, Set<Role>>;
  private customPermissions: Map<string, Set<Permission>>;

  constructor() {
    this.userRoles = new Map();
    this.customPermissions = new Map();
  }

  // Assign role to user
  assignRole(userId: string, role: Role): void {
    if (!this.userRoles.has(userId)) {
      this.userRoles.set(userId, new Set());
    }
    this.userRoles.get(userId)!.add(role);
  }

  // Remove role from user
  removeRole(userId: string, role: Role): void {
    if (this.userRoles.has(userId)) {
      this.userRoles.get(userId)!.delete(role);
    }
  }

  // Add custom permission for user
  addCustomPermission(userId: string, permission: Permission): void {
    if (!this.customPermissions.has(userId)) {
      this.customPermissions.set(userId, new Set());
    }
    this.customPermissions.get(userId)!.add(permission);
  }

  // Remove custom permission from user
  removeCustomPermission(userId: string, permission: Permission): void {
    if (this.customPermissions.has(userId)) {
      this.customPermissions.get(userId)!.delete(permission);
    }
  }

  // Check if user has specific permission
  hasPermission(userId: string, permission: Permission): boolean {
    // Check custom permissions first
    if (this.customPermissions.has(userId) && 
        this.customPermissions.get(userId)!.has(permission)) {
      return true;
    }

    // Check role-based permissions
    const userRoles = this.userRoles.get(userId);
    if (!userRoles) return false;

    return Array.from(userRoles).some(role => 
      rolePermissions[role].includes(permission)
    );
  }

  // Get all permissions for a user
  getUserPermissions(userId: string): Permission[] {
    const permissions = new Set<Permission>();

    // Add role-based permissions
    const userRoles = this.userRoles.get(userId);
    if (userRoles) {
      for (const role of userRoles) {
        rolePermissions[role].forEach(permission => 
          permissions.add(permission)
        );
      }
    }

    // Add custom permissions
    const customUserPermissions = this.customPermissions.get(userId);
    if (customUserPermissions) {
      customUserPermissions.forEach(permission => 
        permissions.add(permission)
      );
    }

    return Array.from(permissions);
  }

  // Get user roles
  getUserRoles(userId: string): Role[] {
    return Array.from(this.userRoles.get(userId) || []);
  }

  // Check if user has specific role
  hasRole(userId: string, role: Role): boolean {
    return this.userRoles.get(userId)?.has(role) || false;
  }

  // Check if user has admin access
  isAdmin(userId: string): boolean {
    return this.hasRole(userId, Role.ADMIN);
  }

  // Validate multiple permissions
  validatePermissions(userId: string, permissions: Permission[]): boolean {
    return permissions.every(permission => 
      this.hasPermission(userId, permission)
    );
  }
}