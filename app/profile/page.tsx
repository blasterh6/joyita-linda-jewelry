"use client";

import { 
  UserCircle, 
  MapPin, 
  ShieldCheck, 
  Bell, 
  CreditCard, 
  Save, 
  Image as ImageIcon,
  BadgeCheck,
  Plus,
  Trash2,
  ShieldAlert,
  BellRing,
  LogOut,
  ChevronDown,
  X,
  Eye,
  EyeOff
} from "lucide-react";
import Link from "next/link";
import Logo from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Profile() {
  const { user, isLoading, logout, updateUser, token } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  });
  const [addresses, setAddresses] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [isAddrModalOpen, setIsAddrModalOpen] = useState(false);
  const [editingAddr, setEditingAddr] = useState<any>(null);
  const [addrForm, setAddrForm] = useState({ name: "", addr: "" });
  const [passForm, setPassForm] = useState({ current: "", new: "", confirm: "" });
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false });
  const [passStatus, setPassStatus] = useState<{ type: 'success' | 'error' | null, msg: string }>({ type: null, msg: "" });

  useEffect(() => {
    if (user) {
      const names = user.name.split(' ');
      setFormData({
        firstName: names[0] || "",
        lastName: names.slice(1).join(' ') || "",
        email: user.email,
        phone: ""
      });

      const savedAddr = localStorage.getItem(`jl_profile_addr_${user.email}`);
      const savedPay = localStorage.getItem(`jl_profile_pay_${user.email}`);
      if (savedAddr) setAddresses(JSON.parse(savedAddr));
      else setAddresses([
        { name: "Principal", addr: "Sin dirección guardada", main: true }
      ]);
      
      if (savedPay) setPayments(JSON.parse(savedPay));
      else setPayments([]);
    }
  }, [user]);

  const saveAddresses = (newAddr: any[]) => {
    setAddresses(newAddr);
    if (user) localStorage.setItem(`jl_profile_addr_${user.email}`, JSON.stringify(newAddr));
  };

  const handleOpenAddrModal = (addr: any = null) => {
    if (addr) {
      setEditingAddr(addr);
      setAddrForm({ name: addr.name, addr: addr.addr });
    } else {
      setEditingAddr(null);
      setAddrForm({ name: "", addr: "" });
    }
    setIsAddrModalOpen(true);
  };

  const handleSaveAddr = () => {
    if (!addrForm.name || !addrForm.addr) return;
    
    let newAddresses;
    if (editingAddr) {
      newAddresses = addresses.map(a => a === editingAddr ? { ...a, ...addrForm } : a);
    } else {
      newAddresses = [...addresses, { ...addrForm, main: addresses.length === 0 }];
    }
    
    saveAddresses(newAddresses);
    setIsAddrModalOpen(false);
  };

  const savePayments = (newPay: any[]) => {
    setPayments(newPay);
    if (user) localStorage.setItem(`jl_profile_pay_${user.email}`, JSON.stringify(newPay));
  };

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await updateUser({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
      });
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setIsSaving(false);
      alert(err.message || "Error al actualizar información");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassStatus({ type: null, msg: "" });
    
    if (passForm.new.length < 6) {
      setPassStatus({ type: 'error', msg: "La nueva contraseña debe tener al menos 6 caracteres." });
      return;
    }

    if (passForm.new !== passForm.confirm) {
      setPassStatus({ type: 'error', msg: "Las nuevas contraseñas no coinciden." });
      return;
    }

    setIsSaving(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
      const response = await fetch(`${API_URL}/auth/password`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          currentPassword: passForm.current, 
          newPassword: passForm.new 
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al actualizar contraseña');

      setPassStatus({ type: 'success', msg: "Contraseña actualizada exitosamente." });
      setPassForm({ current: "", new: "", confirm: "" });
      setIsSaving(false);
    } catch (err: any) {
      setPassStatus({ type: 'error', msg: err.message || "Error al actualizar contraseña" });
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="h-screen flex items-center justify-center text-primary/20 uppercase font-black tracking-[0.5em]">Abriendo Perfil Joyita Linda...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-40">
      <nav className="h-40 bg-white border-b border-primary/5 flex items-center justify-between px-16 sticky top-0 z-50">
        <div className="flex items-center gap-12 flex-1">
          <Link href="/" className="flex items-center gap-4 group">
            <Logo className="w-10 h-10 group-hover:scale-110 transition-transform" />
            <h1 className="text-xl font-serif italic text-primary">Joyita Linda</h1>
          </Link>
          <div className="h-10 w-px bg-primary/5" />
          <div className="flex items-center gap-4 text-xs font-bold tracking-[0.2em] uppercase text-primary/40">
             <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
             <span>/</span>
             <Link href="/products" className="hover:text-primary transition-colors">Tienda</Link>
             <span>/</span>
             <span className="text-primary tracking-[0.3em]">Mi Cuenta</span>
          </div>
        </div>
        <button onClick={logout} className="p-4 hover:bg-surface-container-low text-primary/40 hover:text-primary transition-all flex items-center gap-4">
           <span className="text-[10px] uppercase font-black tracking-widest">Cerrar Sesión</span>
           <LogOut size={16} />
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-16 pt-24 grid grid-cols-1 lg:grid-cols-4 gap-16">
         {/* Side Nav */}
         <aside className="lg:col-span-1 space-y-4">
            {[
              { id: "info", label: "Información Básica", icon: <UserCircle size={16} /> },
              { id: "addr", label: "Direcciones", icon: <MapPin size={16} /> },
              { id: "sec", label: "Seguridad", icon: <ShieldCheck size={16} /> },
              { id: "notif", label: "Notificaciones", icon: <Bell size={16} /> },
              { id: "pay", label: "Métodos de Pago", icon: <CreditCard size={16} /> }
            ].map((item) => (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-6 py-5 transition-all border ${
                  activeTab === item.id ? "bg-primary text-white border-primary" : "bg-white text-primary/40 border-primary/5 hover:bg-surface-container-low"
                }`}
              >
                <div className="flex items-center gap-4">
                   {item.icon}
                   <span className="text-[10px] uppercase font-black tracking-widest">{item.label}</span>
                </div>
                {activeTab === item.id && <motion.div layoutId="dot" className="w-1 h-1 bg-white" />}
              </button>
            ))}
            <Link href="/dashboard" className="w-full flex items-center gap-4 px-6 py-5 bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all border border-transparent">
               <BadgeCheck size={16} />
               <span className="text-[10px] uppercase font-black tracking-widest">Ir al Dashboard</span>
            </Link>
         </aside>

         {/* Content Area */}
         <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
               {activeTab === "info" && (
                 <motion.section key="info" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="bg-white p-12 border border-primary/5 shadow-sm space-y-12">
                    <div className="flex items-center justify-between border-b border-primary/5 pb-8">
                       <h4 className="text-xs uppercase font-black tracking-[0.3em]">Gestión de Perfil Personal</h4>
                       <button className="text-[10px] font-bold text-primary flex items-center gap-2 underline underline-offset-8 uppercase tracking-widest">Cambiar Foto <ImageIcon size={12} /></button>
                    </div>
                    <form className="space-y-10" onSubmit={handleSaveInfo}>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="flex flex-col gap-4">
                             <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Nombre(s)</label>
                             <input type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="h-16 px-6 bg-surface-container-low border border-transparent focus:border-primary/20 focus:bg-white transition-all text-sm font-bold tracking-wide outline-none" required />
                          </div>
                          <div className="flex flex-col gap-4">
                             <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Apellidos</label>
                             <input type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="h-16 px-6 bg-surface-container-low border border-transparent focus:border-primary/20 focus:bg-white transition-all text-sm font-bold tracking-wide outline-none" required />
                          </div>
                       </div>
                       <div className="flex flex-col gap-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Email Principal (Privado)</label>
                          <input type="email" value={formData.email} disabled className="h-16 px-6 bg-surface-container-low border border-transparent opacity-40 text-sm font-bold tracking-wide outline-none cursor-not-allowed" />
                       </div>
                       <div className="pt-12 border-t border-primary/5 flex items-center justify-between">
                          <AnimatePresence>
                             {saveSuccess && (
                               <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-[9px] font-black uppercase text-green-600 tracking-widest flex items-center gap-2">
                                  <BadgeCheck size={14} /> Información Actualizada
                               </motion.span>
                             )}
                          </AnimatePresence>
                          <button 
                            type="submit"
                            disabled={isSaving}
                            className="btn-primary h-16 px-16 text-[10px] uppercase tracking-widest font-black flex items-center gap-4 disabled:opacity-50 transition-all"
                          >
                            {isSaving ? 'Guardando...' : 'Guardar Cambios'} <Save size={16} />
                          </button>
                       </div>
                    </form>
                 </motion.section>
               )}

                {activeTab === "addr" && (
                  <motion.section key="addr" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                     <div className="bg-white p-12 border border-primary/5 shadow-sm space-y-10">
                        <div className="flex items-center justify-between border-b border-primary/5 pb-8">
                           <h4 className="text-xs uppercase font-black tracking-[0.3em]">Direcciones de Envío</h4>
                           <button 
                             onClick={() => handleOpenAddrModal()}
                             className="text-[10px] font-black bg-primary text-white px-6 h-10 flex items-center gap-3 uppercase tracking-widest transition-all hover:bg-primary-container"
                           >
                             Agregar Nueva <Plus size={14} />
                           </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           {addresses.map((addr, i) => (
                             <div key={i} className={`p-8 border ${addr.main ? 'border-primary' : 'border-primary/5'} bg-[#F8F9FA] relative group`}>
                                {addr.main && <span className="absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest text-primary">Predeterminada</span>}
                                <p className="text-xs font-black uppercase tracking-widest text-primary mb-4">{addr.name}</p>
                                <p className="text-[10px] font-bold text-primary/40 leading-relaxed uppercase tracking-wider mb-8">{addr.addr}</p>
                                <div className="flex items-center gap-6 pt-6 border-t border-primary/5">
                                   <button 
                                     onClick={() => handleOpenAddrModal(addr)}
                                     className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/20 hover:text-primary"
                                   >
                                     Editar
                                   </button>
                                   <button 
                                     onClick={() => saveAddresses(addresses.filter((_, idx) => idx !== i))}
                                     className="text-[9px] font-black uppercase tracking-[0.2em] text-red-600/30 hover:text-red-600"
                                   >
                                     Eliminar
                                   </button>
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>
                  </motion.section>
                )}

               {activeTab === "sec" && (
                 <motion.section key="sec" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="bg-white p-12 border border-primary/5 shadow-sm space-y-12">
                    <div className="border-b border-primary/5 pb-8 flex items-center justify-between">
                       <h4 className="text-xs uppercase font-black tracking-[0.3em]">Seguridad & Acceso</h4>
                       <ShieldAlert size={20} className="text-primary/10" />
                    </div>
                    <div className="space-y-10">
                       <div className="flex items-center justify-between p-8 bg-surface-container-low border border-primary/5">
                          <div className="space-y-1">
                             <p className="text-[10px] uppercase font-black tracking-widest text-primary">Autenticación de Dos Factores (2FA)</p>
                             <p className="text-[9px] font-bold text-primary/40 uppercase tracking-widest">Protege tu cuenta con verificación adicional</p>
                          </div>
                          <button className="h-10 px-6 border border-primary/20 text-[9px] uppercase font-black tracking-widest hover:bg-primary hover:text-white transition-all">Activar</button>
                       </div>
                       <form onSubmit={handleUpdatePassword} className="space-y-8">
                          <p className="text-[10px] uppercase font-black tracking-widest text-primary/40">Cambiar Contraseña</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="space-y-2 relative">
                                <label className="text-[9px] uppercase font-black text-primary/30 tracking-widest">Contraseña Actual</label>
                                <div className="relative">
                                   <input 
                                     type={showPass.current ? "text" : "password"}
                                     value={passForm.current}
                                     onChange={(e) => setPassForm({...passForm, current: e.target.value})}
                                     className="w-full h-14 px-6 pr-12 bg-[#F8F9FA] border border-transparent text-xs font-bold outline-none focus:border-primary/20" 
                                     required
                                   />
                                   <button type="button" onClick={() => setShowPass({...showPass, current: !showPass.current})} className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/20 hover:text-primary transition-colors">
                                      {showPass.current ? <EyeOff size={16} /> : <Eye size={16} />}
                                   </button>
                                </div>
                             </div>
                             <div className="space-y-2 relative">
                                <label className="text-[9px] uppercase font-black text-primary/30 tracking-widest">Nueva Contraseña</label>
                                <div className="relative">
                                   <input 
                                     type={showPass.new ? "text" : "password"}
                                     value={passForm.new}
                                     onChange={(e) => setPassForm({...passForm, new: e.target.value})}
                                     className="w-full h-14 px-6 pr-12 bg-[#F8F9FA] border border-transparent text-xs font-bold outline-none focus:border-primary/20" 
                                     required
                                   />
                                   <button type="button" onClick={() => setShowPass({...showPass, new: !showPass.new})} className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/20 hover:text-primary transition-colors">
                                      {showPass.new ? <EyeOff size={16} /> : <Eye size={16} />}
                                   </button>
                                </div>
                             </div>
                             <div className="space-y-2 relative md:col-span-2">
                                <label className="text-[9px] uppercase font-black text-primary/30 tracking-widest">Confirmar Nueva Contraseña</label>
                                <div className="relative">
                                   <input 
                                     type={showPass.confirm ? "text" : "password"}
                                     value={passForm.confirm}
                                     onChange={(e) => setPassForm({...passForm, confirm: e.target.value})}
                                     className="w-full h-14 px-6 pr-12 bg-[#F8F9FA] border border-transparent text-xs font-bold outline-none focus:border-primary/20" 
                                     required
                                   />
                                   <button type="button" onClick={() => setShowPass({...showPass, confirm: !showPass.confirm})} className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/20 hover:text-primary transition-colors">
                                      {showPass.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                   </button>
                                </div>
                             </div>
                          </div>
                          <div className="flex items-center justify-between">
                             <AnimatePresence>
                               {passStatus.type && (
                                 <motion.span 
                                   initial={{ opacity: 0, x: -10 }} 
                                   animate={{ opacity: 1, x: 0 }} 
                                   exit={{ opacity: 0 }} 
                                   className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ${passStatus.type === 'success' ? 'text-green-600' : 'text-red-600'}`}
                                 >
                                   {passStatus.type === 'success' ? <BadgeCheck size={14} /> : <ShieldAlert size={14} />}
                                   {passStatus.msg}
                                 </motion.span>
                               )}
                             </AnimatePresence>
                             <button 
                               type="submit"
                               disabled={isSaving}
                               className="btn-primary h-14 px-12 text-[10px] uppercase font-black tracking-[0.2em] disabled:opacity-50 transition-all font-serif italic lowercase ml-auto"
                             >
                               {isSaving ? 'Procesando...' : 'Actualizar Acceso'}
                             </button>
                          </div>
                       </form>
                    </div>
                 </motion.section>
               )}

               {activeTab === "notif" && (
                 <motion.section key="notif" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="bg-white p-12 border border-primary/5 shadow-sm space-y-12">
                    <div className="border-b border-primary/5 pb-8 flex items-center justify-between">
                       <h4 className="text-xs uppercase font-black tracking-[0.3em]">Centro de Notificaciones</h4>
                       <BellRing size={20} className="text-primary/10" />
                    </div>
                    <div className="space-y-2">
                       {[
                         { title: "Nuevas Colecciones", desc: "Avisos de piezas exclusivas .925", active: true },
                         { title: "Estatus de Órdenes", desc: "Seguimiento de compras en tiempo real", active: true },
                         { title: "Oportunidades Socio", desc: "Mentorías y beneficios de mayoreo", active: false },
                         { title: "Boletín Joyita", desc: "Tendencias y cuidado de joyería", active: false }
                       ].map((notif, i) => (
                         <div key={i} className="flex items-center justify-between p-8 hover:bg-surface-container-low transition-all border-b border-primary/5 last:border-0 group">
                            <div className="space-y-1">
                               <p className="text-[10px] uppercase font-black tracking-widest text-primary group-hover:translate-x-2 transition-transform">{notif.title}</p>
                               <p className="text-[9px] font-bold text-primary/40 uppercase tracking-widest">{notif.desc}</p>
                            </div>
                            <div className={`w-12 h-6 rounded-full relative transition-colors cursor-pointer ${notif.active ? 'bg-primary' : 'bg-primary/10'}`}>
                               <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notif.active ? 'right-1' : 'left-1'}`} />
                            </div>
                         </div>
                       ))}
                    </div>
                 </motion.section>
               )}

               {activeTab === "pay" && (
                 <motion.section key="pay" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="bg-white p-12 border border-primary/5 shadow-sm space-y-12">
                    <div className="border-b border-primary/5 pb-8 flex items-center justify-between">
                       <h4 className="text-xs uppercase font-black tracking-[0.3em]">Métodos de Pago</h4>
                       <button 
                         onClick={() => savePayments([...payments, { bank: "Nueva Tarjeta", id: "**** 0000", expiry: "MM/YY", type: "Credito" }])}
                         className="text-[10px] font-black bg-primary text-white px-6 h-10 flex items-center gap-3 uppercase tracking-widest transition-all hover:bg-primary-container"
                       >
                         Añadir Tarjeta <Plus size={14} />
                       </button>
                    </div>
                    <div className="space-y-6">
                       {payments.map((card, i) => (
                         <div key={i} className="p-10 border border-primary/5 bg-gradient-to-br from-white to-[#F8F9FA] flex flex-col md:flex-row items-center justify-between gap-10 group hover:border-primary/20 transition-all">
                            <div className="flex items-center gap-10 flex-1">
                               <div className="w-16 h-10 bg-primary/5 border border-primary/10 flex items-center justify-center">
                                  <CreditCard size={18} className="text-primary/20 group-hover:text-primary transition-colors" />
                               </div>
                               <div className="space-y-1">
                                  <p className="text-xs font-black uppercase tracking-widest text-primary">{card.bank}</p>
                                  <p className="text-[9px] font-bold text-primary/40 uppercase tracking-widest">{card.id} • Expira {card.expiry}</p>
                               </div>
                            </div>
                            <div className="flex items-center gap-8">
                               <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary/20">{card.type} Card</span>
                               <button 
                                 onClick={() => savePayments(payments.filter((_, idx) => idx !== i))}
                                 className="p-3 hover:bg-white transition-all text-red-600/30 hover:text-red-600"
                               ><Trash2 size={14} /></button>
                            </div>
                         </div>
                       ))}
                    </div>
                 </motion.section>
               )}
            </AnimatePresence>

            {/* Bottom ID Badge */}
            <section className="mt-12 bg-primary text-white p-12 shadow-lg space-y-6 overflow-hidden relative">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
               <div className="flex items-center gap-4 text-white/40 relative z-10">
                  <BadgeCheck size={20} />
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Identidad Digital Joyita Linda</span>
               </div>
               <div className="flex items-center justify-between relative z-10">
                  <div>
                    <h5 className="text-2xl font-serif italic text-white/90 lowercase">{user.name}</h5>
                    <p className="text-[9px] uppercase font-black tracking-widest text-white/40 mt-2">Nivel de Acceso: {user.role === 'admin' ? 'Administrador Maestro' : user.role === 'vendor' ? 'Socio Vendedor' : 'Cliente Premium'}</p>
                  </div>
                  <div className="px-6 py-2 bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-widest">Estado Activo</div>
               </div>
            </section>
         </div>
      </main>

      {/* Address Modal */}
      <AnimatePresence>
        {isAddrModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddrModalOpen(false)} className="absolute inset-0 bg-primary/20 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white w-full max-w-lg shadow-2xl border border-primary/5 overflow-hidden">
               <div className="p-8 bg-primary text-white flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <MapPin size={24} className="text-white/40" />
                     <div>
                        <h3 className="text-xs uppercase font-black tracking-widest text-white/40 mb-1">{editingAddr ? 'Editar Dirección' : 'Nueva Dirección'}</h3>
                        <p className="text-lg font-black uppercase tracking-tighter">Detalles de Envío</p>
                     </div>
                  </div>
                  <button onClick={() => setIsAddrModalOpen(false)} className="p-2 hover:bg-white/10 transition-colors rounded-full"><X size={20} /></button>
               </div>
               
               <div className="p-10 space-y-8">
                  <div className="space-y-2">
                     <label className="text-[10px] uppercase font-black tracking-widest text-primary/40">Nombre de la Dirección (Ej: Casa, Oficina)</label>
                     <input 
                       type="text" 
                       value={addrForm.name} 
                       onChange={(e) => setAddrForm({...addrForm, name: e.target.value})}
                       className="w-full h-14 bg-surface-container-low border-none px-6 text-sm font-bold tracking-wide focus:ring-1 focus:ring-primary/10" 
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] uppercase font-black tracking-widest text-primary/40">Dirección Completa</label>
                     <textarea 
                       value={addrForm.addr} 
                       onChange={(e) => setAddrForm({...addrForm, addr: e.target.value})}
                       className="w-full h-32 bg-surface-container-low border-none p-6 text-sm font-bold tracking-wide focus:ring-1 focus:ring-primary/10 resize-none"
                       placeholder="Calle, Número, Colonia, CP, Ciudad..."
                     />
                  </div>
                  <button onClick={handleSaveAddr} className="btn-primary w-full h-16 text-[10px] uppercase font-black tracking-widest">{editingAddr ? 'Actualizar Dirección' : 'Guardar Dirección'}</button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
