"use client";

import { ShoppingBag, TrendingUp, DollarSign, Package, ArrowRight, UserCircle, MapPin, ReceiptText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

import { useState } from "react";
import { X, Receipt } from "lucide-react";

export default function CustomerDashboard() {
  const { orders } = useCart();
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const formatPrice = (p: number) => p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  
  // orders are already filtered by user in CartContext
  const allOrders = orders.map(o => ({
    ...o,
    carrier: "Joyita Express",
    tracking: "Pendiente"
  }));

  return (
    <div className="space-y-12 pb-24">
      <div className="flex items-end justify-between">
        <div>
           <motion.h2 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-4xl font-serif italic lowercase text-primary mb-2">mis compras</motion.h2>
           <p className="text-[10px] uppercase font-black tracking-[0.4em] text-primary/40">Seguimiento de pedidos y facturación</p>
        </div>
        <Link href="/products" className="btn-primary text-xs flex items-center gap-3 h-14 px-8 uppercase font-black tracking-widest">
           Tienda Joyita
           <ArrowRight size={14} />
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-10 border border-primary/5 shadow-sm space-y-6">
           <div className="flex items-center gap-4 text-primary/30">
              <ShoppingBag size={20} />
              <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Pedidos Totales</span>
           </div>
           <p className="text-3xl font-black text-primary">{allOrders.length} <span className="text-xs uppercase tracking-widest text-primary/30 ml-2">Compras</span></p>
        </div>
        
        <div className="bg-white p-10 border border-primary/5 shadow-sm space-y-6">
           <div className="flex items-center gap-4 text-primary/30">
              <MapPin size={20} />
              <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Destinos</span>
           </div>
           <p className="text-3xl font-black text-primary">2 <span className="text-xs uppercase tracking-widest text-primary/30 ml-2">Direcciones</span></p>
        </div>

        <div className="bg-primary text-white p-10 shadow-lg space-y-6">
           <div className="flex items-center gap-4 text-white/40">
              <ReceiptText size={20} />
              <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Fidelidad</span>
           </div>
           <p className="text-3xl font-black">Nivel Dorado <span className="text-xs uppercase tracking-widest text-white/40 ml-2">Legacy</span></p>
        </div>
      </div>

      {/* Recent Orders List */}
      <div className="bg-white border border-primary/5 shadow-sm">
        <div className="px-10 py-8 border-b border-primary/5 flex items-center justify-between bg-surface-container-lowest">
            <h4 className="text-xs uppercase font-black tracking-[0.2em]">Pedidos Recientes</h4>
            <div className="flex gap-4">
               <button className="text-[9px] uppercase font-black text-primary/40 underline underline-offset-4">Historial Completo</button>
            </div>
        </div>
        <div className="divide-y divide-primary/5">
          {allOrders.map((o) => (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              key={o.id} 
              className="p-10 flex flex-col xl:flex-row items-center justify-between gap-10 hover:bg-surface-container-low transition-all"
            >
               <div className="flex items-center gap-8 group cursor-pointer">
                  <div className="w-16 h-16 bg-primary text-white flex items-center justify-center text-[10px] font-black opacity-90 group-hover:opacity-100 transition-all ring-4 ring-primary/5">JL</div>
                  <div>
                    <h5 className="text-sm font-black text-primary mb-1 uppercase tracking-tight">{o.id}</h5>
                    <p className="text-[10px] uppercase font-bold text-primary/40 tracking-widest">{o.date}</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-12 flex-1 max-w-2xl px-8">
                  <div>
                     <p className="text-[9px] uppercase font-bold text-primary/40 tracking-widest mb-2">Total</p>
                     <p className="text-sm font-black text-primary">${formatPrice(o.total)}</p>
                  </div>
                  <div>
                     <p className="text-[9px] uppercase font-bold text-primary/40 tracking-widest mb-2">Estatus</p>
                     <p className={`text-xs font-black uppercase tracking-widest ${o.status === 'Entregado' ? 'text-green-600' : 'text-blue-600'}`}>{o.status}</p>
                  </div>
                  <div>
                     <p className="text-[9px] uppercase font-bold text-primary/40 tracking-widest mb-2">Logística</p>
                     <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">{o.carrier}</p>
                  </div>
                  <div>
                     <p className="text-[9px] uppercase font-bold text-primary/40 tracking-widest mb-2">Seguimiento</p>
                     <p className="text-[10px] font-black text-primary/90 underline underline-offset-4 hover:text-primary cursor-pointer tracking-widest">{o.tracking}</p>
                  </div>
               </div>

                <button 
                  onClick={() => setSelectedOrder(o)}
                  className="h-14 px-8 border border-primary/10 text-[10px] uppercase font-black tracking-[0.2em] hover:bg-primary hover:text-white transition-all shrink-0"
                >
                   Detalles
                </button>
             </motion.div>
           ))}
         </div>
       </div>

       {/* Order Modal */}
       <AnimatePresence>
         {selectedOrder && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               onClick={() => setSelectedOrder(null)}
               className="absolute inset-0 bg-primary/20 backdrop-blur-md" 
             />
             <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="relative bg-white w-full max-w-2xl shadow-2xl border border-primary/5 overflow-hidden"
             >
                <div className="p-8 bg-primary text-white flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <Receipt size={24} className="text-white/40" />
                      <div>
                         <h3 className="text-xs uppercase font-black tracking-widest text-white/40 mb-1">Detalle de Compra</h3>
                         <p className="text-lg font-black uppercase tracking-tighter">{selectedOrder.id}</p>
                      </div>
                   </div>
                   <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/10 transition-colors rounded-full">
                      <X size={20} />
                   </button>
                </div>
                
                <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                   <div className="grid grid-cols-2 gap-8 text-[10px] font-bold uppercase tracking-widest">
                      <div className="space-y-1">
                         <p className="text-primary/20">Fecha</p>
                         <p className="text-primary">{selectedOrder.date}</p>
                      </div>
                      <div className="space-y-1 text-right">
                         <p className="text-primary/20">Estatus</p>
                         <p className="text-blue-600">{selectedOrder.status}</p>
                      </div>
                   </div>

                   <div className="border-t border-primary/5 pt-8">
                      <h4 className="text-[10px] uppercase font-black tracking-widest text-primary/30 mb-6">Artículos</h4>
                      <div className="space-y-4">
                         {selectedOrder.items?.map((item: any, idx: number) => (
                           <div key={idx} className="flex justify-between items-center py-4 border-b border-primary/5 last:border-none">
                              <div className="space-y-1">
                                 <p className="text-xs font-black text-primary uppercase">{item.name}</p>
                                 <p className="text-[9px] font-bold text-primary/40 uppercase">{item.qty} Unidad(es) x ${formatPrice(item.price)}</p>
                              </div>
                              <span className="text-sm font-black text-primary">${formatPrice(item.price * item.qty)}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="p-8 bg-surface-container-low border-t border-primary/5 flex justify-between items-center">
                   <span className="text-[10px] uppercase font-black tracking-[0.4em] text-primary/30">Total Pagado</span>
                   <p className="text-3xl font-black text-primary">${formatPrice(selectedOrder.total)}</p>
                </div>
             </motion.div>
           </div>
         )}
       </AnimatePresence>

      {/* Help Banner */}
      <section className="bg-primary text-white p-20 flex flex-col items-center text-center space-y-8 shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full" />
         <UserCircle size={48} className="text-white/20" />
         <h4 className="text-3xl font-serif italic lowercase leading-none">soporte joyita linda</h4>
         <p className="text-sm text-white/60 max-w-md font-semibold tracking-wide">¿Tienes dudas con tu pedido o necesitas asesoramiento sobre el cuidado de tu plata .925? Estamos aquí para ayudarte.</p>
         <a 
           href={`https://wa.me/${typeof window !== 'undefined' ? localStorage.getItem('joyita_whatsapp_number') || '521234567890' : '521234567890'}?text=Hola,%20necesito%20soporte%20con%20mi%20pedido%20en%20Joyita%20Linda.`}
           target="_blank"
           rel="noopener noreferrer"
           className="btn-primary-white text-[10px] px-12 py-4 h-16 uppercase font-black tracking-[0.3em] flex items-center justify-center translate-y-0 hover:-translate-y-1 transition-all"
         >
           Asesoría Joyita
         </a>
      </section>
    </div>
  );
}
