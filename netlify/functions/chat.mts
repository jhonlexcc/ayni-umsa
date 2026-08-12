import { GoogleGenAI } from '@google/genai';
import { fallbackReply, systemInstruction } from '../shared/knowledgeBase.js';

export const config = { path: '/api/chat' };

interface ChatRequest {
  message?: string;
  conversationHistory?: { role: string; text: string }[];
}

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Método no permitido' }, { status: 405 });
  }

  const { message, conversationHistory }: ChatRequest = await req.json();
  if (!message) {
    return Response.json({ error: 'Mensaje requerido' }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(fallbackReply(message));
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        ...(conversationHistory || []).map((h) => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        })),
        { role: 'user', parts: [{ text: message }] },
      ],
      config: { systemInstruction, temperature: 0.3 },
    });

    return Response.json({
      reply: response.text || 'Disculpa, no pude procesar la consulta en este momento.',
      source: 'Gemini + Base de Conocimientos UMSA',
    });
  } catch (err) {
    console.error('Error in /api/chat:', err);
    return Response.json(fallbackReply(message));
  }
};
