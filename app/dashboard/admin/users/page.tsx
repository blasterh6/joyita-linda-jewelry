"use client";

import { Users, UserPlus, Search, Filter, Mail, ShieldCheck, MoreVertical, ShieldAlert, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";

const users = [
  { id: 101, name: "Javier Admin", email: "admin@joyitalinda.com", role: "Admin", status: "Activo", last: "Hace 2m" },
  { id: 102, name: "Sofia Vendedora", email: "vendor@joyitalinda.com", role: "Vendedor", status: "Activo", last: "Hace 1h" },
  { id: 103, name: "Carlos Cliente", email: "customer@joyitalinda.com", role: "Cliente", status: "Inactivo", last: "Hace 2d" }
];

const roles = [
  { name: "Admin", icon: <ShieldCheck size={14} /> },
  { name: "Vendedor", icon: <BadgeCheck size={14} /> },
  { name: "Cliente", icon: <Users size={14} /> }
];

export default function UsersManager() {
  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between">
        <div>
           <h2 className="text-4xl font-serif italic lowercase text-primary mb-2">gestión de usuarios</h2>
           <p className="text-[10px] uppercase font-black tracking-[0.4em] text-primary/40">Control de accesos y roles del sistema</p>
        </div>
        <button className="btn-primary flex items-center gap-4 text-xs h-14 px-10">
           Nuevo Usuario <UserPlus size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {roles.map((r, i) => (
          <div key={i} className="bg-white p-10 border border-primary/5 shadow-sm space-y-4">
             <div className="flex items-center gap-3 text-primary/40">
                {r.icon}
                <span className="text-[10px] uppercase font-bold tracking-widest">{r.name}s</span>
             </div>
             <p className="text-4xl font-black text-primary">0{i+1}</p>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white border border-primary/5 shadow-sm">
        <div className="p-10 border-b border-primary/5 flex items-center justify-between bg-[#F8F9FA]/50">
           <div className="relative group max-w-sm w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/30" />
              <input type="text" placeholder="Filtrar por nombre o email..." className="h-12 w-full pl-14 pr-6 bg-white border border-primary/5 text-[10px] font-bold tracking-wide outline-none placeholder:text-primary/20 uppercase" />
           </div>
           <button className="text-[9px] uppercase font-black tracking-widest text-primary/40 hover:text-primary flex items-center gap-2">
              <Filter size={14} /> Refinar Búsqueda
           </button>
        </div>

        <table className="w-full">
           <thead>
              <tr className="bg-white text-left text-[9px] uppercase font-black tracking-[0.3em] text-primary/30">
                 <th className="px-10 py-8 border-b border-primary/5">Identidad</th>
                 <th className="px-10 py-8 border-b border-primary/5">Rol de Acceso</th>
                 <th className="px-10 py-8 border-b border-primary/5">Estatus</th>
                 <th className="px-10 py-8 border-b border-primary/5">Última Actividad</th>
                 <th className="px-10 py-8 border-b border-primary/5 text-right pr-16">Acción</th>
              </tr>
           </thead>
           <tbody>
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-surface-container-low transition-all">
                   <td className="px-10 py-8 border-b border-primary/5">
                      <div className="flex items-center gap-6">
                         <div className="w-10 h-10 bg-primary-container text-white flex items-center justify-center text-[10px] font-bold ring-4 ring-primary/5">{u.name.split(' ').map(n=>n[0]).join('')}</div>
                         <div>
                            <p className="text-xs font-black text-primary uppercase tracking-tight">{u.name}</p>
                            <p className="text-[9px] font-bold text-primary/40 tracking-widest">{u.email}</p>
                         </div>
                      </div>
                   </td>
                   <td className="px-10 py-8 border-b border-primary/5">
                      <span className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest ${
                        u.role === 'Admin' ? 'bg-primary text-white' : 'bg-surface-container-high text-primary'
                      }`}>
                         {u.role}
                      </span>
                   </td>
                   <td className="px-10 py-8 border-b border-primary/5">
                      <div className="flex items-center gap-2">
                         <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'Activo' ? 'bg-green-600' : 'bg-red-600'}`} />
                         <span className="text-[10px] font-bold text-primary/60 uppercase tracking-widest">{u.status}</span>
                      </div>
                   </td>
                   <td className="px-10 py-8 border-b border-primary/5">
                      <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">{u.last}</span>
                   </td>
                   <td className="px-10 py-8 border-b border-primary/5 text-right pr-16">
                      <button className="p-2 hover:bg-white transition-all text-primary/30 hover:text-primary">
                         <MoreVertical size={16} />
                      </button>
                   </td>
                </tr>
              ))}
           </tbody>
        </table>
      </div>

      <div className="bg-red-50 p-10 flex flex-col md:flex-row items-center gap-10 border border-red-100">
         <ShieldAlert size={40} className="text-red-900/30" />
         <div>
            <h5 className="text-[10px] uppercase font-black tracking-widest text-red-900">Protocolo de Seguridad RBAC</h5>
            <p className="text-[10px] text-red-900/50 font-bold max-w-xl leading-relaxed uppercase mt-2">La modificación de roles administrativos requiere una doble validación de identidad. Todos los cambios se registran en el Audit Log.</p>
         </div>
      </div>
    </div>
  );
}
