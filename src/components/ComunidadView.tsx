import React, { useState } from 'react';
import {
  MessageSquare,
  Video,
  Mic,
  FileText,
  Image as ImageIcon,
  Heart,
  Plus,
  ShieldCheck,
  Check,
  X,
  Sparkles,
  Play,
  Volume2,
} from 'lucide-react';
import { CommunityPost, MediaType, Role } from '../types';

interface ComunidadViewProps {
  activeRole: Role;
  communityPosts: CommunityPost[];
  setCommunityPosts: React.Dispatch<React.SetStateAction<CommunityPost[]>>;
}

export const ComunidadView: React.FC<ComunidadViewProps> = ({
  activeRole,
  communityPosts,
  setCommunityPosts,
}) => {
  const [selectedMediaType, setSelectedMediaType] = useState<'todos' | MediaType>('todos');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Post Form State
  const [newTitulo, setNewTitulo] = useState('');
  const [newMedio, setNewMedio] = useState<MediaType>('texto');
  const [newContenido, setNewContenido] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newEtiquetas, setNewEtiquetas] = useState('');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitulo || !newContenido) return;

    // Students post as 'pendiente' moderation, Admin as 'publicado'
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      autorNombre: 'Estudiante UMSA',
      autorCarrera: 'Sociología',
      tipoMedio: newMedio,
      titulo: newTitulo,
      contenido: newContenido,
      mediaUrl:
        newMediaUrl ||
        (newMedio === 'fotografia'
          ? 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80'
          : undefined),
      fecha: new Date().toISOString().split('T')[0],
      estado: activeRole === 'administrador' ? 'publicado' : 'pendiente',
      meGusta: 1,
      etiquetas: newEtiquetas
        ? newEtiquetas.split(',').map((t) => t.trim())
        : ['Cuidado', 'UMSA'],
    };

    setCommunityPosts([newPost, ...communityPosts]);
    setShowAddModal(false);
    setNewTitulo('');
    setNewContenido('');
    setNewMediaUrl('');
  };

  const handleModeratePost = (id: string, newEstado: 'publicado' | 'rechazado') => {
    setCommunityPosts(
      communityPosts.map((p) => (p.id === id ? { ...p, estado: newEstado } : p))
    );
  };

  const handleLikePost = (id: string) => {
    setCommunityPosts(
      communityPosts.map((p) => (p.id === id ? { ...p, meGusta: p.meGusta + 1 } : p))
    );
  };

  const filteredPosts = communityPosts.filter((p) => {
    // If visitor or student, show only 'publicado' posts (plus their own pending if student)
    if (activeRole !== 'administrador' && p.estado !== 'publicado') {
      return false;
    }
    if (selectedMediaType === 'todos') return true;
    return p.tipoMedio === selectedMediaType;
  });

  const pendingCount = communityPosts.filter((p) => p.estado === 'pendiente').length;

  return (
    <div className="space-y-8 py-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center space-x-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-0.5 rounded-full text-xs font-bold uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Biblioteca de Experiencias y Testimonios</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Comunidad Ayni UMSA</h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
            Espacio participativo donde los estudiantes comparten historias, estrategias, audios, videos y fotografías sobre conciliar el estudio y el cuidado.
          </p>
        </div>

        {activeRole !== 'visitante' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs px-5 py-3 rounded-2xl shadow-lg inline-flex items-center space-x-2 transition-all cursor-pointer relative z-10"
          >
            <Plus className="w-4 h-4" />
            <span>Publicar Experiencia</span>
          </button>
        )}
      </div>

      {/* Admin Moderation Alert Banner */}
      {activeRole === 'administrador' && pendingCount > 0 && (
        <div className="bg-purple-500/10 border border-purple-400/40 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3 text-xs">
            <ShieldCheck className="w-5 h-5 text-purple-600" />
            <div>
              <span className="font-bold text-slate-900">Moderación de Publicaciones Pendientes</span>
              <p className="text-slate-600 text-[11px]">
                Hay {pendingCount} experiencias enviadas por estudiantes esperando revisión antes de publicarse en la biblioteca.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter by Media Type */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Formato de Publicaciones:
        </span>

        <div className="flex space-x-2 overflow-x-auto scrollbar-none text-xs">
          <button
            onClick={() => setSelectedMediaType('todos')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              selectedMediaType === 'todos'
                ? 'bg-slate-900 text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos los formatos
          </button>

          <button
            onClick={() => setSelectedMediaType('texto')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              selectedMediaType === 'texto'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            📝 Texto
          </button>

          <button
            onClick={() => setSelectedMediaType('audio')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              selectedMediaType === 'audio'
                ? 'bg-purple-600 text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🎙️ Audio Podcasting
          </button>

          <button
            onClick={() => setSelectedMediaType('video')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              selectedMediaType === 'video'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🎥 Video
          </button>

          <button
            onClick={() => setSelectedMediaType('fotografia')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              selectedMediaType === 'fotografia'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            📷 Fotografía
          </button>
        </div>
      </div>

      {/* Posts Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className={`bg-white p-6 rounded-3xl border shadow-sm flex flex-col justify-between space-y-4 relative ${
              post.estado === 'pendiente' ? 'border-purple-300 bg-purple-50/20' : 'border-slate-200'
            }`}
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                    {post.autorNombre.charAt(0)}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{post.autorNombre}</h4>
                    <p className="text-[10px] text-slate-500">{post.autorCarrera} • {post.fecha}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase">
                    {post.tipoMedio === 'texto'
                      ? '📝 Texto'
                      : post.tipoMedio === 'audio'
                      ? '🎙️ Audio'
                      : post.tipoMedio === 'video'
                      ? '🎥 Video'
                      : '📷 Fotografía'}
                  </span>

                  {post.estado === 'pendiente' && (
                    <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      ⏳ En Moderación
                    </span>
                  )}
                </div>
              </div>

              <h3 className="font-bold text-slate-900 text-base leading-snug">{post.titulo}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{post.contenido}</p>

              {/* Media Previews */}
              {post.tipoMedio === 'video' && post.mediaUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 bg-black aspect-video relative flex items-center justify-center">
                  <video src={post.mediaUrl} controls className="w-full h-full object-cover" />
                </div>
              )}

              {post.tipoMedio === 'audio' && post.mediaUrl && (
                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 flex items-center space-x-3 text-xs text-purple-900">
                  <Volume2 className="w-5 h-5 text-purple-700" />
                  <audio src={post.mediaUrl} controls className="w-full h-8" />
                </div>
              )}

              {post.tipoMedio === 'fotografia' && post.mediaUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 aspect-video">
                  <img
                    src={post.mediaUrl}
                    alt={post.titulo}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {post.etiquetas.map((tag, idx) => (
                  <span key={idx} className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => handleLikePost(post.id)}
                className="flex items-center space-x-1.5 text-slate-600 hover:text-red-600 font-bold transition-colors cursor-pointer"
              >
                <Heart className="w-4 h-4 text-red-500 fill-red-100" />
                <span>{post.meGusta} Apoyos</span>
              </button>

              {/* Admin Moderation Buttons */}
              {activeRole === 'administrador' && post.estado === 'pendiente' && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleModeratePost(post.id, 'publicado')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Aprobar</span>
                  </button>
                  <button
                    onClick={() => handleModeratePost(post.id, 'rechazado')}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Rechazar</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CREATE POST MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">Compartir Experiencia o Testimonio</h3>
              <p className="text-xs text-slate-500">
                Tu publicación pasará por un proceso breve de revisión por el equipo de moderación UMSA.
              </p>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Título de tu experiencia</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Cómo organizo los exámenes con el cuidado de mi hijo"
                  value={newTitulo}
                  onChange={(e) => setNewTitulo(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Formato</label>
                  <select
                    value={newMedio}
                    onChange={(e) => setNewMedio(e.target.value as MediaType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    <option value="texto">📝 Texto escrito</option>
                    <option value="audio">🎙️ Audio / Podcast</option>
                    <option value="video">🎥 Video</option>
                    <option value="fotografia">📷 Fotografía</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Enlace Multimedia (Opcional)</label>
                  <input
                    type="url"
                    placeholder="URL de audio, video o foto..."
                    value={newMediaUrl}
                    onChange={(e) => setNewMediaUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Contenido / Testimonio</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Relata tu experiencia, consejos o vivencias..."
                  value={newContenido}
                  onChange={(e) => setNewContenido(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Etiquetas (separadas por comas)</label>
                <input
                  type="text"
                  placeholder="Ej: CuidadoInfantil, Examenes, Sociologia"
                  value={newEtiquetas}
                  onChange={(e) => setNewEtiquetas(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                />
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
                  Enviar para Moderación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
