"use client";

import { DollarSign, TrendingUp, Calendar, ChevronDown, CheckCircle, Package } from "lucide-react";

export default function VendorSales() {
  const sales = [
    { id: "S-1001", client: "Elena R.", amount: "$1,850.00", commission: "$277.50", date: "07/04/2026", status: "Confirmado" },
    { id: "S-1002", client: "Miguel A.", amount: "$450.00", commission: "$67.50", date: "06/04/2026", status: "Confirmado" }
  ];

  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between">
        <div>
           <h2 className="text-4xl font-serif italic lowercase text-primary mb-2">mis ventas personales</h2>
           <p className="text-[10px] uppercase font-black tracking-[0.4em] text-primary/40">Registro de comisiones y cierres</p>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white border border-primary/5 shadow-sm">
        <div className="px-10 py-10 border-b border-primary/5 flex items-center justify-between">
            <h4 className="text-xs uppercase font-black tracking-[0.2em] flex items-center gap-4">
              <Calendar size={14} className="text-primary/40" /> Abril 2026
            </h4>
        </div>
        <table className="w-full">
           <thead>
              <tr className="bg-white text-left text-[9px] uppercase font-black tracking-[0.3em] text-primary/30 border-b border-primary/5">
                 <th className="px-10 py-8">ID Venta</th>
                 <th className="px-10 py-8">Cliente</th>
                 <th className="px-10 py-8">Monto Total</th>
                 <th className="px-10 py-8">Mi Comisión (15%)</th>
                 <th className="px-10 py-8">Estatus</th>
                 <th className="px-10 py-8 text-right pr-16">Fecha</th>
              </tr>
           </thead>
           <tbody>
              {sales.map((s) => (
                <tr key={s.id} className="hover:bg-surface-container-low transition-all group">
                   <td className="px-10 py-8 border-b border-primary/5 text-xs font-black text-primary">{s.id}</td>
                   <td className="px-10 py-8 border-b border-primary/5 text-xs font-black text-primary uppercase tracking-tight">{s.client}</td>
                   <td className="px-10 py-8 border-b border-primary/5 text-xs font-black text-primary/60">{s.amount}</td>
                   <td className="px-10 py-8 border-b border-primary/5 text-sm font-black text-primary">{s.commission}</td>
                   <td className="px-10 py-8 border-b border-primary/5">
                      <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-green-600">
                         <CheckCircle size={10} /> {s.status}
                      </div>
                   </td>
                   <td className="px-10 py-8 border-b border-primary/5 text-[9px] font-bold text-primary/20 tracking-widest text-right pr-16 uppercase">{s.date}</td>
                </tr>
              ))}
           </tbody>
        </table>
      </div>
    </div>
  );
}
