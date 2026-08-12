import React, { useState } from 'react';
import {
  MapPin,
  List,
  Search,
  Clock,
  Phone,
  Mail,
  Info,
  CheckCircle,
  ChevronRight,
  Sparkles,
  X,
  ExternalLink,
} from 'lucide-react';
import { ServiceCategory, UmsaService } from '../types';

interface ServiciosViewProps {
  umsaServices: UmsaService[];
}

export const ServiciosView: React.FC<ServiciosViewProps> = ({ umsaServices }) => {
  const [viewMode, setViewMode] = useState<'mapa' | 'catalogo'>('mapa');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<UmsaService | null>(
    umsaServices[0] || null
  );

  const categories: string[] = [
    'Todos',
    'Cuidado infantil',
    'Apoyo académico',
    'Información sobre becas',
    'Orientación universitaria',
    'Bienestar',
    'Información institucional',
  ];

  const filteredServices = umsaServices.filter((s) => {
    const matchesCategory = selectedCategory === 'Todos' || s.categoria === selectedCategory;
    const matchesSearch =
      s.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.ubicacion.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 py-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center space-x-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-0.5 rounded-full text-xs font-bold uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Infraestructura & Recursos UMSA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Servicios y Recursos Universitarios</h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
            Encuentra centros infantiles, becas comedor, defensorías y gabinetes de atención social y de salud en los campus de la UMSA.
          </p>
        </div>

        {/* Toggle View Buttons */}
        <div className="bg-slate-950 p-1.5 rounded-2xl border border-slate-800 flex items-center space-x-1 relative z-10">
          <button
            onClick={() => setViewMode('mapa')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              viewMode === 'mapa'
                ? 'bg-orange-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Vista Mapa Campus</span>
          </button>
          <button
            onClick={() => setViewMode('catalogo')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              viewMode === 'catalogo'
                ? 'bg-orange-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
            <span>Vista Catálogo</span>
          </button>
        </div>
      </div>

      {/* Need Filters Category Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <span className="text-xs font-bold text-slate-700 block uppercase tracking-wider">
          ¿Qué tipo de recurso necesitas hoy?
        </span>
        <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'Todos' ? '🔍 Ver Todos' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* VISTA 1: MAPA DE CAMPUS INTERACTIVO */}
      {viewMode === 'mapa' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interactive Campus Map Canvas Container */}
          <div className="lg:col-span-2 bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-4 relative overflow-hidden min-h-[480px]">
            <div className="flex items-center justify-between z-10 relative">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Mapa Georreferenciado Campus UMSA (La Paz)</span>
              </span>
              <span className="text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-semibold">
                Haz clic en los marcadores 📍
              </span>
            </div>

            {/* Simulated Custom Stylized Map Graphic */}
            <div className="relative w-full h-[400px] bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-inner flex items-center justify-center">
              {/* Grid / Roads background graphic */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-50"></div>

              {/* Campus Zones Annotations */}
              <div className="absolute top-4 left-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-800 bg-slate-950/80 px-2 py-1 rounded">
                Zona Central / Monoblock
              </div>
              <div className="absolute top-4 right-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-800 bg-slate-950/80 px-2 py-1 rounded">
                Campus Cota Cota (Sur)
              </div>
              <div className="absolute bottom-4 left-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-800 bg-slate-950/80 px-2 py-1 rounded">
                Zona Cotahuma
              </div>

              {/* MAP PINS */}
              {filteredServices.map((service) => {
                const isSelected = selectedService?.id === service.id;
                return (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    style={{
                      left: `${service.coordenadasMapa.x}%`,
                      top: `${service.coordenadasMapa.y}%`,
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all z-20 cursor-pointer ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                    }`}
                  >
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`p-2 rounded-full border shadow-xl flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 border-white ring-4 ring-amber-500/30'
                            : 'bg-blue-600 text-white border-slate-300 hover:bg-amber-400 hover:text-slate-950'
                        }`}
                      >
                        <MapPin className="w-5 h-5" />
                      </div>
                      <span className="mt-1 bg-slate-950/90 text-white text-[10px] font-bold px-2 py-0.5 rounded border border-slate-700 shadow whitespace-nowrap max-w-[130px] truncate">
                        {service.nombre}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Service Details Side Panel */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
            {selectedService ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between pb-2 border-b border-slate-100">
                  <span className="bg-amber-100 text-amber-900 font-bold text-xs px-2.5 py-1 rounded-md">
                    {selectedService.categoria}
                  </span>
                  <span className="text-slate-400 text-xs font-semibold">{selectedService.campus}</span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 leading-snug">{selectedService.nombre}</h3>

                <p className="text-xs text-slate-600 leading-relaxed">{selectedService.descripcion}</p>

                <div className="space-y-2 text-xs pt-2">
                  <div className="flex items-start space-x-2 text-slate-700">
                    <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-900">Ubicación:</strong> {selectedService.ubicacion}
                    </span>
                  </div>

                  <div className="flex items-start space-x-2 text-slate-700">
                    <Clock className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-900">Horarios:</strong> {selectedService.horario}
                    </span>
                  </div>

                  <div className="flex items-start space-x-2 text-slate-700">
                    <Phone className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-slate-900">Contacto:</strong> {selectedService.contacto}
                    </span>
                  </div>
                </div>

                {/* Steps to access */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center space-x-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>¿Cómo acceder a este servicio?</span>
                  </h4>
                  <ul className="text-xs text-slate-700 space-y-1 pl-1">
                    {selectedService.comoAcceder.map((step, idx) => (
                      <li key={idx} className="leading-snug">
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-12 text-center">
                Selecciona un punto en el mapa para ver la ficha informativa completa.
              </p>
            )}
          </div>
        </div>
      )}

      {/* VISTA 2: CATÁLOGO SEARCHABLE */}
      {viewMode === 'catalogo' && (
        <div className="space-y-6">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Buscar por nombre de servicio, palabra clave o campus..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-blue-50 text-blue-800 font-bold text-[11px] px-2.5 py-1 rounded-md border border-blue-100">
                      {service.categoria}
                    </span>
                    <span className="text-slate-400 text-xs font-medium">{service.campus}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base">{service.nombre}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {service.descripcion}
                  </p>

                  <div className="text-xs text-slate-500 space-y-1 pt-1">
                    <p>📍 {service.ubicacion}</p>
                    <p>🕐 {service.horario}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedService(service);
                      setViewMode('mapa');
                    }}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <span>Ver ubicación en mapa & requisitos</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
