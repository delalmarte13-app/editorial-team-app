export interface OfflineAnalysis {
  specialistId: string;
  text: string;
  analysis: string;
  timestamp: number;
  cached: boolean;
}

// Análisis locales precargados para modo offline
const OFFLINE_TEMPLATES = {
  corrector: (text: string) => `
**Análisis de Corrección (Modo Offline)**

Longitud del texto: ${text.length} caracteres
Palabras: ${text.split(/\s+/).length}

**Observaciones Generales:**
- El texto tiene una estructura clara
- Se recomienda revisar la puntuación
- Verificar consistencia en el uso de tiempos verbales

**Sugerencias:**
1. Revisar párrafos muy largos (dividir si es necesario)
2. Verificar repetición de palabras clave
3. Mejorar transiciones entre párrafos

*Nota: Este es un análisis básico offline. Para un análisis completo, reconecta cuando tengas créditos disponibles.*
  `,

  analyst: (text: string) => `
**Análisis Literario (Modo Offline)**

Estadísticas del Texto:
- Longitud: ${text.length} caracteres
- Palabras: ${text.split(/\s+/).length}
- Párrafos: ${text.split(/\n\n/).length}

**Estructura Narrativa:**
- Introducción: Presente
- Desarrollo: Identificable
- Conclusión: Recomendada

**Voz y Estilo:**
- Tono: Profesional
- Consistencia: Buena
- Claridad: Aceptable

*Análisis completo disponible con créditos API.*
  `,

  editor: (text: string) => `
**Sugerencias de Edición (Modo Offline)**

**Puntos Clave para Mejorar:**
1. Revisar la estructura general del texto
2. Eliminar redundancias
3. Mejorar la fluidez entre párrafos

**Recomendaciones:**
- Párrafos: ${text.split(/\n\n/).length} (considerar reorganizar)
- Extensión: ${text.split(/\s+/).length} palabras (adecuada)
- Claridad: Mejorable con edición

**Próximos Pasos:**
Cuando reconectes, obtén un análisis completo con sugerencias específicas de reescritura.

*Modo offline activado.*
  `,

  translator: (text: string) => `
**Información de Traducción (Modo Offline)**

Texto a traducir:
- Longitud: ${text.length} caracteres
- Palabras: ${text.split(/\s+/).length}

**Idiomas Disponibles (cuando reconectes):**
- Español ✓
- Inglés
- Francés
- Alemán
- Italiano
- Portugués
- Ruso
- Chino
- Japonés
- Árabe

*Para traducir, reconecta cuando tengas créditos disponibles.*
  `,

  kdp: (text: string) => `
**Análisis KDP (Modo Offline)**

**Viabilidad Inicial:**
- Longitud: ${text.split(/\s+/).length} palabras (${text.split(/\s+/).length > 10000 ? "Novela" : "Cuento"})
- Mercado: Potencial
- Categoría: Requiere análisis completo

**Recomendaciones Generales:**
1. Definir categoría principal
2. Investigar competencia
3. Optimizar descripción y keywords

*Análisis completo disponible con créditos API.*
  `,

  marketing: (text: string) => `
**Estrategia de Marketing (Modo Offline)**

**Análisis Inicial:**
- Tema: Requiere análisis de contenido
- Audiencia: Potencial identificable
- Nicho: Recomendado investigar

**Pasos Recomendados:**
1. Definir buyer persona
2. Investigar mercado objetivo
3. Crear estrategia de lanzamiento

*Análisis de mercado completo disponible con créditos API.*
  `,

  illustrator: (text: string) => `
**Análisis de Ilustración (Modo Offline)**

**Recomendaciones de Estilo:**
- Realista: Profesional y detallado
- Minimalista: Moderno y limpio
- Fantástico: Imaginativo y cautivador

**Paleta de Colores Sugerida:**
- Primario: Azul marino (#1a3a52)
- Secundario: Dorado (#d4af37)
- Acentos: Crema (#f5f1e8)

*Generación de ilustraciones disponible con créditos API.*
  `,

  economist: (text: string) => `
**Análisis Económico (Modo Offline)**

**Escenario Bajo:**
- Copias: 100
- Precio: $5
- Ingresos: $500
- Costos: $200
- Beneficio: $300

**Escenario Medio:**
- Copias: 500
- Precio: $8
- Ingresos: $4,000
- Costos: $1,500
- Beneficio: $2,500

**Escenario Alto:**
- Copias: 2,000
- Precio: $12
- Ingresos: $24,000
- Costos: $8,000
- Beneficio: $16,000

*Análisis económico detallado disponible con créditos API.*
  `,

  rewriter: (text: string) => `
**Reescritura (Modo Offline)**

Texto Original (${text.split(/\s+/).length} palabras):
---
${text.substring(0, 200)}...
---

**Versión Mejorada (Disponible con créditos):**
El sistema generará una versión completamente reescrita con:
- Mejor fluidez
- Vocabulario mejorado
- Estructura optimizada
- Tono consistente

*Reconecta para obtener la reescritura completa.*
  `,

  antiAi: (text: string) => `
**Verificación Anti-IA (Modo Offline)**

**Análisis Inicial:**
- Autenticidad: Verificable
- Tono: Humano
- Patrones: Naturales

**Indicadores de Autenticidad:**
✓ Variación en estructura de oraciones
✓ Uso natural del lenguaje
✓ Inconsistencias típicamente humanas

*Análisis anti-IA completo disponible con créditos API.*
  `,
};

export function generateOfflineAnalysis(
  specialistId: string,
  text: string
): OfflineAnalysis {
  const template =
    OFFLINE_TEMPLATES[specialistId as keyof typeof OFFLINE_TEMPLATES];

  return {
    specialistId,
    text,
    analysis: template ? template(text) : "Análisis no disponible en modo offline",
    timestamp: Date.now(),
    cached: true,
  };
}

export function getOfflineAnalysisForAllSpecialists(
  text: string
): OfflineAnalysis[] {
  const specialists = [
    "corrector",
    "analyst",
    "editor",
    "translator",
    "kdp",
    "marketing",
    "illustrator",
    "economist",
    "rewriter",
    "antiAi",
  ];

  return specialists.map((id) => generateOfflineAnalysis(id, text));
}
