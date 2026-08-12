import {
  CalendarEvent,
  CommunityPost,
  EducationalNarrative,
  KnowledgeItem,
  NetworkMember,
  StudentProfile,
  SurveyResponse,
  UmsaService,
} from '../types';

export const initialProfile: StudentProfile = {
  nombre: 'Lucía Mamani Quispe',
  ci: '8492019 LP',
  carrera: 'Sociología',
  facultad: 'Facultad de Ciencias Sociales',
  semestre: '6to Semestre',
  email: 'lucia.mamani@est.umsa.bo',
  telefono: '76543210',
  personasACargoCount: 2,
  tipoCuidado: ['Cuidado Infantil (Hijo 3 años)', 'Apoyo Madre Adulta Mayor'],
  horasSemanalesCuidado: 28,
  trabaja: true,
  horasSemanalesTrabajo: 15,
  necesidadesPrioritarias: [
    'Cupo en Centro Infantil Andresito',
    'Flexibilidad horaria en exámenes',
    'Apoyo en transporte seguro',
  ],
};

export const initialNetworkMembers: NetworkMember[] = [
  {
    id: 'net-1',
    nombre: 'Doña María Quispe',
    relacion: 'Madre/Padre',
    tipoApoyo: 'Cuidado infantil',
    frecuencia: 'Diaria',
    disponibilidad: 'Lunes a Viernes (08:00 - 13:00)',
    notas: 'Cuida a Mateo mientras asisto a clases matutinas en el Monoblock.',
    categoriaNodo: 'Familia',
  },
  {
    id: 'net-2',
    nombre: 'Carlos Mamani',
    relacion: 'Hermanos',
    tipoApoyo: 'Transporte y traslado',
    frecuencia: 'Ocasional',
    disponibilidad: 'Martes y Jueves por la tarde',
    notas: 'Ayuda a llevar a Mateo al centro médico o recoger materiales de la facultad.',
    categoriaNodo: 'Familia',
  },
  {
    id: 'net-3',
    nombre: 'Valeria Condori',
    relacion: 'Compañeros',
    tipoApoyo: 'Estudio compartido',
    frecuencia: 'Frecuente',
    disponibilidad: 'Fines de semana y tardes',
    notas: 'Me comparte apuntes de clases cuando tengo emergencias de cuidado.',
    categoriaNodo: 'Amigos',
  },
  {
    id: 'net-4',
    nombre: 'Centro Infantil Andresito UMSA',
    relacion: 'Instituciones',
    tipoApoyo: 'Cuidado infantil',
    frecuencia: 'Diaria',
    disponibilidad: 'Lunes a Viernes (07:30 - 17:00)',
    notas: 'Institución UMSA para hijos de estudiantes universitarios.',
    categoriaNodo: 'Instituciones',
  },
  {
    id: 'net-5',
    nombre: 'Doña Rosa (Vecina)',
    relacion: 'Vecinos',
    tipoApoyo: 'Acompañamiento en salud',
    frecuencia: 'En emergencias',
    disponibilidad: 'Noches o fines de semana',
    notas: 'Apoyo para cuidar la casa o avisar de emergencias en el barrio.',
    categoriaNodo: 'Comunidad',
  },
];

export const initialUmsaServices: UmsaService[] = [
  {
    id: 'serv-1',
    nombre: 'Centro Infantil Andresito UMSA',
    categoria: 'Cuidado infantil',
    ubicacion: 'Predios Centrales Monoblock, Av. Villazón Nro. 1995, Edif. Antiguo',
    campus: 'Monoblock Central',
    coordenadasMapa: { x: 45, y: 35 },
    horario: 'Lunes a Viernes de 07:30 a 17:00',
    contacto: '2440333 / 71520011',
    email: 'centroinfantil.andresito@umsa.bo',
    descripcion:
      'Servicio de atención integral para hijas e hijos de estudiantes de la UMSA (desde los 6 meses hasta los 5 años), brindando estimulación temprana, alimentación y cuidado pedagógico mientras los padres asisten a clases.',
    comoAcceder: [
      '1. Presentar Matrícula Universitaria vigente del padre/madre estudiante.',
      '2. Certificado de nacimiento del niño/a.',
      '3. Carnet de vacunas al día.',
      '4. Formulario de inscripción del Departamento de Bienestar Social UMSA.',
    ],
    destacado: true,
  },
  {
    id: 'serv-2',
    nombre: 'Departamento de Bienestar Social UMSA',
    categoria: 'Bienestar',
    ubicacion: 'Monoblock Central, Piso 2 (Entrada Calle J.J. Pérez)',
    campus: 'Monoblock Central',
    coordenadasMapa: { x: 50, y: 40 },
    horario: 'Lunes a Viernes de 08:30 a 16:30',
    contacto: '2441520 / 2442201',
    email: 'bienestarsocial@umsa.bo',
    descripcion:
      'Gestiona programas de becas (comedor, trabajo, idh), orientación social, apoyo de salud y atención prioritaria para estudiantes con vulnerabilidad socioeconómica y cargas de cuidado.',
    comoAcceder: [
      '1. Solicitar cita de evaluación socioeconómica presencial o virtual.',
      '2. Presentar fotocopia de C.I., matrícula y comprobantes de ingreso/gastos del hogar.',
      '3. Declaración jurada de personas bajo su cuidado.',
    ],
    destacado: true,
  },
  {
    id: 'serv-3',
    nombre: 'Comedor Universitario Central',
    categoria: 'Información sobre becas',
    ubicacion: 'Monoblock Central, Subsuelo Patio Técnico',
    campus: 'Monoblock Central',
    coordenadasMapa: { x: 40, y: 50 },
    horario: 'Almuerzo: 11:30 - 14:00 | Cena: 17:30 - 19:00',
    contacto: '2440011 int. 112',
    descripcion:
      'Proporciona raciones alimenticias balanceadas gratuitas o subvencionadas para estudiantes becarios. Cuenta con atención preferencial para estudiantes gestantes o con infantes.',
    comoAcceder: [
      '1. Postular a la Convocatoria Anual de Beca Comedor UMSA.',
      '2. Validar carnet de becario en el sistema de Bienestar.',
    ],
    destacado: false,
  },
  {
    id: 'serv-4',
    nombre: 'Defensoría Universitaria UMSA',
    categoria: 'Orientación universitaria',
    ubicacion: 'Av. 6 de Agosto, Edificio Hoy, Piso 4',
    campus: 'Monoblock Central',
    coordenadasMapa: { x: 55, y: 30 },
    horario: 'Lunes a Viernes de 09:00 a 16:00',
    contacto: '2443090',
    email: 'defensoria@umsa.bo',
    descripcion:
      'Protege los derechos universitarios de los estudiantes. Asesora y defiende ante situaciones de discriminación, falta de flexibilidad docente por emergencias de cuidado o conciliación de horarios.',
    comoAcceder: [
      '1. Presentar nota dirigida al Defensor Universitario detallando la situación.',
      '2. Adjuntar justificativos (certificados médicos o certificados de cuidado).',
    ],
    destacado: true,
  },
  {
    id: 'serv-5',
    nombre: 'Gabinete de Apoyo Psicológico Estudiantil',
    categoria: 'Bienestar',
    ubicacion: 'Campus Cota Cota, Calle 27, Edificio de Ciencias Sociales/Psicología',
    campus: 'Cota Cota',
    coordenadasMapa: { x: 75, y: 70 },
    horario: 'Lunes a Viernes de 08:30 a 15:30',
    contacto: '72009841',
    descripcion:
      'Atención psicoterapéutica individual y talleres de manejo del estrés para estudiantes universitarios, enfocados en la sobrecarga emocional de estudiar y cuidar.',
    comoAcceder: [
      '1. Reserva de ficha vía WhatsApp o presencial en recepción de Cota Cota.',
      '2. Presentar matrícula universitaria vigente.',
    ],
    destacado: false,
  },
  {
    id: 'serv-6',
    nombre: 'Biblioteca Central UMSA (Área de Estudio Inclusivo)',
    categoria: 'Apoyo académico',
    ubicacion: 'Monoblock Central, Planta Baja',
    campus: 'Monoblock Central',
    coordenadasMapa: { x: 48, y: 45 },
    horario: 'Lunes a Viernes de 08:00 a 20:00 | Sábados 09:00 - 13:00',
    contacto: '2441982',
    descripcion:
      'Acceso a préstamos bibliográficos, bases de datos digitales, cubículos de estudio grupal y espacio amigable habilitado para consulta rápida.',
    comoAcceder: ['Presentar Carnet Universitario o C.I. vigente en el mostrador.'],
    destacado: false,
  },
  {
    id: 'serv-7',
    nombre: 'Guardería de Convenio Municipal Cotahuma',
    categoria: 'Cuidado infantil',
    ubicacion: 'Av. Buenos Aires esq. Jaimes Freyre, Zona Cotahuma',
    campus: 'Cotahuma',
    coordenadasMapa: { x: 25, y: 60 },
    horario: 'Lunes a Viernes de 07:00 a 18:00',
    contacto: '2411099',
    descripcion:
      'Centro de cuidado infantil en convenio con la UMSA para estudiantes que residen en la Zona Oeste y Cotahuma.',
    comoAcceder: [
      '1. Certificado de alumno regular UMSA.',
      '2. Fotocopia de C.I. de los padres y niño/a.',
    ],
    destacado: false,
  },
];

export const initialCalendarEvents: CalendarEvent[] = [
  {
    id: 'evt-1',
    titulo: 'Examen Parcial de Sociología Boliviana',
    categoria: 'academico',
    fecha: '2026-08-12',
    hora: '10:00',
    recordatorioHora: '09:00',
    completada: false,
    notas: 'Aula 204 Monoblock Central. Repasar lecturas de Zavaleta Mercado.',
    urgente: true,
  },
  {
    id: 'evt-2',
    titulo: 'Llevar a Mateo al control pediátrico (Caja de Salud)',
    categoria: 'cuidado',
    fecha: '2026-08-12',
    hora: '16:00',
    recordatorioHora: '15:00',
    completada: false,
    notas: 'Llevar carnet de vacunas y libreta de salud.',
    urgente: true,
  },
  {
    id: 'evt-3',
    titulo: 'Entrega de ensayo de Métodos de Investigación',
    categoria: 'academico',
    fecha: '2026-08-14',
    hora: '23:59',
    recordatorioHora: '18:00',
    completada: false,
    notas: 'Subir PDF a la plataforma Moodle de la carrera.',
    urgente: false,
  },
  {
    id: 'evt-4',
    titulo: 'Reunión familiar para acordar turnos de cuidado de mamá',
    categoria: 'cuidado',
    fecha: '2026-08-15',
    hora: '19:00',
    recordatorioHora: '18:30',
    completada: false,
    notas: 'Definir quiéñ la acompañará al traumatólogo el próximo martes.',
    urgente: false,
  },
  {
    id: 'evt-5',
    titulo: 'Turno de trabajo de apoyo administrativo medio tiempo',
    categoria: 'personal',
    fecha: '2026-08-13',
    hora: '14:00',
    recordatorioHora: '13:30',
    completada: false,
    notas: 'Oficina Miraflores.',
    urgente: false,
  },
];

export const initialCommunityPosts: CommunityPost[] = [
  {
    id: 'post-1',
    autorNombre: 'Gonzalo Fernández',
    autorCarrera: 'Ingeniería Civil',
    tipoMedio: 'video',
    titulo: 'Cómo organizo mis estudios y el cuidado de mi hijo de 2 años',
    contenido:
      'Hola a la comunidad Ayni UMSA. Les comparto este breve video con 3 estrategias que me funcionaron para no congelar materias en Ingeniería mientras cuido a mi pequeño Benjamín. La clave ha sido sincronizar los bloques de siesta con las horas de estudio intensivo.',
    mediaUrl: 'https://assets.mixkit.co/videos/preview/mixkit-studying-with-a-laptop-4232-large.mp4',
    fecha: '2026-08-08',
    estado: 'publicado',
    meGusta: 24,
    etiquetas: ['Estudio', 'CuidadoInfantil', 'Ingeniería'],
  },
  {
    id: 'post-2',
    autorNombre: 'Carla Villca',
    autorCarrera: 'Derecho',
    tipoMedio: 'audio',
    titulo: 'Mi experiencia como hermana mayor cuidadora y estudiante',
    contenido:
      'Podcast testimonial sobre la corresponsabilidad cuando te toca cuidar a tus hermanos menores mientras tus padres trabajan todo el día.',
    mediaUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    fecha: '2026-08-05',
    estado: 'publicado',
    meGusta: 18,
    etiquetas: ['HermanosCuidadores', 'Derecho', 'Testimonio'],
  },
  {
    id: 'post-3',
    autorNombre: 'Ramiro Ticona',
    autorCarrera: 'Medicina',
    tipoMedio: 'texto',
    titulo: 'Cómo logré organizarme en época de exámenes finales y turnos',
    contenido:
      'Escribo esto para quienes sienten que no pueden más. Armar una red con otros dos compañeros papás en la facultad nos salvó el semestre: intercambiamos apuntes, cuidamos a los niños por turnos de 3 horas y estudiamos en grupo en la biblioteca.',
    fecha: '2026-08-02',
    estado: 'publicado',
    meGusta: 31,
    etiquetas: ['Medicina', 'Exámenes', 'RedDeApoyo'],
  },
  {
    id: 'post-4',
    autorNombre: 'Elena Yujra',
    autorCarrera: 'Trabajo Social',
    tipoMedio: 'fotografia',
    titulo: 'El espacio amigable en la facultad que construimos juntas',
    contenido:
      'Miren la fotografía de nuestro rinconcito de lactancia y lectura infantil gestionado en el centro de estudiantes.',
    mediaUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
    fecha: '2026-08-10',
    estado: 'pendiente',
    meGusta: 0,
    etiquetas: ['Lactancia', 'Comunidad', 'TrabajoSocial'],
  },
];

export const initialKnowledgeBase: KnowledgeItem[] = [
  {
    id: 'kb-1',
    pregunta: '¿Dónde está el Centro Infantil Andresito y cuáles son los requisitos?',
    respuesta:
      'El Centro Infantil Andresito se encuentra en los predios del Monoblock Central de la UMSA (Av. Villazón Nro. 1995, Edificio Antiguo). Para inscribir a tu hijo/a necesitas: 1) Matrícula universitaria vigente del padre/madre, 2) Certificado de nacimiento del niño/a, 3) Carnet de vacunas al día, y 4) Formulario de Bienestar Social.',
    categoria: 'Servicios e Infraestructura',
    etiquetas: ['Centro Infantil', 'Andresito', 'Cuidado Infantil', 'Monoblock'],
  },
  {
    id: 'kb-2',
    pregunta: '¿Cómo puedo postular a las becas de la UMSA si tengo personas a cargo?',
    respuesta:
      'El Departamento de Bienestar Social UMSA publica convocatorias anuales para Beca Comedor, Beca Trabajo e Beca IDH. Al contar con hijas/os o adultos mayores dependientes, obtienes puntuación ponderada prioritaria en la evaluación socioeconómica. Debes adjuntar certificados de nacimiento o certificados médicos de dependencia.',
    categoria: 'Becas y Apoyo Económico',
    etiquetas: ['Becas', 'Comedor', 'Bienestar Social', 'Requisitos'],
  },
  {
    id: 'kb-3',
    pregunta: '¿Qué puedo hacer si un docente no flexibiliza la asistencia por emergencia médica de mi hijo?',
    respuesta:
      'Puedes acudir a la Defensoría Universitaria UMSA (Av. 6 de Agosto, Edif. Hoy, Piso 4). La normativa institucional resguarda la permanencia estudiantil. Presenta una carta adjuntando el certificado médico o comprobante de atención para solicitar una recalendarización justa de exámenes o trabajos.',
    categoria: 'Normativa e Inclusión',
    etiquetas: ['Defensoría', 'Docentes', 'Flexibilidad', 'Derechos Estudiantiles'],
  },
  {
    id: 'kb-4',
    pregunta: '¿Existe atención psicológica o de salud mental para estudiantes en la UMSA?',
    respuesta:
      'Sí, el Gabinete de Apoyo Psicológico Estudiantil en el campus Cota Cota y el servicio de Salud Estudiantil del Seguro Social Universitario brindan atención psicoterapéutica gratuita o subvencionada para estudiantes con matrícula al día.',
    categoria: 'Bienestar y Salud',
    etiquetas: ['Psicología', 'Salud Mental', 'Bienestar'],
  },
];

export const initialEducationalNarratives: EducationalNarrative[] = [
  {
    id: 'narr-1',
    titulo: 'La organización del cuidado como pilar de la corresponsabilidad social',
    categoria: 'Cuidado',
    resumen:
      'Análisis sobre cómo las cargas no pagadas de cuidado afectan desproporcionadamente la permanencia universitaria de los estudiantes.',
    contenido: `El cuidado de niños, niñas, personas con discapacidad y adultos mayores constituye el sostén cotidiano de la vida social y universitaria. Sin embargo, en el ámbito de la Universidad Mayor de San Andrés (UMSA), la investigación diagnóstica revela que más del 70% de las tareas de cuidado dentro de los hogares de los estudiantes recae en las mujeres (madres o hermanas mayores).

Promover la corresponsabilidad social implica redistribuir equitativamente el trabajo de cuidado entre hombres, mujeres, familias, comunidades y la propia universidad pública.

Puntos clave de la investigación:
• La triple jornada: Estudio + Cuidado + Trabajo informal.
• Invisibilización institucional: Ausencia de espacios infantiles en la mayoría de los campus secundarios.
• Estrategias colectivas: Redes entre pares e intercambio comunitario de horas de cuidado.`,
    tipo: 'articulo',
    tiempoLectura: '5 min de lectura',
    autor: 'Equipo de Investigación Ayni UMSA',
    fecha: 'Julio 2026',
  },
  {
    id: 'narr-2',
    titulo: 'Narrativas emergentes: Historias de vida de estudiantes cuidadores en la UMSA',
    categoria: 'Narrativas UMSA',
    resumen:
      'Testimonios recogidos en los talleres de cartografía social en la Facultad de Ciencias Sociales y Humanidades.',
    contenido: `Durante el proceso de levantamiento cualitativo, se identificaron cuatro grandes tipos de historias estudiantiles:

1. "Madres jóvenes en las aulas": Estudiantes que asisten a clases teóricas amamantando o llevando juguetes a pupitres traseros.
2. "Hijos cuidadores de padres mayores": Jóvenes de últimos semestres que coordinan tratamientos de salud para adultos mayores en casa mientras preparan sus tesis.
3. "Hermanos mayores tutores": Estudiantes cuyos padres migraron o trabajan doble turno, asumiendo la crianza completa de hermanos menores.
4. "Padres universitarios en búsqueda de corresponsabilidad": Hombres jóvenes que demandan guarderías con horario nocturno para la Facultad de Ingeniería y Tecnología.`,
    tipo: 'articulo',
    tiempoLectura: '7 min de lectura',
    autor: 'Investigadoras Observatorio UMSA',
    fecha: 'Junio 2026',
  },
  {
    id: 'narr-3',
    titulo: 'Infografía interactiva: ¿Cómo mapear tu Red Social de Cuidados?',
    categoria: 'Recursos Educativos',
    resumen:
      'Guía gráfica paso a paso para identificar tus vínculos primarios, secundarios e institucionales y fortalecer tu red.',
    contenido: `Paso 1: Identifica a tus actores primarios (familiares directos que aportan horas de cuidado directo).
Paso 2: Reconoce a tus actores secundarios (compañeros de curso que comparten notas, vecinos, amigos).
Paso 3: Mapea a tus actores institucionales (Centro Infantil Andresito, Comedor UMSA, becas).
Paso 4: Evalúa la frecuencia y disponibilidad de cada conexión para activar apoyos de emergencia sin sobrecargar un solo vínculo.`,
    tipo: 'infografia',
    tiempoLectura: '3 min de lectura',
    autor: 'Ayni UMSA Pedagógico',
    fecha: 'Agosto 2026',
  },
];

export const initialSurveyAggregateStats = {
  totalParticipantes: 342,
  distribucionGeneros: [
    { name: 'Mujeres', value: 68 },
    { name: 'Hombres', value: 30 },
    { name: 'Otro/Prefiero no decir', value: 2 },
  ],
  proveedoresPrincipalesApoyo: [
    { name: 'Madre/Padre', porcentaje: 45 },
    { name: 'Pareja', porcentaje: 28 },
    { name: 'Hermanos/as', porcentaje: 14 },
    { name: 'Amigos/Compañeros', porcentaje: 8 },
    { name: 'Instituciones UMSA', porcentaje: 5 },
  ],
  horasSemanalesCuidado: [
    { rango: '1 - 10 horas', estudiantes: 65 },
    { rango: '11 - 20 horas', estudiantes: 112 },
    { rango: '21 - 30 horas', estudiantes: 98 },
    { rango: 'Más de 30 horas', estudiantes: 67 },
  ],
  necesidadesMasReportadas: [
    { necesidad: 'Cupo / Ampliación Centro Infantil', cantidad: 189 },
    { necesidad: 'Flexibilidad de horarios y asistencia', cantidad: 165 },
    { necesidad: 'Becas o apoyo económico directo', cantidad: 142 },
    { necesidad: 'Acompañamiento psicológico y manejo de estrés', cantidad: 98 },
    { necesidad: 'Espacios amigables de lactancia en facultades', cantidad: 84 },
  ],
  participacionPorFacultad: [
    { facultad: 'Ciencias Sociales', estudiantes: 88 },
    { facultad: 'Humanidades y Educación', estudiantes: 74 },
    { facultad: 'Derecho y Ciencias Políticas', estudiantes: 56 },
    { facultad: 'Medicina y Enfermería', estudiantes: 48 },
    { facultad: 'Ingeniería y Tecnología', estudiantes: 42 },
    { facultad: 'Agronomía y Económicas', estudiantes: 34 },
  ],
};
