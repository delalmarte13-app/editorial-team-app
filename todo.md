# Editorial Team — TODO

## Configuración y Branding
- [x] Configurar paleta de colores (crema, negro, dorado)
- [x] Generar logo de la app
- [x] Actualizar app.config.ts con nombre y logo
- [x] Actualizar theme.config.js con colores de marca

## Estructura y Navegación
- [x] Configurar tab bar con 3 tabs (Inicio, Equipo, Historial)
- [x] Agregar iconos necesarios en icon-symbol.tsx
- [x] Crear estructura de carpetas para especialistas
- [x] Configurar navegación stack para pantallas de especialistas

## Backend / API
- [x] Crear router tRPC para análisis editorial (publicProcedure)
- [x] Implementar endpoint de análisis por especialista con LLM
- [x] Implementar endpoint de generación de ilustración
- [x] Implementar endpoint de traducción

## Pantalla de Inicio
- [x] Área de carga/escritura de texto grande
- [x] Botón "Enviar al equipo"
- [x] Historial de textos recientes con AsyncStorage
- [x] Contador de caracteres/palabras

## Hub del Equipo
- [x] Grid de tarjetas de especialistas
- [x] Estado de cada especialista (esperando/analizando/listo)
- [x] Avatares e información de cada miembro
- [x] Navegación a pantalla de especialista

## Módulo: Correctora (Elena Voss)
- [x] Perfil de la especialista
- [x] Análisis de errores ortográficos y gramaticales
- [x] Texto corregido
- [x] Opinión editorial sincera

## Módulo: Analista (Marco Reyes)
- [x] Perfil del especialista
- [x] Análisis estructural y narrativo
- [x] Evaluación de voz y estilo
- [x] Puntuación editorial con justificación

## Módulo: Editor (Sophia Laurent)
- [x] Perfil de la especialista
- [x] Sugerencias de restructuración
- [x] Texto completamente reescrito

## Módulo: Traductor (Hiroshi Tanaka)
- [x] Perfil del especialista
- [x] Selector de idioma destino (10 idiomas)
- [x] Traducción completa
- [x] Notas culturales y de adaptación

## Módulo: Especialista KDP (Rachel Stone)
- [x] Perfil de la especialista
- [x] Análisis de viabilidad KDP
- [x] Categorías y keywords recomendadas
- [x] Precio y formato sugerido

## Módulo: Marketing (Diego Vargas)
- [x] Perfil del especialista
- [x] Estudio de mercado del nicho
- [x] Buyer persona
- [x] Estrategia de lanzamiento
- [x] Copy para descripción

## Módulo: Ilustraciones (Amara Osei)
- [x] Perfil de la especialista
- [x] Análisis de estilos visuales sugeridos (3 estilos)
- [x] Generación de ilustración de muestra con IA
- [x] Paleta de colores para portada

## Pantalla de Historial
- [x] Lista de textos anteriores con AsyncStorage
- [x] Opción de recargar texto anterior
- [x] Opción de eliminar del historial

## Pulido Final
- [x] Estados vacíos y de error
- [x] Modo oscuro completo
- [x] Pruebas unitarias básicas
- [x] Eliminar console.log de debug
- [x] Agregar tokens accent/tint al theme-provider

## Mejoras Solicitadas (Nueva Iteración)
- [x] Corregir generación de ilustraciones (debug del endpoint)
- [x] Añadir especialista económico (Carlos Mendez - Economista)
- [x] Implementar análisis de ventas en 3 escenarios (bajo, medio, alto)
- [x] Crear pantalla de chat con el equipo editorial
- [x] Integrar chat con contexto del texto actual

## Testing y Validación
- [x] Tests unitarios (24 tests pasando)
- [x] TypeScript sin errores
- [x] Linting corregido
- [x] Servidor de desarrollo funcionando
- [x] Guía completa de Goodbarber creada (GOODBARBER_DESIGN_GUIDE.md)

## Mejoras Fase 2 (Gemini API + Nuevos Departamentos)

### Configuración Gemini
- [ ] Configurar clave API de Google Gemini
- [ ] Reemplazar mocks con análisis reales de Gemini
- [ ] Validar conexión y manejo de errores

### Nuevos Departamentos
- [ ] Departamento de Reescritura (texto mejorado + audio)
- [ ] Departamento Anti-IA (verificación de autenticidad)
- [ ] Equipo de Ingeniería de Prompts (gestión centralizada)

### Funcionalidades Avanzadas
- [ ] Edición por párrafo (seleccionar + menú rápido)
- [ ] Chat interactivo mejorado con contexto
- [ ] Dictado de voz (speech-to-text)
- [ ] Lectura de voz (text-to-speech)
- [ ] Almacenamiento offline de audio
- [ ] Ilustración con alternativa gratuita

### Testing y Validación
- [x] Tests para Gemini API
- [ ] Implementar importación de archivos (.txt, .pdf, .docx)
- [ ] Probar carga de archivos en múltiples formatos
- [ ] Probar pantalla de inicio (pegar, contador, estadísticas)
- [ ] Probar pantalla del equipo (visualización de especialistas)
- [ ] Probar análisis individual con Gemini API
- [ ] Probar chat interactivo con especialistas
- [ ] Probar historial de textos
- [ ] Probar navegación entre pantallas
- [ ] Probar modo oscuro y responsividad
- [ ] Ejecutar suite completa de tests


## Fase 3: Modo Offline y Monitor de Créditos
- [x] Implementar sistema de monitor de créditos API (api-credits.ts)
- [x] Implementar análisis offline para todos los especialistas (offline-analysis.ts)
- [x] Implementar exportación de análisis (JSON, CSV, TXT, HTML)
- [x] Crear pantalla de configuración con modo offline
- [x] Agregar tab de configuración a la navegación
- [x] Tests para modo offline y exportación (92 tests pasando)
- [x] Probar importación/exportación de archivos
- [x] Probar navegación completa
- [x] Verificar modo offline funciona correctamente
- [x] Verificar monitor de créditos actualiza correctamente

## Fase 4: Correcciones y Limpieza Final
- [x] Corregir errores TypeScript en app/specialist/[id].tsx
- [x] Implementar funcionalidad de pegar texto en home screen
- [x] Agregar botón de copiar en pantalla de reescritura
- [x] Verificar extractContent se usa en todos los puntos de API
- [x] Ejecutar tests completos (92 tests pasando)
- [x] TypeScript sin errores
- [x] Servidor funcionando correctamente

## Fase 5: Historial de Reescrituras Recientes
- [x] Crear funciones getRecentRewrites y deleteRewrite en lib/rewrite.ts
- [x] Agregar estado recentRewrites en home screen
- [x] Implementar funciones handleLoadRewrite y handleDeleteRewrite
- [x] Crear sección visual de reescrituras recientes en home screen
- [x] Agregar scroll horizontal para tarjetas de reescrituras
- [x] Implementar eliminación de reescrituras con confirmación
- [x] Agregar estilos para tarjetas de reescrituras (rewriteCard, rewritePreview, etc.)
- [x] Crear tests para funcionalidad de historial (10 tests)
- [x] Todos los tests pasando (112 tests)
- [x] TypeScript sin errores
