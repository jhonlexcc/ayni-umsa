import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  BarChart2,
  Users,
  Download,
  Upload,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  PieChart as PieIcon,
  Layers,
  Clock,
  FileSpreadsheet,
  Database,
  RefreshCw,
  Key,
  UserPlus,
} from 'lucide-react';
import { initialSurveyAggregateStats } from '../data/mockData';
import {
  getAllUsers,
  getAllSurveys,
  bulkSaveUsers,
  bulkSaveSurveys,
  RegisteredUser,
} from '../lib/firebase';
import {
  exportUsersToExcel,
  exportSurveysToExcel,
  parseUsersExcelFile,
  parseSurveysExcelFile,
} from '../lib/excelUtils';
import { SurveyResponse } from '../types';

const COLORS = ['#2563eb', '#d97706', '#10b981', '#8b5cf6', '#ec4899', '#6366f1'];

export const ObservatorioView: React.FC = () => {
  const stats = initialSurveyAggregateStats;

  const [dbUsers, setDbUsers] = useState<RegisteredUser[]>([]);
  const [dbSurveys, setDbSurveys] = useState<(SurveyResponse & { ci: string })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Load Firestore data
  const loadFirestoreData = async () => {
    setIsLoading(true);
    try {
      const [users, surveys] = await Promise.all([getAllUsers(), getAllSurveys()]);
      setDbUsers(users);
      setDbSurveys(surveys);
      setStatusMessage({
        type: 'success',
        text: `Sincronizado con Firebase: ${users.length} usuarios y ${surveys.length} encuestas cargadas.`,
      });
    } catch (err) {
      console.error('Error loading Firestore data:', err);
      setStatusMessage({
        type: 'error',
        text: 'Error al conectar con la base de datos Firebase.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFirestoreData();
  }, []);

  // Handle Export Users to Excel
  const handleExportUsers = () => {
    if (dbUsers.length === 0) {
      // If empty in DB, export mock default user list
      exportUsersToExcel([
        { ci: '1234567', nombre: 'Valeria Mamani Quispe', carrera: 'Sociología', semestre: '4to Semestre', facultad: 'Facultad de Ciencias Sociales', rol: 'estudiante', password: '1234567', surveyCompleted: true },
        { ci: '7654321', nombre: 'Carlos Eduardo Mendoza', carrera: 'Trabajo Social', semestre: '6to Semestre', facultad: 'Facultad de Ciencias Sociales', rol: 'estudiante', password: '7654321', surveyCompleted: false },
        { ci: '123456', nombre: 'Coordinador UMSA Admin', carrera: 'Investigación Sociales', semestre: 'Docente', facultad: 'Facultad de Ciencias Sociales', rol: 'administrador', password: '123456', surveyCompleted: true },
      ]);
      return;
    }
    exportUsersToExcel(dbUsers);
  };

  // Handle Import Users from Excel
  const handleImportUsersFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setStatusMessage({ type: 'info', text: 'Procesando archivo Excel de usuarios...' });

    try {
      const parsedUsers = await parseUsersExcelFile(file);
      if (parsedUsers.length === 0) {
        setStatusMessage({
          type: 'error',
          text: 'No se encontraron columnas válidas de Carnet de Identidad (C.I.) en el archivo Excel.',
        });
        return;
      }

      const count = await bulkSaveUsers(parsedUsers);
      setStatusMessage({
        type: 'success',
        text: `¡Éxito! Se importaron ${count} estudiantes/usuarios a la base de datos. Usuario y Contraseña por defecto: Carnet de Identidad.`,
      });
      await loadFirestoreData();
    } catch (err) {
      console.error('Error importing users:', err);
      setStatusMessage({ type: 'error', text: 'Error al leer el archivo Excel/CSV. Verifique el formato.' });
    } finally {
      setIsLoading(false);
      e.target.value = '';
    }
  };

  // Handle Export Surveys to Excel
  const handleExportSurveys = () => {
    if (dbSurveys.length === 0) {
      setStatusMessage({ type: 'info', text: 'No hay encuestas guardadas aún. Complete la encuesta como estudiante primero.' });
      return;
    }
    exportSurveysToExcel(dbSurveys);
  };

  // Handle Import Surveys from Excel
  const handleImportSurveysFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setStatusMessage({ type: 'info', text: 'Procesando archivo Excel de encuestas...' });

    try {
      const parsedSurveys = await parseSurveysExcelFile(file);
      if (parsedSurveys.length === 0) {
        setStatusMessage({
          type: 'error',
          text: 'No se encontraron registros de C.I. válidos en la hoja de encuestas.',
        });
        return;
      }

      const count = await bulkSaveSurveys(parsedSurveys);
      setStatusMessage({
        type: 'success',
        text: `¡Éxito! Se importaron y guardaron ${count} encuestas en la base de datos en la nube.`,
      });
      await loadFirestoreData();
    } catch (err) {
      console.error('Error importing surveys:', err);
      setStatusMessage({ type: 'error', text: 'Error al procesar el archivo de encuestas.' });
    } finally {
      setIsLoading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-8 py-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-indigo-900/60 shadow-2xl flex flex-wrap items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Observatorio Institucional UMSA & Firebase Cloud</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Observatorio y Gestión de Datos de Cuidado
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
            Módulo central de administración para importar y exportar planillas Excel (`.xlsx` / `.csv`) con nóminas de estudiantes, credenciales de Carnet de Identidad y encuestas de cuidados.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10">
          <button
            onClick={loadFirestoreData}
            disabled={isLoading}
            className="bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs px-4 py-3 rounded-2xl border border-slate-700 inline-flex items-center justify-center space-x-2 cursor-pointer shadow"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sincronizar Firestore</span>
          </button>
        </div>
      </div>

      {/* Status Alert Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between space-x-3 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : statusMessage.type === 'error'
              ? 'bg-red-50 border-red-300 text-red-900'
              : 'bg-blue-50 border-blue-300 text-blue-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusMessage.text}</span>
          </div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-slate-500 hover:text-slate-800 font-black underline text-[11px]"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* EXCEL IMPORT / EXPORT ACTION BENTO BOX */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <span>Gestión de Datos Excel (`.xlsx` / `.csv`)</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Carga masiva de nómina de estudiantes, contraseñas por defecto (C.I.) y descarga de reportes.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700">
            <Database className="w-4 h-4 text-orange-500" />
            <span>Firestore DB Activo</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Import / Export Usuarios (C.I.) */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center space-x-3 border-b border-slate-200 pb-3">
              <div className="p-2.5 bg-blue-100 text-blue-700 rounded-2xl">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-sm">Nómina de Usuarios / C.I.</h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  Contraseña asignada por defecto = Número de Carnet (C.I.)
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <label className="flex-1 bg-slate-900 hover:bg-slate-800 text-orange-400 font-black text-xs px-4 py-3 rounded-2xl flex items-center justify-center space-x-2 cursor-pointer shadow transition-all">
                <Upload className="w-4 h-4" />
                <span>Importar Usuarios Excel</span>
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleImportUsersFile}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleExportUsers}
                className="flex-1 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-black text-xs px-4 py-3 rounded-2xl flex items-center justify-center space-x-2 cursor-pointer shadow-xs transition-all"
              >
                <Download className="w-4 h-4 text-blue-600" />
                <span>Exportar Usuarios Excel</span>
              </button>
            </div>

            <div className="bg-blue-50/80 p-3 rounded-2xl border border-blue-200 text-[11px] text-blue-900 space-y-1">
              <p className="font-bold flex items-center space-x-1">
                <Key className="w-3.5 h-3.5 text-blue-600" />
                <span>Formato sugerido de columnas Excel:</span>
              </p>
              <p className="text-blue-800">
                `Carnet de Identidad (C.I.)`, `Nombre Completo`, `Carrera UMSA`, `Semestre`, `Facultad`, `Rol`
              </p>
            </div>
          </div>

          {/* Card 2: Import / Export Encuestas Completa */}
          <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center space-x-3 border-b border-slate-200 pb-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-2xl">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-sm">Encuestas de Cuidados UMSA</h4>
                <p className="text-[11px] text-slate-500 font-medium">
                  Exportación e importación completa con las 9 secciones.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <label className="flex-1 bg-slate-900 hover:bg-slate-800 text-emerald-400 font-black text-xs px-4 py-3 rounded-2xl flex items-center justify-center space-x-2 cursor-pointer shadow transition-all">
                <Upload className="w-4 h-4" />
                <span>Importar Encuestas Excel</span>
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleImportSurveysFile}
                  className="hidden"
                />
              </label>

              <button
                onClick={handleExportSurveys}
                className="flex-1 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-black text-xs px-4 py-3 rounded-2xl flex items-center justify-center space-x-2 cursor-pointer shadow-xs transition-all"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Exportar Encuestas Excel</span>
              </button>
            </div>

            <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200 text-[11px] text-emerald-900 space-y-1">
              <p className="font-bold">Total encuestas guardadas en la nube:</p>
              <p className="text-emerald-800 font-extrabold text-sm">
                {dbSurveys.length} respuestas registradas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Usuarios Registrados DB</span>
          <p className="text-3xl font-black text-slate-900">{dbUsers.length || stats.totalParticipantes}</p>
          <p className="text-[11px] text-emerald-600 font-medium">↑ Credencial C.I. activa</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Encuestas Respondidas</span>
          <p className="text-3xl font-black text-blue-600">{dbSurveys.length || 88}</p>
          <p className="text-[11px] text-slate-500">Guardadas en Firestore</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Horas Cuidado Promedio</span>
          <p className="text-3xl font-black text-amber-600">22.4 hrs/sem</p>
          <p className="text-[11px] text-amber-700 font-medium">Equivalente a medio tiempo</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-500 uppercase">Apoyo Principal</span>
          <p className="text-3xl font-black text-purple-600">45% Madres</p>
          <p className="text-[11px] text-slate-500">Apoyo intergeneracional</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <PieIcon className="w-4 h-4 text-blue-600" />
              <span>¿Quién proporciona el apoyo de cuidado principal?</span>
            </h3>
            <span className="text-[10px] text-slate-400">Distribución %</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.proveedoresPrincipalesApoyo} layout="vertical">
                <XAxis type="number" unit="%" />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => [`${value}%`, 'Porcentaje']} />
                <Bar dataKey="porcentaje" fill="#2563eb" radius={[0, 8, 8, 0]}>
                  {stats.proveedoresPrincipalesApoyo.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Carga de Horas Semanales de Cuidado por Estudiante</span>
            </h3>
            <span className="text-[10px] text-slate-400">Total Estudiantes</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.horasSemanalesCuidado}>
                <XAxis dataKey="rango" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="estudiantes" fill="#d97706" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>Participación de Estudiantes por Facultad UMSA</span>
            </h3>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.participacionPorFacultad}>
                <XAxis dataKey="facultad" tick={{ fontSize: 10 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="estudiantes" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-emerald-600" />
              <span>Necesidades de Apoyo Prioritarias Registradas</span>
            </h3>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.necesidadesMasReportadas} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="necesidad" type="category" width={150} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="cantidad" fill="#10b981" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
