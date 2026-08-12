import React, { useState } from 'react';
import {
  X,
  KeyRound,
  UserCheck,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  LogIn,
  LogOut,
  UserPlus,
  Lock,
  Mail,
  User,
  Building2,
  BookOpen,
  Check,
} from 'lucide-react';
import { loginWithCI, registerNewUser, saveUserProfile, RegisteredUser } from '../lib/firebase';
import { StudentProfile, Role } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  currentUser: RegisteredUser | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<RegisteredUser | null>>;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  profile,
  setProfile,
  activeRole,
  setActiveRole,
  currentUser,
  setCurrentUser,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login state
  const [ciInput, setCiInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Register form state
  const [regNombre, setRegNombre] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regCI, setRegCI] = useState('');
  const [regFacultad, setRegFacultad] = useState('Facultad de Ciencias Sociales');
  const [regCarrera, setRegCarrera] = useState('Sociología');
  const [regSemestre, setRegSemestre] = useState('4to Semestre');
  const [regRol, setRegRol] = useState<'estudiante' | 'administrador'>('estudiante');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  if (!isOpen) return null;

  const isUmsaDomain = regEmail.trim().toLowerCase().endsWith('@umsa.bo');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ciInput.trim()) {
      setMessage({ type: 'error', text: 'Por favor ingrese su número de Carnet de Identidad o Correo.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const result = await loginWithCI(ciInput.trim(), passwordInput.trim());

    if (result.success && result.user) {
      setCurrentUser(result.user);
      setActiveRole(result.user.rol as Role);

      setProfile((prev) => ({
        ...prev,
        ci: result.user!.ci,
        nombre: result.user!.nombre,
        carrera: result.user!.carrera,
        semestre: result.user!.semestre,
        facultad: result.user!.facultad,
      }));

      setMessage({ type: 'success', text: `¡Bienvenido/a, ${result.user.nombre}!` });
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setMessage({ type: 'error', text: result.message || 'Error al iniciar sesión.' });
    }

    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!regNombre.trim()) {
      setMessage({ type: 'error', text: 'El Nombre Completo es obligatorio.' });
      return;
    }
    if (!regCI.trim()) {
      setMessage({ type: 'error', text: 'El Carnet de Identidad (C.I.) es obligatorio.' });
      return;
    }
    if (regPassword && regPassword !== regConfirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const result = await registerNewUser({
      ci: regCI.trim(),
      nombre: regNombre.trim(),
      email: regEmail.trim(),
      facultad: regFacultad,
      carrera: regCarrera.trim() || 'Ciencias Sociales',
      semestre: regSemestre,
      rol: regRol,
      password: regPassword.trim() || regCI.trim(),
      esCorreoInstitucional: isUmsaDomain,
    });

    if (result.success && result.user) {
      setCurrentUser(result.user);
      setActiveRole(result.user.rol as Role);

      setProfile((prev) => ({
        ...prev,
        ci: result.user!.ci,
        nombre: result.user!.nombre,
        carrera: result.user!.carrera,
        semestre: result.user!.semestre,
        facultad: result.user!.facultad,
      }));

      setMessage({ type: 'success', text: '¡Cuenta registrada exitosamente en la base de datos!' });
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setMessage({ type: 'error', text: result.message || 'Error al registrar usuario.' });
    }

    setLoading(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveRole('visitante');
    setMessage({ type: 'success', text: 'Sesión cerrada correctamente.' });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative animate-in fade-in zoom-in-95 my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-2 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 text-center">
          <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center text-slate-950 font-black text-xl mx-auto shadow-lg shadow-orange-500/30">
            A
          </div>
          <h2 className="text-xl font-black text-slate-900">Sistema Web Ayni UMSA</h2>
          <p className="text-xs text-slate-500 font-medium">
            Acceso e Identificación de la Red Institucional de Cuidado
          </p>
        </div>

        {/* Navigation Tabs (Login vs Register) if not logged in */}
        {!currentUser && (
          <div className="flex bg-slate-100 p-1.5 rounded-2xl text-xs font-bold space-x-1">
            <button
              onClick={() => {
                setActiveTab('login');
                setMessage(null);
              }}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-slate-900 text-orange-400 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Iniciar Sesión</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                setMessage(null);
              }}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-slate-900 text-orange-400 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Registrarse</span>
            </button>
          </div>
        )}

        {/* Alert Feedback */}
        {message && (
          <div
            className={`p-3.5 rounded-2xl text-xs font-bold flex items-center space-x-2 ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                : 'bg-red-50 text-red-900 border border-red-300'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {currentUser ? (
          /* Logged In View */
          <div className="space-y-4 bg-slate-50 p-5 rounded-3xl border border-slate-200 text-xs">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-orange-100 text-orange-700 rounded-2xl">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-orange-800 bg-orange-100 px-2 py-0.5 rounded-full border border-orange-300">
                  {currentUser.rol.toUpperCase()}
                </span>
                <h3 className="font-black text-slate-900 text-sm mt-1">{currentUser.nombre}</h3>
                <p className="text-slate-600 font-bold">C.I.: {currentUser.ci}</p>
                {currentUser.email && (
                  <p className="text-slate-500 text-[11px] font-medium">{currentUser.email}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5 text-slate-700 pt-2 border-t border-slate-200">
              <p><strong>Carrera:</strong> {currentUser.carrera}</p>
              <p><strong>Semestre:</strong> {currentUser.semestre}</p>
              <p><strong>Facultad:</strong> {currentUser.facultad}</p>
              {currentUser.esCorreoInstitucional && (
                <div className="inline-flex items-center space-x-1 bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold text-[10px] mt-1">
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span>Correo Institucional UMSA (@umsa.bo)</span>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-2.5 rounded-2xl flex items-center justify-center space-x-2 cursor-pointer shadow mt-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        ) : activeTab === 'login' ? (
          /* LOGIN FORM */
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Carnet de Identidad (C.I.) o Correo Electrónico
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Ej: 1234567 o usuario@umsa.bo"
                  value={ciInput}
                  onChange={(e) => setCiInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 font-bold"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Por defecto su número de C.I."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 font-bold"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
              <p className="font-bold flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Credenciales institucionales UMSA:</span>
              </p>
              <p className="text-amber-800">
                Puedes ingresar con tu número de Carnet o con tu cuenta institucional. Si aún no estás en la nómina, utiliza la pestaña <strong>Registrarse</strong>.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-orange-400 font-black py-3 rounded-2xl flex items-center justify-center space-x-2 shadow-lg cursor-pointer transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Verificando...' : 'Iniciar Sesión'}</span>
            </button>
          </form>
        ) : (
          /* REGISTRATION FORM */
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Nombre Completo *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Ej: Valeria Mamani Quispe"
                  value={regNombre}
                  onChange={(e) => setRegNombre(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 font-bold"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            {/* Email Field with @umsa.bo Guidance */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Correo Electrónico (Recomendado @umsa.bo)
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Ej: usuario@umsa.bo o correo@gmail.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 font-bold"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>

              {/* Live Domain Detection Feedback */}
              {regEmail.trim() !== '' && (
                <div className="mt-1.5">
                  {isUmsaDomain ? (
                    <div className="inline-flex items-center space-x-1.5 bg-emerald-50 border border-emerald-300 text-emerald-900 text-[11px] font-bold px-2.5 py-1 rounded-xl">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>✓ Correo Institucional UMSA Verificado (@umsa.bo)</span>
                    </div>
                  ) : (
                    <div className="bg-blue-50 border border-blue-200 text-blue-900 text-[11px] p-2 rounded-xl space-y-0.5">
                      <p className="font-bold flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>Recomendación de Cuenta Institucional:</span>
                      </p>
                      <p className="text-slate-600">
                        Es altamente recomendable registrarse con la cuenta oficial de la universidad (<strong>@umsa.bo</strong>) para validar el perfil estudiantil, pero también puedes usar tu correo personal.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Carnet & Rol */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Carnet de Identidad (C.I.) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="Ej: 1234567"
                    value={regCI}
                    onChange={(e) => setRegCI(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 font-bold"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Rol Institucional
                </label>
                <select
                  value={regRol}
                  onChange={(e) => setRegRol(e.target.value as 'estudiante' | 'administrador')}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 font-bold bg-white"
                >
                  <option value="estudiante">Estudiante UMSA</option>
                  <option value="administrador">Docente / Coordinador</option>
                </select>
              </div>
            </div>

            {/* Facultad & Carrera */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Facultad
                </label>
                <select
                  value={regFacultad}
                  onChange={(e) => setRegFacultad(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 font-bold bg-white text-[11px]"
                >
                  <option value="Facultad de Ciencias Sociales">Fac. Ciencias Sociales</option>
                  <option value="Facultad de Humanidades y Cs. de la Educación">Fac. Humanidades</option>
                  <option value="Facultad de Derecho y Ciencias Políticas">Fac. Derecho y C.P.</option>
                  <option value="Facultad de Medicina">Fac. Medicina</option>
                  <option value="Facultad de Ingeniería">Fac. Ingeniería</option>
                  <option value="Facultad de Arquitectura">Fac. Arquitectura y Artes</option>
                  <option value="Facultad de Ciencias Económicas">Fac. Económicas</option>
                  <option value="Facultad de Ciencias Puras">Fac. Ciencias Puras</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Carrera UMSA
                </label>
                <input
                  type="text"
                  placeholder="Ej: Trabajo Social, Derecho..."
                  value={regCarrera}
                  onChange={(e) => setRegCarrera(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 font-bold"
                />
              </div>
            </div>

            {/* Semestre */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Semestre
              </label>
              <select
                value={regSemestre}
                onChange={(e) => setRegSemestre(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 font-bold bg-white"
              >
                <option value="1er Semestre">1er Semestre</option>
                <option value="2do Semestre">2do Semestre</option>
                <option value="3er Semestre">3er Semestre</option>
                <option value="4to Semestre">4to Semestre</option>
                <option value="5to Semestre">5to Semestre</option>
                <option value="6to Semestre">6to Semestre</option>
                <option value="7mo Semestre">7mo Semestre</option>
                <option value="8vo Semestre">8vo Semestre</option>
                <option value="9no Semestre / Egreso">9no Semestre / Egreso</option>
              </select>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Contraseña (Opcional)
                </label>
                <input
                  type="password"
                  placeholder="Por defecto su C.I."
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  placeholder="Repetir contraseña"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none text-slate-900 font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-orange-400 font-black py-3 rounded-2xl flex items-center justify-center space-x-2 shadow-lg cursor-pointer transition-all mt-4"
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? 'Registrando en Firestore...' : 'Completar Registro de Usuario'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

