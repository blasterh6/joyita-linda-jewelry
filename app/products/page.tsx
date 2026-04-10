"use client";

import Image from "next/image";
import { ShoppingBag, ArrowLeft, Search, SlidersHorizontal, Check, X, LogOut } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";
import { useState, useMemo, useEffect, Suspense } from "react";

import { products, categories } from "@/lib/products";
const categoriesList = ["Todos", ...categories || ["Aretes", "Collares", "Pulseras", "Anillos"]];

function ProductsContent() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('search');
  const urlCategory = searchParams.get('category');
  const urlCollection = searchParams.get('collection');

  const { addToCart, cartCount } = useCart();
  const { user, logout } = useAuth();
  const [addedItems, setAddedItems] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedCollection, setSelectedCollection] = useState("Todas");
  const [showFilters, setShowFilters] = useState(false);
  const [maxPrice, setMaxPrice] = useState(2000);

  const isWholesale = searchParams.get('mode') === 'wholesale';

  useEffect(() => {
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
    if (urlCategory) {
      const formatted = urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1);
      if (categoriesList.includes(formatted)) {
        setSelectedCategory(formatted);
      }
    }
    if (urlCollection) {
      setSelectedCollection(urlCollection);
    }
  }, [urlSearch, urlCategory, urlCollection]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "Todos" || p.category === selectedCategory;
      const matchesCollection = selectedCollection === "Todas" || p.collection === selectedCollection;
      const matchesPrice = p.price <= maxPrice;
      return matchesSearch && matchesCategory && matchesPrice && matchesCollection;
    });
  }, [searchQuery, selectedCategory, selectedCollection, maxPrice]);

  const handleAdd = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAddedItems((prev) => [...prev, product.id]);
    setTimeout(() => {
       setAddedItems((prev) => prev.filter(id => id !== product.id));
    }, 2000);
  };

  return (
    <div className={`min-h-screen ${isWholesale ? 'bg-[#FCF9F2]' : 'bg-[#F8F9FA]'} pb-32 transition-colors duration-1000`}>
      <nav className="min-h-40 bg-white border-b border-primary/5 flex flex-col md:flex-row items-center justify-between px-8 md:px-16 sticky top-0 z-50 py-6 gap-6">
        <div className="flex items-center gap-6 md:gap-12 flex-1 w-full">
          <Link href="/" className="flex items-center gap-4 group shrink-0">
            <Logo className={isWholesale ? "w-10 h-10 text-amber-600 transition-colors" : "w-10 h-10 text-primary transition-colors"} />
            <div className="flex flex-col">
               <h1 className="text-xl font-serif italic text-primary hidden sm:block leading-none">Joyita Linda</h1>
               {isWholesale && <span className="text-[8px] font-black uppercase tracking-[0.3em] text-amber-600 mt-1">Acceso Mayorista</span>}
            </div>
          </Link>
          <div className="h-10 w-px bg-primary/5 hidden md:block" />
          
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/30 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar joyas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-6 bg-surface-container-lowest border border-primary/5 focus:outline-none focus:border-primary/20 text-sm font-bold tracking-wide transition-all uppercase placeholder:normal-case"
            />
          </div>
        </div>

        <div className="flex items-center gap-6 md:gap-12 flex-1 justify-end w-full">
           <Link href="/cart" className="relative group p-4 bg-surface-container-low hover:bg-white transition-all">
              <ShoppingBag className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 w-6 h-6 bg-primary text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white">{cartCount}</span>}
           </Link>
           
           <div className="h-10 w-px bg-primary/5 mx-2 hidden md:block" />
           
           {user ? (
             <div className="flex items-center gap-6">
               <Link href="/dashboard" className="flex flex-col items-end">
                  <span className="text-[10px] uppercase font-black tracking-widest text-primary">{user.name}</span>
                  <span className="text-[9px] font-bold text-primary/40 uppercase tracking-widest">{user.role}</span>
               </Link>
               <button onClick={logout} className="p-3 hover:bg-surface-container-low text-primary/40 hover:text-primary transition-all">
                  <LogOut size={16} />
               </button>
             </div>
           ) : (
             <Link href="/login" className="btn-primary text-[10px] px-8 h-12 flex items-center uppercase tracking-widest font-black">Entrar</Link>
           )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 md:px-16 pt-12 md:pt-24">
        <div className="flex items-center gap-4 text-xs font-bold tracking-[0.2em] uppercase text-primary/40 mb-12">
            <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
            <span>/</span>
            <span className="text-primary tracking-[0.3em]">Catálogo</span>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-24 border-b border-primary/10 pb-8 gap-8">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-primary/40 block mb-4">
              {isWholesale ? "Programa de Mayoreo" : selectedCollection !== "Todas" ? "Edición Limitada" : "Joyita Linda .925"}
            </span>
            <h2 className="text-6xl font-serif italic text-primary lowercase leading-none">
               {isWholesale ? "Catálogo para Mayoristas" : selectedCollection !== "Todas" ? `Colección ${selectedCollection}` : selectedCategory !== "Todos" ? selectedCategory : "nuestras piezas"}
            </h2>
          </div>
          
          <div className="flex items-center gap-6 self-end">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-primary transition-all border-b pb-1 ${showFilters ? 'border-primary' : 'border-transparent hover:border-primary/40'}`}
            >
               Filtros <SlidersHorizontal size={14} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-16 bg-white border border-primary/5 p-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                <div>
                  <h4 className="text-[10px] uppercase font-black tracking-widest text-primary/40 mb-6">Categorías</h4>
                  <div className="flex flex-wrap gap-3">
                    {categoriesList.map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all ${selectedCategory === cat ? 'bg-primary text-white border-primary' : 'bg-transparent text-primary/60 border-primary/10 hover:border-primary'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase font-black tracking-widest text-primary/40 mb-6">Precio Máximo: ${maxPrice} MXN</h4>
                  <input 
                    type="range" 
                    min="200" 
                    max="2000" 
                    step="50"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between mt-2 text-[10px] font-bold text-primary/20 uppercase tracking-widest">
                    <span>$200</span>
                    <span>$2000+</span>
                  </div>
                </div>

                <div className="flex items-end justify-end">
                  <button 
                    onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("Todos");
                        setMaxPrice(2000);
                    }}
                    className="text-[10px] font-black uppercase tracking-widest text-primary/40 hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <X size={12} /> Limpiar Filtros
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-primary/5 border border-primary/5">
            {filteredProducts.map((p) => (
              <motion.div 
                key={p.id}
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white p-10 group relative transition-all flex flex-col h-full overflow-hidden"
              >
                <Link href={`/products/${p.slug}`} className="flex-1 flex flex-col">
                  <div className="relative h-[250px] mb-12 flex items-center justify-center overflow-hidden">
                    <Image src={p.image} alt={p.name} fill className="object-contain p-8 group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-0 right-0 p-2 bg-surface-container-low text-[9px] uppercase tracking-[0.2em] font-black text-primary/40">
                       {p.category}
                    </div>
                  </div>

                  <div className="mt-auto space-y-6">
                     <h3 className="text-xl text-primary font-serif italic leading-tight lowercase min-h-[50px]">{p.name}</h3>
                     <div className="flex justify-between items-end border-t border-primary/5 pt-8">
                        <span className="text-lg font-black tracking-tighter text-primary">${p.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN</span>
                        <button 
                          onClick={(e) => handleAdd(p, e)}
                          className={`w-12 h-12 flex items-center justify-center transition-all ${
                             addedItems.includes(p.id) ? 'bg-green-600 text-white' : 'border border-primary/10 hover:bg-primary-container hover:text-white'
                          }`}
                        >
                           {addedItems.includes(p.id) ? <Check size={18} /> : <ShoppingBag size={18} />}
                        </button>
                     </div>
                  </div>
                </Link>
                <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 pointer-events-none opacity-10" />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary/40">No se encontraron piezas con estos filtros.</p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("Todos");
                setMaxPrice(2000);
              }}
              className="mt-8 text-primary font-serif italic text-xl border-b border-primary hover:opacity-60 transition-all"
            >
              ver todas las joyas
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function Products() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center text-primary/20 uppercase font-black tracking-[0.5em]">Abriendo Catálogo Joyita Linda...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
