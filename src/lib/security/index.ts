/**
 * Optimized Security System
 */
import { AccessControl, Role } from './accessControl';
import { AuthGuard } from './authGuard';

// Singleton instance
let instance: SecuritySystem | null = null;

class SecuritySystem {
  private accessControl: AccessControl;
  private authGuard: AuthGuard;

  private constructor() {
    this.accessControl = new AccessControl();
    this.authGuard = new AuthGuard(this.accessControl);
  }

  static getInstance(): SecuritySystem {
    if (!instance) {
      instance = new SecuritySystem();
    }
    return instance;
  }

  initializeUser(user: { id: string; email: string }): void {
    const role = user.email.endsWith('@neplus.com') ? Role.ADMIN : Role.USER;
    this.accessControl.assignRole(user.id, role);
  }

  getAccessControl(): AccessControl {
    return this.accessControl;
  }

  getAuthGuard(): AuthGuard {
    return this.authGuard;
  }
}

// Export optimized interface
export const security = SecuritySystem.getInstance();
export const accessControl = security.getAccessControl();
export const authGuard = security.getAuthGuard();
export { Role } from './accessControl';

// Initialize user security
export const initializeAccessControl = (user: { id: string; email: string }) => {
  security.initializeUser(user);
};