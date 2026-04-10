"use client";

import Image from "next/image";
import { 
  MoveRight, 
  ShoppingBag, 
  Globe, 
  ArrowRight, 
} from "lucide-react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import Logo from "@/components/Logo";

const categories = [
  { id: 1, name: "aretes de plata", slug: "aretes", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop" },
  { id: 2, name: "collares finos", slug: "collares", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1000&auto=format&fit=crop" },
  { id: 3, name: "anillos plata .925", slug: "anillos", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1000&auto=format&fit=crop" },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background selection:bg-primary-container selection:text-white">
      <Navbar />
      
      <main>
        {/* Dynamic Hero Section */}
        <section className="relative h-screen flex items-center overflow-hidden bg-primary pt-24">
          <div className="absolute inset-0 z-0">
            <Image 
              src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2000&auto=format&fit=crop" 
              alt="Sucursal Tijuana"
              fill
              priority
              className="object-cover brightness-50 contrast-125"
            />
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              poster="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2000&auto=format&fit=crop"
              className="w-full h-full object-cover hidden md:block opacity-60"
            >
              <source src="https://player.vimeo.com/external/494252666.sd.mp4?s=729737c249dcdd168e35cf826437299ac4533036&profile_id=165" type="video/mp4" />
            </video>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent z-10" />
          
          <div className="relative z-20 max-w-7xl mx-auto px-6 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl"
            >
              <span className="inline-block px-4 py-1 border border-white/20 text-[9px] tracking-[0.6em] uppercase text-white/50 mb-10 font-black">
                Gran Apertura Abril 2026 / Tijuana, BC
              </span>
              <h2 className="text-[80px] md:text-[180px] text-white leading-[0.75] font-black tracking-tighter uppercase mb-16">
                Plata con <br />
                <span className="italic font-light font-serif text-white/60 lowercase">nueva alma.</span>
              </h2>
              <div className="flex flex-col sm:flex-row gap-8">
                <Link href="/products" className="btn-primary-white group flex items-center justify-center gap-10 py-6 h-28 px-16 text-xl font-black uppercase tracking-widest ring-1 ring-white/10">
                  Ver Catálogo
                  <MoveRight className="w-10 h-10 group-hover:translate-x-3 transition-transform" />
                </Link>
                <div className="hidden lg:flex items-center gap-6 px-10 border border-white/10 bg-white/5 backdrop-blur-md">
                   <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center animate-pulse">
                      <div className="w-3 h-3 bg-white rounded-full" />
                   </div>
                   <span className="text-[10px] uppercase font-black tracking-[0.4em] text-white/40">Sucursal <br /> Tijuana Live</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Marquee Banner */}
        <section className="bg-primary-container py-14 overflow-hidden whitespace-nowrap border-y border-white/5 z-40 relative">
          <div className="flex gap-16 animate-marquee">
            {[...Array(10)].map((_, i) => (
               <div key={i} className="flex items-center gap-10 text-white/40 text-[10px] font-black tracking-[0.4em] uppercase">
                  <Globe className="w-4 h-4 text-white/20" />
                  <span>Envíos a todo México & USA</span>
                  <span className="text-white/80 scale-125">|</span>
                  <span className="text-white underline underline-offset-8">Descuentos desde el 5% hasta el 20%</span>
                  <div className="w-2 h-2 bg-white/20 rotate-45 ml-10" />
               </div>
            ))}
          </div>
        </section>

        {/* Categories Carousel */}
        <section className="py-40 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-end mb-24">
              <div>
                 <span className="text-[10px] uppercase font-bold tracking-[0.6em] text-primary/20 block mb-4">Selección Joyita Linda</span>
                 <h3 className="text-8xl text-primary lowercase font-serif italic leading-none">colecciones .925</h3>
              </div>
              <div className="flex gap-6 mb-4">
                {categories.map((_, i) => (
                  <button key={i} onClick={() => setCurrentSlide(i)} className={`w-14 h-1.5 transition-all duration-700 ${currentSlide === i ? 'bg-primary' : 'bg-primary/5'}`} />
                ))}
              </div>
            </div>

            <div className="relative h-[800px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 1.2 }}
                  className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2 gap-px bg-primary/5"
                >
                  <div className="relative overflow-hidden h-full group">
                    <Image src={categories[currentSlide].image} alt={categories[currentSlide].name} fill className="object-cover group-hover:scale-110 transition-transform duration-[4s]" />
                  </div>
                  <div className="flex flex-col justify-center p-24 bg-surface-container-lowest h-full border-l border-primary/5">
                     <h4 className="text-9xl text-primary font-serif italic mb-12 lowercase leading-[0.8] tracking-tighter">{categories[currentSlide].name}</h4>
                     <Link href={`/products?category=${categories[currentSlide].slug}`} className="btn-primary w-fit group flex items-center gap-6 h-24 px-16 uppercase text-sm tracking-widest font-black">
                        Ver Colección
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform" />
                     </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
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

      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: flex; animation: marquee 40s linear infinite; }
      `}</style>
    </div>
  );
}
