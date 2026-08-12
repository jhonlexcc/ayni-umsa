import React, { useState, useEffect } from 'react';
import { Role, StudentProfile, NetworkMember, UmsaService, CalendarEvent, CommunityPost, KnowledgeItem, EducationalNarrative } from './types';
import { Navbar } from './components/Navbar';
import { InicioView } from './components/InicioView';
import { MiRedCartografiaView } from './components/MiRedCartografiaView';
import { ServiciosView } from './components/ServiciosView';
import { ChatbotView } from './components/ChatbotView';
import { OrganizadorView } from './components/OrganizadorView';
import { ComunidadView } from './components/ComunidadView';
import { NarrativasAprendizajeView } from './components/NarrativasAprendizajeView';
import { ObservatorioView } from './components/ObservatorioView';
import { EncuestaModal } from './components/EncuestaModal';
import { LoginModal } from './components/LoginModal';
import { RegisteredUser } from './lib/firebase';
import {
  initialProfile,
  initialNetworkMembers,
  initialUmsaServices,
  initialCalendarEvents,
  initialCommunityPosts,
  initialKnowledgeBase,
  initialEducationalNarratives,
} from './data/mockData';

export default function App() {
  const [activeRole, setActiveRole] = useState<Role>('estudiante');
  const [currentTab, setCurrentTab] = useState<string>('inicio');
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Application state with localStorage persistence
  const [profile, setProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('ayni_profile');
    return saved ? JSON.parse(saved) : initialProfile;
  });

  const [networkMembers, setNetworkMembers] = useState<NetworkMember[]>(() => {
    const saved = localStorage.getItem('ayni_network');
    return saved ? JSON.parse(saved) : initialNetworkMembers;
  });

  const [umsaServices] = useState<UmsaService[]>(initialUmsaServices);

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('ayni_calendar');
    return saved ? JSON.parse(saved) : initialCalendarEvents;
  });

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem('ayni_community');
    return saved ? JSON.parse(saved) : initialCommunityPosts;
  });

  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeItem[]>(() => {
    const saved = localStorage.getItem('ayni_kb');
    return saved ? JSON.parse(saved) : initialKnowledgeBase;
  });

  const [narratives] = useState<EducationalNarrative[]>(initialEducationalNarratives);

  const [surveyCompleted, setSurveyCompleted] = useState<boolean>(() => {
    const saved = localStorage.getItem('ayni_survey_completed');
    return saved ? JSON.parse(saved) : false;
  });

  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('ayni_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('ayni_network', JSON.stringify(networkMembers));
  }, [networkMembers]);

  useEffect(() => {
    localStorage.setItem('ayni_calendar', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    localStorage.setItem('ayni_community', JSON.stringify(communityPosts));
  }, [communityPosts]);

  useEffect(() => {
    localStorage.setItem('ayni_kb', JSON.stringify(knowledgeBase));
  }, [knowledgeBase]);

  useEffect(() => {
    localStorage.setItem('ayni_survey_completed', JSON.stringify(surveyCompleted));
  }, [surveyCompleted]);

  // Handle role change restrictions
  useEffect(() => {
    if (activeRole === 'visitante') {
      if (currentTab === 'mired' || currentTab === 'organizador' || currentTab === 'observatorio') {
        setCurrentTab('inicio');
      }
    } else if (activeRole === 'estudiante') {
      if (currentTab === 'observatorio') {
        setCurrentTab('inicio');
      }
    }
  }, [activeRole, currentTab]);

  const pendingRemindersCount = calendarEvents.filter((e) => !e.completada && e.urgente).length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans flex flex-col justify-between selection:bg-amber-200">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        pendingRemindersCount={pendingRemindersCount}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        currentUser={currentUser}
      />

      {/* Main Tab View Router Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        {currentTab === 'inicio' && (
          <InicioView
            activeRole={activeRole}
            setActiveRole={setActiveRole}
            setCurrentTab={setCurrentTab}
            profile={profile}
            networkMembers={networkMembers}
            calendarEvents={calendarEvents}
            umsaServices={umsaServices}
            onOpenSurvey={() => setIsSurveyModalOpen(true)}
            surveyCompleted={surveyCompleted}
          />
        )}

        {currentTab === 'mired' && activeRole !== 'visitante' && (
          <MiRedCartografiaView
            profile={profile}
            setProfile={setProfile}
            networkMembers={networkMembers}
            setNetworkMembers={setNetworkMembers}
            onOpenSurvey={() => setIsSurveyModalOpen(true)}
            surveyCompleted={surveyCompleted}
          />
        )}

        {currentTab === 'servicios' && <ServiciosView umsaServices={umsaServices} />}

        {currentTab === 'chatbot' && (
          <ChatbotView
            activeRole={activeRole}
            knowledgeBase={knowledgeBase}
            setKnowledgeBase={setKnowledgeBase}
          />
        )}

        {currentTab === 'organizador' && activeRole !== 'visitante' && (
          <OrganizadorView
            calendarEvents={calendarEvents}
            setCalendarEvents={setCalendarEvents}
          />
        )}

        {currentTab === 'comunidad' && (
          <ComunidadView
            activeRole={activeRole}
            communityPosts={communityPosts}
            setCommunityPosts={setCommunityPosts}
          />
        )}

        {currentTab === 'narrativas' && <NarrativasAprendizajeView narratives={narratives} />}

        {currentTab === 'observatorio' && activeRole === 'administrador' && <ObservatorioView />}
      </main>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        profile={profile}
        setProfile={setProfile}
        activeRole={activeRole}
        setActiveRole={setActiveRole}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />

      {/* Survey Modal */}
      <EncuestaModal
        isOpen={isSurveyModalOpen}
        onClose={() => setIsSurveyModalOpen(false)}
        profile={profile}
        setProfile={setProfile}
        onSurveySubmitted={() => setSurveyCompleted(true)}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <p className="text-white font-bold text-sm">Ayni UMSA — Sistema Web Institucional de Cuidados & Corresponsabilidad</p>
            <p className="text-slate-400">
              Universidad Mayor de San Andrés | Vicerrectorado & Instituto de Investigaciones Sociales — La Paz, Bolivia
            </p>
          </div>

          <div className="flex items-center space-x-4 text-slate-400 font-medium">
            <button onClick={() => setCurrentTab('servicios')} className="hover:text-amber-400">
              Servicios UMSA
            </button>
            <span>•</span>
            <button onClick={() => setCurrentTab('narrativas')} className="hover:text-amber-400">
              Investigación & Narrativas
            </button>
            <span>•</span>
            <button onClick={() => setCurrentTab('chatbot')} className="hover:text-amber-400">
              Ayni Bot
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
