"use client";

import { ShoppingBag, TrendingUp, DollarSign, Package, ArrowRight, UserCircle, MapPin, ReceiptText, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { name: 'LUN', total: 4500 },
  { name: 'MAR', total: 5200 },
  { name: 'MIE', total: 4800 },
  { name: 'JUE', total: 6100 },
  { name: 'VIE', total: 5900 },
  { name: 'SAB', total: 7200 },
  { name: 'DOM', total: 3100 },
];

export default function VendorDashboard() {
  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between">
        <div>
           <h2 className="text-4xl font-serif italic lowercase text-primary mb-2">dashboard de ventas</h2>
           <p className="text-[10px] uppercase font-black tracking-[0.4em] text-primary/40">Portal oficial para socios emprendedores</p>
        </div>
        <div className="flex gap-4">
           <button className="bg-primary-container text-white px-8 h-14 text-[9px] uppercase font-black tracking-widest flex items-center gap-3">
              Solicitar Mentoría <Zap size={14} />
           </button>
           <button className="h-14 px-8 border border-primary/10 text-[9px] uppercase font-black tracking-widest hover:bg-surface-container-low transition-all">Reporte Excel</button>
        </div>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white p-10 border border-primary/5 shadow-sm">
           <div className="flex items-center gap-4 text-primary/30 mb-8">
              <DollarSign size={20} />
              <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Ventas del Mes</span>
           </div>
           <p className="text-4xl font-black text-primary">$42,850.00</p>
           <div className="mt-4 flex items-center gap-2 text-green-600 text-[10px] font-bold">
              <TrendingUp size={12} /> +12.5% vs Mes Anterior
           </div>
        </div>
        
        <div className="bg-white p-10 border border-primary/5 shadow-sm">
           <div className="flex items-center gap-4 text-primary/30 mb-8">
              <ShieldCheck size={20} />
              <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Comisiones Acumuladas</span>
           </div>
           <p className="text-4xl font-black text-primary">$8,570.00</p>
           <p className="mt-4 text-[10px] uppercase font-bold text-primary/40 tracking-widest pl-1">Por liquidar el 15/04</p>
        </div>

        <div className="bg-white p-10 border border-primary/5 shadow-sm">
           <div className="flex items-center gap-4 text-primary/30 mb-8">
              <Package size={20} />
              <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Inventario Disponible</span>
           </div>
           <p className="text-4xl font-black text-primary">156 <span className="text-xs text-primary/30 lowercase italic ml-2">unidades</span></p>
           <p className="mt-4 text-[10px] uppercase font-bold text-red-600 tracking-widest pl-1 opacity-60">3 Productos en stock bajo</p>
        </div>

        <div className="bg-primary text-white p-10 shadow-lg flex flex-col justify-between">
           <div className="flex items-center gap-4 text-white/40">
              <TrendingUp size={20} />
              <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Rendimiento Semanal</span>
           </div>
           <div className="h-20 w-full mt-4 opacity-50">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={data}>
                    <Bar dataKey="total" fill="white" radius={[2, 2, 0, 0]} />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Main Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
           <div className="bg-white border border-primary/5 shadow-sm">
             <div className="px-10 py-10 border-b border-primary/5">
                <h4 className="text-xs uppercase font-black tracking-[0.2em]">Órdenes de Mis Clientes</h4>
             </div>
             <div className="p-10 text-center py-40 bg-surface-container-lowest border-b border-primary/5">
                <ShoppingBag size={48} className="mx-auto text-primary/10 mb-8" />
                <p className="text-xs font-black uppercase tracking-[0.3em] text-primary/40">Sin órdenes pendientes de entrega</p>
                <Link href="/products" className="text-[10px] font-bold text-primary mt-6 block uppercase underline underline-offset-8">Generar Nueva Venta</Link>
             </div>
           </div>
        </div>

        <div className="space-y-8">
           <div className="bg-white p-10 border border-primary/5 shadow-sm">
              <h4 className="text-xs uppercase font-black tracking-[0.2em] mb-12">Mentoría & Crecimiento</h4>
              <div className="space-y-8">
                 {[
                   { title: "Dominando la Plata .925", type: "Video Masterclass", time: "12m" },
                   { title: "Estrategias de Venta Directa", type: "Webinar Grabado", time: "45m" },
                   { title: "Cuidado de Joyería Fina", type: "PDF Guía", time: "5 Pág" }
                 ].map((item, i) => (
                   <div key={i} className="flex flex-col gap-2 p-6 border border-primary/5 hover:bg-surface-container-low transition-all cursor-pointer group">
                      <span className="text-[9px] uppercase font-bold text-primary/30 tracking-widest">{item.type}</span>
                      <h5 className="text-sm font-black text-primary group-hover:text-primary transition-colors uppercase leading-tight">{item.title}</h5>
                      <span className="text-[9px] uppercase font-bold text-primary/20 tracking-widest">{item.time} duración</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-surface-container-high p-10 flex flex-col items-center text-center space-y-6">
              <DollarSign size={32} className="text-primary/20" />
              <h5 className="text-sm font-black uppercase tracking-widest text-primary">Solicitar Retiro</h5>
              <p className="text-[10px] text-primary/40 font-bold max-w-[180px] leading-relaxed">Monto disponible para retiro inmediato: $3,450.00 MXN</p>
              <button className="h-12 w-full border border-primary/20 text-[9px] uppercase font-black tracking-[0.3em] hover:bg-primary-container hover:text-white transition-all">Retirar Fondos</button>
           </div>
        </div>
      </div>
    </div>
  );
}
