"use client";

import Image from "next/image";
import { ShoppingBag, ArrowLeft, Trash2, ArrowRight, ShieldCheck, Globe, ShoppingCart, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "@/components/Logo";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartTotalRaw, cartCount, activeDiscount, discountRules, savings } = useCart();
  const router = useRouter();
  const formatPrice = (p: number) => p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  const nextRule = [...discountRules].sort((a,b) => a.minAmount - b.minAmount).find(r => cartTotalRaw < r.minAmount);
  const tax = cartTotal * 0.16;
  const shipping = (cartTotal > 5000 || cartTotal === 0) ? 0 : 250;
  const total = cartTotal + tax + shipping;

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-white pb-40">
      <nav className="h-40 bg-white border-b border-primary/5 flex items-center justify-between px-16 sticky top-0 z-50">
        <div className="flex items-center gap-12 flex-1">
          <Link href="/" className="flex items-center gap-4 group">
            <Logo className="w-10 h-10 group-hover:scale-110 transition-transform" />
            <h1 className="text-xl font-serif italic text-primary">Joyita Linda</h1>
          </Link>
          <div className="h-10 w-px bg-primary/5" />
          <div className="flex items-center gap-4 text-xs font-bold tracking-[0.2em] uppercase text-primary/40">
             <Link href="/products" className="hover:text-primary transition-colors hover:underline underline-offset-8">Volver al Catálogo</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-16 pt-24">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 border border-primary/5 bg-[#F8F9FA]/50 space-y-10">
             <ShoppingCart size={80} className="text-primary/10" />
             <div className="text-center">
                <h2 className="text-4xl font-serif italic lowercase text-primary mb-4">tu bolsa está vacía</h2>
                <p className="text-[10px] uppercase font-black tracking-[0.4em] text-primary/40">Joyita Linda te espera con piezas únicas de plata .925</p>
             </div>
             <Link href="/products" className="btn-primary-white py-4 px-12 h-16 text-[10px] uppercase font-black tracking-widest flex items-center gap-4">
                Explorar Colección <ArrowRight size={14} />
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
            <div className="lg:col-span-2 space-y-12">
               <div className="flex flex-col border-b border-primary/10 pb-8 gap-4">
                  <div className="flex items-end justify-between">
                     <h2 className="text-6xl font-serif italic text-primary lowercase leading-none">mi selección</h2>
                     <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-primary/30">Subtotal: ${cartTotal.toLocaleString()} MXN</span>
                  </div>
                  {activeDiscount > 0 && (
                     <div className="p-4 bg-green-50 border border-green-100 mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <ShieldCheck size={16} className="text-green-600" />
                           <p className="text-[10px] font-bold text-green-800 uppercase tracking-widest">
                             ¡Felicidades! Estás ahorrando ${formatPrice(savings)} MXN por tu volumen de compra.
                           </p>
                        </div>
                     </div>
                  )}
               </div>

               <div className="space-y-4">
                  <AnimatePresence>
                     {cart.map((item) => (
                        <motion.div 
                          key={item.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="bg-surface-container-low p-4 md:p-6 grid grid-cols-1 md:grid-cols-[60px_1fr_150px_110px_40px] items-center gap-4 md:gap-6 hover:bg-white border border-transparent transition-all group"
                        >
                           {/* Column 1: Image */}
                           <div className="relative w-24 h-24 md:w-full md:aspect-square bg-white flex items-center justify-center p-2 shadow-sm border border-primary/5">
                              <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                           </div>

                           {/* Column 2: Info */}
                           <div className="space-y-1">
                              <h3 className="text-lg md:text-xl font-serif italic text-primary leading-tight lowercase">{item.name}</h3>
                              <p className="text-[9px] uppercase font-bold text-primary/40 tracking-[0.2em]">Sku: JL-ITEM-0{item.id} • Plata .925</p>
                           </div>

                           {/* Column 3: Quantity */}
                           <div className="flex justify-center md:justify-start">
                              <div className="flex items-center gap-2 bg-white border border-primary/5 p-1 px-2 shadow-sm h-12">
                                <button 
                                  onClick={() => updateQuantity(item.id, item.qty - 1)} 
                                  className="text-primary/20 hover:text-primary transition-colors p-1"
                                >
                                  <Minus size={14} />
                                </button>
                                <input 
                                  type="number"
                                  min="1"
                                  value={item.qty}
                                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                  className="text-sm font-black text-primary w-12 text-center bg-transparent border-none focus:ring-0 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <button 
                                  onClick={() => updateQuantity(item.id, item.qty + 1)} 
                                  className="text-primary/20 hover:text-primary transition-colors p-1"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                           </div>

                           {/* Column 4: Price */}
                           <div className="text-center md:text-right">
                              <p className="text-lg font-black text-primary whitespace-nowrap">${formatPrice(item.price * item.qty)}</p>
                           </div>

                           {/* Column 5: Trash (Centered) */}
                           <div className="flex justify-center border-l border-primary/5 md:border-none py-4 md:py-0">
                              <button onClick={() => removeFromCart(item.id)} className="text-primary/10 hover:text-red-600 transition-colors p-4 md:p-2 shrink-0 bg-red-50 md:bg-transparent rounded-full md:rounded-none">
                                 <Trash2 size={18} />
                              </button>
                           </div>
                        </motion.div>
                     ))}
                  </AnimatePresence>
               </div>
            </div>

            <aside className="space-y-12 h-fit sticky top-12">
               <div className="bg-primary text-white p-8 md:p-12 space-y-12 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-white/20" />
                  <h4 className="text-xs uppercase font-black tracking-[0.4em] mb-12 text-white/40">Resumen Orden</h4>
                  <div className="space-y-6">
                     <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest opacity-60">
                        <span>Subtotal Bruto</span>
                        <span>${formatPrice(cartTotalRaw)}</span>
                     </div>
                     {activeDiscount > 0 && (
                        <>
                           <div className="flex justify-between text-[10px] uppercase font-black tracking-widest text-green-600">
                              <span>Descuento por volumen ({activeDiscount}%)</span>
                              <span>-${formatPrice(savings)}</span>
                           </div>
                           <div className="flex justify-between text-[10px] uppercase font-black tracking-widest text-white">
                              <span>Subtotal con descuento</span>
                              <span>${formatPrice(cartTotal)}</span>
                           </div>
                        </>
                     )}
                     <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest opacity-60">
                        <span>Envío Asegurado</span>
                        <div className="text-right">
                           <p className={shipping === 0 ? "text-green-600" : ""}>{shipping === 0 ? "Sin Cargo" : `$${formatPrice(shipping)}`}</p>
                           {shipping !== 0 && <p className="text-[7px] lowercase opacity-40">gratis en compras mayores a $5,000</p>}
                        </div>
                     </div>
                     <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest opacity-60">
                        <span>Impuesto Local (IVA 16%)</span>
                        <span>${formatPrice(tax)}</span>
                     </div>
                  </div>
                  <div className="pt-12 border-t border-white/10 space-y-6">
                     <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase font-black tracking-[0.4em] text-white/40">Total Estimado</span>
                        <span className="text-[8px] uppercase font-bold tracking-[0.3em] opacity-30 italic">incluye iva y envío</span>
                     </div>
                     <div className="text-right w-full">
                        <p className="text-[clamp(0.9rem,3.5vw,2.25rem)] font-black text-white leading-none whitespace-nowrap tracking-tighter">
                           ${formatPrice(total)}
                        </p>
                     </div>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="btn-primary-white w-full h-16 flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] group"
                  >
                     Proceder al Pago
                     <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                  </button>
               </div>
               
               {nextRule && (
                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-12 border border-primary/10 bg-white space-y-6">
                    <p className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.3em] text-center">Nivel de Socio Vendor</p>
                    <p className="text-[10px] text-primary italic font-serif leading-relaxed text-center opacity-60">
                       Añade ${(nextRule.minAmount - cartTotalRaw).toLocaleString()} MXN adicionales para elevar tu descuento al {nextRule.discount}%.
                    </p>
                 </motion.div>
               )}
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
