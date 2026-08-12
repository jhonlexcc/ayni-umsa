export interface KnowledgeItem {
  id: string;
  pregunta: string;
  respuesta: string;
  categoria: string;
  etiquetas: string[];
}

export const knowledgeBase: KnowledgeItem[] = [
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
      'El Departamento de Bienestar Social UMSA publica convocatorias anuales para Beca Comedor, Beca Trabajo y Beca IDH. Al contar con hijas/os o adultos mayores dependientes, obtienes puntuación ponderada prioritaria en la evaluación socioeconómica. Debes adjuntar certificados de nacimiento o certificados médicos de dependencia.',
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

export const systemInstruction = `Eres 'Ayni Bot', el chatbot oficial de orientación universitaria de la plataforma Ayni UMSA (Universidad Mayor de San Andrés, La Paz, Bolivia).
Tu objetivo es orientar a estudiantes universitarios que tienen responsabilidades de cuidado (hijas/os, hermanos menores, adultos mayores o familiares dependientes).
Debes ser amable, empático, claro y muy preciso.
NO debes inventar información no sustentada sobre trámites o servicios. Utiliza principalmente la siguiente Base de Conocimientos oficial de la UMSA para fundamentar tus respuestas:

BASE DE CONOCIMIENTOS OFICIAL UMSA:
${knowledgeBase.map((k) => `Pregunta: ${k.pregunta}\nRespuesta: ${k.respuesta}`).join('\n---\n')}

Si la consulta se refiere a ubicaciones o servicios (Centro Infantil Andresito, Bienestar Social, Defensoría, Comedor Universitario, Apoyo Psicológico), brinda indicaciones claras sobre ubicación, horarios y pasos para acceder. Si el estudiante solicita asesoramiento legal o psicológico urgente, orientalo a la Defensoría Universitaria o al Gabinete Psicológico UMSA.`;

export function fallbackReply(message: string): { reply: string; source: string } {
  const matched = knowledgeBase.find(
    (k) =>
      message.toLowerCase().includes(k.pregunta.toLowerCase().slice(0, 15)) ||
      k.etiquetas.some((tag) => message.toLowerCase().includes(tag.toLowerCase()))
  );

  return matched
    ? { reply: `[Base de Conocimiento UMSA]: ${matched.respuesta}`, source: 'Base de Conocimiento UMSA' }
    : {
        reply:
          'Hola, soy Ayni Bot, la guía de orientación universitaria para estudiantes con responsabilidades de cuidado en la UMSA. Puedes consultarme sobre el Centro Infantil Andresito, el Departamento de Bienestar Social, la Defensoría Universitaria o trámites de becas.',
        source: 'Asistente Institucional UMSA',
      };
}
