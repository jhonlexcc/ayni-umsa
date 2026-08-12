import * as XLSX from 'xlsx';
import { RegisteredUser } from './firebase';
import { SurveyResponse } from '../types';

/**
 * EXPORT USERS TO EXCEL
 */
export function exportUsersToExcel(users: RegisteredUser[], filename = 'Nomina_Estudiantes_UMSA.xlsx') {
  const exportData = users.map((u, index) => ({
    'N°': index + 1,
    'Carnet de Identidad (C.I.)': u.ci,
    'Nombre Completo': u.nombre,
    'Correo Electrónico': u.email || '',
    'Correo Institucional (@umsa.bo)': u.esCorreoInstitucional ? 'Sí' : 'No',
    'Carrera UMSA': u.carrera,
    'Semestre': u.semestre,
    'Facultad': u.facultad,
    'Rol': u.rol,
    'Contraseña por Defecto': u.password || u.ci,
    'Encuesta Completada': u.surveyCompleted ? 'Sí' : 'No',
    'Fecha de Registro': u.fechaRegistro || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 5 },  // N°
    { wch: 22 }, // CI
    { wch: 30 }, // Nombre
    { wch: 28 }, // Correo
    { wch: 25 }, // Institucional
    { wch: 25 }, // Carrera
    { wch: 15 }, // Semestre
    { wch: 30 }, // Facultad
    { wch: 15 }, // Rol
    { wch: 22 }, // Password
    { wch: 20 }, // Encuesta
    { wch: 25 }, // Fecha
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios UMSA');
  XLSX.writeFile(workbook, filename);
}

/**
 * IMPORT USERS FROM EXCEL / CSV FILE
 */
export async function parseUsersExcelFile(file: File): Promise<RegisteredUser[]> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  const users: RegisteredUser[] = [];

  rows.forEach((row) => {
    // Look for CI in various common column names
    const ci = String(
      row['Carnet de Identidad (C.I.)'] ||
        row['CI'] ||
        row['ci'] ||
        row['Carnet'] ||
        row['CARNET'] ||
        row['Cedula'] ||
        row['ID'] ||
        ''
    ).trim();

    if (!ci) return;

    const nombre = String(
      row['Nombre Completo'] ||
        row['Nombre'] ||
        row['Nombres'] ||
        row['NOMBRE'] ||
        `Estudiante CI ${ci}`
    ).trim();

    const carrera = String(row['Carrera UMSA'] || row['Carrera'] || row['CARRERA'] || 'Ciencias Sociales').trim();
    const semestre = String(row['Semestre'] || row['SEMESTRE'] || '1er Semestre').trim();
    const facultad = String(row['Facultad'] || row['FACULTAD'] || 'Facultad de Ciencias Sociales').trim();
    const rolRaw = String(row['Rol'] || row['ROL'] || 'estudiante').toLowerCase().trim();
    const rol = rolRaw.includes('admin') ? 'administrador' : 'estudiante';
    const password = String(row['Contraseña por Defecto'] || row['Password'] || ci).trim();

    users.push({
      ci,
      nombre,
      carrera,
      semestre,
      facultad,
      rol,
      password: password || ci,
      surveyCompleted: String(row['Encuesta Completada'] || '').toLowerCase() === 'sí' || false,
      fechaRegistro: new Date().toISOString(),
    });
  });

  return users;
}

/**
 * EXPORT SURVEYS TO EXCEL
 */
export function exportSurveysToExcel(
  surveys: (SurveyResponse & { ci: string })[],
  filename = 'Encuestas_Cuidados_UMSA.xlsx'
) {
  const exportData = surveys.map((s, idx) => ({
    'N°': idx + 1,
    'Carnet (C.I.)': s.ci,
    'Edad': s.edad,
    'Carrera': s.carrera,
    'Semestre': s.semestre,
    'Género': s.genero === 'Otro' && s.generoOtro ? `Otro: ${s.generoOtro}` : s.genero,
    'Trabaja además de estudiar': s.trabaja,
    'Con quién vive': s.viveCon === 'Otro' && s.viveConOtro ? `Otro: ${s.viveConOtro}` : s.viveCon,

    // Responsabilidades
    'Responsabilidades de cuidado': (s.responsabilidadesCuidado || []).join('; '),

    // Distribución
    'Cuidado Directo': s.distribucionCuidado?.cuidadoDirecto || '',
    'Organización Horarios': s.distribucionCuidado?.organizacionHorarios || '',
    'Tareas Domésticas Cuidado': s.distribucionCuidado?.tareasDomesticas || '',

    // Consecuencias
    'Consecuencias en Estudios': (s.consecuenciasEstudios || []).join('; '),

    // Modelos
    'Responsabilidad Actual': s.responsabilidadActual || '',
    'Responsabilidad Ideal': s.responsabilidadIdeal || '',

    // Creencias 1 - 10
    'Creencia 1 (Naturalidad género)': s.creenciasCuidado?.[1] || '',
    'Creencia 2 (Priorizar familia madre)': s.creenciasCuidado?.[2] || '',
    'Creencia 3 (Aporte económico padre)': s.creenciasCuidado?.[3] || '',
    'Creencia 4 (Distribución sin género)': s.creenciasCuidado?.[4] || '',
    'Creencia 5 (Cuidado privado familia)': s.creenciasCuidado?.[5] || '',
    'Creencia 6 (Servicios públicos derechos)': s.creenciasCuidado?.[6] || '',
    'Creencia 7 (Flexibilidad ventaja injusta)': s.creenciasCuidado?.[7] || '',
    'Creencia 8 (Pedir ayuda vecinal)': s.creenciasCuidado?.[8] || '',
    'Creencia 9 (Cuidado comunitario trabajo)': s.creenciasCuidado?.[9] || '',
    'Creencia 10 (Red comunitaria confianza)': s.creenciasCuidado?.[10] || '',

    // Narrativas
    'Frases Frecuentes Escuchadas': (s.frasesFrecuentes || []).join('; ') + (s.fraseOtro ? `; Otro: ${s.fraseOtro}` : ''),
    'Dónde Escucha las Frases': (s.dondeEscuchaFrases || []).join('; ') + (s.dondeEscuchaOtro ? `; Otro: ${s.dondeEscuchaOtro}` : ''),

    // Caso Hipotético & Clima
    'Caso Hipotético (Ocurriría)': s.hipoteticaOcurriria || '',
    'Caso Hipotético (Debería Ocurrir)': s.hipoteticaDeberiaOcurrir || '',
    'Juzgado docente/compañero': s.sienteJuzgadoPadreMadre || '',
    'Conoce servicios apoyo UMSA': s.conoceServiciosApoyo || '',
    'Tipo de apoyo más importante': s.tipoApoyoMasImportante || '',

    // Propuestas abiertas
    'Propuesta Plataforma Digital': s.sugerenciaPlataformaDigital || '',
    'Acción/Servicio Faltante UMSA': s.accionOservicioFaltante || '',

    'Fecha Completado': s.fechaCompletado || '',
  }));

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Encuestas UMSA');
  XLSX.writeFile(workbook, filename);
}

/**
 * IMPORT SURVEYS FROM EXCEL
 */
export async function parseSurveysExcelFile(file: File): Promise<(SurveyResponse & { ci: string })[]> {
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

  const surveys: (SurveyResponse & { ci: string })[] = [];

  rows.forEach((row) => {
    const ci = String(row['Carnet (C.I.)'] || row['CI'] || row['ci'] || row['Carnet'] || '').trim();
    if (!ci) return;

    const respStr = String(row['Responsabilidades de cuidado'] || '');
    const responsabilidadesCuidado = respStr ? respStr.split(';').map((s) => s.trim()) : ['No tengo responsabilidades de cuidado'];

    const consStr = String(row['Consecuencias en Estudios'] || '');
    const consecuenciasEstudios = consStr ? consStr.split(';').map((s) => s.trim()) : [];

    const frasesStr = String(row['Frases Frecuentes Escuchadas'] || '');
    const frasesFrecuentes = frasesStr ? frasesStr.split(';').map((s) => s.trim()) : [];

    const dondeStr = String(row['Dónde Escucha las Frases'] || '');
    const dondeEscuchaFrases = dondeStr ? dondeStr.split(';').map((s) => s.trim()) : [];

    surveys.push({
      completada: true,
      ci,
      edad: Number(row['Edad']) || 22,
      carrera: String(row['Carrera'] || 'Ciencias Sociales').trim(),
      semestre: String(row['Semestre'] || '1er Semestre').trim(),
      genero: (row['Género'] as any) || 'Mujer',
      trabaja: row['Trabaja además de estudiar'] === 'Sí' ? 'Sí' : 'No',
      viveCon: (row['Con quién vive'] as any) || 'Familia',
      responsabilidadesCuidado,
      distribucionCuidado: {
        cuidadoDirecto: String(row['Cuidado Directo'] || 'Yo'),
        organizacionHorarios: String(row['Organización Horarios'] || 'Se comparte'),
        tareasDomesticas: String(row['Tareas Domésticas Cuidado'] || 'Otra mujer'),
      },
      consecuenciasEstudios,
      responsabilidadActual: String(row['Responsabilidad Actual'] || 'Principalmente la familia'),
      responsabilidadIdeal: String(row['Responsabilidad Ideal'] || 'Compartida entre familia, Estado y comunidad'),
      creenciasCuidado: {
        1: String(row['Creencia 1 (Naturalidad género)'] || 'Totalmente de acuerdo'),
        2: String(row['Creencia 2 (Priorizar familia madre)'] || 'De acuerdo'),
        3: String(row['Creencia 3 (Aporte económico padre)'] || 'De acuerdo'),
        4: String(row['Creencia 4 (Distribución sin género)'] || 'Totalmente de acuerdo'),
        5: String(row['Creencia 5 (Cuidado privado familia)'] || 'En desacuerdo'),
        6: String(row['Creencia 6 (Servicios públicos derechos)'] || 'Totalmente de acuerdo'),
        7: String(row['Creencia 7 (Flexibilidad ventaja injusta)'] || 'Totalmente en desacuerdo'),
        8: String(row['Creencia 8 (Pedir ayuda vecinal)'] || 'En desacuerdo'),
        9: String(row['Creencia 9 (Cuidado comunitario trabajo)'] || 'Totalmente de acuerdo'),
        10: String(row['Creencia 10 (Red comunitaria confianza)'] || 'Totalmente de acuerdo'),
      },
      frasesFrecuentes,
      dondeEscuchaFrases,
      hipoteticaOcurriria: String(row['Caso Hipotético (Ocurriría)'] || 'Valeria faltaría a su evaluación.'),
      hipoteticaDeberiaOcurrir: String(row['Caso Hipotético (Debería Ocurrir)'] || 'Solicitarían apoyo o flexibilidad a la universidad.'),
      sienteJuzgadoPadreMadre: (row['Juzgado docente/compañero'] as any) || 'A veces',
      conoceServiciosApoyo: row['Conoce servicios apoyo UMSA'] === 'Sí' ? 'Sí' : 'No',
      tipoApoyoMasImportante: (row['Tipo de apoyo más importante'] as any) || 'Académico',
      sugerenciaPlataformaDigital: String(row['Propuesta Plataforma Digital'] || ''),
      accionOservicioFaltante: String(row['Acción/Servicio Faltante UMSA'] || ''),
      fechaCompletado: String(row['Fecha Completado'] || new Date().toISOString()),
    });
  });

  return surveys;
}
