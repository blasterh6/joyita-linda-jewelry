"use client";

import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Search, 
  Bell, 
  LogOut,
  UserCircle,
  ShieldCheck,
  BadgeCheck,
  BadgePercent,
  User,
  X,
  CreditCard,
  CheckCircle,
  Info
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const adminMenu = [
  { label: "General", icon: <LayoutDashboard size={18} />, href: "/dashboard" },
  { label: "Catálogo", icon: <Package size={18} />, href: "/dashboard/admin/catalog" },
  { label: "Usuarios", icon: <Users size={18} />, href: "/dashboard/admin/users" },
  { label: "Descuentos", icon: <BadgePercent size={18} />, href: "/dashboard/admin/discounts" },
  { label: "Órdenes", icon: <ShoppingBag size={18} />, href: "/dashboard/admin/orders" },
  { label: "Promociones", icon: <BadgeCheck size={18} />, href: "/dashboard/admin/promotions" },
];

const vendorMenu = [
  { label: "Resumen", icon: <LayoutDashboard size={18} />, href: "/dashboard/vendor" },
  { label: "Mis Ventas", icon: <ShoppingBag size={18} />, href: "/dashboard/vendor/sales" },
  { label: "Inventario", icon: <Package size={18} />, href: "/dashboard/vendor/inventory" },
];

const customerMenu = [
  { label: "Mis Compras", icon: <ShoppingBag size={18} />, href: "/dashboard/customer" },
  { label: "Mi Perfil", icon: <UserCircle size={18} />, href: "/profile" },
  { label: "Carrito", icon: <ShoppingBag size={18} />, href: "/cart" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [showNotifs, setShowNotifs] = useState(false);
  
  const menu = user?.role === 'vendor' ? vendorMenu : 
               user?.role === 'customer' ? customerMenu : adminMenu;

  useEffect(() => {
    if (!isLoading && !user) {
        router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center text-primary/20 uppercase font-black tracking-[0.5em]">Validando Sesión Joyita Linda...</div>;
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-[#F8F9FA]">
      {/* Sidebar */}
      <aside className="w-72 bg-primary text-white flex flex-col p-8 z-50">
        <div className="flex items-center gap-4 mb-16 px-4">
          <Logo className="w-10 h-10 text-white" />
          <h1 className="text-lg font-serif italic text-white/90">Joyita Linda</h1>
        </div>

        <nav className="flex-1 space-y-3">
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30 block mb-6 px-4">
            Navegación General
          </span>
          <Link href="/" className="flex items-center gap-4 px-6 py-4 text-white/40 hover:text-white transition-all border-l-2 border-transparent">
            <LayoutDashboard size={18} />
            <span className="text-xs uppercase font-black tracking-widest">Inicio</span>
          </Link>
          <Link href="/products" className="flex items-center gap-4 px-6 py-4 text-white/40 hover:text-white transition-all border-l-2 border-transparent">
            <ShoppingBag size={18} />
            <span className="text-xs uppercase font-black tracking-widest">Tienda</span>
          </Link>

          <div className="h-4" />

          <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/30 block mb-6 px-4 border-t border-white/5 pt-6">
            Panel {user.role === 'admin' ? 'Administración' : user.role === 'vendor' ? 'Socio Vendedor' : 'Cliente'}
          </span>
          {menu.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-4 px-6 py-4 transition-all border-l-2 ${
                pathname === item.href ? "bg-white/10 border-white text-white" : "border-transparent text-white/40 hover:text-white"
              }`}
            >
              {item.icon}
              <span className="text-xs uppercase font-black tracking-widest">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="pt-8 border-t border-white/10 mt-auto">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-4 px-6 py-4 text-white/40 hover:text-white transition-all group"
          >
            <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            <span className="text-xs uppercase font-black tracking-widest text-left">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Topbar */}
        <header className="h-24 bg-white border-b border-primary/5 flex items-center justify-between px-12 z-40">
          <div className="flex items-center gap-6 bg-surface-container-low px-8 py-3 w-full max-w-xl">
             <Search size={18} className="text-primary/20" />
             <input type="text" placeholder="Buscar en Joyita Linda..." className="bg-transparent border-none focus:outline-none text-xs font-bold w-full uppercase tracking-widest placeholder:text-primary/10" />
          </div>

          <div className="flex items-center gap-10">
            <div className="relative">
              <button 
                onClick={() => setShowNotifs(!showNotifs)}
                className={`p-3 bg-surface-container-low relative group transition-all ${showNotifs ? 'bg-primary text-white' : 'text-primary'}`}
              >
                 <Bell size={20} className="group-hover:scale-110 transition-transform" />
                 {unreadCount > 0 && <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-600 animate-pulse border-2 border-white rounded-full" />}
              </button>

              <AnimatePresence>
                {showNotifs && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-96 bg-white border border-primary/5 shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-6 border-b border-primary/5 bg-primary text-white flex justify-between items-center">
                       <span className="text-[10px] uppercase font-black tracking-widest">Notificaciones</span>
                       <span className="text-[9px] font-bold opacity-60 uppercase">{unreadCount} Pendientes</span>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                       {notifications.length === 0 ? (
                         <div className="p-12 text-center text-[10px] uppercase font-bold text-primary/20">Sin notificaciones nuevas</div>
                       ) : (
                         notifications.map((n) => (
                           <div 
                             key={n.id} 
                             onClick={() => markAsRead(n.id)}
                             className={`p-6 border-b border-primary/5 hover:bg-surface-container-low transition-all cursor-pointer group ${!n.read ? 'bg-[#F8F9FA]' : ''}`}
                           >
                              <div className="flex gap-4">
                                 <div className="mt-1">
                                    {n.type === 'order' ? <ShoppingBag size={14} className="text-blue-600" /> : 
                                     n.type === 'sale' ? <CheckCircle size={14} className="text-green-600" /> : <Info size={14} className="text-primary/20" />}
                                 </div>
                                 <div className="space-y-1">
                                    <p className={`text-[11px] font-black uppercase tracking-tight ${!n.read ? 'text-primary' : 'text-primary/40'}`}>{n.title}</p>
                                    <p className="text-[9px] font-bold text-primary/40 leading-relaxed uppercase tracking-wider">{n.message}</p>
                                    <p className="text-[8px] font-black text-primary/20 uppercase mt-2">{n.time}</p>
                                 </div>
                              </div>
                           </div>
                         ))
                       )}
                    </div>
                    <button onClick={() => setShowNotifs(false)} className="w-full h-12 border-t border-primary/5 text-[9px] uppercase font-black tracking-widest text-primary/20 hover:text-primary transition-all">Cerrar</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-10 w-px bg-primary/5 mx-2" />
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs font-black uppercase tracking-tight text-primary">{user.name}</p>
                <div className="flex items-center gap-2 justify-end">
                   {user.role === 'admin' ? <ShieldCheck size={10} className="text-blue-600" /> : <BadgeCheck size={10} className="text-green-600" />}
                   <p className="text-[9px] text-primary/40 font-bold uppercase tracking-widest">{user.role}</p>
                </div>
              </div>
              <div className="w-12 h-12 bg-primary-container flex items-center justify-center text-white text-xs font-bold ring-4 ring-primary/5 uppercase">
                {user.name.split(' ').map(n=>n[0]).join('')}
              </div>
              <button 
                onClick={logout}
                className="p-3 bg-surface-container-low text-primary/40 hover:text-red-600 hover:bg-white transition-all shadow-sm"
                title="Cerrar Sesión"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 overflow-y-auto p-12 bg-[#F8F9FA] z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
