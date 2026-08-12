import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Network,
  ClipboardList,
  Trash2,
  Heart,
  CheckCircle2,
  X,
  Sparkles,
  GraduationCap,
  Clock,
  ShieldAlert,
  Layers,
  Filter,
  Activity,
  Award,
  Zap,
} from 'lucide-react';
import {
  Frequency,
  NetworkMember,
  StudentProfile,
  SupportRelation,
  SupportType,
} from '../types';
import { saveNetworkMembersToFirestore } from '../lib/firebase';

interface MiRedCartografiaViewProps {
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  networkMembers: NetworkMember[];
  setNetworkMembers: React.Dispatch<React.SetStateAction<NetworkMember[]>>;
  onOpenSurvey: () => void;
  surveyCompleted: boolean;
}

export const MiRedCartografiaView: React.FC<MiRedCartografiaViewProps> = ({
  profile,
  setProfile,
  networkMembers,
  setNetworkMembers,
  onOpenSurvey,
  surveyCompleted,
}) => {
  const [activeTab, setActiveTab] = useState<'cartografia' | 'lista' | 'perfil'>('cartografia');
  const [selectedNode, setSelectedNode] = useState<NetworkMember | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('Todos');

  // Form state for adding new network actor
  const [newNombre, setNewNombre] = useState('');
  const [newRelacion, setNewRelacion] = useState<SupportRelation>('Madre/Padre');
  const [newTipoApoyo, setNewTipoApoyo] = useState<SupportType>('Cuidado infantil');
  const [newFrecuencia, setNewFrecuencia] = useState<Frequency>('Frecuente');
  const [newDisponibilidad, setNewDisponibilidad] = useState('');
  const [newNotas, setNewNotas] = useState('');

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNombre) return;

    let categoriaNodo: 'Familia' | 'Amigos' | 'Instituciones' | 'Comunidad' = 'Familia';
    if (['Amigos', 'Compañeros'].includes(newRelacion)) categoriaNodo = 'Amigos';
    else if (['Instituciones'].includes(newRelacion)) categoriaNodo = 'Instituciones';
    else if (['Vecinos', 'Otros'].includes(newRelacion)) categoriaNodo = 'Comunidad';

    const newMember: NetworkMember = {
      id: `net-${Date.now()}`,
      nombre: newNombre,
      relacion: newRelacion,
      tipoApoyo: newTipoApoyo,
      frecuencia: newFrecuencia,
      disponibilidad: newDisponibilidad || 'Según necesidad',
      notas: newNotas,
      categoriaNodo,
    };

    const updated = [...networkMembers, newMember];
    setNetworkMembers(updated);
    if (profile.ci) {
      saveNetworkMembersToFirestore(profile.ci, updated);
    }

    setShowAddModal(false);
    setNewNombre('');
    setNewDisponibilidad('');
    setNewNotas('');
  };

  const handleDeleteMember = (id: string) => {
    const updated = networkMembers.filter((m) => m.id !== id);
    setNetworkMembers(updated);
    if (profile.ci) {
      saveNetworkMembersToFirestore(profile.ci, updated);
    }
    if (selectedNode?.id === id) setSelectedNode(null);
  };

  // Group members by category
  const filteredMembers =
    filterCategory === 'Todos'
      ? networkMembers
      : networkMembers.filter((m) => m.categoriaNodo === filterCategory);

  const familiaNodes = networkMembers.filter((m) => m.categoriaNodo === 'Familia');
  const amigosNodes = networkMembers.filter((m) => m.categoriaNodo === 'Amigos');
  const institucionesNodes = networkMembers.filter((m) => m.categoriaNodo === 'Instituciones');
  const comunidadNodes = networkMembers.filter((m) => m.categoriaNodo === 'Comunidad');

  // Calculate Care Burden Index & Cohesion
  const careBurdenIndex = Math.min(
    100,
    Math.round((profile.horasSemanalesCuidado / 40) * 100)
  );
  const networkCohesion = Math.min(100, networkMembers.length * 20);

  return (
    <div className="space-y-8 py-6">
      {/* Module Banner with UMSA Colors & Modern Gradient Glow */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-indigo-900/60 shadow-2xl flex flex-wrap items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-400 border border-orange-500/40 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Investigación Social UMSA — Cartografía Estudiantil</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Mi Red de Corresponsabilidad y Cartografía Social
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
            Mapeo interactivo de actores familiares, universitarios y comunitarios que sostienen la conciliación entre las labores de cuidado no remunerado y el avance académico en la UMSA.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs px-5 py-3 rounded-2xl shadow-xl hover:shadow-orange-500/20 inline-flex items-center space-x-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Registrar Nuevo Apoyo</span>
          </button>

          <button
            onClick={onOpenSurvey}
            className="bg-slate-800/90 hover:bg-slate-700 text-white border border-slate-700 text-xs px-4 py-3 rounded-2xl inline-flex items-center space-x-2 cursor-pointer font-extrabold shadow"
          >
            <ClipboardList className="w-4 h-4 text-orange-400" />
            <span>{surveyCompleted ? 'Encuesta Completada' : 'Responder Encuesta'}</span>
          </button>
        </div>
      </div>

      {/* Metric Quick Indicator Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-blue-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-2xl">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-blue-800 tracking-wider block">
              Integrantes Activos
            </span>
            <span className="text-2xl font-black text-slate-900">{networkMembers.length} nodos</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-amber-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-amber-800 tracking-wider block">
              Carga Semanal Cuidado
            </span>
            <span className="text-2xl font-black text-slate-900">{profile.horasSemanalesCuidado} hrs/sem</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-emerald-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-2xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider block">
              Cohesión de Red
            </span>
            <span className="text-2xl font-black text-emerald-700">{networkCohesion}% Alta</span>
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-3xl border border-purple-200 shadow-sm flex items-center space-x-3.5">
          <div className="p-3 bg-purple-100 text-purple-700 rounded-2xl">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase text-purple-800 tracking-wider block">
              Soporte Institucional
            </span>
            <span className="text-2xl font-black text-purple-900">
              {institucionesNodes.length > 0 ? 'Conectado UMSA' : 'En vinculación'}
            </span>
          </div>
        </div>
      </div>

      {/* Bento Tab Controls */}
      <div className="flex bg-slate-200/90 p-1.5 rounded-2xl max-w-lg shadow-inner">
        <button
          onClick={() => setActiveTab('cartografia')}
          className={`flex-1 py-2.5 px-4 text-xs font-black rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'cartografia'
              ? 'bg-slate-900 text-orange-400 shadow-md scale-[1.02]'
              : 'text-slate-700 hover:text-slate-950 font-bold'
          }`}
        >
          <Network className="w-4 h-4" />
          <span>Mapa de Nodos</span>
        </button>

        <button
          onClick={() => setActiveTab('lista')}
          className={`flex-1 py-2.5 px-4 text-xs font-black rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'lista'
              ? 'bg-slate-900 text-orange-400 shadow-md scale-[1.02]'
              : 'text-slate-700 hover:text-slate-950 font-bold'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Directorio ({networkMembers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('perfil')}
          className={`flex-1 py-2.5 px-4 text-xs font-black rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer ${
            activeTab === 'perfil'
              ? 'bg-slate-900 text-orange-400 shadow-md scale-[1.02]'
              : 'text-slate-700 hover:text-slate-950 font-bold'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Perfil Cuidador</span>
        </button>
      </div>

      {/* TAB 1: CARTOGRAFÍA DIGITAL VISUAL */}
      {activeTab === 'cartografia' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Visualizador de Cartografía Social Estudiantil
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Matriz concéntrica de vinculación. Haz clic en un actor para inspeccionar sus atributos.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
                {['Todos', 'Familia', 'Amigos', 'Instituciones', 'Comunidad'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                      filterCategory === cat
                        ? 'bg-slate-900 text-orange-400 font-black shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Graph Canvas Wrapper */}
            <div className="relative min-h-[500px] bg-slate-950 rounded-3xl border border-slate-800 p-6 flex items-center justify-center overflow-hidden shadow-inner">
              {/* Concentric Orbital Rings Background */}
              <div className="absolute w-[420px] h-[420px] rounded-full border border-purple-500/20 animate-spin-slow pointer-events-none"></div>
              <div className="absolute w-[320px] h-[320px] rounded-full border border-emerald-500/20 pointer-events-none"></div>
              <div className="absolute w-[220px] h-[220px] rounded-full border border-amber-500/20 pointer-events-none"></div>
              <div className="absolute w-[120px] h-[120px] rounded-full border border-blue-500/30 pointer-events-none"></div>

              {/* CENTER NODE: ESTUDIANTE */}
              <div className="relative z-20 flex flex-col items-center">
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-orange-500 via-amber-400 to-yellow-300 p-1 shadow-2xl shadow-orange-500/40 animate-pulse">
                  <div className="w-full h-full bg-slate-900 rounded-full flex flex-col items-center justify-center text-center p-2">
                    <GraduationCap className="w-7 h-7 text-amber-400" />
                    <span className="text-[11px] font-black text-white leading-tight mt-0.5">ESTUDIANTE</span>
                    <span className="text-[10px] text-amber-300 font-bold truncate max-w-[80px]">
                      {profile.nombre.split(' ')[0]}
                    </span>
                  </div>
                </div>
                <span className="bg-slate-900/90 text-amber-400 text-[10px] px-3 py-0.5 rounded-full border border-amber-500/50 font-black mt-2.5 shadow">
                  Centro de la Red UMSA
                </span>
              </div>

              {/* SATELLITE NODES */}
              {/* Cluster 1: Familia (Top-Left) */}
              {(filterCategory === 'Todos' || filterCategory === 'Familia') && (
                <div className="absolute top-6 left-6 sm:left-12 z-20 space-y-2.5">
                  <div className="bg-blue-900/90 text-blue-200 border border-blue-400/40 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider text-center shadow">
                    👪 Familia ({familiaNodes.length})
                  </div>
                  <div className="flex flex-col gap-2">
                    {familiaNodes.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedNode(m)}
                        className={`text-left p-3 rounded-2xl border text-xs transition-all cursor-pointer ${
                          selectedNode?.id === m.id
                            ? 'bg-blue-600 text-white border-white shadow-xl scale-105'
                            : 'bg-slate-900/90 text-slate-200 border-blue-500/40 hover:bg-slate-800 hover:border-blue-400'
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between space-x-2">
                          <span>{m.nombre}</span>
                          <span className="text-[10px] text-blue-300 font-normal">({m.relacion})</span>
                        </div>
                        <div className="text-[10px] text-blue-300 font-medium truncate">{m.tipoApoyo}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Cluster 2: Amigos & Pares (Top-Right) */}
              {(filterCategory === 'Todos' || filterCategory === 'Amigos') && (
                <div className="absolute top-6 right-6 sm:right-12 z-20 space-y-2.5">
                  <div className="bg-amber-900/90 text-amber-200 border border-amber-400/40 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider text-center shadow">
                    🤝 Amigos & Pares ({amigosNodes.length})
                  </div>
                  <div className="flex flex-col gap-2">
                    {amigosNodes.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedNode(m)}
                        className={`text-left p-3 rounded-2xl border text-xs transition-all cursor-pointer ${
                          selectedNode?.id === m.id
                            ? 'bg-amber-600 text-white border-white shadow-xl scale-105'
                            : 'bg-slate-900/90 text-slate-200 border-amber-500/40 hover:bg-slate-800 hover:border-amber-400'
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between space-x-2">
                          <span>{m.nombre}</span>
                          <span className="text-[10px] text-amber-300 font-normal">({m.relacion})</span>
                        </div>
                        <div className="text-[10px] text-amber-300 font-medium truncate">{m.tipoApoyo}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Cluster 3: Instituciones UMSA (Bottom-Left) */}
              {(filterCategory === 'Todos' || filterCategory === 'Instituciones') && (
                <div className="absolute bottom-6 left-6 sm:left-12 z-20 space-y-2.5">
                  <div className="bg-emerald-900/90 text-emerald-200 border border-emerald-400/40 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider text-center shadow">
                    🏛️ Instituciones UMSA ({institucionesNodes.length})
                  </div>
                  <div className="flex flex-col gap-2">
                    {institucionesNodes.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedNode(m)}
                        className={`text-left p-3 rounded-2xl border text-xs transition-all cursor-pointer ${
                          selectedNode?.id === m.id
                            ? 'bg-emerald-600 text-white border-white shadow-xl scale-105'
                            : 'bg-slate-900/90 text-slate-200 border-emerald-500/40 hover:bg-slate-800 hover:border-emerald-400'
                        }`}
                      >
                        <div className="font-bold">{m.nombre}</div>
                        <div className="text-[10px] text-emerald-300 font-medium truncate">{m.tipoApoyo}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Cluster 4: Comunidad (Bottom-Right) */}
              {(filterCategory === 'Todos' || filterCategory === 'Comunidad') && (
                <div className="absolute bottom-6 right-6 sm:right-12 z-20 space-y-2.5">
                  <div className="bg-purple-900/90 text-purple-200 border border-purple-400/40 px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider text-center shadow">
                    🏡 Comunidad ({comunidadNodes.length})
                  </div>
                  <div className="flex flex-col gap-2">
                    {comunidadNodes.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedNode(m)}
                        className={`text-left p-3 rounded-2xl border text-xs transition-all cursor-pointer ${
                          selectedNode?.id === m.id
                            ? 'bg-purple-600 text-white border-white shadow-xl scale-105'
                            : 'bg-slate-900/90 text-slate-200 border-purple-500/40 hover:bg-slate-800 hover:border-purple-400'
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between space-x-2">
                          <span>{m.nombre}</span>
                          <span className="text-[10px] text-purple-300 font-normal">({m.relacion})</span>
                        </div>
                        <div className="text-[10px] text-purple-300 font-medium truncate">{m.tipoApoyo}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Selected Node Details Card */}
            {selectedNode && (
              <div className="bg-slate-900 text-white p-6 rounded-3xl border border-orange-500/40 space-y-4 relative animate-in fade-in">
                <button
                  onClick={() => setSelectedNode(null)}
                  className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center space-x-2">
                  <span className="bg-orange-500 text-slate-950 text-xs px-3 py-0.5 rounded-full font-black uppercase">
                    {selectedNode.categoriaNodo}
                  </span>
                  <span className="text-amber-300 text-xs font-bold">• {selectedNode.relacion}</span>
                </div>

                <h4 className="text-xl font-black text-white">{selectedNode.nombre}</h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div>
                    <span className="text-slate-400 block font-bold mb-0.5">Tipo de apoyo:</span>
                    <span className="font-extrabold text-emerald-400">{selectedNode.tipoApoyo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold mb-0.5">Frecuencia:</span>
                    <span className="font-extrabold text-amber-400">{selectedNode.frecuencia}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold mb-0.5">Disponibilidad:</span>
                    <span className="font-extrabold text-slate-200">{selectedNode.disponibilidad}</span>
                  </div>
                </div>

                {selectedNode.notas && (
                  <p className="text-xs text-slate-300 italic pt-1">
                    "{selectedNode.notas}"
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DETALLE Y LISTA DE INTEGRANTES */}
      {activeTab === 'lista' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-5">
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <h3 className="font-black text-slate-900 text-lg">Directorio Completo de la Red</h3>
              <p className="text-xs text-slate-500">
                Lista clasificada de todos los actores que facilitan tus estudios.
              </p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="bg-slate-900 hover:bg-slate-800 text-orange-400 text-xs font-black px-4 py-2.5 rounded-2xl flex items-center space-x-2 cursor-pointer shadow"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Agregar Integrante</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMembers.map((m) => (
              <div
                key={m.id}
                className="p-5 rounded-3xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:shadow-md transition-all space-y-3 relative"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-orange-950 bg-orange-100 border border-orange-300 px-2.5 py-0.5 rounded-full">
                      {m.categoriaNodo}
                    </span>
                    <h4 className="font-black text-slate-900 text-base mt-2">{m.nombre}</h4>
                    <p className="text-xs text-slate-600 font-bold">{m.relacion}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteMember(m.id)}
                    className="text-slate-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                    title="Eliminar de mi red"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>

                <div className="text-xs space-y-1.5 pt-3 border-t border-slate-200">
                  <p className="text-slate-700">
                    <strong className="text-slate-900">Apoyo Principal:</strong> {m.tipoApoyo}
                  </p>
                  <p className="text-slate-700">
                    <strong className="text-slate-900">Frecuencia:</strong> {m.frecuencia}
                  </p>
                  <p className="text-slate-700">
                    <strong className="text-slate-900">Disponibilidad:</strong> {m.disponibilidad}
                  </p>
                  {m.notas && <p className="text-slate-500 italic text-[11px] pt-1">"{m.notas}"</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MI PERFIL DE CUIDADO */}
      {activeTab === 'perfil' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6">
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <h3 className="font-black text-slate-900 text-xl">Perfil del Estudiante Cuidador UMSA</h3>
              <p className="text-xs text-slate-500">
                Ficha sociodemográfica e indicadores de conciliación académico-familiar.
              </p>
            </div>

            <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs px-3.5 py-1.5 rounded-full font-black flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Estudiante Activo UMSA</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-black text-slate-900 text-sm flex items-center space-x-2 border-b pb-2">
                  <GraduationCap className="w-4 h-4 text-orange-600" />
                  <span>Datos Académicos</span>
                </h4>
                <div className="text-xs space-y-2 text-slate-700">
                  <p><strong>Nombre completo:</strong> {profile.nombre}</p>
                  <p><strong>C.I.:</strong> {profile.ci}</p>
                  <p><strong>Carrera UMSA:</strong> {profile.carrera}</p>
                  <p><strong>Facultad:</strong> {profile.facultad}</p>
                  <p><strong>Semestre / Año:</strong> {profile.semestre}</p>
                  <p><strong>Correo Institucional:</strong> {profile.email}</p>
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-orange-50/80 border border-orange-200 space-y-3">
                <h4 className="font-black text-orange-950 text-sm flex items-center space-x-2 border-b border-orange-200 pb-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span>Carga Semanal de Cuidado y Trabajo</span>
                </h4>
                <div className="text-xs space-y-2 text-slate-800">
                  <p><strong>Personas a cargo:</strong> {profile.personasACargoCount} personas</p>
                  <p><strong>Tipos de cuidado:</strong> {profile.tipoCuidado.join(', ')}</p>
                  <p><strong>Dedicación al cuidado:</strong> {profile.horasSemanalesCuidado} hrs/semana</p>
                  <p><strong>¿Trabaja actualmente?:</strong> {profile.trabaja ? `Sí (${profile.horasSemanalesTrabajo} hrs/semana)` : 'No'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Care burden visual meter */}
              <div className="p-5 rounded-3xl bg-slate-900 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-orange-400 uppercase tracking-wider">
                    Índice de Sobrecarga de Cuidado
                  </span>
                  <span className="text-xs font-black bg-orange-500/20 text-orange-300 px-2.5 py-0.5 rounded-full border border-orange-500/30">
                    {careBurdenIndex}%
                  </span>
                </div>

                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${careBurdenIndex}%` }}
                  ></div>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                  {careBurdenIndex > 50
                    ? 'Alto nivel de dedicación horaria. Se sugiere solicitar apoyo comunitario o tutorías adaptadas UMSA.'
                    : 'Nivel moderado de carga. Tu red actual responde adecuadamente a las demandas.'}
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-blue-50/80 border border-blue-200 space-y-3">
                <h4 className="font-black text-blue-950 text-sm flex items-center space-x-2 border-b border-blue-200 pb-2">
                  <Heart className="w-4 h-4 text-blue-700" />
                  <span>Necesidades de Apoyo Prioritarias</span>
                </h4>
                <ul className="text-xs space-y-2 text-slate-800 list-disc list-inside font-semibold">
                  {profile.necesidadesPrioritarias.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white space-y-3 border border-indigo-900/50">
                <div className="flex items-center space-x-2 text-amber-400 font-black text-xs">
                  <Sparkles className="w-4 h-4" />
                  <span>Encuesta Diagnóstica de Cuidados UMSA</span>
                </div>
                <p className="text-xs text-slate-300">
                  Tus respuestas fortalecen la creación de políticas de corresponsabilidad en Ciencias Sociales.
                </p>
                <button
                  onClick={onOpenSurvey}
                  className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs py-2.5 rounded-xl transition-all shadow cursor-pointer"
                >
                  {surveyCompleted ? 'Revisar o Re-enviar Encuesta' : 'Completar Encuesta Ahora'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD MEMBER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-2 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900">Agregar Integrante a mi Red</h3>
              <p className="text-xs text-slate-500 font-medium">
                Registra familiares, pareja, amigos, vecinos o servicios UMSA que te apoyan.
              </p>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Nombre de la persona o institución</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: María Quispe / Guardería UMSA"
                  value={newNombre}
                  onChange={(e) => setNewNombre(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Relación / Vínculo</label>
                  <select
                    value={newRelacion}
                    onChange={(e) => setNewRelacion(e.target.value as SupportRelation)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 font-semibold"
                  >
                    <option value="Madre/Padre">Madre/Padre</option>
                    <option value="Pareja">Pareja</option>
                    <option value="Hermanos">Hermanos</option>
                    <option value="Hijos">Hijos</option>
                    <option value="Abuelos">Abuelos</option>
                    <option value="Amigos">Amigos</option>
                    <option value="Vecinos">Vecinos</option>
                    <option value="Compañeros">Compañeros</option>
                    <option value="Instituciones">Instituciones</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Tipo de Apoyo Principal</label>
                  <select
                    value={newTipoApoyo}
                    onChange={(e) => setNewTipoApoyo(e.target.value as SupportType)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 font-semibold"
                  >
                    <option value="Cuidado infantil">Cuidado infantil</option>
                    <option value="Transporte y traslado">Transporte y traslado</option>
                    <option value="Apoyo económico">Apoyo económico</option>
                    <option value="Apoyo emocional">Apoyo emocional</option>
                    <option value="Estudio compartido">Estudio compartido</option>
                    <option value="Cuidado de adultos mayores">Cuidado de adultos mayores</option>
                    <option value="Tareas del hogar">Tareas del hogar</option>
                    <option value="Acompañamiento en salud">Acompañamiento en salud</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Frecuencia</label>
                  <select
                    value={newFrecuencia}
                    onChange={(e) => setNewFrecuencia(e.target.value as Frequency)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 font-semibold"
                  >
                    <option value="Diaria">Diaria</option>
                    <option value="Frecuente">Frecuente</option>
                    <option value="Ocasional">Ocasional</option>
                    <option value="En emergencias">En emergencias</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">Disponibilidad</label>
                  <input
                    type="text"
                    placeholder="Ej: Lunes a Viernes"
                    value={newDisponibilidad}
                    onChange={(e) => setNewDisponibilidad(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Notas adicionales</label>
                <input
                  type="text"
                  placeholder="Detalles sobre el acuerdo de cuidado..."
                  value={newNotas}
                  onChange={(e) => setNewNotas(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 font-semibold"
                />
              </div>

              <div className="flex space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 border border-slate-300 font-bold rounded-2xl hover:bg-slate-100 text-slate-700 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-orange-400 font-black rounded-2xl shadow cursor-pointer"
                >
                  Guardar Integrante
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
