"use client";

import Link from "next/link";
import { MoveRight, ArrowLeft, Mail, User, ShieldCheck, Loader2 } from "lucide-react";
import Logo from "@/components/Logo";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Register() {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError("");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
      
      // Real Registration Call
      const regResponse = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.name.split(' ')[0],
          lastName: formData.name.split(' ').slice(1).join(' ') || "",
          email: formData.email,
          password: formData.password
        }),
      });

      const regData = await regResponse.json();
      if (!regResponse.ok) throw new Error(regData.error || 'Error al registrar');

      // Auto-login after successful registration
      await login(formData.email, formData.password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || "Error al crear la cuenta. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 selection:bg-primary-container selection:text-white border-t-8 border-primary">
      <Link href="/" className="absolute top-12 left-12 flex items-center gap-3 text-[10px] uppercase font-black tracking-[0.3em] text-primary/40 hover:text-primary transition-all group">
         <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
         Regresar a inicio
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl flex flex-col items-center text-center"
      >
        <Logo className="w-20 h-20 mb-12" />
        
        <h1 className="text-5xl font-serif italic mb-6 lowercase text-primary leading-none">crear cuenta joyita linda</h1>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary/40 mb-16">Unete a la red de joyería fina .925</p>

        <form className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 text-left" onSubmit={handleRegister}>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/40 pl-1">Nombre Completo</label>
            <div className="relative">
              <User size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/20" />
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Maria Lopez" 
                className="w-full h-16 pl-14 pr-6 border border-primary/10 text-sm font-bold tracking-wide focus:outline-none focus:border-primary transition-all placeholder:text-primary/20 uppercase" 
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
             <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/40 pl-1">Email</label>
             <div className="relative">
               <Mail size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/20" />
               <input 
                 type="email" 
                 name="email"
                 value={formData.email}
                 onChange={handleChange}
                 placeholder="hola@ejemplo.com" 
                 className="w-full h-16 pl-14 pr-6 border border-primary/10 text-sm font-bold tracking-wide focus:outline-none focus:border-primary transition-all placeholder:text-primary/20" 
                 required
               />
             </div>
          </div>

          <div className="flex flex-col gap-2">
             <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/40 pl-1">Contraseña</label>
             <input 
               type="password" 
               name="password"
               value={formData.password}
               onChange={handleChange}
               placeholder="••••••••" 
               className="w-full h-16 px-6 border border-primary/10 text-sm font-bold tracking-wide focus:outline-none focus:border-primary transition-all placeholder:text-primary/20" 
               required
             />
          </div>

          <div className="flex flex-col gap-2">
             <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/40 pl-1">Confirmar</label>
             <input 
               type="password" 
               name="confirmPassword"
               value={formData.confirmPassword}
               onChange={handleChange}
               placeholder="••••••••" 
               className="w-full h-16 px-6 border border-primary/10 text-sm font-bold tracking-wide focus:outline-none focus:border-primary transition-all placeholder:text-primary/20" 
               required
             />
          </div>

          {error && (
            <div className="md:col-span-2 text-red-500 text-[10px] font-bold uppercase tracking-widest text-center">
              {error}
            </div>
          )}

          <div className="md:col-span-2 space-y-8 mt-4">
             <div className="p-8 bg-surface-container-low border border-primary/5 flex items-center gap-6">
                <ShieldCheck size={24} className="text-primary/10" />
                <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest leading-relaxed">Al registrarte, aceptas convertirte en cliente Joyita Linda. Si deseas ser socio vendedor y acceder a precios de mayoreo, completa tu perfil después del alta.</p>
             </div>
             
             <button 
               type="submit" 
               disabled={loading}
               className="btn-primary w-full h-20 flex items-center justify-center gap-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
             >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Crear Mi Cuenta
                    <MoveRight size={16} />
                  </>
                )}
             </button>
          </div>
        </form>

        <p className="mt-12 text-xs font-semibold text-primary/40 tracking-widest uppercase">
          ¿Ya tienes cuenta? {" "}
          <Link href="/login" className="text-primary hover:underline underline-offset-8">Iniciar Sesión</Link>
        </p>
      </motion.div>
    </div>
  );
}
