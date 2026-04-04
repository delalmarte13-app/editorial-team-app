# Editorial Team — Equipo Editorial Virtual Completo

Una aplicación móvil con React Native + Expo que simula un equipo editorial profesional de 10 especialistas altamente cualificados. Cada miembro analiza textos con sinceridad absoluta, sin lenguaje artificial, sin halagos vacíos.

## 🎯 Características Principales

### 10 Especialistas Virtuales

1. **Elena Voss (✍️ Correctora)** — Ortografía, gramática, puntuación, coherencia
2. **Marco Reyes (🔍 Analista)** — Estructura narrativa, voz del autor, ritmo, impacto
3. **Sophia Laurent (📝 Editora)** — Reescritura completa, mejora de prosa, claridad
4. **Hiroshi Tanaka (🌐 Traductor)** — 10 idiomas, notas culturales, adaptación local
5. **Rachel Stone (📚 Experta KDP)** — Keywords, categorías, pricing, competencia
6. **Diego Vargas (📊 Marketing)** — Estudio de mercado, buyer persona, lanzamiento 90 días
7. **Amara Osei (🎨 Directora de Arte)** — 3 estilos visuales, análisis, generación de muestras
8. **Carlos Mendez (💰 Economista)** — Viabilidad en 3 escenarios (bajo/medio/alto)
9. **Departamento de Reescritura (🔄)** — Texto completo mejorado + audio offline
10. **Departamento Anti-IA (🛡️)** — Verificación de autenticidad, preservación de voz original

### Funcionalidades

✅ **Carga de Texto** — Pegar directamente o cargar archivos (.txt, .pdf)  
✅ **Análisis por Especialista** — Consultar a cada miembro individualmente  
✅ **Análisis Completo** — Enviar a todo el equipo con un toque  
✅ **Chat Interactivo** — Preguntar a especialistas con contexto del texto  
✅ **Historial** — Guardar y reutilizar análisis anteriores  
✅ **Almacenamiento Offline** — Textos reescritos + audio disponibles sin conexión  
✅ **Gemini API** — Análisis reales con Google Gemini (no mocks)  
✅ **Diseño Elegante** — Paleta editorial crema/negro/dorado, modo oscuro completo

---

## 🏗️ Arquitectura Técnica

### Stack Tecnológico

- **Frontend:** React Native 0.81 + Expo 54 + TypeScript 5.9
- **Styling:** NativeWind 4 (Tailwind CSS para React Native)
- **Backend:** Node.js + tRPC + Express
- **Base de Datos:** PostgreSQL + Drizzle ORM (opcional, local por defecto)
- **IA:** Google Gemini API (análisis reales)
- **Almacenamiento:** AsyncStorage (local) + S3 (opcional)
- **Testing:** Vitest (48 tests pasando)

### Estructura de Carpetas

```
editorial-team-app/
├── app/
│   ├── _layout.tsx                 # Root layout con providers
│   ├── (tabs)/
│   │   ├── _layout.tsx             # Tab bar (4 tabs)
│   │   ├── index.tsx               # Pantalla de inicio (carga de texto)
│   │   ├── team.tsx                # Hub del equipo editorial
│   │   ├── history.tsx             # Historial de textos
│   │   └── chat.tsx                # Chat con especialistas
│   └── specialist/
│       └── [id].tsx                # Pantalla dinámica de especialista
├── server/
│   ├── _core/
│   │   ├── index.ts                # Servidor Express
│   │   ├── llm.ts                  # Integración LLM
│   │   ├── env.ts                  # Variables de entorno
│   │   └── imageGeneration.ts      # Generación de imágenes
│   ├── routers.ts                  # Rutas tRPC (análisis, chat)
│   ├── prompts.ts                  # Prompts optimizados (10 especialistas)
│   ├── gemini.ts                   # Servicio Gemini API
│   └── storage.ts                  # Almacenamiento de archivos
├── components/
│   ├── screen-container.tsx        # SafeArea wrapper
│   ├── markdown-renderer.tsx       # Renderizador de markdown
│   ├── specialist-card.tsx         # Tarjeta de especialista
│   └── ui/
│       └── icon-symbol.tsx         # Mapeo de iconos
├── lib/
│   ├── editorial-context.tsx       # Context global (texto, historial)
│   ├── theme-provider.tsx          # Theme provider (light/dark)
│   ├── utils.ts                    # Utilidades (cn, etc.)
│   └── _core/theme.ts              # Runtime palette
├── hooks/
│   ├── use-colors.ts               # Hook de colores
│   ├── use-color-scheme.ts         # Detección light/dark
│   └── use-auth.ts                 # Autenticación (opcional)
├── tests/
│   ├── editorial.test.ts           # Tests de contexto editorial
│   ├── functionality.test.ts       # Tests de funcionalidad (21 tests)
│   └── gemini-api.test.ts          # Tests de Gemini API (24 tests)
├── assets/images/
│   ├── icon.png                    # Logo de la app
│   ├── splash-icon.png             # Splash screen
│   ├── favicon.png                 # Web favicon
│   └── android-icon-*.png          # Android adaptive icons
├── theme.config.js                 # Paleta de colores (centralizada)
├── tailwind.config.js              # Configuración Tailwind
├── app.config.ts                   # Configuración Expo
├── package.json                    # Dependencias
├── GOODBARBER_DESIGN_GUIDE.md      # Guía completa para Goodbarber
└── todo.md                         # Tareas completadas
```

---

## 🚀 Instalación y Setup

### Requisitos Previos

- Node.js 22.13.0+
- pnpm 9.12.0+
- Clave API de Google Gemini (gratuita)

### Pasos de Instalación

```bash
# 1. Clonar repositorio
git clone <repo-url>
cd editorial-team-app

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
# Crear archivo .env.local
GEMINI_API_KEY=tu_clave_aqui

# 4. Iniciar servidor de desarrollo
pnpm dev

# 5. Abrir en Expo Go (iOS/Android)
# Escanear código QR que aparece en terminal
```

### Variables de Entorno Requeridas

```env
# Google Gemini API
GEMINI_API_KEY=AIzaSy...

# Opcional: Base de datos
DATABASE_URL=postgresql://...

# Opcional: Almacenamiento S3
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

---

## 📱 Pantallas y Flujos

### 1. Pantalla de Inicio (Home)
- Área de texto con carga de archivos (.txt, .pdf)
- Contador de palabras/caracteres en tiempo real
- Preview del equipo (10 especialistas)
- Botón "Enviar al equipo editorial"

### 2. Hub del Equipo (Team)
- Grid de 10 especialistas con perfiles
- Cada uno con emoji, nombre, rol, años de experiencia
- Tap para ver análisis individual
- Botón para análisis completo

### 3. Pantalla de Especialista
- Perfil completo (biografía, especialidad)
- Análisis en tiempo real (con loading)
- Texto reescrito (si aplica)
- Audio para escuchar (si aplica)
- Botón para copiar/compartir

### 4. Historial
- Lista de textos analizados
- Timestamp y vista previa
- Acceso rápido a análisis anteriores
- Opción de eliminar

### 5. Chat
- Selector de especialista
- Historial de mensajes
- Input de texto + botón enviar
- Respuestas en tiempo real

---

## 🔌 Integración Gemini API

### Configuración

```typescript
// server/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
```

### Uso en Routers

```typescript
// server/routers.ts
analyze: publicProcedure
  .input(z.object({
    text: z.string(),
    specialistId: z.enum([...])
  }))
  .mutation(async ({ input }) => {
    const specialist = SPECIALIST_PROMPTS[input.specialistId];
    const result = await invokeLLM({
      messages: [
        { role: "system", content: specialist.system },
        { role: "user", content: input.text }
      ]
    });
    return result;
  })
```

---

## 🎨 Paleta de Colores

| Token | Light | Dark | Uso |
|-------|-------|------|-----|
| `primary` | #0a7ea4 | #0a7ea4 | Botones, acciones |
| `accent` | #D4AF37 | #D4AF37 | Acentos, énfasis |
| `background` | #ffffff | #1A1A1A | Fondo general |
| `surface` | #f5f5f5 | #2A2A2A | Cards, superficies |
| `foreground` | #11181C | #ECEDEE | Texto principal |
| `muted` | #687076 | #9BA1A6 | Texto secundario |
| `border` | #E5E7EB | #334155 | Bordes |
| `success` | #22C55E | #4ADE80 | Estados positivos |
| `warning` | #F59E0B | #FBBF24 | Advertencias |
| `error` | #EF4444 | #F87171 | Errores |

---

## 📊 Prompts Optimizados

Cada especialista tiene un prompt específico y detallado:

### Elena Voss (Correctora)
```
Eres Elena Voss, correctora editorial de 15 años de experiencia.
Tu rol: Identificar y corregir errores de ortografía, gramática, puntuación.
Sé específica, honesta, sin filtros. Señala cada error con claridad.
```

### Marco Reyes (Analista)
```
Eres Marco Reyes, analista literario de 18 años.
Tu rol: Analizar estructura narrativa, voz del autor, ritmo, impacto emocional.
Sé crítico pero constructivo. Identifica fortalezas y debilidades.
```

[Ver todos en `server/prompts.ts`]

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Todos los tests
pnpm test

# Tests específicos
pnpm test editorial
pnpm test gemini

# Con cobertura
pnpm test -- --coverage
```

### Cobertura Actual

- ✅ 48 tests pasando
- ✅ Editorial context (3 tests)
- ✅ Funcionalidad (21 tests)
- ✅ Gemini API (24 tests)

---

## 📦 Dependencias Principales

```json
{
  "react": "19.1.0",
  "react-native": "0.81.5",
  "expo": "~54.0.29",
  "expo-router": "~6.0.19",
  "nativewind": "^4.2.1",
  "@trpc/client": "11.7.2",
  "@trpc/server": "11.7.2",
  "@google/generative-ai": "^0.x.x",
  "expo-document-picker": "^55.0.11",
  "expo-file-system": "~17.0.0",
  "expo-haptics": "~15.0.8"
}
```

---

## 🔐 Privacidad y Seguridad

✅ **Almacenamiento Local** — Los textos se guardan en AsyncStorage del dispositivo  
✅ **Conexión Cifrada** — HTTPS para todas las llamadas al servidor  
✅ **Sin Tracking** — No hay cookies de terceros ni analytics invasivos  
✅ **Datos Efímeros** — El servidor no guarda textos después del análisis  
✅ **Control Total** — El usuario puede eliminar su historial en cualquier momento

---

## 📝 Licencia

Privado. Uso exclusivo del propietario.

---

## 👨‍💻 Desarrollo

### Comandos Útiles

```bash
# Iniciar desarrollo
pnpm dev

# Verificar TypeScript
pnpm check

# Linting
pnpm lint

# Formatear código
pnpm format

# Tests
pnpm test

# Build para producción
pnpm build

# Iniciar servidor de producción
pnpm start
```

### Flujo de Desarrollo

1. **Crear rama** — `git checkout -b feature/nombre`
2. **Hacer cambios** — Editar archivos
3. **Tests** — `pnpm test`
4. **Commit** — `git commit -m "feat: descripción"`
5. **Push** — `git push origin feature/nombre`
6. **Checkpoint** — `webdev_save_checkpoint`

---

## 🚀 Deployment

### Generar APK (Android)

1. Haz clic en **"Publish"** en la interfaz de Manus
2. Espera a que se genere el APK
3. Descarga en tu dispositivo
4. Instala normalmente

### Publicar en App Store/Google Play

1. **iOS:** Enviar a Apple con Xcode
2. **Android:** Enviar a Google Play Console
3. Ambos requieren revisión (3-7 días)

---

## 📞 Soporte

Para preguntas o issues:
1. Revisa la documentación en `GOODBARBER_DESIGN_GUIDE.md`
2. Consulta los tests en `tests/`
3. Revisa los logs del servidor

---

**Versión:** 2.0.0  
**Última actualización:** Abril 2026  
**Estado:** ✅ Producción lista
