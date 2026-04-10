"use client";

import { Package, Boxes, TrendingUp, Search, Filter } from "lucide-react";

export default function VendorInventory() {
  const inventory = [
    { id: 1, name: "Aretes Gota Plata .925", qty: 24, status: "Disponible" },
    { id: 2, name: "Collar Lujo Signature", qty: 2, status: "Próx. Agotado" }
  ];

  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between">
        <div>
           <h2 className="text-4xl font-serif italic lowercase text-primary mb-2">mi inventario asignado</h2>
           <p className="text-[10px] uppercase font-black tracking-[0.4em] text-primary/40">Existencias locales para socios vendedores</p>
        </div>
        <button className="btn-primary h-14 px-12 text-[10px] flex items-center gap-3">
           Solicitar Resurtido <Boxes size={14} />
        </button>
      </div>

      <div className="bg-white border border-primary/5 shadow-sm">
        <div className="p-10 border-b border-primary/5 flex items-center justify-between">
          <h4 className="text-xs uppercase font-black tracking-[0.3em] flex items-center gap-4 text-primary/40">
             <Package size={16} /> Stock de Punto de Venta
          </h4>
        </div>
        <div className="divide-y divide-primary/5">
          {inventory.map((item) => (
            <div key={item.id} className="p-12 flex flex-col md:flex-row items-center justify-between gap-10 hover:bg-surface-container-low transition-all">
               <div className="flex items-center gap-10">
                  <div className="w-16 h-16 bg-surface-container-low p-2 ring-1 ring-primary/5" />
                  <div>
                    <h5 className="text-sm font-black text-primary uppercase tracking-tight">{item.name}</h5>
                    <p className="text-[10px] font-bold text-primary/30 tracking-widest uppercase">ID: JL-ITEM-{item.id}</p>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-20">
                  <div>
                     <p className="text-[9px] uppercase font-bold text-primary/40 tracking-widest mb-3">Existencia</p>
                     <p className="text-2xl font-black text-primary">{item.qty} <span className="text-xs uppercase tracking-widest opacity-20 ml-2">Unidades</span></p>
                  </div>
                  <div>
                     <p className="text-[9px] uppercase font-bold text-primary/40 tracking-widest mb-3">Estatus</p>
                     <p className={`text-[10px] uppercase font-black tracking-[0.2em] ${item.status === 'Disponible' ? 'text-green-600' : 'text-red-700'}`}>{item.status}</p>
                  </div>
               </div>

               <button className="h-14 px-10 border border-primary/10 text-[9px] uppercase font-black tracking-[0.3em] hover:bg-primary-container hover:text-white transition-all">
                  Cargar Venta
               </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
