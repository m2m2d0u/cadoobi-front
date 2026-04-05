import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, AuthResponse } from '../services/auth.service';

interface AuthContextType {
  user: AuthResponse | null;
  permissions: string[];
  roles: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

interface JWTPayload {
  sub: string;
  userId: string;
  fullName: string;
  roles: string[];
  permissions: string[];
  iat: number;
  exp: number;
}

// Decode JWT token
function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

// Check if token is expired
function isTokenExpired(token: string): boolean {
  const payload = decodeJWT(token);
  if (!payload) return true;

  // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
  return payload.exp * 1000 < Date.now();
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data on mount
  useEffect(() => {
    const loadUser = () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        // Check if token is expired
        if (isTokenExpired(token)) {
          console.warn('Token expired, clearing session');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setIsLoading(false);
          return;
        }

        // Decode token to get user data and permissions
        const payload = decodeJWT(token);
        if (payload) {
          // Create AuthResponse-like object from token payload
          const userData: AuthResponse = {
            token: token,
            refreshToken: localStorage.getItem('refresh_token') || '',
            expiresIn: payload.exp - payload.iat,
            userId: payload.userId,
            email: payload.sub,
            fullName: payload.fullName,
            status: 'ACTIVE',
            roles: payload.roles,
            permissions: payload.permissions
          };
          setUser(userData);
        } else {
          console.error('Failed to decode token');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const authData = await authService.login({ email, password });
    localStorage.setItem('access_token', authData.token);
    localStorage.setItem('refresh_token', authData.refreshToken);

    // Decode the token to get permissions and roles
    const payload = decodeJWT(authData.token);
    if (payload) {
      // Merge API response with decoded token data to ensure we have permissions
      const userData: AuthResponse = {
        ...authData,
        userId: payload.userId,
        email: payload.sub,
        fullName: payload.fullName,
        permissions: payload.permissions,
        roles: payload.roles
      };
      setUser(userData);
    } else {
      setUser(authData);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    authService.logout().catch(console.error);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user || !user.permissions) return false;
    // Admins have all permissions
    if (user.permissions.includes('system:admin')) return true;
    return user.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user || !user.permissions) return false;
    // Admins have all permissions
    if (user.permissions.includes('system:admin')) return true;
    return permissions.some(permission => user.permissions.includes(permission));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user || !user.permissions) return false;
    // Admins have all permissions
    if (user.permissions.includes('system:admin')) return true;
    return permissions.every(permission => user.permissions.includes(permission));
  };

  const hasRole = (role: string): boolean => {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  };

  const isAdmin = (): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes('system:admin');
  };

  const value: AuthContextType = {
    user,
    permissions: user?.permissions || [],
    roles: user?.roles || [],
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
