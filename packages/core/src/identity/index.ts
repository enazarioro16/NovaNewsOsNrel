export interface IIdentityUser {
  id: string;
  email: string;
  roles: string[];
  isActive: boolean;
}

export interface IIdentityProvider {
  verifyToken(token: string): Promise<IIdentityUser>;
  getUserById(userId: string): Promise<IIdentityUser | null>;
}

export interface IAuthorizationProvider {
  hasPermission(userId: string, resource: string, action: string): Promise<boolean>;
  hasRole(userId: string, role: string): Promise<boolean>;
}
