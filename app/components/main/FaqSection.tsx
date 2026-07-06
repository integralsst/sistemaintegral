"use client";

import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FaqItem = ({ question, answer, isOpen, onClick }: FaqItemProps) => {
  return (
    <div className="border-b border-gray-100 last:border-none">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center py-6 text-left focus:outline-none group"
      >
        <h3 className={`text-lg sm:text-xl font-semibold tracking-tight transition-colors duration-300 pr-8 ${isOpen ? 'text-blue-600' : 'text-gray-900 group-hover:text-blue-600'}`}>
          {question}
        </h3>
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-blue-600 text-white rotate-180' : 'bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
          {isOpen ? <Minus size={18} strokeWidth={2.5} /> : <Plus size={18} strokeWidth={2.5} />}
        </div>
      </button>
      
      <div 
        className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}
      >
        <p className="text-gray-500 text-[15px] sm:text-base leading-relaxed pr-12">
          {answer}
        </p>
      </div>
    </div>
  );
};

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // El primero abierto por defecto

  const faqs = [
    {
      question: "¿Aplica la normativa del SG-SST para mi empresa si somos menos de 10 empleados?",
      answer: "Sí, la implementación del Sistema de Gestión de Seguridad y Salud en el Trabajo es de carácter obligatorio para todos los empleadores públicos y privados en Colombia. La Resolución 0312 establece los estándares mínimos que aplican de manera proporcional según el tamaño y nivel de riesgo de su empresa."
    },
    {
      question: "¿Qué soportes legales debo tener para las capacitaciones de mi personal?",
      answer: "El artículo 2.2.4.6.12 del Decreto 1072 de 2015 establece explícitamente que el empleador debe mantener los soportes documentales que evidencien la realización de la inducción y reinducción de los trabajadores, así como de las capacitaciones específicas en seguridad y salud."
    },
    {
      question: "¿Cuánto tiempo toma diseñar e implementar el sistema desde cero?",
      answer: "El tiempo de implementación varía según la complejidad, tamaño y nivel de riesgo de su organización. Típicamente, el diseño documental y diagnóstico inicial toma de 4 a 6 semanas, seguido de un plan de trabajo anual de ejecución progresiva."
    },
    {
      question: "¿Qué pasa si el Ministerio de Trabajo me visita y no tengo el SG-SST actualizado?",
      answer: "El incumplimiento expone a su empresa a sanciones económicas que pueden ir desde multas leves hasta montos que superan los 500 SMMLV, e incluso el cierre temporal o definitivo del lugar de trabajo dependiendo de la gravedad y reincidencia de los hallazgos."
    },
    {
      question: "¿Ustedes se encargan de representar a mi empresa ante la ARL?",
      answer: "Sí, como parte de nuestro servicio integral o de outsourcing, realizamos el acompañamiento técnico, reportes y gestión administrativa directa con su Administradora de Riesgos Laborales para asegurar que recibe todos los beneficios y coberturas a los que tiene derecho."
    }
  ];

  return (
    <section className="w-full py-24 md:py-32 bg-white relative z-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Columna Izquierda: Título y Contexto */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <span className="text-sm font-bold tracking-widest uppercase text-blue-600 block mb-4">
              Dudas Frecuentes
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter leading-[1.1] mb-6">
              Respuestas claras para su tranquilidad.
            </h2>
            <p className="text-lg text-gray-500 font-medium mb-8">
              Resolvemos las principales inquietudes sobre la implementación legal, plazos normativos y el alcance de nuestra asesoría especializada.
            </p>
            
            {/* Tarjeta de Contacto Rápido */}
            <div className="bg-[#f5f5f7] rounded-3xl p-8 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-2">¿Tiene un caso particular?</h3>
              <p className="text-sm text-gray-500 mb-6">Hable directamente con uno de nuestros especialistas en normativa laboral.</p>
              <button className="bg-gray-900 text-white font-semibold text-[15px] px-6 py-3 rounded-full hover:bg-gray-800 transition-colors duration-300 w-full sm:w-auto">
                Consultar ahora
              </button>
            </div>
          </div>

          {/* Columna Derecha: Acordeón de FAQs */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-gray-100 shadow-xl shadow-gray-200/20 rounded-[2.5rem] p-6 sm:p-10">
              {faqs.map((faq, index) => (
                <FaqItem
                  key={index}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === index}
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                />
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}