"use client";

import Image from "next/image";
import { 
  ShoppingBag, 
  ArrowLeft, 
  ShieldCheck, 
  Globe, 
  ChevronRight, 
  Heart, 
  Share2, 
  CheckCircle2, 
  Truck,
  Award,
  BadgeCheck,
  Star
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Logo from "@/components/Logo";
import { useCart } from "@/context/CartContext";
import { useState, useMemo } from "react";
import { products } from "@/lib/products";

export default function ProductDetail() {
  const { slug } = useParams();
  const router = useRouter();
  const { addToCart, cartCount } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const product = useMemo(() => {
    return products.find(p => p.slug === slug);
  }, [slug]);

  if (!product) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-8 bg-white">
        <Logo className="w-16 h-16 opacity-10" />
        <h2 className="text-2xl font-serif italic text-primary/40">Pieza no encontrada</h2>
        <Link href="/products" className="btn-primary text-[10px] px-12 h-14 flex items-center">Volver al Catálogo</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product);
    router.push('/cart');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Premium Navbar */}
      <nav className="h-40 bg-white border-b border-primary/5 flex items-center justify-between px-16 sticky top-0 z-50">
        <div className="flex items-center gap-12 flex-1">
          <Link href="/" className="flex items-center gap-4 group">
            <Logo className="w-10 h-10 group-hover:scale-110 transition-transform" />
            <h1 className="text-xl font-serif italic text-primary">Joyita Linda</h1>
          </Link>
          <div className="h-10 w-px bg-primary/5" />
          <div className="flex items-center gap-4 text-xs font-bold tracking-[0.2em] uppercase text-primary/40">
             <Link href="/products" className="hover:text-primary transition-colors">Tienda</Link>
             <ChevronRight size={12} />
             <span className="text-primary/20">{product.category}</span>
             <ChevronRight size={12} />
             <span className="text-primary tracking-[0.3em]">{product.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-12">
           <Link href="/cart" className="relative group p-4 bg-surface-container-low hover:bg-white transition-all">
              <ShoppingBag className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
              {cartCount > 0 && <span className="absolute -top-1 -right-1 w-6 h-6 bg-primary text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white">{cartCount}</span>}
           </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-16 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          
          {/* Visual Section */}
          <section className="space-y-12">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square bg-surface-container-low flex items-center justify-center group overflow-hidden border border-primary/5"
            >
              <Image 
                src={product.image} 
                alt={product.name} 
                fill 
                className="object-contain p-20 group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute top-10 right-10 flex flex-col gap-4">
                 <button className="w-12 h-12 bg-white flex items-center justify-center text-primary/20 hover:text-red-500 transition-colors shadow-sm"><Heart size={18} /></button>
                 <button className="w-12 h-12 bg-white flex items-center justify-center text-primary/20 hover:text-primary transition-colors shadow-sm"><Share2 size={18} /></button>
              </div>
              <div className="absolute bottom-10 left-10 py-2 px-6 bg-primary text-white text-[9px] font-black uppercase tracking-[0.4em]">Plata .925 Auténtica</div>
            </motion.div>
            
            <div className="grid grid-cols-3 gap-6">
               {[1,2,3].map(i => (
                 <div key={i} className="aspect-square bg-surface-container-low border border-primary/5 relative opacity-40 hover:opacity-100 cursor-pointer transition-opacity">
                    <Image src={product.image} alt="preview" fill className="object-contain p-4" />
                 </div>
               ))}
            </div>
          </section>

          {/* Info Section */}
          <section className="space-y-16 py-8">
            <header className="space-y-8">
              <div className="flex items-center gap-4">
                 <span className="px-4 py-1.5 bg-primary/5 text-primary text-[9px] font-black uppercase tracking-[0.3em]">{product.category}</span>
                 <div className="flex gap-1 text-amber-500">
                    {[1,2,3,4,5].map(i => <Star key={i} size={10} fill="currentColor" />)}
                 </div>
              </div>
              <h2 className="text-7xl font-serif italic text-primary leading-none lowercase">{product.name}</h2>
              <div className="flex items-end gap-6 pt-4">
                <p className="text-5xl font-black text-primary tracking-tighter">${product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<span className="text-xl ml-2 font-bold opacity-20">MXN</span></p>
                <span className="text-xs font-bold text-green-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                   <CheckCircle2 size={14} /> {product.availability}
                </span>
              </div>
            </header>

            <div className="h-px bg-primary/5" />

            <article className="space-y-8">
               <p className="text-sm text-primary/60 leading-relaxed font-semibold tracking-wide">
                 {product.description}
               </p>
               
               <div className="space-y-4">
                  <h4 className="text-[10px] uppercase font-black tracking-[0.4em] text-primary/30">Especificaciones Técnicas</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-3 text-[11px] font-bold text-primary/60 uppercase tracking-widest border-l-2 border-primary/10 pl-4 py-1">
                        {detail}
                      </li>
                    ))}
                  </ul>
               </div>
            </article>

            <div className="space-y-6 pt-8">
               <div className="flex gap-6">
                 <button 
                   onClick={handleAddToCart}
                   className={`flex-1 h-20 uppercase font-black tracking-[0.4em] text-[10px] transition-all flex items-center justify-center gap-4 ${
                     isAdded ? 'bg-green-600 text-white' : 'bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white'
                   }`}
                 >
                   {isAdded ? 'Añadido con Éxito' : 'Añadir a la Bolsa'} 
                   <ShoppingBag size={18} />
                 </button>
                 <button 
                   onClick={handleBuyNow}
                   className="flex-1 h-20 bg-primary text-white uppercase font-black tracking-[0.4em] text-[10px] hover:bg-primary-container transition-all"
                 >
                   Comprar Ahora
                 </button>
               </div>
            </div>

            {/* Trust Badges */}
            <footer className="grid grid-cols-3 gap-8 pt-16 border-t border-primary/5">
               <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-12 h-12 bg-surface-container-low flex items-center justify-center text-primary/40"><Truck size={20} /></div>
                  <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Envío Express a todo México</span>
               </div>
               <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-12 h-12 bg-surface-container-low flex items-center justify-center text-primary/40"><BadgeCheck size={20} /></div>
                  <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Garantía de Calidad .925</span>
               </div>
               <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-12 h-12 bg-surface-container-low flex items-center justify-center text-primary/40"><ShieldCheck size={20} /></div>
                  <span className="text-[8px] font-black uppercase tracking-widest opacity-40">Pago Seguro & Encriptado</span>
               </div>
            </footer>
          </section>
        </div>
      </main>
    </div>
  );
}
