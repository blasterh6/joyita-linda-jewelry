"use client";

import { Package, Plus, Search, Filter, Pencil, Trash2, Eye, Boxes, TrendingDown, ClipboardList } from "lucide-react";
import Image from "next/image";

const stock = [
  { id: 1, name: "Aretes Gota Plata .925", sku: "ARE-001", stock: 85, price: "$450", retail: "$315", status: "Stock Alto" },
  { id: 2, name: "Collar Lujo Signature", sku: "COL-001", stock: 12, price: "$1,200", retail: "$840", status: "Alerta Stock" },
  { id: 3, name: "Anillo Compromiso Plata", sku: "ANI-001", stock: 5, price: "$950", retail: "$665", status: "Crítico" },
  { id: 4, name: "Cadena Fígaro Fina", sku: "CAD-001", stock: 45, price: "$850", retail: "$595", status: "Normal" }
];

export default function CatalogManager() {
  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between">
        <div>
           <h2 className="text-4xl font-serif italic lowercase text-primary mb-2">catálogo e inventario</h2>
           <p className="text-[10px] uppercase font-black tracking-[0.4em] text-primary/40">Control de SKUs, precios y existencias reales</p>
        </div>
        <button className="btn-primary flex items-center gap-4 text-xs h-14 px-10">
           Nuevo Producto <Plus size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: "Total SKUs", value: "84", icon: <Boxes size={20} /> },
          { label: "Valor Inventario", value: "$1.2M", icon: <ClipboardList size={20} /> },
          { label: "Stock Crítico", value: "03", icon: <TrendingDown size={20} />, color: "text-red-600" },
          { label: "Ventas Semanales", value: "156", icon: <Package size={20} /> },
        ].map((item, i) => (
          <div key={i} className="bg-white p-10 border border-primary/5 shadow-sm space-y-4">
             <div className="flex items-center gap-3 text-primary/40">
                {item.icon}
                <span className="text-[10px] uppercase font-bold tracking-widest">{item.label}</span>
             </div>
             <p className={`text-4xl font-black ${item.color || 'text-primary'}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-primary/5 shadow-sm">
        <div className="p-10 border-b border-primary/5 flex items-center justify-between bg-[#F8F9FA]/50">
           <div className="relative group max-w-sm w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30" />
              <input type="text" placeholder="Buscar por SKU o Nombre..." className="h-12 w-full pl-14 pr-6 bg-white border border-primary/5 text-[10px] font-bold tracking-wide outline-none placeholder:text-primary/20 uppercase" />
           </div>
           <button className="text-[9px] uppercase font-black tracking-widest text-primary/40 hover:text-primary flex items-center gap-2">
              <Filter size={14} /> Filtro de Categoría
           </button>
        </div>

        <table className="w-full">
           <thead>
              <tr className="bg-white text-left text-[9px] uppercase font-black tracking-[0.3em] text-primary/30 border-b border-primary/5">
                 <th className="px-10 py-8">Imagen</th>
                 <th className="px-10 py-8">Producto</th>
                 <th className="px-10 py-8">Precios (Ret/May)</th>
                 <th className="px-10 py-8">Existencia</th>
                 <th className="px-10 py-8">Estatus</th>
                 <th className="px-10 py-8 text-right pr-16">Gestión</th>
              </tr>
           </thead>
           <tbody>
              {stock.map((s) => (
                <tr key={s.id} className="hover:bg-surface-container-low transition-all">
                   <td className="px-10 py-8 border-b border-primary/5">
                      <div className="relative w-16 h-16 bg-surface-container-low p-2 ring-1 ring-primary/5">
                         <div className="w-full h-full bg-primary/5 animate-pulse" />
                      </div>
                   </td>
                   <td className="px-10 py-8 border-b border-primary/5">
                      <div className="flex flex-col">
                         <span className="text-xs font-black text-primary uppercase tracking-tight">{s.name}</span>
                         <span className="text-[9px] font-bold text-primary/30 tracking-widest uppercase">{s.sku}</span>
                      </div>
                   </td>
                   <td className="px-10 py-8 border-b border-primary/5">
                      <div className="flex flex-col">
                         <span className="text-xs font-black text-primary tracking-tight">{s.price}</span>
                         <span className="text-[9px] font-bold text-primary/40 tracking-widest uppercase mb-1">Mayoreo: {s.retail}</span>
                      </div>
                   </td>
                   <td className="px-10 py-8 border-b border-primary/5">
                      <div className="flex flex-col gap-2">
                         <span className="text-lg font-black text-primary">{s.stock}</span>
                         <div className="w-24 h-1 bg-primary/5 rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{width: `${Math.min(s.stock, 100)}%`}} />
                         </div>
                      </div>
                   </td>
                   <td className="px-10 py-8 border-b border-primary/5 text-[10px] font-bold tracking-widest uppercase">
                      <span className={`${
                        s.status === 'Stock Alto' ? 'text-green-600' :
                        s.status === 'Alerta Stock' ? 'text-orange-600' : 'text-red-700'
                      }`}>
                         {s.status}
                      </span>
                   </td>
                   <td className="px-10 py-8 border-b border-primary/5 text-right pr-16">
                      <div className="flex justify-end gap-6 text-primary/20">
                         <button className="hover:text-primary transition-colors"><Pencil size={14} /></button>
                         <button className="hover:text-primary transition-colors"><Eye size={14} /></button>
                         <button className="hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                      </div>
                   </td>
                </tr>
              ))}
           </tbody>
        </table>
      </div>
    </div>
  );
}
