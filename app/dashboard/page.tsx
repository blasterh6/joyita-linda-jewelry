"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.push('/login');
    if (!isLoading && user?.role === 'admin') router.push('/dashboard/admin');
    if (!isLoading && user?.role === 'vendor') router.push('/dashboard/vendor');
    if (!isLoading && user?.role === 'customer') router.push('/dashboard/customer');
  }, [user, isLoading, router]);

  if (isLoading || !user) return <div className="h-screen flex items-center justify-center text-primary/20 uppercase font-black tracking-[0.5em]">Sincronizando Joyita Linda...</div>;

  return null;
}
