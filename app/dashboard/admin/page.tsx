"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie 
} from "recharts";
import { 
  Users, ShoppingBag, DollarSign, Activity, ArrowUpRight, Clock, Settings, MessageCircle, Loader2, Save
} from "lucide-react";

export default function AdminDashboard() {
  const { user, isLoading, token } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [whatsapp, setWhatsapp] = useState('521234567890');
  const [savingWa, setSavingWa] = useState(false);
  const [waSaved, setWaSaved] = useState(false);
  
  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!token) return;
    // Load stats
    fetch('/api/v1/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setStats(data); setLoadingStats(false); })
      .catch(() => setLoadingStats(false));

    // Load whatsapp setting
    fetch('/api/v1/settings?key=whatsapp_number')
      .then(r => r.json())
      .then(d => { if (d.value) setWhatsapp(d.value); });
  }, [token]);

  const saveWhatsapp = async () => {
    setSavingWa(true);
    await fetch('/api/v1/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ key: 'whatsapp_number', value: whatsapp }),
    });
    setSavingWa(false);
    setWaSaved(true);
    setTimeout(() => setWaSaved(false), 2000);
  };

  const COLORS = ['#0A192F', '#1E3A5F', '#C0C0C0', '#F8F9FA'];

  if (isLoading || (user && user.role !== 'admin')) return null;

  const revenueData = stats?.monthly?.length > 0
    ? stats.monthly
    : [{ name: 'Sin datos', value: 0 }];

  const categoryData = stats?.categories?.length > 0
    ? stats.categories.map((c: any) => ({ name: c.name, value: Number(c.sales) || 0 }))
    : [{ name: 'Sin ventas', value: 1 }];

  return (
    <div className="space-y-12 pb-24">
      <div className="flex items-end justify-between">
        <div>
           <h2 className="text-4xl font-serif italic lowercase text-primary mb-2">resumen ejecutivo</h2>
           <p className="text-[10px] uppercase font-black tracking-[0.4em] text-primary/40">Control total de la plataforma joyita linda</p>
        </div>
        <div className="px-6 py-4 border border-primary/5 bg-white flex items-center gap-4">
           <Clock size={16} className="text-primary/20" />
           <span className="text-[10px] uppercase font-bold tracking-widest text-primary/40">Datos en tiempo real</span>
        </div>
      </div>

      {/* KPI Cards */}
      {loadingStats ? (
        <div className="flex items-center justify-center py-20 gap-4 text-primary/30">
          <Loader2 size={24} className="animate-spin" />
          <span className="text-[10px] uppercase font-black tracking-widest">Cargando métricas...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: "Ventas Netas", value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, icon: <DollarSign size={20} />, sub: "MXN Total" },
            { label: "Pedidos Totales", value: (stats?.totalOrders || 0).toLocaleString(), icon: <ShoppingBag size={20} />, sub: "Órdenes registradas" },
            { label: "Usuarios Activos", value: (stats?.activeUsers || 0).toLocaleString(), icon: <Users size={20} />, sub: "Cuentas activas" },
            { label: "Categorías Activas", value: (stats?.categories?.length || 0).toString(), icon: <Activity size={20} />, sub: "En catálogo" },
          ].map((kpi, i) => (
            <div key={i} className="bg-white p-10 border border-primary/5 shadow-sm space-y-8 group hover:border-primary/20 transition-all">
               <div className="flex items-center justify-between">
                  <div className="p-3 bg-surface-container-low text-primary/40 group-hover:bg-primary group-hover:text-white transition-all">{kpi.icon}</div>
                  <ArrowUpRight size={14} className="text-green-600" />
               </div>
               <div>
                  <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/40 mb-2">{kpi.label}</p>
                  <p className="text-4xl font-black text-primary tracking-tighter">{kpi.value}</p>
                  <p className="text-[9px] text-primary/20 uppercase tracking-widest mt-2">{kpi.sub}</p>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Charts */}
      {!loadingStats && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 bg-white p-10 border border-primary/5 shadow-sm">
             <h4 className="text-xs uppercase font-black tracking-[0.2em] mb-12">Rendimiento de Ventas (MXN)</h4>
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
                     {categoryData.map((_: any, index: number) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                   </Pie>
                 </PieChart>
               </ResponsiveContainer>
             </div>
             <div className="space-y-4 pt-10">
               {categoryData.map((c: any, i: number) => (
                 <div key={i} className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="w-3 h-3" style={{backgroundColor: COLORS[i % COLORS.length]}} />
                     <span className="text-[10px] uppercase font-bold text-primary/40 tracking-widest">{c.name}</span>
                   </div>
                   <span className="text-[10px] font-black text-primary">{c.value} Ventas</span>
                 </div>
               ))}
             </div>
          </div>
        </div>
      )}

      {/* Recent Orders Overview */}
      <div className="bg-white border border-primary/5 shadow-sm">
        <div className="p-10 border-b border-primary/5 flex items-center justify-between bg-surface-container-lowest">
           <h4 className="text-xs uppercase font-black tracking-[0.2em]">Órdenes Recientes</h4>
           <button onClick={() => router.push('/dashboard/admin/orders')} className="text-[9px] uppercase font-black tracking-widest text-primary/40 hover:text-primary transition-colors flex items-center gap-2">
             Ver Todo <ArrowUpRight size={14} />
           </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white text-[9px] uppercase font-black tracking-[0.3em] text-primary/30 border-b border-primary/5">
                <th className="px-10 py-6">ID</th>
                <th className="px-10 py-6">Cliente</th>
                <th className="px-10 py-6">Total</th>
                <th className="px-10 py-6">Estado</th>
                <th className="px-10 py-6">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {loadingStats ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <Loader2 size={24} className="animate-spin mx-auto opacity-20" />
                  </td>
                </tr>
              ) : stats?.recentOrders?.length > 0 ? (
                stats.recentOrders.map((o: any) => (
                  <tr key={o.id} className="hover:bg-surface-container-low transition-all">
                    <td className="px-10 py-6 text-xs font-black text-primary">{o.order_code}</td>
                    <td className="px-10 py-6 text-xs font-bold text-primary/60 uppercase">{o.customer || 'Desconocido'}</td>
                    <td className="px-10 py-6 text-xs font-black text-primary">${Number(o.total).toLocaleString()}</td>
                    <td className="px-10 py-6">
                      <span className={`text-[9px] font-black uppercase tracking-widest ${
                        o.status === 'delivered' ? 'text-green-600' : 
                        o.status === 'preparing' || o.status === 'pending_payment' ? 'text-orange-600' : 
                        'text-blue-600'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-10 py-6 text-[9px] font-bold text-primary/30 uppercase">{o.date}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-20 text-center text-[10px] uppercase font-black tracking-widest text-primary/20">No hay órdenes recientes</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* WhatsApp Settings */}
      <div className="bg-white p-12 border border-primary/5 shadow-sm space-y-12">
         <div>
            <h3 className="text-xs uppercase font-black tracking-[0.4em] text-primary/30 mb-4 flex items-center gap-4">
               <Settings size={16} /> Configuración de Soporte
            </h3>
            <p className="text-sm font-medium text-primary/60 max-w-xl">Define el número de WhatsApp oficial donde los clientes recibirán asesoría. Se guarda en la base de datos y aplica de inmediato.</p>
         </div>
         <div className="flex items-end gap-8 max-w-md">
            <div className="flex-1 space-y-4">
               <label className="text-[10px] uppercase font-black tracking-widest text-primary/40 block">WhatsApp de Soporte (con código de país)</label>
               <div className="relative">
                  <MessageCircle size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/20" />
                  <input 
                    type="text" 
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Ej: 521234567890"
                    className="w-full h-14 bg-primary/5 border-none pl-12 pr-4 text-[10px] font-black uppercase tracking-widest placeholder:text-primary/20 focus:ring-1 focus:ring-primary/10 transition-all"
                  />
               </div>
            </div>
            <button
              onClick={saveWhatsapp}
              disabled={savingWa}
              className={`h-14 px-8 flex items-center gap-3 text-[10px] uppercase font-black tracking-widest transition-all ${waSaved ? 'bg-green-600 text-white' : 'btn-primary'}`}
            >
              {savingWa ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {waSaved ? 'Guardado' : 'Guardar'}
            </button>
         </div>
      </div>
    </div>
  );
}
