"use client";

import { Plus, Tag, Trash2, Edit, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const initialPromotions = [
  { id: 1, name: "Bienvenida Joyita", code: "JOYITA20", discount: "20%", type: "Porcentaje", status: "Activo", usage: 45, limit: 100 },
  { id: 2, name: "Buen Fin 2026", code: "BUENFIN15", discount: "15%", type: "Porcentaje", status: "Activo", usage: 12, limit: 50 },
  { id: 3, name: "Socio Fundador", code: "SOCIO1000", discount: "$1,000", type: "Fijo", status: "Pausado", usage: 154, limit: 200 }
];

export default function PromotionsAdmin() {
  const [promotions, setPromotions] = useState(initialPromotions);

  return (
    <div className="space-y-12 pb-24">
      <div className="flex items-end justify-between">
        <div>
           <h2 className="text-4xl font-serif italic lowercase text-primary mb-2">promociones y cupones</h2>
           <p className="text-[10px] uppercase font-black tracking-[0.4em] text-primary/40">Gestión de incentivos y campañas de marketing</p>
        </div>
        <button className="btn-primary text-xs flex items-center gap-3 h-14 px-8 uppercase font-black tracking-widest shadow-xl">
           Crear Promoción
           <Plus size={16} />
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white p-8 border border-primary/5 shadow-sm space-y-4">
           <div className="flex items-center justify-between text-primary/20">
              <span className="text-[9px] uppercase font-bold tracking-widest">Cupones Redimidos</span>
              <CheckCircle size={14} />
           </div>
           <p className="text-3xl font-black text-primary">211</p>
        </div>
        <div className="bg-white p-8 border border-primary/5 shadow-sm space-y-4">
           <div className="flex items-center justify-between text-primary/20">
              <span className="text-[9px] uppercase font-bold tracking-widest">Ahorro Generado</span>
              <Tag size={14} />
           </div>
           <p className="text-3xl font-black text-primary">$45K</p>
        </div>
        <div className="bg-white p-8 border border-primary/5 shadow-sm space-y-4">
           <div className="flex items-center justify-between text-primary/20">
              <span className="text-[9px] uppercase font-bold tracking-widest">Campañas Activas</span>
              <Clock size={14} />
           </div>
           <p className="text-3xl font-black text-primary">2</p>
        </div>
        <div className="bg-white p-8 border border-primary/5 shadow-sm space-y-4">
           <div className="flex items-center justify-between text-primary/20">
              <span className="text-[9px] uppercase font-bold tracking-widest">Agotados</span>
              <AlertCircle size={14} />
           </div>
           <p className="text-3xl font-black text-primary">0</p>
        </div>
      </div>

      {/* Promotions Table */}
      <div className="bg-white border border-primary/5 shadow-sm overflow-hidden">
        <div className="divide-y divide-primary/5">
          {promotions.map((p) => (
            <div key={p.id} className="p-8 flex flex-col lg:flex-row items-center justify-between gap-10 hover:bg-surface-container-low transition-all">
               <div className="flex items-center gap-8 min-w-[300px]">
                  <div className={`w-16 h-16 flex items-center justify-center text-[10px] font-black uppercase tracking-widest ${p.status === 'Activo' ? 'bg-primary text-white' : 'bg-surface-container-high text-primary/20'}`}>
                     {p.discount}
                  </div>
                  <div>
                    <h5 className="text-sm font-black text-primary mb-1 uppercase tracking-tight">{p.name}</h5>
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] bg-primary/5 text-primary px-3 py-1 font-black tracking-widest">{p.code}</span>
                       <span className="text-[9px] text-primary/30 uppercase font-black tracking-widest">• {p.type}</span>
                    </div>
                  </div>
               </div>

               <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-10">
                  <div>
                    <p className="text-[9px] uppercase font-bold text-primary/40 tracking-widest mb-1">Estatus</p>
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${p.status === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>{p.status}</span>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase font-bold text-primary/40 tracking-widest mb-1">Uso / Límite</p>
                    <p className="text-xs font-black text-primary tracking-widest">{p.usage} / {p.limit}</p>
                    <div className="w-full bg-primary/5 h-1 mt-2">
                       <div className="bg-primary h-full" style={{ width: `${(p.usage/p.limit)*100}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-4 mt-4 md:mt-0">
                     <button className="p-3 text-primary/30 hover:text-primary transition-all group">
                        <Edit size={16} />
                     </button>
                     <button className="p-3 text-primary/10 hover:text-red-600 transition-all group">
                        <Trash2 size={16} />
                     </button>
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Promotion Banner */}
      <section className="bg-surface-container-high p-16 flex flex-col items-center text-center space-y-6 relative overflow-hidden">
         <Tag size={40} className="text-primary/10" />
         <h4 className="text-2xl font-serif italic text-primary lowercase tracking-tight">regla de envío gratis global</h4>
         <p className="text-[10px] text-primary/40 max-w-md font-bold tracking-[0.3em] uppercase leading-relaxed text-center">Configurado para compras mayores a $2,000 MXN. Incrementa ticket promedio un +24%.</p>
         <button className="underline underline-offset-8 text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors text-primary/40">Modificar Regla</button>
      </section>
    </div>
  );
}
