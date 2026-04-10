"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useAuth } from './AuthContext';

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  image: string;
}

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: string;
  userEmail?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any) => void;
  updateQuantity: (id: number, qty: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotalRaw: number;
  cartTotal: number;
  activeDiscount: number;
  savings: number;
  discountRules: { minAmount: number, discount: number }[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountRules, setDiscountRules] = useState<{minAmount: number, discount: number}[]>([]);

  const fetchRules = async () => {
    try {
      const response = await fetch('/api/v1/settings?key=discount_rules');
      const data = await response.json();
      if (data.value) {
        setDiscountRules(JSON.parse(data.value));
      }
    } catch (err) {
      console.error('Error fetching discount rules:', err);
    }
  };

  // Initial load
  useEffect(() => {
    fetchRules();
    
    // Listen for rule updates from admin panel in other tabs
    const handleStorage = (e: any) => {
      if (e.key === 'jl_discount_rules' || !e.key) fetchRules();
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Load User Specific Data
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`jl_cart_session_${user.email}`);
      if (savedCart) setCart(JSON.parse(savedCart));
      else setCart([]);
    } else {
      setCart([]);
    }
  }, [user]);

  // Persist User Specific Data
  useEffect(() => {
    if (user) {
      localStorage.setItem(`jl_cart_session_${user.email}`, JSON.stringify(cart));
    }
  }, [cart, user]);



  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQuantity = (id: number, qty: number) => {
    if (qty < 1) {
      removeFromCart(id);
      return;
    }
    setCart((prev) => prev.map(item => item.id === id ? { ...item, qty } : item));
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const addOrder = () => {}; // No longer used in context, managed via API in pages

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const cartTotalRaw = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const activeDiscount = useMemo(() => {
    const sortedRules = [...discountRules].sort((a, b) => b.minAmount - a.minAmount);
    const applicableRule = sortedRules.find(r => cartTotalRaw >= r.minAmount);
    return applicableRule ? applicableRule.discount : 0;
  }, [cartTotalRaw, discountRules]);

  const savings = cartTotalRaw * (activeDiscount / 100);
  const cartTotal = cartTotalRaw - savings;

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      updateQuantity, 
      removeFromCart, 
      clearCart, 
      cartCount, 
      cartTotalRaw,
      cartTotal,
      activeDiscount,
      discountRules,
      savings
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
