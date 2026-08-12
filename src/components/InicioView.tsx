import React from 'react';
import {
  Users,
  Calendar,
  MapPin,
  AlertTriangle,
  ArrowRight,
  HeartHandshake,
  BookOpen,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
  GraduationCap,
  Clock,
  HelpCircle,
} from 'lucide-react';
import { CalendarEvent, NetworkMember, Role, StudentProfile, UmsaService } from '../types';

interface InicioViewProps {
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  setCurrentTab: (tab: string) => void;
  profile: StudentProfile;
  networkMembers: NetworkMember[];
  calendarEvents: CalendarEvent[];
  umsaServices: UmsaService[];
  onOpenSurvey: () => void;
  surveyCompleted: boolean;
}

export const InicioView: React.FC<InicioViewProps> = ({
  activeRole,
  setActiveRole,
  setCurrentTab,
  profile,
  networkMembers,
  calendarEvents,
  umsaServices,
  onOpenSurvey,
  surveyCompleted,
}) => {
  const isVisitor = activeRole === 'visitante';

  const pendingEvents = calendarEvents.filter((e) => !e.completada);
  const highlightedServices = umsaServices.filter((s) => s.destacado);

  if (isVisitor) {
    return (
      <div className="space-y-8 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Public Bento Hero Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 md:p-12 border border-slate-800 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center space-x-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sistema Web Oficial UMSA — La Paz, Bolivia</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Ayni UMSA: <br />
              <span className="text-orange-400 font-bold">
                Redes de Apoyo y Corresponsabilidad
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg font-normal leading-relaxed">
              Un sistema web participativo diseñado para fortalecer las redes de apoyo de estudiantes universitarios con responsabilidades de cuidado (hijas/os, adultos mayores o hermanos), facilitar el acceso a servicios institucionales de la UMSA y articular estudio, trabajo y vida familiar.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                id="btn-acceso-estudiante"
                onClick={() => {
                  setActiveRole('estudiante');
                  setCurrentTab('mired');
                }}
                className="inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-400 text-slate-950 font-black px-6 py-3.5 rounded-2xl shadow-xl transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>Acceder como Estudiante</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                id="btn-explorar-servicios"
                onClick={() => setCurrentTab('servicios')}
                className="inline-flex items-center space-x-2 bg-slate-800/90 hover:bg-slate-700 text-white font-bold px-6 py-3.5 rounded-2xl border border-slate-700 transition-all cursor-pointer"
              >
                <MapPin className="w-5 h-5 text-orange-400" />
                <span>Ver Servicios Públicos</span>
              </button>
            </div>
          </div>
        </section>

        {/* 3 Bento Pillars Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-sm hover:border-orange-300 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xl border border-orange-200">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">¿Qué es Ayni UMSA?</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Es un sistema web participativo derivado de la investigación institucional en la UMSA que busca mapear, visibilizar y articular las redes familiares, comunitarias e institucionales que sostienen a los estudiantes cuidadores.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-sm hover:border-orange-300 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xl border border-indigo-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">¿Para quién está dirigida?</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Para estudiantes matriculados en las distintas facultades de la UMSA que asumen el cuidado cotidiano de hijos/as pequeños, padres adultos mayores, hermanos menores o familiares con discapacidad.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-sm hover:border-orange-300 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xl border border-emerald-200">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">¿Qué problemas atiende?</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Combate la deserción escolar universitaria, la sobrecarga física/emocional, la falta de corresponsabilidad de género y la desinformación sobre becas, guarderías y derechos estipulados.
            </p>
          </div>
        </section>

        {/* Highlighted Public UMSA Services Bento Section */}
        <section className="bg-white p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-[11px] font-extrabold uppercase text-orange-600 tracking-wider">Directorio UMSA</div>
              <h2 className="text-2xl font-black text-slate-900">Servicios e Información Pública UMSA</h2>
              <p className="text-slate-500 text-xs sm:text-sm">Recursos institucionales abiertos para orientación y consulta rápida</p>
            </div>
            <button
              onClick={() => setCurrentTab('servicios')}
              className="bg-slate-900 hover:bg-slate-800 text-orange-400 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-800 transition-colors inline-flex items-center space-x-2 cursor-pointer"
            >
              <span>Ver catálogo completo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highlightedServices.map((service) => (
              <div key={service.id} className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-2 hover:bg-slate-100/80 transition-colors">
                <div className="flex items-start justify-between">
                  <span className="bg-orange-100 text-orange-800 font-extrabold text-[11px] px-2.5 py-1 rounded-lg border border-orange-200">
                    {service.categoria}
                  </span>
                  <span className="text-slate-400 text-xs font-mono">{service.campus}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-base">{service.nombre}</h4>
                <p className="text-xs text-slate-600 line-clamp-2">{service.descripcion}</p>
                <p className="text-xs text-slate-500 font-medium pt-1">📍 {service.ubicacion}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // Bento Dashboard view for Logged In Students / Admins
  return (
    <div className="space-y-6 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Bento Student Welcome Header Card */}
      <section className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="flex items-center space-x-2">
            <span className="bg-orange-500/20 text-orange-400 text-xs px-3 py-1 rounded-full font-bold border border-orange-500/30">
              {profile.carrera} — {profile.semestre}
            </span>
            <span className="text-slate-400 text-xs font-mono">{profile.facultad}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">¡Hola, {profile.nombre}! 👋</h1>
          <p className="text-slate-300 text-sm">
            Resumen personal de tu red de apoyo, actividades académicas y responsabilidades de cuidado.
          </p>
        </div>

        {/* Survey Invitation Card if not completed */}
        {!surveyCompleted ? (
          <div className="bg-slate-950/80 border border-orange-500/30 p-5 rounded-2xl max-w-xs space-y-2.5 relative z-10 shadow-lg">
            <div className="flex items-center space-x-2 text-orange-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Encuesta Ayni UMSA</span>
            </div>
            <p className="text-slate-300 text-xs">
              Alimenta el diagnóstico institucional de corresponsabilidad en la UMSA.
            </p>
            <button
              onClick={onOpenSurvey}
              className="w-full bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs py-2.5 rounded-xl transition-all cursor-pointer shadow-md"
            >
              Completar Encuesta Ayni
            </button>
          </div>
        ) : (
          <div className="bg-emerald-500/10 border border-emerald-500/30 px-5 py-3.5 rounded-2xl flex items-center space-x-3 text-xs text-emerald-300 relative z-10">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <div>
              <p className="font-bold text-white">Encuesta Completada</p>
              <p className="text-slate-300 text-[11px]">Gracias por aportar a la investigación UMSA.</p>
            </div>
          </div>
        )}
      </section>

      {/* Grid of Bento Dashboard Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Widget 1: 👥 Mi Red summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-orange-100 text-orange-600 font-bold border border-orange-200">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">👥 Mi Red de Apoyo</h3>
              </div>
              <button
                onClick={() => setCurrentTab('mired')}
                className="text-xs text-orange-600 font-bold hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <span>Cartografía</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 pt-3">
              <div className="bg-slate-50 p-3 rounded-2xl flex items-center justify-between border border-slate-200/60">
                <span className="text-xs font-bold text-slate-700">Integrantes en mi red:</span>
                <span className="text-sm font-black text-orange-600">{networkMembers.length} actores</span>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Principales apoyos activos:</p>
                {networkMembers.slice(0, 3).map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-xl border border-slate-200/70 bg-slate-50/50 hover:bg-slate-100/80 flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{m.nombre}</p>
                      <p className="text-slate-500 text-[11px]">
                        {m.relacion} • {m.tipoApoyo}
                      </p>
                    </div>
                    <span className="bg-orange-100 text-orange-800 text-[10px] px-2.5 py-0.5 rounded-full font-extrabold border border-orange-200">
                      {m.frecuencia}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Widget 2: 📅 Mis Actividades Bento Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 font-bold border border-indigo-200">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base">📅 Mis Actividades</h3>
              </div>
              <button
                onClick={() => setCurrentTab('organizador')}
                className="text-xs text-indigo-600 font-bold hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <span>Organizador</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5 pt-3">
              {pendingEvents.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">No tienes actividades pendientes hoy.</p>
              ) : (
                pendingEvents.slice(0, 3).map((evt) => (
                  <div
                    key={evt.id}
                    className={`p-3.5 rounded-2xl text-xs space-y-1.5 border-l-4 shadow-xs ${
                      evt.categoria === 'academico'
                        ? 'border-l-indigo-600 bg-indigo-50/60 text-indigo-950 border-y border-r border-slate-200/60'
                        : evt.categoria === 'cuidado'
                        ? 'border-l-emerald-600 bg-emerald-50/60 text-emerald-950 border-y border-r border-slate-200/60'
                        : 'border-l-orange-500 bg-orange-50/60 text-orange-950 border-y border-r border-slate-200/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          evt.categoria === 'academico'
                            ? 'bg-indigo-200/80 text-indigo-900'
                            : evt.categoria === 'cuidado'
                            ? 'bg-emerald-200/80 text-emerald-900'
                            : 'bg-orange-200/80 text-orange-900'
                        }`}
                      >
                        {evt.categoria === 'academico'
                          ? '🎓 Académico'
                          : evt.categoria === 'cuidado'
                          ? '👶 Cuidado'
                          : '💼 Personal'}
                      </span>
                      <span className="text-slate-600 text-[11px] font-mono flex items-center space-x-1">
                        <Clock className="w-3 h-3 inline" />
                        <span>{evt.fecha} {evt.hora}</span>
                      </span>
                    </div>
                    <p className="font-bold text-slate-900">{evt.titulo}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Widget 3: ⚠️ Necesidades Pendientes Bento Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-100">
              <div className="p-2 rounded-xl bg-orange-100 text-orange-600 font-bold border border-orange-200">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">⚠️ Necesidades Pendientes</h3>
            </div>

            <div className="space-y-3 pt-3">
              <p className="text-xs text-slate-600 font-medium">
                Necesidades de apoyo prioritarias registradas para conciliar estudios y cuidado:
              </p>
              <div className="space-y-2">
                {profile.necesidadesPrioritarias.map((nec, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-800"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 mt-1 flex-shrink-0"></span>
                    <span>{nec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('chatbot')}
            className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-orange-400 font-bold text-xs py-3 px-4 rounded-2xl flex items-center justify-center space-x-2 transition-colors cursor-pointer border border-slate-800 shadow-md"
          >
            <span>Consultar servicios con Ayni Bot</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Relevant UMSA Campus Services Bento Bar */}
      <section className="bg-white p-7 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <MapPin className="w-5 h-5 text-orange-500" />
            <h3 className="font-extrabold text-slate-900 text-lg">📍 Servicios UMSA Relevantes</h3>
          </div>
          <button
            onClick={() => setCurrentTab('servicios')}
            className="text-xs text-orange-600 font-bold hover:underline cursor-pointer"
          >
            Explorar mapa completo →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {highlightedServices.map((service) => (
            <div key={service.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 hover:bg-slate-100/70 transition-colors">
              <span className="text-[10px] uppercase font-black text-orange-800 bg-orange-100 px-2.5 py-0.5 rounded-md border border-orange-200">
                {service.categoria}
              </span>
              <h4 className="font-bold text-slate-900 text-sm">{service.nombre}</h4>
              <p className="text-xs text-slate-600 line-clamp-2">{service.descripcion}</p>
              <p className="text-[11px] text-slate-500 pt-1 font-medium">📍 {service.ubicacion}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

