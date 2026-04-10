"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShoppingBag, 
  ChevronDown, 
  Search, 
  User as UserIcon, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const navItems = [
  { 
    label: "Colecciones", 
    id: "collections",
    items: [
      { label: "Esenciales", slug: "esenciales", desc: "Joyas para el diario" },
      { label: "Noche", slug: "noche", desc: "Brillo para eventos" },
      { label: "Artesanal", slug: "artesanal", desc: "Hecho a mano" }
    ]
  },
  { 
    label: "Categorías", 
    id: "categories",
    items: [
      { label: "Aretes", slug: "aretes", desc: "Plata fina para tus oídos" },
      { label: "Collares", slug: "collares", desc: "Elegancia en tu cuello" },
      { label: "Anillos", slug: "anillos", desc: "Detalles en tus manos" },
      { label: "Pulseras", slug: "pulseras", desc: "Brillo en cada movimiento" }
    ]
  },
  {
    label: "Socio Vendedor",
    id: "socio",
    href: "/socio"
  }
];

export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${searchQuery}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] glass border-b border-primary/5 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-28 flex items-center justify-between gap-8">
        <div className="flex items-center gap-12 shrink-0">
          <Link href="/" className="flex items-center gap-3 group">
            <Logo className="w-12 h-12 group-hover:scale-105 transition-transform" />
            <div className="hidden lg:block">
              <h1 className="text-xl font-serif tracking-tighter text-primary uppercase font-black leading-none">
                Joyita Linda
              </h1>
              <p className="text-[8px] tracking-[0.4em] font-black text-primary/30 mt-1 uppercase">Plata .925 Fina</p>
            </div>
          </Link>
        </div>

        {/* Desktop Menus */}
        <div className="hidden lg:flex items-center gap-8 flex-1">
          {navItems.map((menu) => (
            menu.href ? (
              <Link 
                key={menu.id} 
                href={menu.href}
                className="nav-link text-[10px] uppercase font-black tracking-widest text-primary/40 hover:text-primary transition-all"
              >
                {menu.label}
              </Link>
            ) : (
              <div 
                key={menu.id} 
                className="relative h-28 flex items-center"
                onMouseEnter={() => setActiveDropdown(menu.id)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className={`nav-link text-[10px] uppercase font-black tracking-widest flex items-center gap-2 ${activeDropdown === menu.id ? 'text-primary' : 'text-primary/40'}`}>
                  {menu.label}
                  <ChevronDown className={`w-3 h-3 transition-transform ${activeDropdown === menu.id ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {activeDropdown === menu.id && menu.items && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-24 left-0 w-80 bg-white border border-primary/5 shadow-2xl p-6 grid grid-cols-1 gap-4"
                    >
                      {menu.items.map((item) => (
                        <Link 
                          key={item.slug} 
                          href={`/products?${menu.id === 'categories' ? 'category' : 'collection'}=${item.slug}`} 
                          className="group p-4 hover:bg-surface-container-low transition-all"
                        >
                          <p className="text-[10px] uppercase font-black tracking-widest text-primary mb-1 group-hover:translate-x-2 transition-transform">{item.label}</p>
                          <p className="text-[9px] font-bold text-primary/30 uppercase tracking-widest">{item.desc}</p>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          ))}

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xs relative ml-4">
             <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" />
             <input 
               type="text" 
               placeholder="Buscar..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full h-12 bg-primary/5 border-none px-12 text-[10px] uppercase font-black tracking-widest placeholder:text-primary/20 focus:ring-1 focus:ring-primary/10 transition-all rounded-none"
             />
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6 shrink-0">
          {user ? (
            <div className="flex items-center gap-4">
              <Link 
                href={user.role === 'admin' ? '/dashboard/admin' : '/dashboard/customer'} 
                className="flex items-center gap-3 p-3 bg-primary text-white hover:bg-primary-container transition-all shadow-lg"
              >
                <UserIcon size={16} />
                <span className="text-[9px] uppercase font-black tracking-widest hidden sm:block">Mi Cuenta</span>
              </Link>
              <button 
                onClick={logout}
                className="p-3 text-primary/40 hover:text-red-600 transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="nav-link text-[10px] uppercase font-black tracking-widest text-primary/40 hover:text-primary">
              Mi Cuenta
            </Link>
          )}

          <div className="w-px h-8 bg-primary/5 hidden md:block" />

          <Link href="/cart" className="relative group">
            <div className="p-3 bg-surface-container-low group-hover:bg-primary transition-all shadow-sm">
              <ShoppingBag size={20} className="text-primary group-hover:text-white transition-colors" />
            </div>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-primary text-white text-[10px] font-black flex items-center justify-center ring-2 ring-background animate-in zoom-in">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-3 bg-surface-container-low text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 top-28 bg-white z-[90] lg:hidden flex flex-col p-8 space-y-12 overflow-y-auto"
          >
            <div className="space-y-8">
              {navItems.map((menu) => (
                <div key={menu.id} className="space-y-4">
                  <p className="text-[10px] uppercase font-black tracking-[0.4em] text-primary/30 border-b border-primary/5 pb-2">{menu.label}</p>
                  {menu.items ? (
                    <div className="grid grid-cols-1 gap-4 pl-4">
                      {menu.items.map((sub) => (
                        <Link 
                          key={sub.slug}
                          href={`/products?${menu.id === 'categories' ? 'category' : 'collection'}=${sub.slug}`}
                          className="text-sm font-black text-primary uppercase tracking-tight"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link 
                      href={menu.href || '#'}
                      className="text-sm font-black text-primary uppercase tracking-tight block pl-4"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Ir a {menu.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-primary/5 space-y-6">
              <form onSubmit={handleSearch} className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" />
                <input 
                  type="text" 
                  placeholder="Buscar Joyería..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-14 bg-surface-container-low border-none px-12 text-xs font-black uppercase tracking-widest"
                />
              </form>
              
              {!user && (
                <Link 
                  href="/login" 
                  className="btn-primary w-full h-16 flex items-center justify-center text-[10px] font-black uppercase tracking-widest"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
