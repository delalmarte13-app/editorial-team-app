# Editorial Team - Tu Equipo Editorial Virtual

Una aplicación móvil completa que simula un equipo editorial profesional con 10+ especialistas, análisis de texto avanzado, reescritura personalizada y herramientas de marketing.

## 🎯 Características Principales

### Equipo Editorial Completo
- **Elena Voss** (Correctora) - Corrección ortográfica y gramatical
- **Marco Ruiz** (Analista) - Análisis literario y estructura
- **Sophia Martín** (Editora) - Edición profesional
- **Hiroshi Tanaka** (Traductor) - Traducción multiidioma
- **Rachel Green** (KDP Expert) - Estrategia Amazon KDP
- **Diego López** (Marketing) - Estrategia de marketing
- **Amara Okonkwo** (Ilustradora) - Análisis de estilos visuales
- **Carlos Mendez** (Economista) - Análisis de ventas y beneficios
- **Reescritura Editorial** - Reescritura profesional
- **Anti-IA** - Detección de contenido generado por IA
- **Javier Castillo** (Director General) - Síntesis y recomendaciones

### Funcionalidades Avanzadas

#### 1. **Regulador de Alucinamiento (0-5)**
Controla el nivel de creatividad en reescrituras:
- **0**: Fiel al original, cambios mínimos
- **1**: Solo mejora claridad y gramática
- **2**: Mejora prosa y pacing moderadamente
- **3**: Mejora significativa con libertad moderada
- **4**: Reescritura creativa con libertad
- **5**: Reescritura muy creativa

#### 2. **5 Equipos de Reescritura Especializados**
- **Equipo Infantil (0-8 años)** - Vocabulario simple, ritmo dinámico
- **Equipo Juvenil (8-14 años)** - Aventura, misterio, educativo
- **Equipo YA (14-18 años)** - Temas adolescentes, emociones intensas
- **Equipo Adulto Joven (18-35)** - Temas complejos, narrativa sofisticada
- **Equipo Adulto (35+)** - Literatura refinada, temas universales

#### 3. **Análisis Anti-IA Mejorado**
Detecta contenido generado por IA con 10 indicadores:
- Patrones de lenguaje AI
- Repetición de palabras
- Variación de oraciones
- Contracciones y coloquialismos
- Profundidad emocional
- Voz personal
- Variedad de puntuación
- Y más...

#### 4. **Carga de Archivos**
Soporta múltiples formatos:
- `.txt` - Archivos de texto plano
- `.pdf` - Documentos PDF
- `.docx` - Documentos Word

#### 5. **Audio TTS/STT**
- **Text-to-Speech**: Escucha los análisis y reescrituras
- **Speech-to-Text**: Dicta tu texto directamente (próximamente)
- Múltiples idiomas y voces
- Control de velocidad y tono

#### 6. **Historial y Exportación**
- Historial de reescrituras recientes
- Exportación a Word (.docx) con análisis completo
- Exportación a PDF (próximamente)
- Comparación de versiones

## 📱 Estructura de la App

```
app/
  (tabs)/
    index.tsx          → Pantalla de inicio con análisis
    team.tsx           → Equipo editorial
    history.tsx        → Historial de reescrituras
    chat.tsx           → Chat con Director General
    settings.tsx       → Configuración
  specialist/
    [id].tsx           → Detalle de especialista
  analysis-complete.tsx → Resultados del análisis
  rewrite-complete.tsx  → Resultados de reescritura
```

## 🛠️ Stack Técnico

- **React Native 0.81** - Framework móvil
- **Expo 54** - Plataforma de desarrollo
- **TypeScript 5.9** - Tipado estático
- **NativeWind 4** - Tailwind CSS para React Native
- **tRPC** - API type-safe
- **Gemini AI** - Motor de IA
- **expo-speech** - Text-to-Speech
- **expo-av** - Audio y video
- **docx** - Generación de documentos Word

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev

# Ejecutar tests
pnpm test

# Verificar tipos
pnpm check
```

## 📚 Librerías Principales

### `lib/rewrite-teams.ts`
Define los 5 equipos de reescritura con prompts especializados y niveles de alucinamiento.

### `lib/anti-ia-analyzer.ts`
Analiza autenticidad de texto con 10 indicadores y proporciona puntuación (0-100).

### `lib/file-parser.ts`
Parsea archivos .txt, .pdf, .docx extrayendo texto para análisis.

### `lib/audio-utils.ts`
Utilidades para TTS/STT, grabación de audio y reproducción.

### `lib/export-analysis.ts`
Genera documentos Word con análisis completo de todos los departamentos.

## 🧪 Testing

La aplicación incluye 123 tests cubriendo:
- Funcionalidad de análisis
- Reescritura con equipos
- Exportación de documentos
- Clipboard (copiar/pegar)
- Historial de reescrituras
- Funcionalidad editorial

```bash
pnpm test          # Ejecutar tests
pnpm test --ui     # Con interfaz visual
```

## 🎨 Diseño

- **Colores**: Crema (#F5F1E8), Negro (#1A1A1A), Dorado (#D4AF37)
- **Tipografía**: Inter (moderna y legible)
- **Componentes**: Basados en Apple HIG
- **Modo oscuro**: Soporte completo

## 🔒 Seguridad

- API keys almacenadas en variables de entorno
- Autenticación con OAuth
- Datos encriptados en almacenamiento local
- Validación de entrada en todos los endpoints

## 📈 Próximas Características

1. **Chat en tiempo real con Director General**
2. **Exportación a PDF con diseño editorial**
3. **Comparación de versiones lado a lado**
4. **Plantillas personalizadas de análisis**
5. **Colaboración en equipo**
6. **Integración con Google Docs**
7. **Análisis de sentimiento**
8. **Recomendaciones de SEO**

## 📝 Notas de Desarrollo

- Todos los especialistas tienen prompts únicos y realistas
- El regulador de alucinamiento es independiente por equipo
- Los análisis se cachean localmente para mejor rendimiento
- La exportación DOCX incluye metadatos y timestamps

## 🤝 Contribuir

Para reportar bugs o sugerir features, contacta al equipo de desarrollo.

## 📄 Licencia

Privada - Editorial Team 2026

---

**Versión**: 4.0.0  
**Última actualización**: Julio 2026  
**Estado**: Producción
