"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'sale' | 'system' | 'commission';
  read: boolean;
  time: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (title: string, message: string, type: 'order' | 'sale' | 'system' | 'commission') => void;
  markAsRead: (id: string) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('jl_notifications_session');
    if (saved) {
      setNotifications(JSON.parse(saved));
    } else if (user) {
      // If no saved notifications, load defaults for user role
      let initial: Notification[] = [];
      if (user.role === 'admin') {
        initial = [
          { id: '1', title: 'Nueva Orden', message: 'Se ha recibido la orden ORD-9901 para Carlos Cliente.', type: 'order', read: false, time: 'Hace 5min' },
          { id: '2', title: 'Registro de Socio', message: 'Un nuevo prospecto desea unirse como Vendedor.', type: 'system', read: false, time: 'Hace 10min' }
        ];
      } else if (user.role === 'vendor') {
        initial = [
          { id: '1', title: 'Venta Confirmada', message: 'Felicidades, has cerrado una venta de $1,850.00.', type: 'sale', read: false, time: 'Hace 2min' }
        ];
      } else if (user.role === 'customer') {
        initial = [
          { id: '1', title: 'Pedido en Camino', message: 'Tu joyería está siendo empacada con amor.', type: 'order', read: false, time: 'Hace 5min' }
        ];
      }
      setNotifications(initial);
    }
  }, [user]);

  // Persist notifications to LocalStorage on change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('jl_notifications_session', JSON.stringify(notifications));
    }
  }, [notifications]);

  const addNotification = (title: string, message: string, type: 'order' | 'sale' | 'system' | 'commission') => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substring(7),
      title,
      message,
      type,
      read: false,
      time: 'Ahora mismo'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('jl_notifications_session');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};
