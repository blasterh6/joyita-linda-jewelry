"use client";

import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  TrendingUp, 
  Users, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  BadgeCheck, 
  Rocket, 
  DollarSign,
  Gem,
  Globe
} from "lucide-react";
import Link from "next/link";
import Logo from "@/components/Logo";
import Navbar from "@/components/Navbar";

export default function SocioLanding() {
  const benefits = [
    {
      icon: <DollarSign className="text-amber-600" />,
      title: "Precios de Mayorista",
      desc: "Acceso exclusivo a márgenes de ganancia preferenciales desde tu primera compra de socio."
    },
    {
      icon: <Users className="text-blue-600" />,
      title: "Mentoría Personalizada",
      desc: "Acompañamiento directo para ayudarte a escalar tu propio negocio de joyería."
    },
    {
      icon: <Gem className="text-purple-600" />,
      title: "Catálogo Exclusivo",
      desc: "Piezas de edición limitada que solo los socios certificados pueden comercializar."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Registro de Aspirante",
      desc: "Completa tu perfil y solicita el cambio de rol en tu panel de control."
    },
    {
      number: "02",
      title: "Compra Inicial de Activación",
      desc: "Realiza un pedido inicial de al menos $10,000 MXN para obtener tu certificación."
    },
    {
      number: "03",
      title: "Certificación Joyita",
      desc: "Recibe tu kit de bienvenida y acceso total a las herramientas de venta pro."
    }
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-primary selection:text-white">
      <Navbar />

      <main className="pt-28">
        {/* Hero Section */}
        <section className="relative py-32 px-12 overflow-hidden bg-surface-container-lowest">
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-10"
              >
                 <span className="px-6 py-2 bg-primary text-white text-[9px] font-black uppercase tracking-[0.4em] inline-block">Oportunidad de Negocio</span>
                 <h2 className="text-8xl font-serif italic text-primary leading-[0.9] lowercase">conviértete en socio joyita linda</h2>
                 <p className="text-lg text-primary/60 max-w-xl font-medium leading-relaxed">Únete a nuestra red exclusiva de embajadores y comienza a construir tu propio patrimonio con la plata .925 de la más alta calidad en México.</p>
                 <div className="flex items-center gap-8 pt-6">
                    <Link href="/register" className="btn-primary text-[10px] px-12 h-16 flex items-center gap-4">
                       Comenzar Solicitud
                       <ArrowRight size={16} />
                    </Link>
                    <div className="flex items-center gap-4 text-primary/40">
                       <ShieldCheck size={24} />
                       <span className="text-[9px] uppercase font-black tracking-widest">Programa Certificado</span>
                    </div>
                 </div>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-square"
              >
                 <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl" />
                 <div className="relative bg-white p-20 shadow-2xl border border-primary/5 flex items-center justify-center overflow-hidden">
                    <Gem size={300} className="text-primary/5 absolute -bottom-20 -right-20 rotate-12" />
                    <div className="space-y-8 relative z-10 w-full">
                       <div className="flex justify-between items-end border-b border-primary/10 pb-8">
                          <h3 className="text-5xl font-serif italic text-primary">beneficios lite</h3>
                          <span className="text-[10px] uppercase font-black text-primary/30">Versión Demo</span>
                       </div>
                       <div className="space-y-6">
                          {["Márgenes del 40% al 60%", "Envíos asegurados Prioritarios", "Acceso a Preventas VIP", "Dashboard de Analítica"].map((t, i) => (
                            <div key={i} className="flex items-center gap-4 text-sm font-bold text-primary/80 uppercase tracking-widest">
                               <CheckCircle2 size={18} className="text-green-600" />
                               {t}
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </motion.div>
           </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-32 px-12 max-w-7xl mx-auto">
           <div className="text-center space-y-4 mb-24">
              <h3 className="text-xs uppercase font-black tracking-[0.5em] text-primary/20">Por qué unirse</h3>
              <p className="text-5xl font-serif italic text-primary lowercase">ventajas competitivas exclusivas</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {benefits.map((b, i) => (
                <div key={i} className="p-12 bg-white border border-primary/5 shadow-sm space-y-8 hover:shadow-xl transition-all group">
                   <div className="w-16 h-16 bg-surface-container-low flex items-center justify-center group-hover:scale-110 transition-transform">
                      {b.icon}
                   </div>
                   <h4 className="text-xl font-black text-primary uppercase tracking-tighter">{b.title}</h4>
                   <p className="text-sm font-medium text-primary/50 leading-relaxed">{b.desc}</p>
                </div>
              ))}
           </div>
        </section>

        {/* Rules/Process Section */}
        <section className="bg-primary text-white py-32 px-12">
           <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-24 items-center">
                 <div className="space-y-8">
                    <span className="text-white/40 text-[9px] font-black uppercase tracking-[0.4em]">El Proceso</span>
                    <h3 className="text-6xl font-serif italic leading-none lowercase">cómo convertirte en socio</h3>
                    <p className="text-white/60 font-medium leading-relaxed">Hemos simplificado el proceso para que puedas iniciar tu trayectoria como socio vendedor hoy mismo.</p>
                 </div>
                 <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((s, i) => (
                      <div key={i} className="p-8 bg-white/5 border border-white/10 space-y-6 relative overflow-hidden group hover:bg-white/10 transition-all">
                         <span className="text-6xl font-black text-white/5 absolute -top-4 -right-2 group-hover:text-white/10 transition-colors">{s.number}</span>
                         <h4 className="text-xs font-black uppercase tracking-widest text-white/40">{s.title}</h4>
                         <p className="text-sm font-medium text-white/80 leading-relaxed">{s.desc}</p>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* Requirements Banner */}
        <section className="py-32 px-12 text-center bg-surface-container-low">
           <div className="max-w-3xl mx-auto space-y-12">
              <BadgeCheck size={64} className="mx-auto text-primary/20" />
              <div className="space-y-4">
                 <h4 className="text-xs uppercase font-black tracking-[0.4em] text-primary/30">Requisitos de Prueba</h4>
                 <p className="text-3xl font-serif italic text-primary lowercase leading-snug">Para este demo, cualquier usuario puede solicitar el cambio. Solo requerimos validación de correo y un pedido mínimo de activación.</p>
              </div>
              <div className="flex justify-center gap-12">
                 <div className="text-left">
                    <p className="text-xs font-black text-primary uppercase tracking-widest mb-2">Compra Mínima</p>
                    <p className="text-2xl font-black text-primary">$10,000.00 MXN</p>
                 </div>
                 <div className="w-px bg-primary/10" />
                 <div className="text-left">
                    <p className="text-xs font-black text-primary uppercase tracking-widest mb-2">Mantenimiento</p>
                    <p className="text-2xl font-black text-primary">$5,000.00 Menual</p>
                 </div>
              </div>
           </div>
        </section>

        {/* Final CTA */}
        <section className="py-40 px-12 relative overflow-hidden flex flex-col items-center text-center space-y-12">
           <div className="absolute inset-0 bg-primary -z-10" />
           <Rocket size={80} className="text-white/10 animate-bounce" />
           <h2 className="text-7xl font-serif italic text-white lowercase leading-tight">¿estás listo para elevar tus ingresos?</h2>
           <Link href="/register" className="btn-primary-white text-[11px] px-20 h-20 uppercase font-black tracking-[0.5em] flex items-center justify-center">
              Iniciar Mi Carrera en Joyita
           </Link>
           <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest italic">* Registro sujeto a aprobación del administrador</p>
        </section>
      </main>

      {/* Global Footer */}
      <footer className="bg-primary-container pt-40 pb-16 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-24 mb-32 relative z-10">
            <div className="col-span-1 lg:col-span-2">
              <div className="flex items-center gap-4 mb-10">
                 <Logo className="w-16 h-16 text-white" />
                 <h2 className="text-5xl font-serif italic lowercase font-normal">joyita linda</h2>
              </div>
              <p className="text-white/50 text-xl font-light max-w-lg mb-16 leading-relaxed">
                Joyas con alma mexicana. Diseñamos con precisión arquitectónica y creamos con la pasión de un taller artesanal moderno.
              </p>
            </div>
            
            <div>
               <h5 className="text-[10px] uppercase font-black tracking-[0.5em] mb-12 text-white/30">Navegación</h5>
               <ul className="space-y-6 text-white/70 text-xs font-black tracking-widest uppercase">
                  <li><Link href="/products" className="hover:text-white transition-all">Tienda</Link></li>
                  <li><Link href="/socio" className="hover:text-white transition-all">Programa Socio</Link></li>
                  <li><Link href="/login" className="hover:text-white transition-all">Acceso Socio</Link></li>
               </ul>
            </div>
          </div>
          <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10 text-[10px] uppercase font-black tracking-[0.6em] text-white/20">
            <span>&copy; 2026 Joyita Linda .925 / Todos los derechos reservados.</span>
            <div className="flex gap-12"><span>Privacidad</span><span>Términos</span></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
