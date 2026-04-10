"use client";

import { ShoppingBag, Search, Filter, Eye, Truck, CheckCircle, Clock, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const STATUS_MAP: Record<string, string> = {
  pending_payment: 'Pendiente Pago',
  payment_validation: 'Validando',
  paid: 'Pagado',
  preparing: 'Preparando',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
  returned: 'Devuelto',
};

export default function AdminOrders() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!token) return;
    fetch('/api/v1/admin/orders', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : []);
        setFiltered(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [token]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(orders.filter(o =>
      o.order_code?.toLowerCase().includes(q) ||
      o.customer?.toLowerCase().includes(q)
    ));
  }, [search, orders]);

  const statusIcon = (status: string) => {
    if (['paid', 'preparing', 'payment_validation', 'pending_payment'].includes(status))
      return <Clock size={12} className="text-orange-600" />;
    if (status === 'shipped') return <Truck size={12} className="text-blue-600" />;
    return <CheckCircle size={12} className="text-green-600" />;
  };

  const statusColor = (status: string) => {
    if (['paid', 'preparing', 'payment_validation', 'pending_payment'].includes(status)) return 'text-orange-600';
    if (status === 'shipped') return 'text-blue-600';
    if (status === 'cancelled') return 'text-red-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-12 pb-24">
      <div className="flex items-end justify-between">
        <div>
           <h2 className="text-4xl font-serif italic lowercase text-primary mb-2">todas las órdenes</h2>
           <p className="text-[10px] uppercase font-black tracking-[0.4em] text-primary/40">Seguimiento global de transacciones en tiempo real desde la base de datos</p>
        </div>
        <div className="px-6 py-4 bg-primary/5 border border-primary/10 text-[10px] uppercase font-black tracking-widest text-primary">
          {filtered.length} Orden{filtered.length !== 1 ? 'es' : ''}
        </div>
      </div>

      <div className="bg-white border border-primary/5 shadow-sm">
        <div className="p-10 border-b border-primary/5 flex items-center justify-between bg-surface-container-lowest">
           <div className="relative group max-w-sm w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30" />
              <input 
                type="text" 
                placeholder="Filtrar por orden o cliente..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-12 w-full pl-14 pr-6 bg-white border border-primary/5 text-[10px] font-bold tracking-wide outline-none placeholder:text-primary/20 uppercase transition-all focus:border-primary" 
              />
           </div>
           <div className="flex items-center gap-3 text-[9px] uppercase font-black tracking-widest text-primary/40">
              <Filter size={14} /> Resultados: {filtered.length}
           </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-24 gap-4 text-primary/30">
            <Loader2 size={24} className="animate-spin" />
            <span className="text-[10px] uppercase font-black tracking-widest">Cargando órdenes...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-24 text-center text-primary/20">
            <p className="text-[10px] uppercase font-black tracking-widest">Sin órdenes registradas</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-white text-[9px] uppercase font-black tracking-[0.3em] text-primary/30 border-b border-primary/5">
                     <th className="px-10 py-8">ID Joyita</th>
                     <th className="px-10 py-8">Cliente</th>
                     <th className="px-10 py-8">Total</th>
                     <th className="px-10 py-8">Estatus</th>
                     <th className="px-10 py-8">Fecha</th>
                     <th className="px-10 py-8 text-right pr-16">Ver</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-primary/5">
                  {filtered.map((o) => (
                    <motion.tr 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      key={o.id} 
                      className="hover:bg-surface-container-low transition-all group"
                    >
                       <td className="px-10 py-8">
                          <span className="text-xs font-black text-primary tracking-tight">{o.order_code}</span>
                       </td>
                       <td className="px-10 py-8">
                          <span className="text-xs font-black text-primary uppercase tracking-tight">{o.customer}</span>
                       </td>
                       <td className="px-10 py-8 text-sm font-black text-primary">
                          ${Number(o.total).toLocaleString()}
                       </td>
                       <td className="px-10 py-8 uppercase tracking-widest text-[9px] font-black">
                          <div className="flex items-center gap-3">
                             {statusIcon(o.status)}
                             <span className={statusColor(o.status)}>{STATUS_MAP[o.status] || o.status}</span>
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
        )}
      </div>
    </div>
  );
}
