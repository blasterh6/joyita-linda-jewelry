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
  orders: Order[];
  addToCart: (product: any) => void;
  updateQuantity: (id: number, qty: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  addOrder: (order: Order) => void;
  cartCount: number;
  cartTotalRaw: number;
  cartTotal: number;
  activeDiscount: number;
  discountRules: { minAmount: number, discount: number }[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [discountRules, setDiscountRules] = useState<{minAmount: number, discount: number}[]>([]);

  // Load User Specific Data
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`jl_cart_session_${user.email}`);
      const savedOrders = localStorage.getItem(`jl_orders_session_${user.email}`);
      if (savedCart) setCart(JSON.parse(savedCart));
      else setCart([]);
      
      if (savedOrders) setOrders(JSON.parse(savedOrders));
      else setOrders([]);
    } else {
      setCart([]);
      setOrders([]);
    }

    const savedRules = localStorage.getItem('jl_discount_rules');
    if (savedRules) setDiscountRules(JSON.parse(savedRules));
    else setDiscountRules([]);
  }, [user]);

  // Persist User Specific Data
  useEffect(() => {
    if (user) {
      localStorage.setItem(`jl_cart_session_${user.email}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`jl_orders_session_${user.email}`, JSON.stringify(orders));
    }
  }, [orders, user]);

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

  const addOrder = (order: Order) => {
    const orderWithEmail = { ...order, userEmail: user?.email };
    setOrders((prev) => [orderWithEmail, ...prev]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const cartTotalRaw = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const activeDiscount = useMemo(() => {
    if (!user) return 0;
    const sortedRules = [...discountRules].sort((a, b) => b.minAmount - a.minAmount);
    const applicableRule = sortedRules.find(r => cartTotalRaw >= r.minAmount);
    return applicableRule ? applicableRule.discount : 0;
  }, [user, cartTotalRaw, discountRules]);

  const cartTotal = cartTotalRaw * (1 - activeDiscount / 100);

  return (
    <CartContext.Provider value={{ 
      cart, 
      orders, 
      addToCart, 
      updateQuantity, 
      removeFromCart, 
      clearCart, 
      addOrder, 
      cartCount, 
      cartTotalRaw,
      cartTotal,
      activeDiscount,
      discountRules
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
