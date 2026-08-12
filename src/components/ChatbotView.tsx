import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  Plus,
  ShieldCheck,
  User,
  Info,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { KnowledgeItem, Role } from '../types';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  source?: string;
  timestamp: string;
}

interface ChatbotViewProps {
  activeRole: Role;
  knowledgeBase: KnowledgeItem[];
  setKnowledgeBase: React.Dispatch<React.SetStateAction<KnowledgeItem[]>>;
}

export const ChatbotView: React.FC<ChatbotViewProps> = ({
  activeRole,
  knowledgeBase,
  setKnowledgeBase,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: '¡Hola! Soy Ayni Bot, la guía de orientación universitaria para estudiantes con responsabilidades de cuidado en la UMSA. ¿En qué puedo orientarte hoy?',
      source: 'Base de Conocimientos Oficial UMSA',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Admin Knowledge Base Add Form State
  const [showAddKbModal, setShowAddKbModal] = useState(false);
  const [newPregunta, setNewPregunta] = useState('');
  const [newRespuesta, setNewRespuesta] = useState('');
  const [newCategoria, setNewCategoria] = useState('Servicios e Infraestructura');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setLoading(true);

    try {
      // Build conversation history for API call
      const history = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, conversationHistory: history }),
      });

      const data = await res.json();

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'No pude encontrar información para tu consulta.',
        source: data.source || 'Base de Conocimientos UMSA',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Error contacting chatbot:', err);
      // Fallback local match
      const matched = knowledgeBase.find((k) =>
        text.toLowerCase().includes(k.pregunta.toLowerCase().slice(0, 10))
      );
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: matched
          ? `[Base de Conocimiento UMSA]: ${matched.respuesta}`
          : 'El Centro Infantil Andresito se encuentra en el Monoblock Central de la UMSA. Atiende de Lunes a Viernes de 07:30 a 17:00.',
        source: 'Base de Conocimientos UMSA (Modo local)',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddKb = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPregunta || !newRespuesta) return;

    const newItem: KnowledgeItem = {
      id: `kb-${Date.now()}`,
      pregunta: newPregunta,
      respuesta: newRespuesta,
      categoria: newCategoria,
      etiquetas: ['UMSA', 'Administrador'],
    };

    setKnowledgeBase([newItem, ...knowledgeBase]);
    setShowAddKbModal(false);
    setNewPregunta('');
    setNewRespuesta('');

    // Also sync with server endpoint if running
    fetch('/api/knowledge-base', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    }).catch((e) => console.log('Synced KB locally', e));
  };

  const samplePrompts = [
    '¿Dónde está el Centro Infantil Andresito?',
    'Necesito información sobre becas UMSA',
    '¿Qué hago si un docente no me da permiso por cuidar a mi hijo?',
    '¿Dónde ofrecen atención de salud mental gratuita?',
  ];

  return (
    <div className="space-y-6 py-6">
      {/* Title Header */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center space-x-2 bg-orange-500/20 text-orange-400 border border-orange-500/30 px-3 py-0.5 rounded-full text-xs font-bold uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Asistente Inteligente Institucional</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Ayni Bot — Orientador Universitario</h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
            Consulta información institucional verificado sobre centros infantiles, becas, defensoría, horarios y trámites de conciliación.
          </p>
        </div>

        {activeRole === 'administrador' && (
          <button
            onClick={() => setShowAddKbModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-4 py-2.5 rounded-2xl shadow inline-flex items-center space-x-2 transition-all cursor-pointer relative z-10"
          >
            <Plus className="w-4 h-4" />
            <span>Administrar Base de Conocimiento</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chat Interface */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[580px] overflow-hidden">
          {/* Chat Header */}
          <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-orange-500 text-slate-950 flex items-center justify-center font-black">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Ayni Bot UMSA</h3>
                <p className="text-[10px] text-emerald-400 font-medium">Alimentado con la Base Oficial UMSA</p>
              </div>
            </div>
            <span className="text-[11px] text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full font-mono">
              Gemini 2.5 Flash
            </span>
          </div>

          {/* Quick Prompts Bar */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex space-x-2 overflow-x-auto scrollbar-none text-xs">
            {samplePrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 hover:border-amber-300 font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap transition-all flex-shrink-0 cursor-pointer"
              >
                💡 {prompt}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm space-y-1 ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between space-x-4 pb-1">
                    <span className="font-bold text-[10px] opacity-75 uppercase">
                      {msg.sender === 'user' ? 'Tú (Estudiante)' : 'Ayni Bot UMSA'}
                    </span>
                    <span className="text-[10px] opacity-60">{msg.timestamp}</span>
                  </div>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>

                  {msg.source && (
                    <div className="pt-2 border-t border-slate-100 text-[10px] text-amber-700 font-medium flex items-center space-x-1">
                      <BookOpen className="w-3 h-3 text-amber-600" />
                      <span>Fuente: {msg.source}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-2 text-slate-500 text-xs bg-white p-3 rounded-2xl border border-slate-200 w-fit">
                <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                <span>Consultando Base de Conocimiento UMSA...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-4 bg-white border-t border-slate-200 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Escribe tu consulta sobre becas, centros infantiles, la defensoría..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 px-4 py-2.5 bg-slate-100 rounded-2xl text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={loading || !inputMessage.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-3 rounded-2xl shadow transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Knowledge Base Sidebar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
              <BookOpen className="w-4 h-4 text-amber-600" />
              <span>Base de Conocimientos ({knowledgeBase.length})</span>
            </h3>
            <span className="text-[10px] text-slate-400">Verificada</span>
          </div>

          <p className="text-xs text-slate-500">
            Estas son las preguntas frecuentes administradas oficialmente que Ayni Bot utiliza para responder a los estudiantes.
          </p>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {knowledgeBase.map((kb) => (
              <div
                key={kb.id}
                className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-1.5 text-xs hover:border-amber-300 transition-colors"
              >
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded">
                  {kb.categoria}
                </span>
                <p className="font-bold text-slate-900">{kb.pregunta}</p>
                <p className="text-slate-600 text-[11px] line-clamp-3">{kb.respuesta}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ADMIN ADD KB MODAL */}
      {showAddKbModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                Agregar Información a la Base de Conocimiento
              </h3>
              <p className="text-xs text-slate-500">
                Como Administrador, puedes actualizar las respuestas de Ayni Bot sin modificar el código fuente.
              </p>
            </div>

            <form onSubmit={handleAddKb} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Categoría</label>
                <select
                  value={newCategoria}
                  onChange={(e) => setNewCategoria(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="Servicios e Infraestructura">Servicios e Infraestructura</option>
                  <option value="Becas y Apoyo Económico">Becas y Apoyo Económico</option>
                  <option value="Normativa e Inclusión">Normativa e Inclusión</option>
                  <option value="Bienestar y Salud">Bienestar y Salud</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pregunta Frecuente</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: ¿Dónde puedo solicitar permiso por examen médico de mi familiar?"
                  value={newPregunta}
                  onChange={(e) => setNewPregunta(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Respuesta Oficial UMSA</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Escribe la respuesta oficial detallada..."
                  value={newRespuesta}
                  onChange={(e) => setNewRespuesta(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddKbModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 font-bold hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow"
                >
                  Guardar en Base de Conocimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
