export type Role = 'visitante' | 'estudiante' | 'administrador';

export type SupportRelation =
  | 'Madre/Padre'
  | 'Pareja'
  | 'Hermanos'
  | 'Hijos'
  | 'Abuelos'
  | 'Amigos'
  | 'Vecinos'
  | 'Compañeros'
  | 'Instituciones'
  | 'Otros';

export type SupportType =
  | 'Cuidado infantil'
  | 'Transporte y traslado'
  | 'Apoyo económico'
  | 'Apoyo emocional'
  | 'Estudio compartido'
  | 'Cuidado de adultos mayores'
  | 'Tareas del hogar'
  | 'Acompañamiento en salud'
  | 'Otro';

export type Frequency = 'Diaria' | 'Frecuente' | 'Ocasional' | 'En emergencias';

export interface NetworkMember {
  id: string;
  nombre: string;
  relacion: SupportRelation;
  tipoApoyo: SupportType;
  frecuencia: Frequency;
  disponibilidad: string; // e.g. "Lunes a Viernes mañanas"
  notas?: string;
  categoriaNodo: 'Familia' | 'Amigos' | 'Instituciones' | 'Comunidad';
}

export interface StudentProfile {
  nombre: string;
  ci: string;
  carrera: string;
  facultad: string;
  semestre: string;
  email: string;
  telefono: string;
  personasACargoCount: number;
  tipoCuidado: string[]; // e.g. ['Hijos', 'Adulto Mayor']
  horasSemanalesCuidado: number;
  trabaja: boolean;
  horasSemanalesTrabajo: number;
  necesidadesPrioritarias: string[];
}

export interface SurveyResponse {
  completada: boolean;
  fechaCompletado?: string;
  // 1. Datos generales
  edad: number;
  carrera: string;
  semestre: string;
  genero: 'Mujer' | 'Hombre' | 'Prefiero no responder' | 'Otro';
  generoOtro?: string;
  trabaja: 'Sí' | 'No';
  viveCon: 'Solo/a' | 'Familia' | 'Pareja' | 'Amigos' | 'Otro';
  viveConOtro?: string;

  // 2. Responsabilidades de cuidado
  responsabilidadesCuidado: string[];

  // 3. Distribución del cuidado
  distribucionCuidado: {
    cuidadoDirecto: string;
    organizacionHorarios: string;
    tareasDomesticas: string;
  };

  // 4. Consecuencias en los estudios
  consecuenciasEstudios: string[];

  // 5. Responsabilidad actual y responsabilidad ideal
  responsabilidadActual: string;
  responsabilidadIdeal: string;

  // 6. Creencias sobre el cuidado (10 afirmaciones)
  creenciasCuidado: Record<number, string>;

  // 7. Narrativas que circulan
  frasesFrecuentes: string[];
  fraseOtro?: string;
  dondeEscuchaFrases: string[];
  dondeEscuchaOtro?: string;

  // 8. Situación hipotética
  hipoteticaOcurriria: string;
  hipoteticaDeberiaOcurrir: string;
  sienteJuzgadoPadreMadre: 'Sí' | 'No' | 'A veces';
  conoceServiciosApoyo: 'Sí' | 'No';
  tipoApoyoMasImportante: 'Emocional' | 'Académico' | 'Económico' | 'Psicológico' | 'Legal' | 'Otro';

  // 9. Pregunta abierta final
  sugerenciaPlataformaDigital: string;
  accionOservicioFaltante: string;
}

export type ServiceCategory =
  | 'Cuidado infantil'
  | 'Apoyo académico'
  | 'Información sobre becas'
  | 'Orientación universitaria'
  | 'Bienestar'
  | 'Información institucional'
  | 'Otro';

export interface UmsaService {
  id: string;
  nombre: string;
  categoria: ServiceCategory;
  ubicacion: string;
  campus: 'Monoblock Central' | 'Cota Cota' | 'Miraflores' | 'Cotahuma' | 'Otros Campus';
  coordenadasMapa: { x: number; y: number }; // % positions on UMSA campus map
  horario: string;
  contacto: string;
  email?: string;
  descripcion: string;
  comoAcceder: string[];
  destacado?: boolean;
}

export type EventDomain = 'academico' | 'cuidado' | 'personal';

export interface CalendarEvent {
  id: string;
  titulo: string;
  categoria: EventDomain;
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:MM
  recordatorioHora?: string;
  completada: boolean;
  notas?: string;
  urgente?: boolean;
}

export type MediaType = 'texto' | 'audio' | 'video' | 'fotografia';

export interface CommunityPost {
  id: string;
  autorNombre: string;
  autorCarrera: string;
  tipoMedio: MediaType;
  titulo: string;
  contenido: string;
  mediaUrl?: string; // audio/video simulation URL or photo
  fecha: string;
  estado: 'publicado' | 'pendiente' | 'rechazado';
  meGusta: number;
  etiquetas: string[];
}

export interface KnowledgeItem {
  id: string;
  pregunta: string;
  respuesta: string;
  categoria: string;
  etiquetas: string[];
}

export interface EducationalNarrative {
  id: string;
  titulo: string;
  categoria: 'Cuidado' | 'Corresponsabilidad' | 'Narrativas UMSA' | 'Recursos Educativos';
  resumen: string;
  contenido: string;
  tipo: 'infografia' | 'articulo' | 'guia' | 'video';
  tiempoLectura: string;
  autor: string;
  fecha: string;
}
