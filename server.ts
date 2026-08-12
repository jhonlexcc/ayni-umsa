import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini API client on server
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // Knowledge Base mock stored on server
  let knowledgeBase = [
    {
      id: "kb-1",
      pregunta: "¿Dónde está el Centro Infantil Andresito y cuáles son los requisitos?",
      respuesta:
        "El Centro Infantil Andresito se encuentra en los predios del Monoblock Central de la UMSA (Av. Villazón Nro. 1995, Edificio Antiguo). Para inscribir a tu hijo/a necesitas: 1) Matrícula universitaria vigente del padre/madre, 2) Certificado de nacimiento del niño/a, 3) Carnet de vacunas al día, y 4) Formulario de Bienestar Social.",
      categoria: "Servicios e Infraestructura",
      etiquetas: ["Centro Infantil", "Andresito", "Cuidado Infantil", "Monoblock"],
    },
    {
      id: "kb-2",
      pregunta: "¿Cómo puedo postular a las becas de la UMSA si tengo personas a cargo?",
      respuesta:
        "El Departamento de Bienestar Social UMSA publica convocatorias anuales para Beca Comedor, Beca Trabajo y Beca IDH. Al contar con hijas/os o adultos mayores dependientes, obtienes puntuación ponderada prioritaria en la evaluación socioeconómica. Debes adjuntar certificados de nacimiento o certificados médicos de dependencia.",
      categoria: "Becas y Apoyo Económico",
      etiquetas: ["Becas", "Comedor", "Bienestar Social", "Requisitos"],
    },
    {
      id: "kb-3",
      pregunta: "¿Qué puedo hacer si un docente no flexibiliza la asistencia por emergencia médica de mi hijo?",
      respuesta:
        "Puedes acudir a la Defensoría Universitaria UMSA (Av. 6 de Agosto, Edif. Hoy, Piso 4). La normativa institucional resguarda la permanencia estudiantil. Presenta una carta adjuntando el certificado médico o comprobante de atención para solicitar una recalendarización justa de exámenes o trabajos.",
      categoria: "Normativa e Inclusión",
      etiquetas: ["Defensoría", "Docentes", "Flexibilidad", "Derechos Estudiantiles"],
    },
    {
      id: "kb-4",
      pregunta: "¿Existe atención psicológica o de salud mental para estudiantes en la UMSA?",
      respuesta:
        "Sí, el Gabinete de Apoyo Psicológico Estudiantil en el campus Cota Cota y el servicio de Salud Estudiantil del Seguro Social Universitario brindan atención psicoterapéutica gratuita o subvencionada para estudiantes con matrícula al día.",
      categoria: "Bienestar y Salud",
      etiquetas: ["Psicología", "Salud Mental", "Bienestar"],
    },
  ];

  // API Endpoints
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "Ayni UMSA Server" });
  });

  app.get("/api/knowledge-base", (_req, res) => {
    res.json(knowledgeBase);
  });

  app.post("/api/knowledge-base", (req, res) => {
    const { pregunta, respuesta, categoria, etiquetas } = req.body;
    if (!pregunta || !respuesta) {
      return res.status(400).json({ error: "Pregunta y respuesta son requeridas" });
    }
    const newItem = {
      id: `kb-${Date.now()}`,
      pregunta,
      respuesta,
      categoria: categoria || "General UMSA",
      etiquetas: etiquetas || ["UMSA"],
    };
    knowledgeBase.unshift(newItem);
    res.json({ success: true, item: newItem });
  });

  // Chatbot Gemini Route
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, conversationHistory } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Mensaje requerido" });
      }

      // Check if Gemini API client is available
      if (!ai) {
        // Fallback intelligent response using local knowledge base if API key is absent
        const matchedKb = knowledgeBase.find(
          (k) =>
            message.toLowerCase().includes(k.pregunta.toLowerCase().slice(0, 15)) ||
            k.etiquetas.some((tag) => message.toLowerCase().includes(tag.toLowerCase()))
        );

        const responseText = matchedKb
          ? `[Base de Conocimiento UMSA]: ${matchedKb.respuesta}`
          : `Hola, soy Ayni Bot, la guía de orientación universitaria para estudiantes con responsabilidades de cuidado en la UMSA. Puedes consultarme sobre el Centro Infantil Andresito, el Departamento de Bienestar Social, la Defensoría Universitaria o trámites de becas.`;

        return res.json({
          reply: responseText,
          source: matchedKb ? "Base de Conocimiento UMSA" : "Asistente Institucional UMSA",
        });
      }

      // Build knowledge context string
      const kbContext = knowledgeBase
        .map((k) => `Pregunta: ${k.pregunta}\nRespuesta: ${k.respuesta}`)
        .join("\n---\n");

      const systemInstruction = `Eres 'Ayni Bot', el chatbot oficial de orientación universitaria de la plataforma Ayni UMSA (Universidad Mayor de San Andrés, La Paz, Bolivia).
Tu objetivo es orientar a estudiantes universitarios que tienen responsabilidades de cuidado (hijas/os, hermanos menores, adultos mayores o familiares dependientes).
Debes ser amable, empático, claro y muy preciso.
NO debes inventar información no sustentada sobre trámites o servicios. Utiliza principalmente la siguiente Base de Conocimientos oficial de la UMSA para fundamentar tus respuestas:

BASE DE CONOCIMIENTOS OFICIAL UMSA:
${kbContext}

Si la consulta se refiere a ubicaciones o servicios (Centro Infantil Andresito, Bienestar Social, Defensoría, Comedor Universitario, Apoyo Psicológico), brinda indicaciones claras sobre ubicación, horarios y pasos para acceder. Si el estudiante solicita asesoramiento legal o psicológico urgente, orientalo a la Defensoría Universitaria o al Gabinete Psicológico UMSA.`;

      // Call Gemini 3.6 Flash
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: [
          ...(conversationHistory || []).map((h: { role: string; text: string }) => ({
            role: h.role === "user" ? "user" : "model",
            parts: [{ text: h.text }],
          })),
          { role: "user", parts: [{ text: message }] },
        ],
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });

      const replyText = response.text || "Disculpa, no pude procesar la consulta en este momento.";

      res.json({
        reply: replyText,
        source: "Gemini 3.6 Flash + Base de Conocimientos UMSA",
      });
    } catch (err: any) {
      console.error("Error in /api/chat:", err);
      res.status(500).json({
        error: "Error procesando el mensaje",
        details: err?.message || "Internal server error",
      });
    }
  });

  // Serve Frontend with Vite middleware in Dev or Static files in Production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Ayni UMSA] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
