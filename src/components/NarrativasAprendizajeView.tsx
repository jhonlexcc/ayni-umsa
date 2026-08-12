import React, { useState } from 'react';
import {
  BookOpen,
  FileText,
  Video,
  Download,
  Share2,
  Sparkles,
  Search,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Clock,
  User,
} from 'lucide-react';
import { EducationalNarrative } from '../types';

interface NarrativasAprendizajeViewProps {
  narratives: EducationalNarrative[];
}

export const NarrativasAprendizajeView: React.FC<NarrativasAprendizajeViewProps> = ({
  narratives,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [activeNarrative, setActiveNarrative] = useState<EducationalNarrative | null>(
    narratives[0] || null
  );

  const categories = ['Todas', 'Cuidado', 'Corresponsabilidad', 'Narrativas UMSA', 'Recursos Educativos'];

  const filteredNarratives = narratives.filter((n) => {
    if (selectedCategory === 'Todas') return true;
    return n.categoria === selectedCategory;
  });

  return (
    <div className="space-y-8 py-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center space-x-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-0.5 rounded-full text-xs font-bold uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Divulgación Pedagógica de la Investigación UMSA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Narrativas y Aprendizaje de Cuidados</h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
            Módulo educativo con artículos, guías de corresponsabilidad, infografías descargables y resultados cualitativos de la investigación en la UMSA.
          </p>
        </div>
      </div>

      {/* Category Pills */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center space-x-2 overflow-x-auto text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-slate-900 text-orange-400 shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Narratives */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Contenidos Disponibles</h3>
          <div className="space-y-3">
            {filteredNarratives.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveNarrative(item)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  activeNarrative?.id === item.id
                    ? 'bg-blue-50 border-blue-600 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {item.categoria}
                  </span>
                  <span className="text-slate-400 text-[10px]">{item.tiempoLectura}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm leading-snug">{item.titulo}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{item.resumen}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Reader Article Box */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          {activeNarrative ? (
            <div className="space-y-6">
              <div className="space-y-3 pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-md uppercase">
                    {activeNarrative.categoria}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 inline" />
                    <span>{activeNarrative.tiempoLectura}</span>
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                  {activeNarrative.titulo}
                </h2>

                <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium pt-1">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Por {activeNarrative.autor} — {activeNarrative.fecha}</span>
                </div>
              </div>

              {/* Body */}
              <div className="prose max-w-none text-slate-700 text-sm leading-relaxed whitespace-pre-line space-y-4">
                {activeNarrative.contenido}
              </div>

              {/* Download / Share Bar */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl">
                <div className="text-xs">
                  <span className="font-bold text-slate-900">Material Pedagógico Ayni UMSA</span>
                  <p className="text-slate-500 text-[11px]">Cita recomendada para la investigación universitaria</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      alert('Descargando Guía / Infografía en PDF de Ayni UMSA...')
                    }
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Descargar Recurso PDF</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 text-center py-12">
              Selecciona un artículo o infografía para leer.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
