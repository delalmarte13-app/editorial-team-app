# Editorial Team — Guía Completa de Diseño para Goodbarber

**Versión:** 1.0  
**Fecha:** Marzo 2026  
**Plataforma:** Goodbarber  
**Estado:** Listo para implementación

---

## 📋 ÍNDICE

1. [Configuración General](#configuración-general)
2. [Branding y Diseño Visual](#branding-y-diseño-visual)
3. [Arquitectura de Navegación](#arquitectura-de-navegación)
4. [Pantallas y Componentes](#pantallas-y-componentes)
5. [Funcionalidades Core](#funcionalidades-core)
6. [Especialistas del Equipo Editorial](#especialistas-del-equipo-editorial)
7. [Flujos de Usuario](#flujos-de-usuario)
8. [Integración de Backend](#integración-de-backend)
9. [Configuración de Goodbarber](#configuración-de-goodbarber)
10. [Checklist de Implementación](#checklist-de-implementación)

---

## 1. CONFIGURACIÓN GENERAL

### Información de la App

| Parámetro | Valor |
|-----------|-------|
| **Nombre de la App** | Editorial Team |
| **Subtítulo** | Tu Equipo Editorial Virtual |
| **Descripción Corta** | Analiza, edita y mejora tus textos con un equipo de 8 especialistas cualificados. Corrección, análisis literario, edición, traducción, KDP, marketing, diseño y economía. |
| **Descripción Larga** | Editorial Team es tu equipo editorial personal. Sube cualquier texto y recibe análisis honesto y profesional de correctores, analistas, editores, traductores, especialistas KDP, expertos en marketing, directores de arte y economistas. Cada especialista trabaja de forma independiente con criterio propio. Sin halagos vacíos, sin lenguaje artificial. Solo profesionales reales dándote su mejor opinión. |
| **Versión Inicial** | 1.0.0 |
| **Identificador Único** | com.editorialteam.app |
| **Idioma Principal** | Español (es) |
| **Idiomas Secundarios** | Inglés (en), Francés (fr), Portugués (pt), Alemán (de), Italiano (it) |
| **Público Objetivo** | Autores, escritores, editores independientes, especialistas KDP, creadores de contenido |
| **Edad Mínima** | 13+ |
| **Categoría Principal** | Productividad |
| **Categoría Secundaria** | Educación / Escritura |

### Especificaciones Técnicas

| Parámetro | Valor |
|-----------|-------|
| **Plataforma** | iOS + Android (Goodbarber) |
| **Versión iOS Mínima** | iOS 14.0 |
| **Versión Android Mínima** | Android 8.0 (API 26) |
| **Orientación** | Retrato (Portrait) |
| **Soporte Tablet** | Sí (optimizado para iPad) |
| **Modo Oscuro** | Obligatorio (Light + Dark) |
| **Accesibilidad** | WCAG 2.1 AA |

---

## 2. BRANDING Y DISEÑO VISUAL

### Paleta de Colores

#### Colores Principales

| Nombre | Código Hex | RGB | Uso |
|--------|-----------|-----|-----|
| **Dorado Editorial** | #D4AF37 | 212, 175, 55 | Acentos, botones primarios, iconos destacados |
| **Crema Clásica** | #F5F1E8 | 245, 241, 232 | Fondo claro, superficies |
| **Negro Profundo** | #1A1A1A | 26, 26, 26 | Fondo oscuro, texto principal |
| **Gris Neutro** | #8B8B8B | 139, 139, 139 | Texto secundario, bordes |
| **Blanco Puro** | #FFFFFF | 255, 255, 255 | Superficies claras, overlays |

#### Colores por Especialista

| Especialista | Emoji | Color Primario | Color Secundario | Uso |
|--------------|-------|----------------|-----------------|-----|
| **Elena Voss** (Correctora) | ✍️ | #4A7C59 | #E8F3ED | Tarjetas, badges |
| **Marco Reyes** (Analista) | 🔍 | #2E4A7C | #E8EDF3 | Tarjetas, badges |
| **Sophia Laurent** (Editora) | 📝 | #7C2E4A | #F3E8ED | Tarjetas, badges |
| **Hiroshi Tanaka** (Traductor) | 🌐 | #4A4A7C | #EDEDF3 | Tarjetas, badges |
| **Rachel Stone** (KDP) | 📚 | #7C5A2E | #F3EFE8 | Tarjetas, badges |
| **Diego Vargas** (Marketing) | 📊 | #2E7C5A | #E8F3EF | Tarjetas, badges |
| **Amara Osei** (Arte) | 🎨 | #7C2E2E | #F3E8E8 | Tarjetas, badges |
| **Carlos Mendez** (Economista) | 💰 | #5A7C2E | #F0F3E8 | Tarjetas, badges |

#### Modos de Color

**Modo Claro (Light)**
- Fondo Principal: #F5F1E8
- Fondo Secundario: #FFFFFF
- Texto Principal: #1A1A1A
- Texto Secundario: #8B8B8B
- Bordes: #E0DDD8
- Acentos: #D4AF37

**Modo Oscuro (Dark)**
- Fondo Principal: #1A1A1A
- Fondo Secundario: #2A2A2A
- Texto Principal: #F5F1E8
- Texto Secundario: #B8B8B8
- Bordes: #3A3A3A
- Acentos: #D4AF37

### Tipografía

| Elemento | Fuente | Tamaño | Peso | Espaciado |
|----------|--------|--------|------|-----------|
| **Títulos H1** | SF Pro Display / Roboto | 28px | 700 (Bold) | -0.5pt |
| **Títulos H2** | SF Pro Display / Roboto | 22px | 600 (Semibold) | -0.3pt |
| **Títulos H3** | SF Pro Display / Roboto | 18px | 600 (Semibold) | 0pt |
| **Cuerpo Principal** | SF Pro Text / Roboto | 16px | 400 (Regular) | 0.5pt |
| **Cuerpo Secundario** | SF Pro Text / Roboto | 14px | 400 (Regular) | 0.3pt |
| **Etiquetas** | SF Pro Text / Roboto | 12px | 500 (Medium) | 0.2pt |
| **Botones** | SF Pro Text / Roboto | 16px | 600 (Semibold) | 0.5pt |

### Espaciado y Layout

| Elemento | Valor |
|----------|-------|
| **Padding Horizontal Estándar** | 16px |
| **Padding Vertical Estándar** | 12px |
| **Margen entre Secciones** | 24px |
| **Margen entre Elementos** | 12px |
| **Radio de Bordes (Cards)** | 16px |
| **Radio de Bordes (Botones)** | 12px |
| **Altura de Botones Primarios** | 48px |
| **Altura de Botones Secundarios** | 40px |
| **Altura de Tab Bar** | 56px + safe area |

### Iconografía

**Sistema de Iconos:** SF Symbols (iOS) / Material Icons (Android)

| Icono | Nombre SF Symbol | Nombre Material | Uso |
|-------|-----------------|-----------------|-----|
| Casa | house.fill | home | Tab Inicio |
| Personas | person.3.fill | group | Tab Equipo |
| Reloj | clock.fill | history | Tab Historial |
| Mensaje | paperplane.fill | send | Tab Chat |
| Más | ellipsis | more_vert | Menú adicional |
| Configuración | gear | settings | Ajustes |
| Compartir | square.and.arrow.up | share | Compartir |
| Descargar | arrow.down.circle | download | Descargar |
| Copiar | doc.on.doc | content_copy | Copiar al portapapeles |
| Cerrar | xmark | close | Cerrar modal |

### Sombras y Elevación

| Nivel | Sombra | Elevación | Uso |
|-------|--------|-----------|-----|
| **Nivel 1** | 0px 2px 4px rgba(0,0,0,0.1) | 4px | Botones, inputs |
| **Nivel 2** | 0px 4px 8px rgba(0,0,0,0.12) | 8px | Cards, modals pequeños |
| **Nivel 3** | 0px 8px 16px rgba(0,0,0,0.15) | 16px | Modals grandes, overlays |

---

## 3. ARQUITECTURA DE NAVEGACIÓN

### Estructura de Tabs (Bottom Tab Navigation)

```
┌─────────────────────────────────────┐
│                                     │
│          CONTENIDO PRINCIPAL        │
│                                     │
├─────────────────────────────────────┤
│ 🏠    👥    ⏰    ✉️                │
│ Inicio Equipo Historial Chat        │
└─────────────────────────────────────┘
```

### Jerarquía de Navegación

```
Inicio (Home)
├── Pantalla Principal
├── Carga de Texto
├── Envío al Equipo
└── [Navega a → Equipo o Chat]

Equipo (Team)
├── Grid de Especialistas (2x4)
├── Tarjeta de Especialista
│   └── Tap → Pantalla de Especialista
│       ├── Perfil del Especialista
│       ├── Análisis Anterior
│       ├── Botón "Nuevo Análisis"
│       └── [Navega a → Chat del Especialista]
└── Botón "Analizar Todo"

Historial (History)
├── Lista de Textos Anteriores
├── Cada Entrada
│   ├── Título
│   ├── Fecha
│   ├── Palabra Count
│   └── Tap → Detalle del Texto
│       ├── Vista Previa
│       ├── Análisis Guardados
│       └── Opciones (Editar, Eliminar, Compartir)
└── Búsqueda y Filtros

Chat (Chat)
├── Selector de Especialista (Scroll Horizontal)
├── Historial de Conversación
├── Input de Mensaje
└── Respuestas en Tiempo Real
```

---

## 4. PANTALLAS Y COMPONENTES

### 4.1 PANTALLA 1: INICIO (Home)

**Propósito:** Punto de entrada. Carga de texto y envío al equipo.

**Componentes:**

1. **Header**
   - Logo: "Editorial Team"
   - Subtítulo: "Tu equipo editorial de elite"
   - Altura: 60px
   - Fondo: Gradiente dorado (sutil)

2. **Sección: TEXTO A ANALIZAR**
   - Título: "TEXTO A ANALIZAR"
   - TextInput (Textarea)
     - Placeholder: "Pega o escribe tu texto aquí. Puede ser un capítulo, un artículo, un relato corto, una descripción de producto... Tu equipo lo analizará con total honestidad."
     - Min Height: 200px
     - Max Height: 400px
     - Scroll interno si es necesario
     - Fondo: Color surface
     - Borde: 1px color border
     - Border Radius: 16px
     - Padding: 16px

3. **Indicadores de Texto**
   - Fila con dos elementos:
     - "X palabras"
     - "X caracteres"
   - Tamaño: 12px
   - Color: Gris secundario

4. **Sección: EL EQUIPO**
   - Título: "EL EQUIPO"
   - Grid de Especialistas (2 columnas)
   - Cada especialista:
     - Emoji grande (32px)
     - Nombre (Elena, Marco, Sophia, etc.)
     - Rol (Correctora, Analista, etc.)
     - Fondo: Color del especialista (semi-transparente)
     - Tap → Navega a pantalla del especialista
   - Scroll vertical si es necesario

5. **Botón Principal: "Enviar al Equipo Editorial"**
   - Altura: 48px
   - Ancho: Full width - 32px padding
   - Fondo: Dorado (#D4AF37)
   - Texto: Blanco
   - Font Weight: 600
   - Border Radius: 12px
   - Estado Disabled si no hay texto
   - Tap → Envía el texto a todos los especialistas (análisis paralelo)
   - Muestra loading indicator mientras se procesa

6. **Pie de Página**
   - Texto: "Tu equipo analizará el texto con sinceridad absoluta. Sin filtros, sin halagos vacíos."
   - Tamaño: 12px
   - Color: Gris secundario
   - Alineación: Centro

**Estados:**
- **Sin Texto:** Botón deshabilitado, placeholder visible
- **Con Texto:** Botón habilitado, contador actualizado
- **Enviando:** Loading spinner, botón deshabilitado
- **Enviado:** Toast de confirmación, contador se resetea

---

### 4.2 PANTALLA 2: EQUIPO (Team)

**Propósito:** Visualizar todos los especialistas y acceder a análisis individuales.

**Componentes:**

1. **Header**
   - Título: "El Equipo Editorial"
   - Descripción: "8 especialistas, 8 perspectivas"

2. **Grid de Especialistas**
   - Layout: 2 columnas
   - Cada Card:
     - Emoji: 40px
     - Nombre: 16px bold
     - Rol: 12px gris
     - Fondo: Color del especialista (10% opacity)
     - Borde: 1px color del especialista
     - Border Radius: 16px
     - Padding: 16px
     - Altura: 140px
     - Tap → Navega a pantalla del especialista
     - Estado Pressed: Escala 0.95, opacidad 0.8

3. **Información del Especialista (en Card)**
   - Nombre completo
   - Rol profesional
   - Años de experiencia (ej: "20 años de experiencia")
   - Pequeña biografía (1-2 líneas)

4. **Botón Secundario: "Analizar Todo"**
   - Posición: Bottom
   - Altura: 48px
   - Ancho: Full width - 32px
   - Fondo: Transparente
   - Borde: 2px dorado
   - Texto: Dorado
   - Tap → Envía el texto actual a todos los especialistas simultáneamente
   - Deshabilitado si no hay texto en el contexto

**Scroll:** Vertical, contenido fluye naturalmente

---

### 4.3 PANTALLA 3: ESPECIALISTA INDIVIDUAL

**Propósito:** Ver perfil del especialista y su análisis del texto.

**Componentes:**

1. **Header Personalizado**
   - Emoji grande: 60px
   - Nombre: 24px bold
   - Rol: 16px gris
   - Años de experiencia: 14px
   - Fondo: Color del especialista (20% opacity)
   - Altura mínima: 120px

2. **Biografía del Especialista**
   - Texto: 14px, line height 1.6
   - Padding: 16px
   - Fondo: Subtle (surface color)
   - Border Radius: 12px
   - Margen: 12px

3. **Análisis del Especialista**
   - Si no hay análisis:
     - Icono: Reloj o documento
     - Texto: "Sin análisis aún. Envía un texto para que [Nombre] lo analice."
     - Botón: "Enviar Texto" → Vuelve a Inicio
   
   - Si hay análisis:
     - Contenido Markdown renderizado
     - Secciones con títulos (##, ###)
     - Negrita, cursiva, listas
     - Blockquotes para citas
     - Código si es necesario
     - Padding: 16px
     - Fondo: Blanco/Dark surface
     - Border Radius: 12px
     - Scroll vertical

4. **Botones de Acción**
   - Fila de 3 botones (o más si hay espacio):
     - **Copiar:** Copia el análisis al portapapeles
     - **Compartir:** Abre el sheet de compartir del sistema
     - **Más:** Menú adicional (guardar, reportar, etc.)
   - Altura: 40px
   - Ancho: Distribuido equitativamente
   - Fondo: Transparente
   - Borde: 1px
   - Icono + Texto
   - Tap feedback: Escala 0.95

5. **Botón Flotante: Chat**
   - Posición: Bottom Right
   - Tamaño: 56px (FAB)
   - Fondo: Dorado
   - Icono: Mensaje
   - Tap → Navega a Chat con este especialista preseleccionado
   - Sombra: Nivel 3

**Scroll:** Vertical, contenido fluye naturalmente

---

### 4.4 PANTALLA 4: HISTORIAL (History)

**Propósito:** Acceder a textos anteriores y sus análisis.

**Componentes:**

1. **Header**
   - Título: "Historial de Textos"
   - Descripción: "Tus análisis anteriores"

2. **Barra de Búsqueda**
   - Input: "Buscar en historial..."
   - Icono: Lupa
   - Altura: 40px
   - Padding: 12px
   - Border Radius: 12px
   - Borde: 1px color border

3. **Filtros (Opcional)**
   - Botones: "Todos", "Últimos 7 días", "Este mes", "Más antiguos"
   - Scroll horizontal
   - Altura: 36px
   - Padding: 8px
   - Border Radius: 8px

4. **Lista de Textos**
   - Cada entrada:
     - Título (primeras 50 caracteres del texto o título personalizado)
     - Fecha: "Hace 2 días"
     - Palabra count: "1,250 palabras"
     - Preview: Primeras 100 caracteres del texto
     - Fondo: Surface color
     - Borde: 1px color border
     - Border Radius: 12px
     - Padding: 12px
     - Margen entre elementos: 8px
     - Tap → Abre modal/pantalla de detalle

5. **Detalle de Entrada (Modal o Pantalla)**
   - Título completo del texto
   - Fecha y hora exacta
   - Palabra count
   - Vista previa del texto (primeras 500 caracteres)
   - Botones:
     - "Ver Análisis Completo" → Navega a pantalla de especialista con análisis
     - "Editar Texto" → Vuelve a Inicio con el texto precargado
     - "Eliminar" → Confirma eliminación
     - "Compartir" → Sheet de compartir
   - Botón "Cerrar" o Swipe down para cerrar

6. **Estado Vacío**
   - Si no hay historial:
     - Icono: Documento vacío
     - Texto: "No hay textos en el historial aún."
     - Botón: "Crear Primer Análisis" → Navega a Inicio

**Scroll:** Vertical, lista infinita o paginada

---

### 4.5 PANTALLA 5: CHAT (Chat)

**Propósito:** Interacción conversacional con especialistas.

**Componentes:**

1. **Header**
   - Título: "Chat con el Equipo"
   - Descripción: "Haz preguntas y recibe respuestas personalizadas"

2. **Selector de Especialista (Scroll Horizontal)**
   - Botones/Chips:
     - Emoji + Nombre (ej: "✍️ Elena")
     - Altura: 44px
     - Padding: 8px horizontal
     - Border Radius: 12px
     - Estado Activo: Fondo color del especialista, texto blanco
     - Estado Inactivo: Fondo surface, texto gris
     - Scroll horizontal, snap al especialista
   - Margen: 12px horizontal

3. **Área de Mensajes**
   - Scroll vertical
   - Cada mensaje:
     - **Mensaje del Usuario:**
       - Alineación: Derecha
       - Fondo: Dorado (#D4AF37)
       - Texto: Blanco o contraste alto
       - Border Radius: 16px (con esquina cuadrada en la derecha)
       - Padding: 12px 16px
       - Max Width: 85% del ancho
       - Margen: 8px
     
     - **Mensaje del Especialista:**
       - Alineación: Izquierda
       - Fondo: Surface color
       - Borde: 1px color border
       - Texto: Color foreground
       - Border Radius: 16px (con esquina cuadrada en la izquierda)
       - Padding: 12px 16px
       - Max Width: 85% del ancho
       - Margen: 8px
       - Nombre del especialista: 11px bold, color del especialista, margen inferior 4px
       - Contenido Markdown renderizado

4. **Estado de Carga**
   - Mientras se procesa:
     - Icono: Spinner animado
     - Texto: "[Nombre del especialista] está escribiendo..."
     - Posición: Izquierda

5. **Área de Input**
   - TextInput (Textarea):
     - Placeholder: "Haz una pregunta..."
     - Max Length: 500 caracteres
     - Min Height: 40px
     - Max Height: 100px
     - Padding: 12px
     - Border Radius: 12px
     - Borde: 1px color border
     - Fondo: Surface color
   
   - Botón Enviar:
     - Icono: Avión de papel
     - Tamaño: 40x40px
     - Fondo: Dorado (si hay texto), gris (si está vacío)
     - Border Radius: 12px
     - Tap → Envía el mensaje y lo agrega a la conversación
     - Loading state mientras se procesa

6. **Estado Vacío**
   - Si no hay texto en el contexto:
     - Icono: Documento
     - Texto: "Sin texto para analizar. Sube un texto en Inicio para chatear con el equipo."
     - Botón: "Ir a Inicio" → Navega a Inicio

**Scroll:** Vertical, auto-scroll al último mensaje

---

## 5. FUNCIONALIDADES CORE

### 5.1 Carga de Texto

**Flujo:**
1. Usuario pega/escribe texto en Inicio
2. App calcula palabras y caracteres en tiempo real
3. Usuario tapa "Enviar al Equipo Editorial"
4. App valida: mínimo 50 palabras, máximo 50,000 palabras
5. Si es válido: muestra loading, envía al servidor
6. Servidor procesa con LLM de cada especialista en paralelo
7. Respuestas se guardan localmente y en contexto
8. Toast de confirmación: "Análisis completado"

**Validaciones:**
- Mínimo 50 palabras
- Máximo 50,000 palabras
- No vacío
- Caracteres válidos (UTF-8)

### 5.2 Análisis por Especialista

**Flujo:**
1. Usuario selecciona especialista en Equipo
2. App muestra análisis anterior si existe
3. Si no existe: muestra opción "Nuevo Análisis"
4. Usuario tapa "Nuevo Análisis"
5. App envía el texto actual + prompt del especialista al servidor
6. Servidor invoca LLM con system prompt personalizado
7. Respuesta se renderiza como Markdown
8. Se guarda en historial local

**Prompts por Especialista:**
- Cada especialista tiene un system prompt único
- Prompts enfatizan: honestidad, sin lenguaje de IA, criterio propio
- Estructura de respuesta predefinida (secciones con ##, ###)

### 5.3 Chat Conversacional

**Flujo:**
1. Usuario selecciona especialista en Chat
2. Usuario escribe pregunta
3. App envía: pregunta + contexto del texto + especialista ID
4. Servidor invoca LLM con contexto
5. Respuesta se agrega a historial de chat
6. Historial persiste por sesión (no se guarda entre sesiones por defecto)

**Contexto:**
- Pregunta del usuario
- Primeros 500 caracteres del texto actual
- Especialista seleccionado

### 5.4 Historial Local

**Almacenamiento:**
- AsyncStorage (Goodbarber)
- Estructura:
  ```json
  {
    "texts": [
      {
        "id": "uuid",
        "text": "contenido",
        "title": "primeras 50 chars",
        "createdAt": "timestamp",
        "wordCount": 1250,
        "analyses": {
          "corrector": "resultado",
          "analyst": "resultado",
          ...
        }
      }
    ]
  }
  ```

**Límites:**
- Máximo 50 textos guardados
- Máximo 10MB de almacenamiento local
- Textos más antiguos se eliminan automáticamente

### 5.5 Compartir Análisis

**Opciones:**
- Compartir análisis individual (especialista)
- Compartir análisis completo (todos los especialistas)
- Formatos: Texto plano, PDF (si se implementa)
- Destinos: WhatsApp, Email, Redes Sociales, Copiar al portapapeles

---

## 6. ESPECIALISTAS DEL EQUIPO EDITORIAL

### Información Detallada de Cada Especialista

#### 1. **Elena Voss** — Correctora Senior
- **Emoji:** ✍️
- **Color:** #4A7C59 (Verde Editorial)
- **Años:** 20 años de experiencia
- **Biografía:** Formada en Leipzig y Madrid. Ha trabajado para Planeta, Anagrama y Suhrkamp. Especialista en ficción literaria y no ficción. No tiene paciencia para los textos descuidados.
- **Especialidad:** Corrección ortográfica, gramatical y de estilo
- **Estructura de Respuesta:**
  - Diagnóstico general
  - Errores encontrados
  - Problemas de estilo
  - Texto corregido
  - Veredicto final (puntuación 1-10)

#### 2. **Marco Reyes** — Analista Literario y Crítico
- **Emoji:** 🔍
- **Color:** #2E4A7C (Azul Intelectual)
- **Años:** 15 años de experiencia
- **Biografía:** Crítico literario en tres revistas especializadas. Doctor en Literatura Comparada por la Complutense. Lector voraz con criterio propio y sin miedo a decir lo que piensa.
- **Especialidad:** Análisis de estructura, voz, tono y potencial editorial
- **Estructura de Respuesta:**
  - Análisis estructural
  - Voz y tono
  - Puntos fuertes
  - Puntos débiles
  - Potencial editorial
  - Puntuación: X/10

#### 3. **Sophia Laurent** — Editora Jefe
- **Emoji:** 📝
- **Color:** #7C2E4A (Púrpura Editorial)
- **Años:** 18 años de experiencia
- **Biografía:** Editora en París, Londres y Barcelona. Ha trabajado con autores en tres idiomas. Especialista en transformar textos con potencial en libros que se venden.
- **Especialidad:** Edición, reescritura y mejora estructural
- **Estructura de Respuesta:**
  - Evaluación editorial
  - Cambios estructurales recomendados
  - Notas por sección
  - Texto reescrito
  - Diferencias clave

#### 4. **Hiroshi Tanaka** — Traductor Literario
- **Emoji:** 🌐
- **Color:** #4A4A7C (Azul Profundo)
- **Años:** 22 años de experiencia
- **Biografía:** Domina 8 idiomas: japonés, inglés, español, francés, alemán, portugués, italiano y chino mandarín. Especialista en la adaptación cultural, no solo en la traducción literal.
- **Especialidad:** Traducción a múltiples idiomas con adaptación cultural
- **Idiomas Disponibles:** Inglés, Francés, Alemán, Portugués, Italiano, Chino, Japonés, Árabe, Ruso
- **Estructura de Respuesta:**
  - Notas de traducción
  - Desafíos específicos
  - Traducción completa
  - Notas culturales
  - Alternativas consideradas

#### 5. **Rachel Stone** — Experta en Amazon KDP
- **Emoji:** 📚
- **Color:** #7C5A2E (Marrón Comercial)
- **Años:** 12 años de experiencia
- **Biografía:** Ha publicado más de 500 libros en KDP en múltiples nichos. Conoce los algoritmos de Amazon mejor que muchos empleados de la empresa. Directa y sin rodeos sobre el potencial comercial.
- **Especialidad:** Keywords, categorías, precios, posicionamiento KDP
- **Estructura de Respuesta:**
  - Análisis de nicho
  - Keywords recomendadas (top 10)
  - Categorías sugeridas
  - Rango de precio recomendado
  - Estrategia de lanzamiento
  - Competencia directa

#### 6. **Diego Vargas** — Director de Marketing Editorial
- **Emoji:** 📊
- **Color:** #2E7C5A (Verde Mercado)
- **Años:** 16 años de experiencia
- **Biografía:** Ha lanzado libros en mercados hispanohablantes, europeos y latinoamericanos. Especialista en estrategias de bajo presupuesto con alto impacto. No vende humo.
- **Especialidad:** Estrategia de marketing, buyer persona, lanzamiento editorial
- **Estructura de Respuesta:**
  - Buyer persona identificado
  - Canales de distribución recomendados
  - Estrategia de lanzamiento (90 días)
  - Presupuesto estimado (bajo/medio/alto)
  - Métricas de éxito
  - Riesgos y oportunidades

#### 7. **Amara Osei** — Directora de Arte Editorial
- **Emoji:** 🎨
- **Color:** #7C2E2E (Rojo Artístico)
- **Años:** 14 años de experiencia
- **Biografía:** Artista ghanesa-británica premiada en tres continentes. Ha diseñado portadas para editoriales independientes y grandes sellos. Su criterio visual es tan honesto como su trabajo.
- **Especialidad:** Análisis de estilo visual, diseño de portada, ilustración
- **Estructura de Respuesta:**
  - Análisis visual del contenido
  - 3 estilos de ilustración recomendados (con descripción detallada)
  - Paleta de colores para portada
  - Prompt para generación de imagen IA
  - Referencias visuales sugeridas

#### 8. **Carlos Mendez** — Economista Editorial
- **Emoji:** 💰
- **Color:** #5A7C2E (Verde Económico)
- **Años:** 19 años de experiencia
- **Biografía:** Economista especializado en industria editorial. Ha analizado miles de proyectos. Proporciona estimaciones realistas de ventas, costos y beneficios. No promete milagros, solo números.
- **Especialidad:** Análisis económico, estimaciones de ventas, viabilidad comercial
- **Estructura de Respuesta:**
  - Análisis de viabilidad económica
  - **Escenario Bajo (Pesimista):**
    - Precio de venta
    - Copias vendidas (año 1)
    - Ingresos brutos
    - Costos estimados
    - Beneficio neto
    - Análisis
  - **Escenario Medio (Realista):** (Ídem)
  - **Escenario Alto (Optimista):** (Ídem)
  - Recomendación final

---

## 7. FLUJOS DE USUARIO

### Flujo 1: Análisis Completo (Happy Path)

```
1. Usuario abre app → Pantalla Inicio
2. Usuario pega/escribe texto → Contador actualizado
3. Usuario tapa "Enviar al Equipo Editorial"
4. Loading spinner aparece (3-10 segundos)
5. Toast: "Análisis completado"
6. Automáticamente navega a Equipo
7. Usuario ve grid de especialistas con badges "Nuevo análisis"
8. Usuario tapa especialista → Pantalla del especialista
9. Usuario ve análisis completo
10. Usuario tapa "Chat" → Pantalla de Chat con especialista preseleccionado
11. Usuario hace pregunta → Respuesta en tiempo real
12. Conversación continúa
```

### Flujo 2: Análisis Individual

```
1. Usuario abre app → Pantalla Inicio
2. Usuario pega/escribe texto
3. Usuario tapa en especialista en Equipo
4. Navega a pantalla del especialista
5. Usuario tapa "Nuevo Análisis"
6. Loading spinner
7. Análisis aparece
8. Usuario puede copiar, compartir, o ir a chat
```

### Flujo 3: Chat Conversacional

```
1. Usuario en Chat
2. Selecciona especialista
3. Escribe pregunta
4. Tapa enviar
5. Loading spinner
6. Respuesta aparece
7. Usuario puede continuar conversación
8. Historial de chat se mantiene durante la sesión
```

### Flujo 4: Acceder al Historial

```
1. Usuario tapa Historial
2. Ve lista de textos anteriores
3. Tapa en un texto
4. Ve vista previa y opciones
5. Puede:
   - Ver análisis completo
   - Editar texto (vuelve a Inicio con texto precargado)
   - Eliminar
   - Compartir
```

---

## 8. INTEGRACIÓN DE BACKEND

### Endpoints Requeridos

#### POST /api/analyze
**Propósito:** Analizar texto con especialista específico

**Request:**
```json
{
  "text": "string (50-50000 palabras)",
  "specialistId": "corrector|analyst|editor|translator|kdp|marketing|illustrator|economist",
  "targetLanguage": "string (opcional, para traductor)"
}
```

**Response:**
```json
{
  "success": true,
  "specialistId": "string",
  "result": "string (markdown)",
  "processingTime": "number (ms)"
}
```

**Errores:**
- 400: Texto inválido (muy corto, muy largo, vacío)
- 401: No autenticado (si se implementa)
- 500: Error del servidor

#### POST /api/analyzeAll
**Propósito:** Analizar texto con todos los especialistas en paralelo

**Request:**
```json
{
  "text": "string (50-50000 palabras)"
}
```

**Response:**
```json
{
  "success": true,
  "results": {
    "corrector": "string (markdown)",
    "analyst": "string (markdown)",
    ...
  },
  "processingTime": "number (ms)"
}
```

#### POST /api/chat
**Propósito:** Chat conversacional con especialista

**Request:**
```json
{
  "specialistId": "string",
  "userQuestion": "string",
  "textContext": "string (primeros 500 chars del texto)"
}
```

**Response:**
```json
{
  "success": true,
  "specialistId": "string",
  "response": "string (markdown)",
  "processingTime": "number (ms)"
}
```

### Configuración del Servidor

**Base URL:** `https://api.editorialteam.com` (o URL de Goodbarber)

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {token} (si se implementa autenticación)
X-App-Version: 1.0.0
X-Platform: ios|android
```

**Timeouts:**
- Análisis individual: 30 segundos
- Análisis completo: 60 segundos
- Chat: 20 segundos

**Rate Limiting:**
- 100 análisis por hora por usuario (si se implementa)
- 500 mensajes de chat por hora por usuario

---

## 9. CONFIGURACIÓN DE GOODBARBER

### Pasos de Implementación en Goodbarber

#### 1. Crear Proyecto
- Nombre: Editorial Team
- Descripción: Tu equipo editorial virtual
- Icono: Logo dorado (512x512px)
- Splash Screen: Logo + fondo crema/dorado

#### 2. Configurar Identidad Visual
- Colores Primarios:
  - Primary: #D4AF37 (Dorado)
  - Secondary: #F5F1E8 (Crema)
  - Accent: #1A1A1A (Negro)
- Tipografía:
  - Títulos: SF Pro Display / Roboto Bold
  - Cuerpo: SF Pro Text / Roboto Regular
- Modo Oscuro: Habilitado automáticamente

#### 3. Crear Estructura de Navegación
- Tab Bar (Bottom Navigation)
  - Inicio (Home)
  - Equipo (Team)
  - Historial (History)
  - Chat (Chat)

#### 4. Crear Pantallas

**Pantalla: Inicio**
- Componentes:
  - Header (Logo + Subtítulo)
  - TextInput (Textarea)
  - Indicadores (Palabras/Caracteres)
  - Grid de Especialistas (2x4)
  - Botón Primario (Enviar)
  - Pie de página

**Pantalla: Equipo**
- Componentes:
  - Header
  - Grid de Especialistas (2 columnas)
  - Botón Secundario (Analizar Todo)

**Pantalla: Especialista Individual**
- Componentes:
  - Header Personalizado (Emoji + Nombre + Rol)
  - Biografía
  - Área de Análisis (Markdown)
  - Botones de Acción (Copiar, Compartir, Más)
  - FAB (Chat)

**Pantalla: Historial**
- Componentes:
  - Header
  - Barra de Búsqueda
  - Filtros (Opcional)
  - Lista de Textos
  - Modal de Detalle

**Pantalla: Chat**
- Componentes:
  - Header
  - Selector de Especialista (Scroll Horizontal)
  - Área de Mensajes
  - Input + Botón Enviar

#### 5. Configurar Almacenamiento Local
- AsyncStorage para:
  - Historial de textos
  - Análisis guardados
  - Preferencias de usuario

#### 6. Integrar Backend
- API Base URL: `https://api.editorialteam.com`
- Endpoints:
  - POST /api/analyze
  - POST /api/analyzeAll
  - POST /api/chat

#### 7. Configurar Permisos
- Acceso a portapapeles (copiar/pegar)
- Acceso a compartir (sistema)
- Acceso a almacenamiento local

#### 8. Configurar App Store / Google Play

**iOS (App Store):**
- Bundle ID: com.editorialteam.app
- Versión: 1.0.0
- Descripción: [Ver sección 1]
- Categoría: Productividad
- Edad: 4+
- Privacidad: No recopila datos personales
- Permisos: Portapapeles, Compartir

**Android (Google Play):**
- Package Name: com.editorialteam.app
- Versión: 1.0.0
- Descripción: [Ver sección 1]
- Categoría: Productividad
- Clasificación: Todos
- Permisos: INTERNET, WRITE_EXTERNAL_STORAGE (si se implementa descarga)

---

## 10. CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Configuración Base (Semana 1)
- [ ] Crear proyecto en Goodbarber
- [ ] Configurar identidad visual (colores, tipografía)
- [ ] Crear estructura de tabs
- [ ] Crear pantalla Inicio (básica)
- [ ] Crear pantalla Equipo (básica)
- [ ] Crear pantalla Historial (básica)
- [ ] Crear pantalla Chat (básica)

### Fase 2: Componentes y Diseño (Semana 2)
- [ ] Diseñar Header personalizado para Inicio
- [ ] Diseñar TextInput con contador
- [ ] Diseñar Grid de Especialistas
- [ ] Diseñar Cards de Especialista
- [ ] Diseñar Pantalla Individual de Especialista
- [ ] Diseñar Modal de Historial
- [ ] Diseñar Selector de Especialista en Chat
- [ ] Diseñar Área de Mensajes en Chat

### Fase 3: Funcionalidades Core (Semana 3)
- [ ] Implementar carga de texto y contador
- [ ] Implementar validación de texto
- [ ] Implementar almacenamiento local (AsyncStorage)
- [ ] Implementar historial de textos
- [ ] Implementar búsqueda en historial
- [ ] Implementar copiar análisis
- [ ] Implementar compartir análisis

### Fase 4: Integración Backend (Semana 4)
- [ ] Conectar endpoint /api/analyze
- [ ] Conectar endpoint /api/analyzeAll
- [ ] Conectar endpoint /api/chat
- [ ] Implementar loading states
- [ ] Implementar error handling
- [ ] Implementar retry logic
- [ ] Implementar timeout handling

### Fase 5: Pulido y Testing (Semana 5)
- [ ] Testing en iOS
- [ ] Testing en Android
- [ ] Testing en tablet
- [ ] Testing en modo oscuro
- [ ] Testing de accesibilidad
- [ ] Optimización de rendimiento
- [ ] Corrección de bugs

### Fase 6: Publicación (Semana 6)
- [ ] Preparar assets para App Store
- [ ] Preparar assets para Google Play
- [ ] Escribir descripción de app
- [ ] Crear screenshots de marketing
- [ ] Enviar a App Store
- [ ] Enviar a Google Play
- [ ] Monitorear aprobación

---

## NOTAS FINALES

### Principios de Diseño

1. **Honestidad:** El diseño refleja la honestidad del equipo editorial. Sin adornos innecesarios.
2. **Claridad:** Cada elemento tiene un propósito claro. No hay confusión.
3. **Elegancia:** Paleta editorial, tipografía profesional, espaciado generoso.
4. **Accesibilidad:** Contraste suficiente, tamaños de texto legibles, navegación intuitiva.
5. **Rendimiento:** App rápida, sin lags, respuestas inmediatas.

### Tono y Voz

- **Profesional pero accesible:** No es académico, pero tampoco casual.
- **Directo:** Sin rodeos, sin frases de relleno.
- **Empoderador:** Ayuda al usuario a mejorar su escritura.
- **Honesto:** Críticas constructivas, no halagos vacíos.

### Próximas Iteraciones

- V1.1: Autenticación de usuarios
- V1.2: Sincronización en la nube
- V1.3: Exportación a PDF
- V1.4: Integración con redes sociales
- V2.0: Suscripción premium con análisis ilimitados

---

**Documento preparado por:** Editorial Team Design Team  
**Fecha:** Marzo 2026  
**Versión:** 1.0  
**Estado:** Listo para Goodbarber
