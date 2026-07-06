"use client";

import React from 'react';
import { AlertTriangle, TrendingDown, Scale, ShieldCheck, TrendingUp, CheckCircle2, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PainPoints() {
  return (
    <section className="w-full py-24 bg-[#f5f5f7] relative z-10 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera Animada */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight mb-6">
            El verdadero costo de ignorar la Seguridad Laboral
          </h2>
          <p className="text-lg text-gray-600 font-medium">
            No deje el futuro de su empresa al azar. El incumplimiento del SG-SST expone a su organización a riesgos financieros y legales severos.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Tarjeta de Riesgos (Roja) - Entra desde la izquierda */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
            className="bg-white rounded-[2rem] p-8 md:p-12 border border-red-100 shadow-xl shadow-red-900/5 relative overflow-hidden group"
          >
            {/* Fondo de alerta con flotación infinita */}
            <motion.div 
              animate={{ y: [0, -15, 0], rotate: [0, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 right-0 p-8 opacity-5 text-red-900"
            >
              <AlertTriangle size={200} />
            </motion.div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 relative z-10 flex items-center gap-3">
              <div className="bg-red-50 text-red-500 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <AlertTriangle size={24} />
              </div>
              Sin una gestión adecuada
            </h3>
            
            <ul className="space-y-6 relative z-10">
              {[
                { icon: <Scale size={24} />, title: "Sanciones del Ministerio", desc: "Multas severas e incluso el cierre temporal del establecimiento por incumplimiento legal." },
                { icon: <TrendingDown size={24} />, title: "Sobrecostos en ARL", desc: "Aumento en las tasas de cotización por alta accidentalidad y falta de prevención." },
                { icon: <Users size={24} />, title: "Demandas Laborales", desc: "Vulnerabilidad legal ante accidentes o enfermedades laborales de sus trabajadores." }
              ].map((item, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + (i * 0.15) }}
                  className="flex gap-4"
                >
                  <div className="text-red-400 shrink-0 mt-1">{item.icon}</div>
                  <div>
                    <h4 className="font-bold text-gray-900">{item.title}</h4>
                    <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Tarjeta de Solución (Azul Oscuro) - Entra desde la derecha */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.3, delay: 0.2 }}
            className="bg-gray-900 rounded-[2rem] p-8 md:p-12 shadow-xl shadow-gray-900/20 relative overflow-hidden text-white group"
          >
             {/* Fondo de escudo con flotación infinita */}
             <motion.div 
              animate={{ y: [0, -15, 0], scale: [1, 1.05, 1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-0 right-0 p-8 opacity-5 text-blue-500"
            >
              <ShieldCheck size={200} />
            </motion.div>

            <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 relative z-10 flex items-center gap-3">
              <div className="bg-blue-500/20 text-blue-400 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <ShieldCheck size={24} />
              </div>
              Con Sistema Integral
            </h3>
            
            <ul className="space-y-6 relative z-10">
              {[
                { icon: <CheckCircle2 size={24} />, title: "Cumplimiento Legal 100%", desc: "Blindamos su empresa ante auditorías del MinTrabajo y requerimientos de las ARL." },
                { icon: <TrendingUp size={24} />, title: "Optimización de Recursos", desc: "Reducimos el ausentismo y evitamos multas, protegiendo la rentabilidad de su negocio." },
                { icon: <ShieldCheck size={24} />, title: "Tranquilidad Gerencial", desc: "Delegue la carga operativa del SG-SST en expertos mientras usted se enfoca en su negocio." }
              ].map((item, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + (i * 0.15) }}
                  className="flex gap-4"
                >
                  <div className="text-blue-400 shrink-0 mt-1">{item.icon}</div>
                  <div>
                    <h4 className="font-bold text-white">{item.title}</h4>
                    <p className="text-gray-400 text-sm mt-1">{item.desc}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
}