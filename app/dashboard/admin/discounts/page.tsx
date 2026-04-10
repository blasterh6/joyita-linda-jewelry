"use client";

import { 
  Plus, Trash2, Save, ShieldCheck, BadgePercent, Info, DollarSign, Check, Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function DiscountManager() {
  const { token } = useAuth();
  const [rules, setRules] = useState<{minAmount: number, discount: number}[]>([]);
  const [savedStates, setSavedStates] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load rules from DB
  useEffect(() => {
    fetch('/api/v1/settings?key=discount_rules')
      .then(r => r.json())
      .then(data => {
        if (data.value) {
          try { setRules(JSON.parse(data.value)); } catch { setRules([]); }
        } else {
          setRules([]);
        }
      })
      .catch(() => setRules([]))
      .finally(() => setIsLoading(false));
  }, []);

  const persistRules = async (newRules: typeof rules) => {
    await fetch('/api/v1/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ key: 'discount_rules', value: JSON.stringify(newRules) }),
    });
    // Broadcast update so checkout can read it
    window.dispatchEvent(new Event('storage'));
  };

  const saveSpecificRule = async (index: number) => {
    setSavedStates(prev => [...prev, index]);
    await persistRules(rules);
    setTimeout(() => setSavedStates(prev => prev.filter(i => i !== index)), 2000);
  };

  const addRule = () => setRules(prev => [...prev, { minAmount: 10000, discount: 25 }]);

  const removeRule = async (index: number) => {
    const newRules = rules.filter((_, i) => i !== index);
    setRules(newRules);
    await persistRules(newRules);
  };

  const updateRule = (index: number, field: 'minAmount' | 'discount', value: string) => {
    const newRules = [...rules];
    newRules[index][field] = parseInt(value) || 0;
    setRules(newRules);
  };

  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between">
        <div>
           <h2 className="text-4xl font-serif italic lowercase text-primary mb-2">tabulador de descuentos</h2>
           <p className="text-[10px] uppercase font-black tracking-[0.4em] text-primary/40">Gestión independiente de reglas por rango de compra — guardado en base de datos</p>
        </div>
        <button onClick={addRule} className="btn-primary flex items-center gap-4 text-xs h-14 px-10 transition-all">
           Añadir Nuevo Rango <Plus size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* Rules List */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-primary/5 shadow-sm overflow-hidden">
               <div className="p-8 bg-[#F8F9FA] border-b border-primary/5">
                  <span className="text-[10px] uppercase font-black tracking-widest text-primary/40">Listado de Beneficios Activos</span>
               </div>
               <div className="divide-y divide-primary/5">
                  <AnimatePresence>
                  {isLoading ? (
                    <div className="p-20 flex items-center justify-center gap-4 text-primary/30">
                      <Loader2 size={20} className="animate-spin" />
                      <span className="text-[10px] uppercase font-black tracking-widest">Cargando reglas...</span>
                    </div>
                  ) : rules.map((rule, i) => (
                    <motion.div 
                      key={`${i}-${rule.minAmount}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-8 flex flex-col md:flex-row items-center gap-8 group hover:bg-surface-container-low transition-all"
                    >
                       <div className="w-12 h-12 shrink-0 bg-primary/5 flex items-center justify-center text-primary/20 group-hover:text-primary transition-colors">
                          <DollarSign size={18} />
                       </div>
                       
                       <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                             <label className="text-[9px] uppercase font-black tracking-widest text-primary/30">Mínimo de Compra</label>
                             <div className="flex items-center gap-4 bg-[#F8F9FA] px-4 border border-transparent focus-within:border-primary/20 transition-all">
                                <span className="text-[10px] font-bold text-primary/40">$</span>
                                <input 
                                  type="number" 
                                  value={rule.minAmount || 0} 
                                  onChange={(e) => updateRule(i, 'minAmount', e.target.value)}
                                  className="w-full h-12 bg-transparent text-xs font-bold outline-none"
                                />
                                <span className="text-[10px] font-bold text-primary/20 uppercase">MXN</span>
                             </div>
                          </div>
                          
                          <div className="space-y-3">
                             <label className="text-[9px] uppercase font-black tracking-widest text-primary/30">Porcentaje Bonificación</label>
                             <div className="flex items-center gap-4 bg-[#F8F9FA] px-4 border border-transparent focus-within:border-primary/20 transition-all">
                                <input 
                                  type="number" 
                                  value={rule.discount || 0} 
                                  onChange={(e) => updateRule(i, 'discount', e.target.value)}
                                  className="w-full h-12 bg-transparent text-xs font-bold outline-none"
                                />
                                <span className="text-[10px] font-bold text-primary/20 uppercase">%</span>
                             </div>
                          </div>
                       </div>

                       <div className="flex items-center gap-4 md:border-l md:border-primary/5 md:pl-8">
                          <button 
                            onClick={() => saveSpecificRule(i)}
                            disabled={savedStates.includes(i)}
                            className={`w-12 h-12 flex items-center justify-center transition-all ${
                              savedStates.includes(i) ? 'bg-green-600 text-white' : 'bg-primary text-white hover:bg-primary-container'
                            }`}
                            title="Guardar esta regla"
                          >
                             {savedStates.includes(i) ? <Check size={16} /> : <Save size={16} />}
                          </button>
                          <button 
                            onClick={() => removeRule(i)}
                            className="w-12 h-12 flex items-center justify-center text-red-600/30 hover:text-red-600 transition-colors border border-primary/5"
                            title="Eliminar regla"
                          >
                             <Trash2 size={16} />
                          </button>
                       </div>
                    </motion.div>
                  ))}
                  </AnimatePresence>
                  {!isLoading && rules.length === 0 && (
                    <div className="p-20 text-center flex flex-col items-center gap-6 opacity-40">
                      <BadgePercent size={40} className="text-primary/30" />
                      <div>
                        <p className="text-[10px] uppercase font-black tracking-widest text-primary">Sin reglas configuradas</p>
                        <p className="text-[9px] uppercase font-bold tracking-wider text-primary/40 mt-2">Usa el botón "Añadir Nuevo Rango" para crear tu primera regla de descuento</p>
                      </div>
                    </div>
                  )}
               </div>
            </div>
         </div>

         {/* Helper Column */}
         <div className="space-y-8">
            <div className="bg-primary text-white p-12 shadow-lg space-y-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
               <div className="flex items-center gap-4 text-white/40 relative z-10">
                  <ShieldCheck size={20} />
                  <span className="text-[10px] uppercase font-bold tracking-widest leading-none">Guardado en Base de Datos</span>
               </div>
               <p className="text-xs font-medium leading-relaxed opacity-60 relative z-10">
                 Las reglas se guardan directamente en la base de datos y aplican de forma inmediata a todos los clientes en checkout.
               </p>
               <div className="p-5 bg-white/5 border border-white/10 text-[9px] font-bold uppercase tracking-[0.2em] flex items-center gap-4 relative z-10">
                  <Info size={16} className="text-amber-500 shrink-0" />
                  El ahorro se calcula sobre el subtotal bruto del carrito.
               </div>
            </div>

            <div className="p-12 border border-primary/5 bg-white space-y-8">
               <h5 className="text-[10px] uppercase font-black tracking-widest flex items-center gap-3">
                 <BadgePercent size={14} className="text-primary/30" /> Resumen de Márgenes
               </h5>
               <div className="space-y-6">
                  {rules.length > 0 ? (
                    rules.sort((a,b) => a.minAmount - b.minAmount).map((r, i) => (
                      <div key={i} className="flex justify-between items-end">
                         <div className="space-y-1">
                            <span className="text-[10px] font-black text-primary">${r.minAmount.toLocaleString()}</span>
                            <p className="text-[8px] uppercase font-bold text-primary/20 tracking-tighter">Mínimo sugerido</p>
                         </div>
                         <span className="text-xs font-serif italic text-green-600">{r.discount}% descuento</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-primary/20 italic">Configura tu primera regla...</p>
                  )}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
