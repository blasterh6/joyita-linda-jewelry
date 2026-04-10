"use client";

import { ShoppingBag, ArrowLeft, ShieldCheck, MapPin, CreditCard, ChevronRight, CheckCircle, Tag, AlertCircle } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Checkout() {
  const { cart, cartTotal, cartTotalRaw, activeDiscount, clearCart, addOrder, savings } = useCart();
  const { user, isLoading } = useAuth();
  const { addNotification } = useNotifications();
  const router = useRouter();
  const formatPrice = (p: number) => p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  const [step, setStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");

  const shipping = (cartTotal > 5000 || cartTotal === 0) ? 0 : 250;
  const subtotalAfterCoupon = cartTotal - couponDiscount;
  const tax = subtotalAfterCoupon * 0.16;
  const finalTotal = subtotalAfterCoupon + tax + shipping;

  // Step 0: Authentication Guard
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/checkout');
    }
  }, [user, isLoading, router]);

  const applyCoupon = () => {
    if (coupon.toUpperCase() === "JOYITA20") {
      setCouponDiscount(subtotalAfterWholesale * 0.2);
      setCouponError("");
      addNotification("Cupón Aplicado", "Has obtenido un 20% de descuento Joyita Linda.", "sale");
    } else {
      setCouponError("Cupón no válido.");
      setCouponDiscount(0);
    }
  };

  const handleFinish = () => {
    const newOrder = {
      id: `JL-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...cart],
      total: finalTotal,
      date: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' }),
      status: "Preparando"
    };
    
    addOrder(newOrder);
    addNotification("Pedido Realizado", `Tu orden ${newOrder.id} está siendo procesada.`, "order");
    addNotification("Nueva Venta Recibida", `El cliente ${user?.name} ha realizado la orden ${newOrder.id}.`, "sale");
    setIsSuccess(true);
    clearCart();
  };

  if (isLoading || (!user && !isSuccess)) {
    return <div className="h-screen flex items-center justify-center text-primary/20 uppercase font-black tracking-widest animate-pulse">Validando Sesión Joyita Linda...</div>;
  }

  if (cart.length === 0 && !isSuccess) {
     router.push('/cart');
     return null;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-40 selection:bg-primary-container selection:text-white">
      <nav className="h-40 bg-white border-b border-primary/5 flex items-center justify-between px-16 sticky top-0 z-50">
        <div className="flex items-center gap-12 flex-1">
          <Link href="/cart" className="flex items-center gap-4 group">
            <Logo className="w-10 h-10 group-hover:scale-110 transition-transform" />
            <h1 className="text-xl font-serif italic text-primary">Joyita Linda</h1>
          </Link>
          <div className="h-10 w-px bg-primary/5" />
          <div className="flex items-center gap-4 text-xs font-bold tracking-[0.2em] uppercase text-primary/40">
             <Link href="/cart" className="hover:text-primary transition-colors flex items-center gap-2"><ArrowLeft size={12} /> Volver a Bolsa</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-16 pt-24">
        <AnimatePresence mode="wait">
        {isSuccess ? (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-24 text-center space-y-10 border border-primary/5 shadow-2xl">
             <div className="w-32 h-32 bg-primary/5 mx-auto flex items-center justify-center rounded-full">
                <CheckCircle size={60} className="text-primary animate-bounce" />
             </div>
             <div>
                <h2 className="text-5xl font-serif italic lowercase text-primary mb-6">pedido confirmado</h2>
                <p className="text-[10px] uppercase font-black tracking-[0.4em] text-primary/40 leading-relaxed max-w-sm mx-auto">Tu selección de joyeria fina .925 esta siendo preparada para envío nacional.</p>
             </div>
             <Link href="/dashboard/customer" className="btn-primary inline-flex h-16 px-16 text-[10px] uppercase font-black tracking-widest items-center">Mi Historial de Compras</Link>
          </motion.div>
        ) : (
          <motion.div key="checkout" className="grid grid-cols-1 lg:grid-cols-2 gap-24">
             <div className="space-y-12">
                <h2 className="text-6xl font-serif italic text-primary lowercase leading-none">finalizar compra</h2>
                
                <div className="space-y-4">
                   {/* Step 1: Shipment */}
                   <div className={`p-10 border transition-all ${step === 1 ? 'bg-white border-primary border-2 shadow-xl' : 'bg-surface-container-low border-primary/5 opacity-60'}`}>
                      <div className="flex items-center justify-between mb-8">
                         <div className="flex items-center gap-4">
                            <MapPin size={20} className={step === 1 ? 'text-primary' : 'text-primary/20'} />
                            <h3 className="text-xs uppercase font-black tracking-[0.3em]">Dirección de Entrega</h3>
                         </div>
                         {step > 1 && <span className="text-[9px] font-black text-primary hover:underline cursor-pointer" onClick={() => setStep(1)}>Editar</span>}
                      </div>
                      {step === 1 && (
                        <div className="space-y-10">
                           <div className="p-8 border border-primary/10 bg-[#F8F9FA]">
                              <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Casa Principal / {user?.name}</p>
                              <p className="text-[9px] font-bold text-primary/40 leading-relaxed uppercase tracking-widest">Av. Revolución 1234, Centro, Tijuana, BC.</p>
                           </div>
                           <button onClick={() => setStep(2)} className="h-14 w-full bg-primary text-white text-[10px] uppercase font-black tracking-widest hover:bg-primary-container transition-all">Continuar a Pago</button>
                        </div>
                      )}
                   </div>

                   {/* Step 2: Payment */}
                   <div className={`p-10 border transition-all ${step === 2 ? 'bg-white border-primary border-2 shadow-xl' : 'bg-surface-container-low border-primary/5 opacity-60'}`}>
                      <div className="flex items-center justify-between mb-8">
                         <div className="flex items-center gap-4">
                            <CreditCard size={20} className={step === 2 ? 'text-primary' : 'text-primary/20'} />
                            <h3 className="text-xs uppercase font-black tracking-[0.3em]">Método de Pago</h3>
                         </div>
                      </div>
                      {step === 2 && (
                        <div className="space-y-10">
                           <div className="p-8 border border-primary/10 bg-[#F8F9FA] flex justify-between items-center">
                              <div className="space-y-1">
                                 <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Visa Joyita</p>
                                 <p className="text-[9px] font-bold text-primary/40 uppercase tracking-widest">**** 1242</p>
                              </div>
                              <ShieldCheck size={20} className="text-primary/20" />
                           </div>
                           <button onClick={handleFinish} className="h-16 w-full bg-primary text-white text-[11px] uppercase font-black tracking-widest hover:bg-primary-container transition-all shadow-xl">Confirmar Pedido</button>
                        </div>
                      )}
                   </div>
                </div>
             </div>

             <aside className="space-y-12">
                <div className="bg-white p-16 border border-primary/5 shadow-2xl space-y-12 h-fit">
                   <div>
                      <h4 className="text-[10px] uppercase font-black tracking-[0.4em] mb-4 text-primary/30">Mi Pedido</h4>
                      {activeDiscount > 0 && (
                        <div className="p-4 bg-green-50 border border-green-100 flex items-center gap-3">
                           <ShieldCheck size={14} className="text-green-600" />
                            <p className="text-[8px] font-bold text-green-800 uppercase tracking-widest">
                              Ahorro de ${formatPrice(savings)} por volumen de compra
                            </p>
                        </div>
                      )}
                   </div>
                   <div className="space-y-6 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                      {cart.map((item) => (
                         <div key={item.id} className="flex justify-between items-center border-b border-primary/5 pb-6">
                            <div className="space-y-1">
                               <p className="text-[10px] font-black uppercase tracking-widest text-primary">{item.name}</p>
                               <p className="text-[9px] font-bold text-primary/40 uppercase tracking-widest">{item.qty} Unidad(es)</p>
                            </div>
                            <span className="text-xs font-black text-primary">${formatPrice(item.price * item.qty)}</span>
                         </div>
                      ))}
                   </div>

                   {/* Coupon Field */}
                   <div className="pt-8 border-t border-primary/5 space-y-4">
                      <p className="text-[10px] uppercase font-black tracking-[0.2em] text-primary/30 flex items-center gap-2">
                        <Tag size={12} /> ¿Tienes un cupón?
                      </p>
                      <div className="flex gap-2">
                         <input 
                           type="text" 
                           value={coupon}
                           onChange={(e) => setCoupon(e.target.value)}
                           placeholder="Escribe aquí..." 
                           className="flex-1 h-12 px-4 border border-primary/5 focus:border-primary outline-none text-[10px] font-black uppercase tracking-widest transition-all"
                         />
                         <button 
                           onClick={applyCoupon}
                           className="px-6 h-12 bg-primary text-white text-[10px] uppercase font-black tracking-widest hover:bg-primary-container transition-all"
                         >
                           Aplicar
                         </button>
                      </div>
                      {couponError && <p className="text-[9px] text-red-600 font-bold uppercase tracking-widest flex items-center gap-2"><AlertCircle size={10} /> {couponError}</p>}
                   </div>

                   <div className="pt-8 space-y-4">
                      <div className="flex justify-between text-[10px] font-black tracking-widest text-primary/30 uppercase">
                         <span>Subtotal Bruto</span>
                         <span>${formatPrice(cartTotalRaw)}</span>
                      </div>
                      {activeDiscount > 0 && (
                        <>
                           <div className="flex justify-between text-[10px] font-black tracking-widest text-green-600 uppercase">
                              <span>Descuento por volumen ({activeDiscount}%)</span>
                              <span>-${formatPrice(savings)}</span>
                           </div>
                           <div className="flex justify-between text-[10px] font-black tracking-widest text-primary uppercase">
                              <span>Subtotal con descuento</span>
                              <span>${formatPrice(cartTotal)}</span>
                           </div>
                        </>
                      )}
                      {couponDiscount > 0 && (
                        <div className="flex justify-between text-[10px] font-black tracking-widest text-blue-600 uppercase">
                           <span>Cupón Aplicado</span>
                           <span>-${formatPrice(couponDiscount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-[10px] font-black tracking-widest text-primary/30 uppercase">
                         <span>Envío Asegurado</span>
                         <span>{shipping === 0 ? "Gratis" : `$${formatPrice(shipping)}`}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-black tracking-widest text-primary/30 uppercase">
                         <span>Impuestos (IVA 16%)</span>
                         <span>${formatPrice(tax)}</span>
                      </div>
                      <div className="flex justify-between text-3xl font-black text-primary pt-4 border-t border-primary/5 mt-4">
                         <span className="text-[10px] uppercase tracking-[0.4em]">Total Final</span>
                         <span>${formatPrice(finalTotal)}</span>
                      </div>
                   </div>
                </div>

                <div className="p-8 border border-primary/5 bg-white space-y-4">
                   <p className="text-[9px] font-bold text-primary/20 uppercase tracking-[0.4em] text-center">Protegido por Joyita Shield</p>
                </div>
             </aside>
          </motion.div>
        )}
        </AnimatePresence>
      </main>
    </div>
  );
}
