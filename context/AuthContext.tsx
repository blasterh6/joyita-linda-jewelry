"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Role = 'admin' | 'vendor' | 'customer';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

interface User {
  id: number;
  email: string;
  role: Role;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedSession = localStorage.getItem('jl_user_session');
    if (savedSession) {
      const { user, token } = JSON.parse(savedSession);
      setUser(user);
      setToken(token);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Login failed');

    const session = {
      user: { email, role: data.role, name: data.name, id: data.id || 0 }, // Backend should ideally return ID
      token: data.token
    };

    setUser(session.user);
    setToken(session.token);
    localStorage.setItem('jl_user_session', JSON.stringify(session));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('jl_user_session');
    window.location.href = '/login';
  };

  const updateUser = async (data: Partial<User>) => {
    if (!user || !token) return;

    const response = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ firstName: data.name?.split(' ')[0], lastName: data.name?.split(' ').slice(1).join(' ') }),
    });

    if (!response.ok) throw new Error('Failed to update profile');

    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    
    const session = JSON.parse(localStorage.getItem('jl_user_session') || '{}');
    session.user = updatedUser;
    localStorage.setItem('jl_user_session', JSON.stringify(session));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, updateUser, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
