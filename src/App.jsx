import React from 'react';
import { ArrowUpRight, Zap, ShieldCheck } from 'lucide-react';
import Hero from './components/Hero'; 
import Services from './components/Services'; 
import Projects from './components/Projects'; 
import Clients  from './components/Clients'; 

const App = () => {
  return (
    <div className="min-h-screen font-sans selection:bg-laeq-cyan/30 bg-[#001D3D] text-white">
      
      {/* 1. EL HERO */}
      <Hero />

      {/* 2. COMPONENTE DE SERVICIOS */}
      <Services />

      {/* 3. SECCIÓN DE AUTORIDAD Y MÉTRICAS */}
      <section className="relative bg-[#000d1a] py-40 px-6 md:px-16 overflow-hidden border-t border-white/5">
        
        {/* Fondo sutil con la grid técnica */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('./assets/bg-grid-energy.png')] bg-fixed" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            
            {/* Bloque de Visión */}
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-6">
                <h3 className="text-laeq-cyan font-mono text-xs uppercase tracking-[0.4em] font-bold">
                  Nuestra Influencia
                </h3>
                <h2 className="text-4xl md:text-5xl font-serif leading-[1.1] tracking-tight">
                  Estructuramos el futuro energético con el rigor de la <span className="italic text-white/60 font-light">experiencia.</span>
                </h2>
              </div>

              <div className="group cursor-pointer inline-block">
                <div className="flex items-center gap-4 text-white hover:text-laeq-cyan transition-colors duration-500">
                  <span className="text-xs uppercase tracking-[0.3em] font-bold">Ver trayectoria detallada</span>
                  <div className="p-3 border border-white/10 rounded-full group-hover:border-laeq-cyan/50 group-hover:translate-x-2 transition-all duration-500">
                    <ArrowUpRight size={18} className="text-laeq-cyan" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bloque de Estadísticas */}
            <div className="lg:col-span-7 grid md:grid-cols-2 gap-px bg-white/5 border border-white/5">
              
              <div className="bg-[#001126] p-12 space-y-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex justify-between items-start">
                  <h4 className="text-7xl md:text-8xl font-serif font-bold text-white tracking-tighter">12</h4>
                  <Zap className="text-laeq-cyan/40" size={24} />
                </div>
                <p className="text-[10px] uppercase tracking-[0.3em] font-black text-laeq-cyan">
                  Años de Liderazgo (Est. 2014)
                </p>
                <p className="text-sm text-white/40 leading-relaxed">
                  Liderando la regulación y planificación en el mercado energético peruano.
                </p>
              </div>

              <div className="bg-[#001126] p-12 space-y-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex justify-between items-start">
                  <h4 className="text-7xl md:text-8xl font-serif font-bold text-white tracking-tighter">10+</h4>
                  <ShieldCheck className="text-laeq-cyan/40" size={24} />
                </div>
                <p className="text-[10px] uppercase tracking-[0.3em] font-black text-laeq-cyan">
                  Proyectos Completados
                </p>
                <p className="text-sm text-white/40 leading-relaxed">
                  Asesoría técnica y estratégica para los actores más importantes del sector.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 4. COMPONENTE DE PROYECTOS */}
      <Projects />

      {/* 5. CLIENTES */}
      <Clients />

    </div>
  );
};

export default App;