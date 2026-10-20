import { apiUrl } from '../config/api';
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
}

interface RegisterAddressData {
  houseFlat?: string;
  streetLocality?: string;
  city?: string;
  state?: string;
  pincode?: string;
  landmark?: string;
  deliveryInstructions?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>;
  register: (
    name: string,
    email: string,
    password: string,
    phone?: string,
    addressData?: RegisterAddressData
  ) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => void;
  updateProfile: (name: string, phone: string) => Promise<{ success: boolean; error?: string; user?: User }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('knl_auth_token'));
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('knl_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('knl_auth_token');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(apiUrl('/api/auth/me'), {
          headers: { Authorization: `Bearer ${storedToken}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          localStorage.setItem('knl_user', JSON.stringify(data.user));
        } else {
          // Token invalid or expired
          logout();
        }
      } catch (err) {
        console.warn('Auth check connection issue:', err);
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(apiUrl('/api/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        if (res.status === 404) {
          return {
            success: false,
            error: 'Backend API service is not reachable (404). If the backend is on Render Free Tier, it may be waking up—please allow 30 seconds and retry.',
          };
        }
        return { success: false, error: (data && data.error) || `Login failed (Status ${res.status}).` };
      }

      if (!data || !data.token) {
        return { success: false, error: 'Malformed response received from authentication server.' };
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('knl_auth_token', data.token);
      localStorage.setItem('knl_user', JSON.stringify(data.user));

      return { success: true, user: data.user };
    } catch (err) {
      return {
        success: false,
        error: 'Could not connect to server. If the backend is on a free host, it may be waking up from sleep (takes ~30-50 seconds). Please retry shortly.',
      };
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone?: string,
    addressData?: RegisterAddressData
  ) => {
    try {
      const res = await fetch(apiUrl('/api/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          phone,
          ...(addressData || {}),
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        if (res.status === 404) {
          return {
            success: false,
            error: 'Backend API service is not reachable (404). The server may be waking up; please wait 30 seconds and try again.',
          };
        }
        return { success: false, error: (data && data.error) || `Registration failed (Status ${res.status}).` };
      }

      if (!data || !data.token) {
        return { success: false, error: 'Malformed response received from registration server.' };
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('knl_auth_token', data.token);
      localStorage.setItem('knl_user', JSON.stringify(data.user));

      return { success: true, user: data.user };
    } catch (err) {
      return {
        success: false,
        error: 'Could not connect to server. Please check your internet connection or allow the backend service to spin up.',
      };
    }
  };

  const updateProfile = async (name: string, phone: string) => {
    if (!token) return { success: false, error: 'Not authenticated' };

    try {
      const res = await fetch(apiUrl('/api/auth/profile'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, phone }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Profile update failed.' };
      }

      setUser(data.user);
      localStorage.setItem('knl_user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } catch (err) {
      return { success: false, error: 'Server error updating profile.' };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('knl_auth_token');
    localStorage.removeItem('knl_user');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
