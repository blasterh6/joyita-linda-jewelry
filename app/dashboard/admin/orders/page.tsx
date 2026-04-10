"use client";

import { ShoppingBag, Search, Filter, Eye, Truck, CheckCircle, Clock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";

export default function AdminOrders() {
  const { orders } = useCart();

  // Static fallback orders for demo depth
  const staticOrders = [
    { id: "ORD-JL-9901", customer: "Carlos Cliente", total: 1850.00, status: "Pagado", date: "07/04/2026", vendor: "Sofia Vendedora" },
    { id: "ORD-JL-9854", customer: "Maria Rodriguez", total: 450.00, status: "Enviado", date: "02/04/2026", vendor: "Venta Directa" },
    { id: "ORD-JL-9842", customer: "Juan Perez", total: 12400.00, status: "Validando", date: "01/04/2026", vendor: "Mayoreo S.A." }
  ];

  // Merge static with real context orders (newest first)
  const allOrders = [...orders.map(o => ({
    id: o.id,
    customer: "Cliente Web",
    total: o.total,
    status: o.status,
    date: o.date,
    vendor: "Tienda Online"
  })), ...staticOrders];

  return (
    <div className="space-y-12 pb-24">
      <div className="flex items-end justify-between">
        <div>
           <h2 className="text-4xl font-serif italic lowercase text-primary mb-2">todas las órdenes</h2>
           <p className="text-[10px] uppercase font-black tracking-[0.4em] text-primary/40">Seguimiento global de transacciones en tiempo real</p>
        </div>
      </div>

      <div className="bg-white border border-primary/5 shadow-sm">
        <div className="p-10 border-b border-primary/5 flex items-center justify-between bg-surface-container-lowest">
           <div className="relative group max-w-sm w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30" />
              <input type="text" placeholder="Filtrar por orden o cliente..." className="h-12 w-full pl-14 pr-6 bg-white border border-primary/5 text-[10px] font-bold tracking-wide outline-none placeholder:text-primary/20 uppercase transition-all focus:border-primary" />
           </div>
           <button className="text-[9px] uppercase font-black tracking-widest text-primary/40 hover:text-primary flex items-center gap-2">
              <Filter size={14} /> Refinar Búsqueda
           </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
             <thead>
                <tr className="bg-white text-[9px] uppercase font-black tracking-[0.3em] text-primary/30 border-b border-primary/5">
                   <th className="px-10 py-8">ID Joyita</th>
                   <th className="px-10 py-8">Cliente / Origen</th>
                   <th className="px-10 py-8">Venta Total</th>
                   <th className="px-10 py-8">Estatus Operativo</th>
                   <th className="px-10 py-8">Fecha</th>
                   <th className="px-10 py-8 text-right pr-16">Detalles</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-primary/5">
                {allOrders.map((o) => (
                  <motion.tr 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    key={o.id} 
                    className="hover:bg-surface-container-low transition-all group"
                  >
                     <td className="px-10 py-8">
                        <span className="text-xs font-black text-primary tracking-tight">{o.id}</span>
                     </td>
                     <td className="px-10 py-8">
                        <div className="flex flex-col">
                           <span className="text-xs font-black text-primary uppercase tracking-tight">{o.customer}</span>
                           <span className="text-[9px] font-bold text-primary/30 tracking-widest uppercase">{o.vendor}</span>
                        </div>
                     </td>
                     <td className="px-10 py-8 text-sm font-black text-primary">
                        ${o.total.toLocaleString()}
                     </td>
                     <td className="px-10 py-8 uppercase tracking-widest text-[9px] font-black">
                        <div className="flex items-center gap-3">
                           {o.status === 'Pagado' || o.status === 'Preparando' ? <Clock size={12} className="text-orange-600" /> : 
                            o.status === 'Enviado' ? <Truck size={12} className="text-blue-600" /> : <CheckCircle size={12} className="text-green-600" />}
                           <span className={o.status === 'Pagado' || o.status === 'Preparando' ? 'text-orange-600' : o.status === 'Enviado' ? 'text-blue-600' : 'text-green-600'}>
                             {o.status}
                           </span>
                        </div>
                     </td>
                     <td className="px-10 py-8 text-[10px] font-bold tracking-widest uppercase text-primary/40">
                        {o.date}
                     </td>
                     <td className="px-10 py-8 text-right pr-16">
                        <button className="p-3 bg-surface-container-low text-primary/30 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                           <Eye size={14} />
                        </button>
                     </td>
                  </motion.tr>
                ))}
             </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
