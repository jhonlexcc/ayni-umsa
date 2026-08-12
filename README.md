# Ayni UMSA — Red de Cuidado & Corresponsabilidad

Plataforma web para estudiantes de la UMSA con responsabilidades de cuidado: chatbot de orientación (Gemini), cartografía de red de apoyo, encuestas, observatorio de datos y directorio de servicios.

Stack: React 19 + Vite + Tailwind 4 + Firebase (Firestore) y Google Gemini.

## Desarrollo local

Requisitos: Node.js 20+.

```bash
npm install
cp .env.example .env    # define GEMINI_API_KEY
npm run dev             # servidor Express + Vite en http://localhost:3000
```

## Despliegue en Netlify

El sitio se publica como SPA estática y los endpoints `/api/chat` y `/api/knowledge-base`
corren como Netlify Functions (`netlify/functions/`), equivalentes al servidor Express
usado en desarrollo.

1. En Netlify: *Add new site → Import an existing project* y selecciona este repositorio.
2. La configuración de build ya está en `netlify.toml` (`npm run build:client`, publish `dist`).
3. En *Site configuration → Environment variables* define `GEMINI_API_KEY`.
   Sin esa variable el chatbot responde igualmente usando la base de conocimiento local.

## Scripts

- `npm run dev` — desarrollo con Express + Vite
- `npm run build:client` — build estático (el que usa Netlify)
- `npm run build` — build estático + bundle del servidor Express (`npm start`)
- `npm run lint` — chequeo de tipos con TypeScript
