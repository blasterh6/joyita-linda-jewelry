"use client";

import Link from "next/link";
import { MoveRight, ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 selection:bg-primary-container selection:text-white">
      <Link href="/" className="absolute top-12 left-12 flex items-center gap-3 text-[10px] uppercase font-black tracking-[0.3em] text-primary/40 hover:text-primary transition-all group">
         <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
         Regresar a inicio
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm flex flex-col items-center text-center"
      >
        <Logo className="w-20 h-20 mb-12" />
        
        <h1 className="text-4xl font-serif italic mb-4 lowercase text-primary">entrar a joyita linda</h1>
        <p className="text-sm font-semibold uppercase tracking-widest text-primary/40 mb-12">Acceso para Clientes, Vendedores y Admin</p>

        {error && (
          <div className="w-full p-4 bg-red-50 text-red-600 border border-red-100 text-[10px] font-black uppercase tracking-widest mb-8 text-center animate-pulse">
            Error: {error}
          </div>
        )}

        <form className="w-full space-y-8" onSubmit={handleLogin}>
          <div className="flex flex-col text-left gap-2">
            <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/40 pl-1">Email / Usuario</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ej: admin@joyitalinda.com" 
              className="w-full h-16 px-6 border border-primary/10 text-sm font-bold tracking-wide focus:outline-none focus:border-primary transition-all placeholder:text-primary/20"
              required
            />
          </div>

          <div className="flex flex-col text-left gap-2">
             <label className="text-[10px] uppercase font-bold tracking-[0.2em] text-primary/40 pl-1">Contraseña</label>
             <input 
               type="password" 
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               placeholder="••••••••" 
               className="w-full h-16 px-6 border border-primary/10 text-sm font-bold tracking-wide focus:outline-none focus:border-primary transition-all placeholder:text-primary/20"
               required
             />
          </div>

          <button 
            type="submit" 
            className="btn-primary w-full h-16 flex items-center justify-center gap-4 text-sm"
          >
            Iniciar Sesión
            <MoveRight size={16} />
          </button>
        </form>

        <p className="mt-12 text-xs font-semibold text-primary/40 tracking-widest uppercase">
          ¿Aún no tienes cuenta? {" "}
          <Link href="/register" className="text-primary hover:underline underline-offset-8">Registrarme</Link>
        </p>

        <p className="mt-12 text-[10px] font-bold text-primary/20 tracking-[0.1em] uppercase">
          * Para pruebas cualquier correo es válido. Password: <span className="text-primary/40">cualquiera</span>
        </p>
      </motion.div>
    </div>
  );
}
