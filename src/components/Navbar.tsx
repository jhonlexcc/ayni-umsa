import React from 'react';
import {
  Home,
  Users,
  MapPin,
  Bot,
  Calendar,
  MessageSquare,
  BookOpen,
  BarChart2,
  ShieldCheck,
  UserCheck,
  Globe,
  Bell,
  LogIn,
  KeyRound,
} from 'lucide-react';
import { Role } from '../types';
import { RegisteredUser } from '../lib/firebase';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  pendingRemindersCount: number;
  onOpenLogin: () => void;
  currentUser: RegisteredUser | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  activeRole,
  setActiveRole,
  pendingRemindersCount,
  onOpenLogin,
  currentUser,
}) => {
  const tabs = [
    { id: 'inicio', label: 'Dashboard', icon: Home, roles: ['visitante', 'estudiante', 'administrador'] },
    { id: 'mired', label: 'Mi Red', icon: Users, roles: ['estudiante', 'administrador'] },
    { id: 'servicios', label: 'Servicios', icon: MapPin, roles: ['visitante', 'estudiante', 'administrador'] },
    { id: 'chatbot', label: 'Ayni Bot', icon: Bot, roles: ['visitante', 'estudiante', 'administrador'] },
    { id: 'organizador', label: 'Organizador', icon: Calendar, roles: ['estudiante', 'administrador'] },
    { id: 'comunidad', label: 'Comunidad', icon: MessageSquare, roles: ['visitante', 'estudiante', 'administrador'] },
    { id: 'narrativas', label: 'Narrativas', icon: BookOpen, roles: ['visitante', 'estudiante', 'administrador'] },
    { id: 'observatorio', label: 'Observatorio', icon: BarChart2, roles: ['administrador'] },
  ];

  const visibleTabs = tabs.filter((t) => t.roles.includes(activeRole));

  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white border-b border-slate-800 shadow-xl">
      {/* Top Bar for Role Switcher and University Banner */}
      <div className="bg-slate-950 px-4 py-1.5 text-xs border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-orange-400 font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
          <span className="font-bold tracking-wide">UNIVERSIDAD MAYOR DE SAN ANDRÉS</span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-300">
            Red de Cuidado & Corresponsabilidad
          </span>
        </div>

        {/* Login Button with C.I. & Role Controls */}
        <div className="flex items-center space-x-3 ml-auto">
          <button
            onClick={onOpenLogin}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs px-3 py-1 rounded-xl flex items-center space-x-1.5 cursor-pointer shadow"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{currentUser ? `C.I.: ${currentUser.ci}` : 'Ingresar con C.I.'}</span>
          </button>

          <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-slate-800 space-x-1">
            <button
              id="role-btn-visitante"
              onClick={() => setActiveRole('visitante')}
              className={`flex items-center space-x-1 px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeRole === 'visitante'
                  ? 'bg-orange-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>Visitante</span>
            </button>
            <button
              id="role-btn-estudiante"
              onClick={() => setActiveRole('estudiante')}
              className={`flex items-center space-x-1 px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeRole === 'estudiante'
                  ? 'bg-orange-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <UserCheck className="w-3 h-3" />
              <span>Estudiante</span>
            </button>
            <button
              id="role-btn-administrador"
              onClick={() => setActiveRole('administrador')}
              className={`flex items-center space-x-1 px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeRole === 'administrador'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Bento Logo & Branding */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setCurrentTab('inicio')}
          >
            <div className="w-9 h-9 bg-orange-500 rounded-2xl flex items-center justify-center font-black text-slate-950 text-lg shadow-lg group-hover:scale-105 transition-transform border border-orange-400">
              A
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white">
                AYNI UMSA
              </span>
              <span className="text-orange-400 font-light text-xs sm:text-sm tracking-wider uppercase border-l border-slate-700 pl-2">
                RED DE CUIDADO
              </span>
            </div>
          </div>

          {/* Quick Notifications Indicator for Students */}
          {activeRole !== 'visitante' && (
            <div className="hidden lg:flex items-center space-x-3 bg-slate-800/90 px-3.5 py-1.5 rounded-2xl border border-slate-700/80">
              <Bell className="w-4 h-4 text-orange-400 animate-bounce" />
              <div className="text-xs">
                <span className="text-slate-300 font-medium">Recordatorios de Cuidado & Estudio:</span>{' '}
                <span className="bg-orange-500 text-slate-950 font-bold px-2 py-0.5 rounded-full text-[11px] shadow-sm">
                  {pendingRemindersCount}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Tab Navigation Menu (Bento Pills) */}
        <nav className="flex space-x-1.5 overflow-x-auto pb-2.5 pt-0.5 scrollbar-none">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-orange-500 text-slate-950 shadow-lg shadow-orange-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/90'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.id === 'observatorio' && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold uppercase ${
                    isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-indigo-500/30 text-indigo-300 border border-indigo-400/30'
                  }`}>
                    Data Excel
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
