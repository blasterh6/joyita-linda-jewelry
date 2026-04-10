"use client";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  BarChart, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  PieChart, 
  Pie 
} from "recharts";
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Activity, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  Settings,
  MessageCircle
} from "lucide-react";

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { orders } = useCart();
  
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  // Calculate dynamic metrics
  const stats = useMemo(() => {
    const historicalRevenue = 842500;
    const currentRevenue = orders.reduce((acc, o) => acc + o.total, 0);
    const totalRevenue = historicalRevenue + currentRevenue;
    
    const historicalOrders = 1240;
    const totalOrders = historicalOrders + orders.length;
    
    return {
      totalRevenue,
      totalOrders,
      activeUsers: 8942,
      conversion: 3.42
    };
  }, [orders]);

  const revenueData = [
    { name: 'Jan', value: 45000 }, { name: 'Feb', value: 52000 }, { name: 'Mar', value: 48000 },
    { name: 'Apr', value: 61000 }, { name: 'May', value: 59000 }, { name: 'Jun', value: stats.totalRevenue / 12 },
  ];

  const categoryData = [
    { name: 'Aretes', value: 400 + (orders.length * 0.4) }, 
    { name: 'Collares', value: 300 + (orders.length * 0.3) },
    { name: 'Anillos', value: 300 + (orders.length * 0.2) }, 
    { name: 'Otros', value: 200 + (orders.length * 0.1) },
  ];

  const COLORS = ['#0A192F', '#1E3A5F', '#C0C0C0', '#F8F9FA'];

  if (isLoading || (user && user.role !== 'admin')) return null;

  return (
    <div className="space-y-12 pb-24">
      <div className="flex items-end justify-between">
        <div>
           <h2 className="text-4xl font-serif italic lowercase text-primary mb-2">resumen ejecutivo</h2>
           <p className="text-[10px] uppercase font-black tracking-[0.4em] text-primary/40">Control total de la plataforma joyita linda</p>
        </div>
        <div className="flex gap-4">
           <div className="px-6 py-4 border border-primary/5 bg-white flex items-center gap-4">
              <Clock size={16} className="text-primary/20" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-primary/40">Última act: Ahora mismo</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { label: "Ventas Netas", value: `$${stats.totalRevenue.toLocaleString()}`, trend: "+12.4%", icon: <DollarSign size={20} />, up: true },
          { label: "Pedidos Totales", value: stats.totalOrders.toLocaleString(), trend: "+5.2%", icon: <ShoppingBag size={20} />, up: true },
          { label: "Usuarios Activos", value: stats.activeUsers.toLocaleString(), trend: "-1.8%", icon: <Users size={20} />, up: false },
          { label: "Conversión", value: `${stats.conversion}%`, trend: "+0.8%", icon: <Activity size={20} />, up: true },
        ].map((kpi, i) => (
          <div key={i} className="bg-white p-10 border border-primary/5 shadow-sm space-y-8 group hover:border-primary/20 transition-all">
             <div className="flex items-center justify-between">
                <div className="p-3 bg-surface-container-low text-primary/40 group-hover:bg-primary group-hover:text-white transition-all">{kpi.icon}</div>
                {kpi.up ? <span className="flex items-center gap-1 text-green-600 text-[10px] font-bold"><ArrowUpRight size={12} /> {kpi.trend}</span> : <span className="flex items-center gap-1 text-red-600 text-[10px] font-bold"><ArrowDownRight size={12} /> {kpi.trend}</span>}
             </div>
             <div>
                <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/40 mb-2">{kpi.label}</p>
                <p className="text-4xl font-black text-primary tracking-tighter">{kpi.value}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 bg-white p-10 border border-primary/5 shadow-sm">
           <div className="flex items-center justify-between mb-12"><h4 className="text-xs uppercase font-black tracking-[0.2em]">Rendimiento de Ventas (MXN)</h4></div>
           <div className="h-[400px] w-full">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={revenueData}>
                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#0A192F40', fontWeight: 700}} />
                 <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#0A192F40', fontWeight: 700}}/>
                 <Tooltip contentStyle={{backgroundColor: '#0A192F', border: 'none', color: 'white'}} itemStyle={{color: 'white', textTransform: 'uppercase', fontSize: '10px', fontWeight: 'bold'}}/>
                 <Line type="monotone" dataKey="value" stroke="#0A192F" strokeWidth={4} dot={false} activeDot={{ r: 8, stroke: '#fff', strokeWidth: 4 }} />
               </LineChart>
             </ResponsiveContainer>
           </div>
        </div>
        <div className="bg-white p-10 border border-primary/5 shadow-sm flex flex-col">
           <h4 className="text-xs uppercase font-black tracking-[0.2em] mb-12">Mejores Categorías</h4>
           <div className="flex-1 min-h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie data={categoryData} innerRadius={80} outerRadius={120} paddingAngle={10} dataKey="value">
                   {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                 </Pie>
               </PieChart>
             </ResponsiveContainer>
           </div>
           <div className="space-y-4 pt-10">
             {categoryData.map((c, i) => (
               <div key={i} className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-3 h-3" style={{backgroundColor: COLORS[i]}} />
                   <span className="text-[10px] uppercase font-bold text-primary/40 tracking-widest">{c.name}</span>
                 </div>
                 <span className="text-[10px] font-black text-primary">{Math.round(c.value)} Ventas</span>
               </div>
             ))}
           </div>
        </div>
      </div>

      <div className="bg-white p-12 border border-primary/5 shadow-sm space-y-12">
         <div>
            <h3 className="text-xs uppercase font-black tracking-[0.4em] text-primary/30 mb-4 flex items-center gap-4">
               <Settings size={16} /> Configuración de Soporte
            </h3>
            <p className="text-sm font-medium text-primary/60 max-w-xl">Define el número de WhatsApp oficial donde los clientes recibirán asesoría y soporte técnico de Joyita Linda.</p>
         </div>

         <div className="flex items-end gap-8 max-w-md">
            <div className="flex-1 space-y-4">
               <label className="text-[10px] uppercase font-black tracking-widest text-primary/40 block">WhatsApp de Soporte (con código de país)</label>
               <div className="relative">
                  <MessageCircle size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" />
                  <input 
                    type="text" 
                    placeholder="Ej: 521234567890"
                    defaultValue={typeof window !== 'undefined' ? localStorage.getItem('joyita_whatsapp_number') || '521234567890' : '521234567890'}
                    onChange={(e) => {
                      if (typeof window !== 'undefined') {
                        localStorage.setItem('joyita_whatsapp_number', e.target.value);
                      }
                    }}
                    className="w-full h-14 bg-primary/5 border-none pl-12 pr-4 text-[10px] font-black uppercase tracking-widest placeholder:text-primary/20 focus:ring-1 focus:ring-primary/10 transition-all"
                  />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
