"use client";

import { ShoppingBag, MapPin, Package, ArrowRight, UserCircle, ReceiptText, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { X, Receipt } from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  pending_payment: 'Pendiente de Pago',
  payment_validation: 'Validando Pago',
  paid: 'Pagado',
  preparing: 'En Preparación',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

export default function CustomerDashboard() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [whatsapp, setWhatsapp] = useState('521234567890');
  const formatPrice = (p: number) => p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  useEffect(() => {
    if (!token) return;
    fetch('/api/v1/orders/my', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));

    fetch('/api/v1/settings?key=whatsapp_number')
      .then(r => r.json())
      .then(d => { if (d.value) setWhatsapp(d.value); });
  }, [token]);

  const totalSpent = orders.reduce((acc, o) => acc + Number(o.total), 0);

  return (
    <div className="space-y-12 pb-24">
      <div className="flex items-end justify-between">
        <div>
           <motion.h2 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-4xl font-serif italic lowercase text-primary mb-2">mis compras</motion.h2>
           <p className="text-[10px] uppercase font-black tracking-[0.4em] text-primary/40">Seguimiento de pedidos y facturación</p>
        </div>
        <Link href="/products" className="btn-primary text-xs flex items-center gap-3 h-14 px-8 uppercase font-black tracking-widest">
           Tienda Joyita <ArrowRight size={14} />
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white p-10 border border-primary/5 shadow-sm space-y-6">
           <div className="flex items-center gap-4 text-primary/30">
              <ShoppingBag size={20} />
              <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Pedidos Totales</span>
           </div>
           <p className="text-3xl font-black text-primary">
             {isLoading ? <Loader2 size={20} className="animate-spin" /> : <>{orders.length} <span className="text-xs uppercase tracking-widest text-primary/30 ml-2">Órdenes</span></>}
           </p>
        </div>
        
        <div className="bg-white p-10 border border-primary/5 shadow-sm space-y-6">
           <div className="flex items-center gap-4 text-primary/30">
              <Package size={20} />
              <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Total Invertido</span>
           </div>
           <p className="text-3xl font-black text-primary">
             {isLoading ? <Loader2 size={20} className="animate-spin" /> : <>${formatPrice(totalSpent)} <span className="text-xs uppercase tracking-widest text-primary/30 ml-2">MXN</span></>}
           </p>
        </div>

        <div className="bg-primary text-white p-10 shadow-lg space-y-6">
           <div className="flex items-center gap-4 text-white/40">
              <ReceiptText size={20} />
              <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Cuenta</span>
           </div>
           <p className="text-xl font-black">{user?.name} <span className="text-[10px] uppercase tracking-widest text-white/40 ml-2 block mt-1">{user?.email}</span></p>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white border border-primary/5 shadow-sm">
        <div className="px-10 py-8 border-b border-primary/5 flex items-center justify-between bg-surface-container-lowest">
            <h4 className="text-xs uppercase font-black tracking-[0.2em]">Pedidos Recientes</h4>
        </div>
        <div className="divide-y divide-primary/5">
          {isLoading ? (
            <div className="flex items-center justify-center py-24 gap-4 text-primary/30">
              <Loader2 size={24} className="animate-spin" />
              <span className="text-[10px] uppercase font-black tracking-widest">Cargando tus pedidos...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-24 text-center space-y-4">
              <ShoppingBag size={40} className="mx-auto text-primary/10" />
              <p className="text-[10px] uppercase font-black tracking-widest text-primary/30">Aún no tienes pedidos</p>
              <Link href="/products" className="inline-block text-[9px] uppercase font-black tracking-widest text-primary underline underline-offset-4 hover:no-underline">
                Explorar tienda →
              </Link>
            </div>
          ) : orders.map((o) => (
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

               <div className="grid grid-cols-2 md:grid-cols-3 gap-12 flex-1 max-w-2xl px-8">
                  <div>
                     <p className="text-[9px] uppercase font-bold text-primary/40 tracking-widest mb-2">Total</p>
                     <p className="text-sm font-black text-primary">${formatPrice(Number(o.total))}</p>
                  </div>
                  <div>
                     <p className="text-[9px] uppercase font-bold text-primary/40 tracking-widest mb-2">Estatus</p>
                     <p className={`text-xs font-black uppercase tracking-widest ${o.status === 'delivered' ? 'text-green-600' : o.status === 'shipped' ? 'text-blue-600' : 'text-orange-600'}`}>
                       {STATUS_LABELS[o.status] || o.status}
                     </p>
                  </div>
                  <div>
                     <p className="text-[9px] uppercase font-bold text-primary/40 tracking-widest mb-2">Artículos</p>
                     <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">{o.items?.length || 0} producto(s)</p>
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

       {/* Order Detail Modal */}
       <AnimatePresence>
         {selectedOrder && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
                   <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/10 transition-colors rounded-full"><X size={20} /></button>
                </div>
                
                <div className="p-10 space-y-8 max-h-[60vh] overflow-y-auto">
                   <div className="grid grid-cols-2 gap-8 text-[10px] font-bold uppercase tracking-widest">
                      <div className="space-y-1"><p className="text-primary/20">Fecha</p><p className="text-primary">{selectedOrder.date}</p></div>
                      <div className="space-y-1 text-right">
                        <p className="text-primary/20">Estatus</p>
                        <p className="text-blue-600">{STATUS_LABELS[selectedOrder.status] || selectedOrder.status}</p>
                      </div>
                   </div>

                   <div className="border-t border-primary/5 pt-8">
                      <h4 className="text-[10px] uppercase font-black tracking-widest text-primary/30 mb-6">Artículos</h4>
                      <div className="space-y-4">
                         {selectedOrder.items?.map((item: any, idx: number) => (
                           <div key={idx} className="flex justify-between items-center py-4 border-b border-primary/5 last:border-none">
                              <div className="space-y-1">
                                 <p className="text-xs font-black text-primary uppercase">{item.name}</p>
                                 <p className="text-[9px] font-bold text-primary/40 uppercase">{item.qty} Unidad(es) x ${formatPrice(Number(item.price))}</p>
                              </div>
                              <span className="text-sm font-black text-primary">${formatPrice(Number(item.price) * item.qty)}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>

                <div className="p-8 bg-surface-container-low border-t border-primary/5 flex justify-between items-center">
                   <span className="text-[10px] uppercase font-black tracking-[0.4em] text-primary/30">Total Pagado</span>
                   <p className="text-3xl font-black text-primary">${formatPrice(Number(selectedOrder.total))}</p>
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
           href={`https://wa.me/${whatsapp}?text=Hola,%20necesito%20soporte%20con%20mi%20pedido%20en%20Joyita%20Linda.`}
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
