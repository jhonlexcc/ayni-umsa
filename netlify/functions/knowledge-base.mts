import { knowledgeBase } from '../shared/knowledgeBase.js';

export const config = { path: '/api/knowledge-base' };

export default async (req: Request): Promise<Response> => {
  if (req.method === 'GET') {
    return Response.json(knowledgeBase);
  }

  if (req.method === 'POST') {
    const { pregunta, respuesta, categoria, etiquetas } = await req.json();
    if (!pregunta || !respuesta) {
      return Response.json({ error: 'Pregunta y respuesta son requeridas' }, { status: 400 });
    }
    // Las funciones serverless no mantienen estado entre invocaciones: el item se
    // devuelve al cliente, que lo conserva en su estado local.
    return Response.json({
      success: true,
      item: {
        id: `kb-${Date.now()}`,
        pregunta,
        respuesta,
        categoria: categoria || 'General UMSA',
        etiquetas: etiquetas || ['UMSA'],
      },
    });
  }

  return Response.json({ error: 'Método no permitido' }, { status: 405 });
};
