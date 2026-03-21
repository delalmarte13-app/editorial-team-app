# Editorial Team — Diseño de la App Móvil

## Concepto

Aplicación móvil que simula un equipo editorial profesional completo. El usuario sube un texto y accede a distintos especialistas que lo analizan, corrigen, reescriben, estudian su mercado y sugieren estrategias. Cada especialista tiene su propio espacio de trabajo con personalidad definida, opiniones directas y sin artificialidad.

---

## Paleta de Colores

| Token | Valor Light | Valor Dark | Uso |
|-------|-------------|------------|-----|
| `primary` | `#1A1A2E` | `#E8E4DC` | Acento principal, botones CTA |
| `background` | `#FAFAF8` | `#0F0F14` | Fondo de pantallas |
| `surface` | `#F0EDE8` | `#1A1A24` | Tarjetas, paneles |
| `foreground` | `#1A1A2E` | `#E8E4DC` | Texto principal |
| `muted` | `#7A7570` | `#9A9590` | Texto secundario |
| `border` | `#E0DDD8` | `#2A2A38` | Bordes, separadores |
| `accent` | `#C4A882` | `#C4A882` | Detalles dorados, énfasis |
| `success` | `#4A7C59` | `#6AAD7A` | Confirmaciones |
| `error` | `#C0392B` | `#E05A4A` | Errores |

Estética: **Editorial Luxury** — Crema, negro profundo, dorado suave. Tipografía serif para títulos, sans-serif para cuerpo. Minimalista pero sofisticado.

---

## Lista de Pantallas

### 1. Pantalla de Bienvenida / Inicio (`/`)
- Logo y nombre de la app
- Área de carga de texto (textarea grande o botón de importar)
- Botón "Enviar al equipo"
- Historial de textos recientes (FlatList)

### 2. Hub del Equipo (`/team-hub`)
- Grid de tarjetas con cada miembro del equipo
- Indicador de estado (analizando / listo / esperando)
- Nombre, cargo y avatar ilustrado de cada miembro
- Tap en tarjeta → pantalla del especialista

### 3. Corrector Ortográfico y Gramatical (`/specialist/corrector`)
- Perfil: **Elena Voss** — Correctora Senior, 20 años de experiencia
- Vista del texto original con marcas de corrección (highlight)
- Lista de errores encontrados con explicación
- Texto corregido completo
- Opinión sincera sobre la calidad del texto

### 4. Analista Literario (`/specialist/analyst`)
- Perfil: **Marco Reyes** — Analista Literario y Crítico
- Análisis de estructura narrativa
- Evaluación de voz, tono y estilo
- Puntos fuertes y débiles
- Puntuación editorial (1-10) con justificación

### 5. Editor de Contenido (`/specialist/editor`)
- Perfil: **Sophia Laurent** — Editora Jefe
- Sugerencias de restructuración
- Texto completamente reescrito y mejorado
- Notas editoriales por sección
- Comparativa original vs. editado

### 6. Traductor (`/specialist/translator`)
- Perfil: **Hiroshi Tanaka** — Traductor Literario Multilingüe
- Selector de idioma destino (EN, FR, DE, PT, IT, ZH, JA, AR)
- Traducción completa del texto
- Notas sobre adaptaciones culturales
- Advertencias de pérdida de matices

### 7. Especialista KDP (`/specialist/kdp`)
- Perfil: **Rachel Stone** — Experta en Amazon KDP y Autopublicación
- Análisis de viabilidad para KDP
- Categorías y subcategorías recomendadas
- Keywords sugeridas (7 principales)
- Precio recomendado y formato (ebook/paperback)
- Análisis de competencia en el nicho

### 8. Estratega de Ventas y Marketing (`/specialist/marketing`)
- Perfil: **Diego Vargas** — Director de Marketing Editorial
- Estudio de mercado del nicho
- Perfil del lector ideal (buyer persona)
- Estrategia de lanzamiento (30/60/90 días)
- Canales recomendados
- Copy para descripción del libro

### 9. Director de Arte e Ilustraciones (`/specialist/illustrator`)
- Perfil: **Amara Osei** — Directora de Arte y Diseño Editorial
- Análisis del estilo visual más adecuado para el texto
- 3-4 estilos sugeridos con descripción detallada
- Generación de ilustración de muestra (via imagen IA)
- Paleta de colores sugerida para portada
- Referencias de estilo

### 10. Pantalla de Texto Completo (`/text-view`)
- Vista del texto original con scroll
- Opción de copiar o compartir

---

## Flujos Principales

### Flujo 1: Análisis inicial
1. Usuario llega a Home → escribe o pega texto
2. Toca "Enviar al equipo"
3. App navega al Team Hub
4. Todos los especialistas muestran estado "Analizando..."
5. Cada uno completa su análisis en background
6. Usuario puede navegar libremente entre especialistas

### Flujo 2: Consultar especialista
1. Desde Team Hub → toca tarjeta de especialista
2. Ve perfil del especialista (nombre, cargo, experiencia)
3. Scroll hacia abajo para ver el análisis completo
4. Puede copiar secciones específicas

### Flujo 3: Generar ilustración
1. Desde pantalla de Ilustraciones → ve análisis de estilos
2. Toca "Generar muestra" en un estilo
3. Loading state (5-20 seg)
4. Ve imagen generada con descripción

### Flujo 4: Traducción
1. Desde pantalla de Traductor → selecciona idioma
2. Toca "Traducir"
3. Ve traducción completa con notas

---

## Componentes Reutilizables

- `SpecialistHeader` — Avatar, nombre, cargo, años de experiencia
- `AnalysisSection` — Título de sección + contenido con markdown
- `ScoreCard` — Puntuación visual con barra de progreso
- `TextComparison` — Vista lado a lado original/editado
- `TagChip` — Etiquetas para keywords, géneros, etc.
- `LoadingSpecialist` — Animación de "pensando" con nombre del especialista
- `TeamMemberCard` — Tarjeta del hub con avatar y estado

---

## Navegación

Tab bar inferior con 3 tabs:
1. **Inicio** (house.fill) — Carga de texto
2. **Equipo** (person.3.fill) — Hub del equipo
3. **Historial** (clock.fill) — Textos anteriores

Navegación modal/stack para pantallas de especialistas.
