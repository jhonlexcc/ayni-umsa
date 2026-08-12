import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Bell,
  CheckCircle2,
  Clock,
  Briefcase,
  GraduationCap,
  Baby,
  Trash2,
  Filter,
  Sparkles,
  AlertCircle,
  X,
} from 'lucide-react';
import { CalendarEvent, EventDomain } from '../types';

interface OrganizadorViewProps {
  calendarEvents: CalendarEvent[];
  setCalendarEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
}

export const OrganizadorView: React.FC<OrganizadorViewProps> = ({
  calendarEvents,
  setCalendarEvents,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'todos' | EventDomain>('todos');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Event Form State
  const [newTitulo, setNewTitulo] = useState('');
  const [newCategoria, setNewCategoria] = useState<EventDomain>('academico');
  const [newFecha, setNewFecha] = useState('2026-08-12');
  const [newHora, setNewHora] = useState('14:00');
  const [newRecordatorio, setNewRecordatorio] = useState('30 minutos antes');
  const [newNotas, setNewNotas] = useState('');
  const [newUrgente, setNewUrgente] = useState(false);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitulo) return;

    const newEvt: CalendarEvent = {
      id: `evt-${Date.now()}`,
      titulo: newTitulo,
      categoria: newCategoria,
      fecha: newFecha,
      hora: newHora,
      recordatorioHora: newRecordatorio,
      completada: false,
      notas: newNotas,
      urgente: newUrgente,
    };

    setCalendarEvents([newEvt, ...calendarEvents]);
    setShowAddModal(false);
    setNewTitulo('');
    setNewNotas('');
  };

  const handleToggleComplete = (id: string) => {
    setCalendarEvents(
      calendarEvents.map((evt) =>
        evt.id === id ? { ...evt, completada: !evt.completada } : evt
      )
    );
  };

  const handleDeleteEvent = (id: string) => {
    setCalendarEvents(calendarEvents.filter((evt) => evt.id !== id));
  };

  const filteredEvents = calendarEvents.filter((evt) => {
    if (selectedFilter === 'todos') return true;
    return evt.categoria === selectedFilter;
  });

  const urgentAlerts = calendarEvents.filter((e) => !e.completada && e.urgente);

  return (
    <div className="space-y-8 py-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center space-x-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-0.5 rounded-full text-xs font-bold uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gestión Integral de Tiempos</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Organizador Multidimensional</h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
            Visualiza y concilia tus 4 esferas de vida: ESTUDIO 🎓 + CUIDADO 👶 + TRABAJO 💼 + VIDA PERSONAL 🏡.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs px-5 py-3 rounded-2xl shadow-lg inline-flex items-center space-x-2 transition-all cursor-pointer relative z-10"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Actividad</span>
        </button>
      </div>

      {/* Urgent Reminders Alert Box */}
      {urgentAlerts.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-400/40 p-5 rounded-2xl space-y-3">
          <div className="flex items-center space-x-2 text-amber-800 font-bold text-sm">
            <Bell className="w-5 h-5 text-amber-600 animate-bounce" />
            <span>Recordatorios Importantes & Urgentes:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {urgentAlerts.map((evt) => (
              <div
                key={evt.id}
                className="bg-white p-3.5 rounded-xl border border-amber-300/70 shadow-sm flex items-start justify-between text-xs"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                    🔔 {evt.fecha} — {evt.hora}
                  </span>
                  <p className="font-bold text-slate-900 mt-1">{evt.titulo}</p>
                </div>
                <button
                  onClick={() => handleToggleComplete(evt.id)}
                  className="text-emerald-600 hover:text-emerald-800 p-1"
                  title="Marcar como cumplido"
                >
                  <CheckCircle2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
          <Filter className="w-4 h-4 text-blue-600" />
          <span>Filtrar por Ámbito:</span>
        </div>

        <div className="flex space-x-2 overflow-x-auto scrollbar-none text-xs">
          <button
            onClick={() => setSelectedFilter('todos')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              selectedFilter === 'todos'
                ? 'bg-slate-900 text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos los Compromisos ({calendarEvents.length})
          </button>

          <button
            onClick={() => setSelectedFilter('academico')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              selectedFilter === 'academico'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
            }`}
          >
            🎓 Académico ({calendarEvents.filter((e) => e.categoria === 'academico').length})
          </button>

          <button
            onClick={() => setSelectedFilter('cuidado')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              selectedFilter === 'cuidado'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            👶 Cuidado Infantil/Familiar ({calendarEvents.filter((e) => e.categoria === 'cuidado').length})
          </button>

          <button
            onClick={() => setSelectedFilter('personal')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              selectedFilter === 'personal'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            💼 Trabajo / Personal ({calendarEvents.filter((e) => e.categoria === 'personal').length})
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-lg">Cronograma de Responsabilidades</h3>

        {filteredEvents.length === 0 ? (
          <p className="text-xs text-slate-500 py-12 text-center">
            No tienes actividades registradas en esta categoría.
          </p>
        ) : (
          <div className="space-y-3">
            {filteredEvents.map((evt) => (
              <div
                key={evt.id}
                className={`p-4 rounded-2xl border transition-all flex flex-wrap items-center justify-between gap-4 ${
                  evt.completada
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : evt.categoria === 'academico'
                    ? 'bg-blue-50/40 border-blue-200 hover:bg-blue-50'
                    : evt.categoria === 'cuidado'
                    ? 'bg-emerald-50/40 border-emerald-200 hover:bg-emerald-50'
                    : 'bg-amber-50/40 border-amber-200 hover:bg-amber-50'
                }`}
              >
                <div className="flex items-start space-x-3 max-w-xl">
                  <button
                    onClick={() => handleToggleComplete(evt.id)}
                    className="mt-1 text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    <CheckCircle2
                      className={`w-5 h-5 ${evt.completada ? 'text-emerald-600 fill-emerald-100' : ''}`}
                    />
                  </button>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded ${
                          evt.categoria === 'academico'
                            ? 'bg-blue-100 text-blue-800'
                            : evt.categoria === 'cuidado'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {evt.categoria === 'academico'
                          ? '🎓 Académico'
                          : evt.categoria === 'cuidado'
                          ? '👶 Cuidado'
                          : '💼 Trabajo / Personal'}
                      </span>

                      {evt.urgente && (
                        <span className="bg-red-100 text-red-700 font-bold text-[10px] px-2 py-0.5 rounded">
                          ⚠️ Alta Prioridad
                        </span>
                      )}
                    </div>

                    <h4
                      className={`font-bold text-sm text-slate-900 ${
                        evt.completada ? 'line-through text-slate-500' : ''
                      }`}
                    >
                      {evt.titulo}
                    </h4>

                    {evt.notas && <p className="text-slate-600 text-xs">{evt.notas}</p>}
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-xs font-semibold text-slate-600">
                  <div className="flex items-center space-x-1.5 bg-white/80 px-3 py-1.5 rounded-xl border border-slate-200">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>
                      {evt.fecha} @ {evt.hora}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteEvent(evt.id)}
                    className="text-slate-400 hover:text-red-600 p-1"
                    title="Eliminar actividad"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADD EVENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Agregar Actividad al OrganizaDOR</h3>
              <p className="text-xs text-slate-500">
                Sincroniza tus horarios de estudio, turnos de cuidado y compromisos personales.
              </p>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título de la actividad</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Recoger a mi hijo / Examen de Sociología"
                  value={newTitulo}
                  onChange={(e) => setNewTitulo(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ámbito</label>
                <select
                  value={newCategoria}
                  onChange={(e) => setNewCategoria(e.target.value as EventDomain)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="academico">🎓 Académico (Clases, Exámenes, Trabajos)</option>
                  <option value="cuidado">👶 Cuidado (Niños, Adultos Mayores, Citas)</option>
                  <option value="personal">💼 Trabajo / Personal / Trámites</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    required
                    value={newFecha}
                    onChange={(e) => setNewFecha(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hora</label>
                  <input
                    type="time"
                    required
                    value={newHora}
                    onChange={(e) => setNewHora(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notas / Detalles</label>
                <textarea
                  rows={2}
                  placeholder="Lugar, aula, recordatorio especial..."
                  value={newNotas}
                  onChange={(e) => setNewNotas(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="urgente-check"
                  checked={newUrgente}
                  onChange={(e) => setNewUrgente(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                />
                <label htmlFor="urgente-check" className="font-bold text-slate-800">
                  Marcar como Alta Prioridad / Urgente
                </label>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow"
                >
                  Guardar Actividad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
