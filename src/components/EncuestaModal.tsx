import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Send,
  CheckCircle2,
  HelpCircle,
  Users,
  BookOpen,
  GraduationCap,
  MessageSquare,
  Shield,
  Heart,
  Scale,
  Brain,
} from 'lucide-react';
import { StudentProfile, SurveyResponse } from '../types';
import { saveSurveyToFirestore } from '../lib/firebase';

interface EncuestaModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentProfile>>;
  onSurveySubmitted: () => void;
}

export const EncuestaModal: React.FC<EncuestaModalProps> = ({
  isOpen,
  onClose,
  profile,
  setProfile,
  onSurveySubmitted,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // 1. Datos generales
  const [edad, setEdad] = useState<number>(22);
  const [carrera, setCarrera] = useState<string>(profile.carrera || 'Sociología');
  const [semestre, setSemestre] = useState<string>(profile.semestre || '6to Semestre');
  const [genero, setGenero] = useState<'Mujer' | 'Hombre' | 'Prefiero no responder' | 'Otro'>('Mujer');
  const [generoOtro, setGeneroOtro] = useState<string>('');
  const [trabaja, setTrabaja] = useState<'Sí' | 'No'>('Sí');
  const [viveCon, setViveCon] = useState<'Solo/a' | 'Familia' | 'Pareja' | 'Amigos' | 'Otro'>('Familia');
  const [viveConOtro, setViveConOtro] = useState<string>('');

  // 2. Responsabilidades de cuidado
  const [responsabilidades, setResponsabilidades] = useState<string[]>([
    'Hijos/as',
    'Personas mayores',
  ]);

  // 3. Distribución del cuidado
  const [distribucion, setDistribucion] = useState<{
    cuidadoDirecto: string;
    organizacionHorarios: string;
    tareasDomesticas: string;
  }>({
    cuidadoDirecto: 'Yo',
    organizacionHorarios: 'Se comparte',
    tareasDomesticas: 'Otra mujer',
  });

  // 4. Consecuencias en los estudios
  const [consecuencias, setConsecuencias] = useState<string[]>([
    'Tener menos tiempo para estudiar',
    'Sentir agotamiento o sobrecarga',
  ]);

  // 5. Responsabilidad actual y responsabilidad ideal
  const [responsabilidadActual, setResponsabilidadActual] = useState<string>(
    'Principalmente la familia'
  );
  const [responsabilidadIdeal, setResponsabilidadIdeal] = useState<string>(
    'Compartida entre familia, Estado y comunidad'
  );

  // 6. Creencias sobre el cuidado (10 afirmaciones)
  const [creencias, setCreencias] = useState<Record<number, string>>({
    1: 'En desacuerdo',
    2: 'Ni de acuerdo ni en desacuerdo',
    3: 'En desacuerdo',
    4: 'Totalmente de acuerdo',
    5: 'En desacuerdo',
    6: 'Totalmente de acuerdo',
    7: 'Totalmente en desacuerdo',
    8: 'En desacuerdo',
    9: 'Totalmente de acuerdo',
    10: 'Totalmente de acuerdo',
  });

  // 7. Narrativas que circulan
  const [frases, setFrases] = useState<string[]>([
    '“Cuidar también es trabajo”.',
    '“El cuidado es responsabilidad de todos”.',
  ]);
  const [fraseOtro, setFraseOtro] = useState<string>('');
  const [dondeEscucha, setDondeEscucha] = useState<string[]>([
    'Familia',
    'Universidad',
    'Medios o redes sociales',
  ]);
  const [dondeEscuchaOtro, setDondeEscuchaOtro] = useState<string>('');

  // 8. Situación hipotética & Universidad
  const [hipoteticaOcurriria, setHipoteticaOcurriria] = useState<string>(
    'Valeria faltaría a su evaluación.'
  );
  const [hipoteticaDeberiaOcurrir, setHipoteticaDeberiaOcurrir] = useState<string>(
    'Solicitarían apoyo o flexibilidad a la universidad.'
  );
  const [sienteJuzgado, setSienteJuzgado] = useState<'Sí' | 'No' | 'A veces'>('A veces');
  const [conoceServicios, setConoceServicios] = useState<'Sí' | 'No'>('Sí');
  const [tipoApoyoMasImportante, setTipoApoyoMasImportante] = useState<
    'Emocional' | 'Académico' | 'Económico' | 'Psicológico' | 'Legal' | 'Otro'
  >('Académico');

  // 9. Preguntas abiertas finales
  const [sugerenciaPlataforma, setSugerenciaPlataforma] = useState<string>(
    'Permitir coordinar turnos de cuidado entre compañeros, reservar guardería UMSA y justificar faltas por cuidado.'
  );
  const [accionFaltante, setAccionFaltante] = useState<string>(
    'Implementar lactarios en todos los predios y dar flexibilidad horaria acreditada para padres/madres.'
  );

  if (!isOpen) return null;

  const toggleMultiSelect = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    item: string,
    maxLimit?: number
  ) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      if (maxLimit && list.length >= maxLimit) {
        return; // limit reached
      }
      setList([...list, item]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Compile full response
    const fullResponse: SurveyResponse = {
      completada: true,
      fechaCompletado: new Date().toISOString(),
      edad,
      carrera,
      semestre,
      genero,
      generoOtro,
      trabaja,
      viveCon,
      viveConOtro,
      responsabilidadesCuidado: responsabilidades,
      distribucionCuidado: distribucion,
      consecuenciasEstudios: consecuencias,
      responsabilidadActual,
      responsabilidadIdeal,
      creenciasCuidado: creencias,
      frasesFrecuentes: frases,
      fraseOtro,
      dondeEscuchaFrases: dondeEscucha,
      dondeEscuchaOtro,
      hipoteticaOcurriria,
      hipoteticaDeberiaOcurrir,
      sienteJuzgadoPadreMadre: sienteJuzgado,
      conoceServiciosApoyo: conoceServicios,
      tipoApoyoMasImportante,
      sugerenciaPlataformaDigital: sugerenciaPlataforma,
      accionOservicioFaltante: accionFaltante,
    };

    console.log('Survey Submitted:', fullResponse);

    // Save to Firestore
    if (profile.ci) {
      await saveSurveyToFirestore(fullResponse, profile.ci);
    }

    // Update Profile
    setProfile((prev) => ({
      ...prev,
      carrera,
      semestre,
      personasACargoCount: responsabilidades.filter((r) => r !== 'No tengo responsabilidades de cuidado').length || 1,
      tipoCuidado: responsabilidades,
      trabaja: trabaja === 'Sí',
    }));

    onSurveySubmitted();
    onClose();
  };

  const LIKERT_OPTIONS = [
    'Totalmente de acuerdo',
    'De acuerdo',
    'Ni de acuerdo ni en desacuerdo',
    'En desacuerdo',
    'Totalmente en desacuerdo',
    'No sé',
  ];

  const STATEMENT_GROUPS = [
    {
      titulo: 'Familia y género',
      items: [
        { id: 1, text: '1. Las mujeres tienen una capacidad natural mayor que los hombres para cuidar.' },
        { id: 2, text: '2. Una buena madre debe priorizar a su familia, aunque eso retrase sus estudios.' },
        { id: 3, text: '3. Un padre cumple su principal responsabilidad cuando aporta económicamente.' },
        { id: 4, text: '4. Las tareas de cuidado deben distribuirse según el tiempo y las posibilidades de cada persona, no según su género.' },
      ],
    },
    {
      titulo: 'Estado',
      items: [
        { id: 5, text: '5. El cuidado es un asunto privado que cada familia debe resolver.' },
        { id: 6, text: '6. Los servicios públicos de cuidado son derechos y no favores.' },
        { id: 7, text: '7. Dar flexibilidad académica a estudiantes que cuidan representa una ventaja injusta.' },
      ],
    },
    {
      titulo: 'Comunidad',
      items: [
        { id: 8, text: '8. Pedir ayuda a amistades o vecinos demuestra que la familia no pudo organizarse.' },
        { id: 9, text: '9. El cuidado proporcionado por la comunidad debe reconocerse como trabajo y no solamente como un favor.' },
        { id: 10, text: '10. Una red comunitaria de confianza puede compartir responsablemente algunas tareas de cuidado.' },
      ],
    },
  ];

  const DISTRIBUCION_OPCIONES = [
    'Yo',
    'Otra mujer',
    'Otro hombre',
    'Se comparte',
    'Persona remunerada',
    'No aplica',
  ];

  const RESPONSABILIDAD_MODELOS = [
    'Principalmente la familia',
    'Principalmente el Estado',
    'Principalmente la comunidad',
    'Compartida entre familia y Estado',
    'Compartida entre familia y comunidad',
    'Compartida entre familia, Estado y comunidad',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-auto space-y-6 relative animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto scrollbar-thin">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Survey Presentation Banner */}
        <div className="space-y-3 border-b border-slate-200 pb-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-orange-100 text-orange-800 border border-orange-300 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider">
              Unidad de Interacción de Postgrado — Ciencias Sociales UMSA
            </span>
            <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold">
              Paso {currentStep} de 9
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Encuesta breve sobre cuidados y corresponsabilidad
          </h2>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1.5 leading-relaxed">
            <p className="font-extrabold text-slate-900 uppercase text-[11px] tracking-wider">Presentación institucional:</p>
            <p>
              Desde la Unidad de interacción de post grado de la Facultad de Ciencias Sociales se busca conocer cómo se distribuyen y cómo se interpretan las responsabilidades de cuidado dentro de la Universidad. Se entiende por cuidado la atención de niñas y niños, personas mayores, enfermas o con discapacidad, así como la organización necesaria para su bienestar. No existen respuestas correctas o incorrectas.
            </p>
          </div>
        </div>

        {/* Wizard Step Tabs Pills Bar */}
        <div className="flex overflow-x-auto space-x-1.5 pb-2 scrollbar-none border-b border-slate-100 text-xs font-bold">
          {[
            { num: 1, label: '1. Datos' },
            { num: 2, label: '2. Cuidado' },
            { num: 3, label: '3. Reparto' },
            { num: 4, label: '4. Estudios' },
            { num: 5, label: '5. Modelos' },
            { num: 6, label: '6. Creencias' },
            { num: 7, label: '7. Frases' },
            { num: 8, label: '8. Caso' },
            { num: 9, label: '9. Propuestas' },
          ].map((tab) => (
            <button
              key={tab.num}
              onClick={() => setCurrentStep(tab.num)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                currentStep === tab.num
                  ? 'bg-orange-500 text-slate-950 shadow-md font-black'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Step Content Form */}
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* STEP 1: Datos Generales */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
                <Users className="w-5 h-5 text-orange-600" />
                <h3 className="text-base font-black text-slate-900">1. Datos generales</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-800">Edad</label>
                  <input
                    type="number"
                    value={edad}
                    onChange={(e) => setEdad(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white font-bold text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-800">Carrera UMSA</label>
                  <input
                    type="text"
                    value={carrera}
                    onChange={(e) => setCarrera(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white font-bold text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-800">Semestre o año que cursa</label>
                  <input
                    type="text"
                    value={semestre}
                    onChange={(e) => setSemestre(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl bg-white font-bold text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="block font-bold text-slate-800">Con qué género se identifica:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { val: 'Mujer', label: 'Mujer' },
                    { val: 'Hombre', label: 'Hombre' },
                    { val: 'Prefiero no responder', label: 'Prefiero no responder' },
                    { val: 'Otro', label: 'Otro' },
                  ].map((g) => (
                    <label
                      key={g.val}
                      className={`p-3 rounded-xl border flex items-center space-x-2.5 cursor-pointer font-bold transition-all ${
                        genero === g.val
                          ? 'bg-orange-50 border-orange-500 text-orange-950 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="genero"
                        checked={genero === g.val}
                        onChange={() => setGenero(g.val as any)}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span>{g.label}</span>
                    </label>
                  ))}
                </div>
                {genero === 'Otro' && (
                  <input
                    type="text"
                    placeholder="Especifique su género..."
                    value={generoOtro}
                    onChange={(e) => setGeneroOtro(e.target.value)}
                    className="w-full mt-2 px-3.5 py-2 border border-slate-300 rounded-xl bg-white text-xs"
                  />
                )}
              </div>

              <div className="space-y-2 pt-2">
                <label className="block font-bold text-slate-800">¿Trabaja además de estudiar?</label>
                <div className="flex space-x-4">
                  {['Sí', 'No'].map((opt) => (
                    <label
                      key={opt}
                      className={`px-5 py-2.5 rounded-xl border flex items-center space-x-2 cursor-pointer font-bold transition-all ${
                        trabaja === opt
                          ? 'bg-orange-50 border-orange-500 text-orange-950'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="trabaja"
                        checked={trabaja === opt}
                        onChange={() => setTrabaja(opt as any)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="block font-bold text-slate-800">¿Con quién vive actualmente?</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { val: 'Solo/a', label: 'Solo/a' },
                    { val: 'Familia', label: 'Familia' },
                    { val: 'Pareja', label: 'Pareja' },
                    { val: 'Amigos', label: 'Amigos' },
                    { val: 'Otro', label: 'Otro' },
                  ].map((v) => (
                    <label
                      key={v.val}
                      className={`p-3 rounded-xl border flex items-center space-x-2.5 cursor-pointer font-bold transition-all ${
                        viveCon === v.val
                          ? 'bg-orange-50 border-orange-500 text-orange-950'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="viveCon"
                        checked={viveCon === v.val}
                        onChange={() => setViveCon(v.val as any)}
                      />
                      <span>{v.label}</span>
                    </label>
                  ))}
                </div>
                {viveCon === 'Otro' && (
                  <input
                    type="text"
                    placeholder="Especifique con quién vive..."
                    value={viveConOtro}
                    onChange={(e) => setViveConOtro(e.target.value)}
                    className="w-full mt-2 px-3.5 py-2 border border-slate-300 rounded-xl bg-white text-xs"
                  />
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Responsabilidades de cuidado */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
                <Heart className="w-5 h-5 text-orange-600" />
                <h3 className="text-base font-black text-slate-900">2. Responsabilidades de cuidado</h3>
              </div>

              <p className="text-slate-600 font-semibold">
                ¿Tiene actualmente responsabilidades regulares de cuidado no remunerado?
                <br />
                <span className="text-slate-400 font-normal">Puede marcar más de una. (Opción múltiple)</span>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  'Hijos/as',
                  'Otros niños/as',
                  'Personas mayores',
                  'Personas enfermas o con discapacidad',
                  'Otra persona',
                  'No tengo responsabilidades de cuidado',
                ].map((item) => {
                  const isChecked = responsabilidades.includes(item);
                  return (
                    <label
                      key={item}
                      className={`p-3.5 rounded-2xl border flex items-center space-x-3 cursor-pointer font-bold transition-all ${
                        isChecked
                          ? 'bg-orange-500 text-slate-950 border-orange-600 shadow-md'
                          : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          toggleMultiSelect(
                            responsabilidades,
                            setResponsabilidades,
                            item
                          )
                        }
                        className="w-4 h-4 rounded text-slate-950 focus:ring-orange-500"
                      />
                      <span>{item}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Distribución del cuidado */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
                <Scale className="w-5 h-5 text-orange-600" />
                <h3 className="text-base font-black text-slate-900">3. Distribución del cuidado</h3>
              </div>

              <p className="text-slate-600 font-semibold">
                En su hogar o familia, ¿quién realiza principalmente las siguientes tareas?
              </p>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-900 text-white text-[11px] font-bold">
                      <th className="p-3">Tarea</th>
                      {DISTRIBUCION_OPCIONES.map((opt) => (
                        <th key={opt} className="p-3 text-center">
                          {opt}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs font-semibold">
                    {[
                      { key: 'cuidadoDirecto', label: 'Cuidado directo' },
                      {
                        key: 'organizacionHorarios',
                        label: 'Organización de horarios, citas y necesidades',
                      },
                      {
                        key: 'tareasDomesticas',
                        label: 'Tareas domésticas vinculadas al cuidado',
                      },
                    ].map((row) => (
                      <tr key={row.key} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{row.label}</td>
                        {DISTRIBUCION_OPCIONES.map((opt) => (
                          <td key={opt} className="p-3 text-center">
                            <input
                              type="radio"
                              name={`dist-${row.key}`}
                              checked={
                                (distribucion as any)[row.key] === opt
                              }
                              onChange={() =>
                                setDistribucion({
                                  ...distribucion,
                                  [row.key]: opt,
                                })
                              }
                              className="w-4 h-4 text-orange-600 cursor-pointer"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STEP 4: Consecuencias en los estudios */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
                <GraduationCap className="w-5 h-5 text-orange-600" />
                <h3 className="text-base font-black text-slate-900">4. Consecuencias en los estudios</h3>
              </div>

              <p className="text-slate-600 font-semibold">
                Durante el último semestre, las responsabilidades de cuidado le ocasionaron:
                <br />
                <span className="text-slate-400 font-normal">Puede marcar más de una. (Opción múltiple)</span>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  'Faltar o llegar tarde a clases',
                  'Tener menos tiempo para estudiar',
                  'Postergar evaluaciones o trabajos',
                  'Reducir o abandonar materias',
                  'Sentir agotamiento o sobrecarga',
                  'No tuvieron consecuencias',
                  'No corresponde a mi situación',
                ].map((item) => {
                  const isChecked = consecuencias.includes(item);
                  return (
                    <label
                      key={item}
                      className={`p-3.5 rounded-2xl border flex items-center space-x-3 cursor-pointer font-bold transition-all ${
                        isChecked
                          ? 'bg-orange-500 text-slate-950 border-orange-600 shadow-md'
                          : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          toggleMultiSelect(consecuencias, setConsecuencias, item)
                        }
                        className="w-4 h-4 rounded text-slate-950 focus:ring-orange-500"
                      />
                      <span>{item}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: Responsabilidad actual e ideal */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
                <Shield className="w-5 h-5 text-orange-600" />
                <h3 className="text-base font-black text-slate-900">5. Responsabilidad actual y responsabilidad ideal</h3>
              </div>

              <p className="text-slate-600 font-semibold">
                Seleccione una respuesta en cada columna sobre cómo se distribuyen o deberían distribuirse los cuidados:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Column 1: Actualmente ocurre */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-black text-slate-900 border-b pb-2 text-xs uppercase tracking-wider text-orange-600">
                    Actualmente ocurre
                  </h4>
                  <div className="space-y-2">
                    {RESPONSABILIDAD_MODELOS.map((modelo) => (
                      <label
                        key={modelo}
                        className={`p-3 rounded-xl border flex items-center space-x-2.5 cursor-pointer font-bold text-xs transition-all ${
                          responsabilidadActual === modelo
                            ? 'bg-orange-500 text-slate-950 border-orange-600 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name="respActual"
                          checked={responsabilidadActual === modelo}
                          onChange={() => setResponsabilidadActual(modelo)}
                        />
                        <span>{modelo}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Column 2: Considera que debería ocurrir */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-black text-slate-900 border-b pb-2 text-xs uppercase tracking-wider text-indigo-600">
                    Considera que debería ocurrir
                  </h4>
                  <div className="space-y-2">
                    {RESPONSABILIDAD_MODELOS.map((modelo) => (
                      <label
                        key={modelo}
                        className={`p-3 rounded-xl border flex items-center space-x-2.5 cursor-pointer font-bold text-xs transition-all ${
                          responsabilidadIdeal === modelo
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name="respIdeal"
                          checked={responsabilidadIdeal === modelo}
                          onChange={() => setResponsabilidadIdeal(modelo)}
                        />
                        <span>{modelo}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Creencias sobre el cuidado */}
          {currentStep === 6 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
                <Brain className="w-5 h-5 text-orange-600" />
                <h3 className="text-base font-black text-slate-900">6. Creencias sobre el cuidado</h3>
              </div>

              <p className="text-slate-600 font-semibold">
                Indique cuánto está de acuerdo con las siguientes afirmaciones:
              </p>

              <div className="space-y-6">
                {STATEMENT_GROUPS.map((group) => (
                  <div key={group.titulo} className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <h4 className="font-black text-orange-600 text-xs uppercase tracking-wider border-b pb-1">
                      {group.titulo}
                    </h4>

                    <div className="space-y-4">
                      {group.items.map((item) => (
                        <div key={item.id} className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200/80">
                          <p className="font-bold text-slate-900">{item.text}</p>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1.5 pt-1">
                            {LIKERT_OPTIONS.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() =>
                                  setCreencias({ ...creencias, [item.id]: opt })
                                }
                                className={`p-2 rounded-lg text-[10px] font-bold text-center border transition-all cursor-pointer ${
                                  creencias[item.id] === opt
                                    ? 'bg-slate-900 text-orange-400 border-slate-900 shadow-xs'
                                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: Narrativas que circulan */}
          {currentStep === 7 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
                <MessageSquare className="w-5 h-5 text-orange-600" />
                <h3 className="text-base font-black text-slate-900">7. Narrativas que circulan</h3>
              </div>

              <div className="space-y-3">
                <p className="text-slate-700 font-bold">
                  ¿Cuáles de estas frases escucha con mayor frecuencia en su entorno?
                  <br />
                  <span className="text-slate-400 font-normal">Seleccione hasta tres (3).</span>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    '“La madre sabe cuidar mejor por naturaleza”.',
                    '“Una buena madre se sacrifica por sus hijos”.',
                    '“El padre ayuda cuando puede”.',
                    '“Quien tiene hijos debe arreglárselas solo”.',
                    '“El Estado no debe reemplazar a la familia”.',
                    '“La ayuda de la comunidad siempre debe devolverse”.',
                    '“Cuidar también es trabajo”.',
                    '“El cuidado es responsabilidad de todos”.',
                  ].map((f) => {
                    const isChecked = frases.includes(f);
                    return (
                      <label
                        key={f}
                        className={`p-3 rounded-xl border flex items-center space-x-2.5 cursor-pointer font-bold text-xs transition-all ${
                          isChecked
                            ? 'bg-orange-500 text-slate-950 border-orange-600 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleMultiSelect(frases, setFrases, f, 3)}
                          className="w-4 h-4 rounded text-slate-950 focus:ring-orange-500"
                        />
                        <span>{f}</span>
                      </label>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <label className="block font-bold text-slate-800 mb-1">Otra frase escuchada:</label>
                  <input
                    type="text"
                    placeholder="Escriba otra frase frecuente..."
                    value={fraseOtro}
                    onChange={(e) => setFraseOtro(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl bg-white text-xs"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-200">
                <p className="text-slate-700 font-bold">¿Dónde escucha principalmente esas frases?</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    'Familia',
                    'Pareja',
                    'Universidad',
                    'Amistades o comunidad',
                    'Instituciones públicas',
                    'Medios o redes sociales',
                  ].map((lugar) => {
                    const isChecked = dondeEscucha.includes(lugar);
                    return (
                      <label
                        key={lugar}
                        className={`p-3 rounded-xl border flex items-center space-x-2 cursor-pointer font-bold text-xs transition-all ${
                          isChecked
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            toggleMultiSelect(
                              dondeEscucha,
                              setDondeEscucha,
                              lugar
                            )
                          }
                        />
                        <span>{lugar}</span>
                      </label>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <label className="block font-bold text-slate-800 mb-1">Otro espacio o medio:</label>
                  <input
                    type="text"
                    placeholder="Especifique otro lugar..."
                    value={dondeEscuchaOtro}
                    onChange={(e) => setDondeEscuchaOtro(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl bg-white text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: Situación hipotética & Universidad */}
          {currentStep === 8 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
                <BookOpen className="w-5 h-5 text-orange-600" />
                <h3 className="text-base font-black text-slate-900">8. Situación hipotética</h3>
              </div>

              {/* Case story */}
              <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl text-slate-800 space-y-1 leading-relaxed">
                <p className="font-bold text-orange-900 text-xs uppercase tracking-wider">Caso de estudio:</p>
                <p className="font-semibold text-xs">
                  “Valeria y Mateo estudian y tienen una hija pequeña. Ambos tienen una evaluación importante el mismo día y la niña se enferma. Los dos tienen horarios y condiciones similares.”
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <label className="block font-black text-slate-900 text-xs">
                    ¿Qué cree que ocurriría con mayor probabilidad?
                  </label>
                  {[
                    'Valeria faltaría a su evaluación.',
                    'Mateo faltaría a su evaluación.',
                    'Decidirían conjuntamente quién debe faltar.',
                    'Pedirían ayuda a una mujer de la familia.',
                    'Recurrirían a una red comunitaria.',
                    'Solicitarían apoyo o flexibilidad a la universidad.',
                  ].map((opt) => (
                    <label
                      key={opt}
                      className={`p-2.5 rounded-xl border flex items-center space-x-2 cursor-pointer font-bold text-xs ${
                        hipoteticaOcurriria === opt
                          ? 'bg-orange-500 text-slate-950 border-orange-600'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="hipOcurriria"
                        checked={hipoteticaOcurriria === opt}
                        onChange={() => setHipoteticaOcurriria(opt)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>

                <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <label className="block font-black text-slate-900 text-xs">
                    ¿Qué considera que debería ocurrir?
                  </label>
                  {[
                    'Valeria faltaría a su evaluación.',
                    'Mateo faltaría a su evaluación.',
                    'Decidirían conjuntamente quién debe faltar.',
                    'Pedirían ayuda a una mujer de la familia.',
                    'Recurrirían a una red comunitaria.',
                    'Solicitarían apoyo o flexibilidad a la universidad.',
                  ].map((opt) => (
                    <label
                      key={opt}
                      className={`p-2.5 rounded-xl border flex items-center space-x-2 cursor-pointer font-bold text-xs ${
                        hipoteticaDeberiaOcurrir === opt
                          ? 'bg-indigo-600 text-white border-indigo-700'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="hipDeberia"
                        checked={hipoteticaDeberiaOcurrir === opt}
                        onChange={() => setHipoteticaDeberiaOcurrir(opt)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ambiente universitario */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider text-orange-600">
                  Preguntas sobre el ambiente universitario
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">
                      ¿Has sentido que docentes o compañeros juzgan tu rol de padre/madre en la universidad?
                    </label>
                    <div className="flex space-x-3">
                      {['Sí', 'No', 'A veces'].map((v) => (
                        <label
                          key={v}
                          className={`px-4 py-2 rounded-xl border cursor-pointer font-bold ${
                            sienteJuzgado === v
                              ? 'bg-slate-900 text-orange-400 border-slate-900'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name="juzgado"
                            checked={sienteJuzgado === v}
                            onChange={() => setSienteJuzgado(v as any)}
                            className="mr-1.5"
                          />
                          <span>{v}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">
                      ¿Conoce servicios de apoyo psicológico o bienestar universitario?
                    </label>
                    <div className="flex space-x-3">
                      {['Sí', 'No'].map((v) => (
                        <label
                          key={v}
                          className={`px-4 py-2 rounded-xl border cursor-pointer font-bold ${
                            conoceServicios === v
                              ? 'bg-slate-900 text-orange-400 border-slate-900'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name="conoceServ"
                            checked={conoceServicios === v}
                            onChange={() => setConoceServicios(v as any)}
                            className="mr-1.5"
                          />
                          <span>{v}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">
                      ¿Qué tipo de apoyo considera más importante?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {['Emocional', 'Académico', 'Económico', 'Psicológico', 'Legal', 'Otro'].map((t) => (
                        <label
                          key={t}
                          className={`p-2.5 rounded-xl border flex items-center space-x-2 cursor-pointer font-bold ${
                            tipoApoyoMasImportante === t
                              ? 'bg-orange-500 text-slate-950 border-orange-600'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name="tipoApoyo"
                            checked={tipoApoyoMasImportante === t}
                            onChange={() => setTipoApoyoMasImportante(t as any)}
                          />
                          <span>{t}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 9: Preguntas abiertas finales */}
          {currentStep === 9 && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-200">
                <Sparkles className="w-5 h-5 text-orange-600" />
                <h3 className="text-base font-black text-slate-900">9. Preguntas abiertas finales</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-800">
                    Si la Universidad implementara una plataforma digital de apoyo a los cuidados, ¿qué debería permitir hacer?
                  </label>
                  <textarea
                    rows={3}
                    value={sugerenciaPlataforma}
                    onChange={(e) => setSugerenciaPlataforma(e.target.value)}
                    placeholder="Escriba sus sugerencias de funciones para la plataforma Ayni UMSA..."
                    className="w-full p-3.5 border border-slate-300 rounded-2xl bg-white font-medium text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-800">
                    ¿Qué acción o servicio considera que hace falta dentro de la Universidad para que las responsabilidades de cuidado no impidan continuar los estudios?
                  </label>
                  <textarea
                    rows={3}
                    value={accionFaltante}
                    onChange={(e) => setAccionFaltante(e.target.value)}
                    placeholder="Escriba qué servicios o acciones institucionales considera prioritarias..."
                    className="w-full p-3.5 border border-slate-300 rounded-2xl bg-white font-medium text-slate-900 focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-orange-950 flex items-center space-x-3 text-xs font-semibold">
                <CheckCircle2 className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <span>
                  ¡Ha llegado al final de la encuesta! Al hacer clic en enviar, su respuesta se registrará de forma anónima para la investigación de la UMSA.
                </span>
              </div>
            </div>
          )}

          {/* Wizard Navigation Footer Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2.5 border border-slate-300 hover:bg-slate-100 rounded-2xl font-bold text-slate-700 inline-flex items-center space-x-1.5 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < 9 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-orange-400 font-extrabold rounded-2xl shadow inline-flex items-center space-x-1.5 cursor-pointer"
              >
                <span>Siguiente Paso</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="px-8 py-3 bg-orange-500 hover:bg-orange-400 text-slate-950 font-black rounded-2xl shadow-xl inline-flex items-center space-x-2 cursor-pointer transition-all hover:scale-105"
              >
                <Send className="w-4 h-4" />
                <span>Enviar Respuesta UMSA</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
