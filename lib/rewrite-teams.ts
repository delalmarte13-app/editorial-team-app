/**
 * Rewrite Teams - 5 specialized teams for different age groups
 * Each team has a specific writing style and focus
 */

export type RewriteTeamId = "ages_0_8" | "ages_8_14" | "ages_14_18" | "ages_18_35" | "ages_35_plus" | "editorial";

export interface RewriteTeam {
  id: RewriteTeamId;
  name: string;
  description: string;
  ageRange: string;
  characteristics: string[];
  prompt: (text: string, hallucination: number) => string;
}

const hallucination_prompt = (level: number) => {
  const levels: Record<number, string> = {
    0: "Mantén el texto exactamente como está. No añadas nada nuevo.",
    1: "Mejora solo la claridad y gramática. Cambios mínimos.",
    2: "Mejora prosa y pacing. Cambios moderados manteniendo la esencia.",
    3: "Mejora significativa en prosa, diálogos y descripción. Libertad creativa moderada.",
    4: "Reescritura creativa con libertad para mejorar significativamente. Mantén la voz del autor.",
    5: "Reescritura muy creativa. Puedes reimaginar secciones mientras mantienes la trama.",
  };
  return levels[Math.min(5, Math.max(0, Math.floor(level)))]
};

export const REWRITE_TEAMS: Record<RewriteTeamId, RewriteTeam> = {
  ages_0_8: {
    id: "ages_0_8",
    name: "Equipo Infantil (0-8 años)",
    description: "Especialistas en literatura infantil para preescolares y primaria temprana",
    ageRange: "0-8 años",
    characteristics: [
      "Vocabulario simple y directo",
      "Oraciones cortas",
      "Ritmo rápido y dinámico",
      "Personajes memorables",
      "Mensajes positivos",
      "Repetición de palabras clave",
    ],
    prompt: (text: string, hallucination: number) =>
      `You are a team of expert children's book writers specializing in ages 0-8. Rewrite this text for young children.

${hallucination_prompt(hallucination)}

REQUIREMENTS:
- Use simple vocabulary (max 5-6 letters per word)
- Keep sentences short (5-8 words max)
- Create engaging rhythm and flow
- Make characters memorable and relatable
- Include positive messages
- Repeat key words for learning
- Make it fun and engaging for young readers

Text to rewrite:\n${text}`,
  },

  ages_8_14: {
    id: "ages_8_14",
    name: "Equipo Juvenil (8-14 años)",
    description: "Especialistas en literatura infantil para niños en edad escolar",
    ageRange: "8-14 años",
    characteristics: [
      "Vocabulario intermedio",
      "Oraciones variadas",
      "Aventura y misterio",
      "Personajes con profundidad",
      "Humor apropiado para edad",
      "Temas educativos",
    ],
    prompt: (text: string, hallucination: number) =>
      `You are a team of expert children's book writers specializing in ages 8-14. Rewrite this text for school-age children.

${hallucination_prompt(hallucination)}

REQUIREMENTS:
- Use age-appropriate vocabulary
- Vary sentence length for engagement
- Include adventure, mystery, or humor
- Create characters with personality
- Add educational elements naturally
- Keep pacing engaging
- Make it relatable to their experiences

Text to rewrite:\n${text}`,
  },

  ages_14_18: {
    id: "ages_14_18",
    name: "Equipo YA (14-18 años)",
    description: "Especialistas en Young Adult (YA) para adolescentes",
    ageRange: "14-18 años",
    characteristics: [
      "Vocabulario sofisticado",
      "Temas relevantes para adolescentes",
      "Emociones intensas",
      "Protagonistas con conflictos reales",
      "Diálogos auténticos",
      "Ritmo rápido",
    ],
    prompt: (text: string, hallucination: number) =>
      `You are a team of expert Young Adult (YA) authors. Rewrite this text for teenagers (14-18).

${hallucination_prompt(hallucination)}

REQUIREMENTS:
- Use sophisticated but accessible vocabulary
- Address themes relevant to teens (identity, relationships, independence)
- Create intense, authentic emotions
- Develop protagonists with real conflicts
- Write authentic dialogue
- Maintain fast pacing
- Make it resonate with teenage experiences

Text to rewrite:\n${text}`,
  },

  ages_18_35: {
    id: "ages_18_35",
    name: "Equipo Adulto Joven (18-35 años)",
    description: "Especialistas en New Adult y ficción para adultos jóvenes",
    ageRange: "18-35 años",
    characteristics: [
      "Lenguaje maduro",
      "Temas complejos",
      "Personajes multidimensionales",
      "Narrativa sofisticada",
      "Profundidad emocional",
      "Reflexión y crecimiento",
    ],
    prompt: (text: string, hallucination: number) =>
      `You are a team of expert New Adult and contemporary fiction authors. Rewrite this text for young adults (18-35).

${hallucination_prompt(hallucination)}

REQUIREMENTS:
- Use mature, sophisticated language
- Explore complex themes (career, relationships, identity, purpose)
- Develop multidimensional characters
- Create sophisticated narrative structure
- Include emotional depth and nuance
- Show character growth and reflection
- Balance humor, drama, and insight

Text to rewrite:\n${text}`,
  },

  ages_35_plus: {
    id: "ages_35_plus",
    name: "Equipo Adulto (35+ años)",
    description: "Especialistas en ficción para adultos maduros",
    ageRange: "35+ años",
    characteristics: [
      "Lenguaje refinado",
      "Temas profundos y universales",
      "Personajes complejos",
      "Narrativa literaria",
      "Sabiduría y experiencia",
      "Reflexión existencial",
    ],
    prompt: (text: string, hallucination: number) =>
      `You are a team of expert literary fiction authors for mature audiences. Rewrite this text for adults (35+).

${hallucination_prompt(hallucination)}

REQUIREMENTS:
- Use refined, literary language
- Explore universal themes (mortality, legacy, meaning, relationships)
- Create deeply complex characters
- Employ sophisticated narrative techniques
- Include wisdom earned through experience
- Explore existential and philosophical questions
- Balance literary quality with readability

Text to rewrite:\n${text}`,
  },

  editorial: {
    id: "editorial",
    name: "Reescritor Editorial",
    description: "Reescritor profesional de la editorial",
    ageRange: "Todos",
    characteristics: [
      "Mantiene voz del autor",
      "Mejora prosa y estructura",
      "Respeta intención original",
      "Profesional y versátil",
      "Enfoque en legibilidad",
      "Mejora general",
    ],
    prompt: (text: string, hallucination: number) =>
      `You are the Editorial House's professional rewriter. Your role is to enhance the text while preserving the author's voice and original intent.

${hallucination_prompt(hallucination)}

REQUIREMENTS:
- Maintain the author's unique voice and style
- Improve prose quality and flow
- Enhance pacing and structure
- Strengthen dialogue and description
- Respect the original intent and message
- Make the text more engaging and readable
- Ensure authenticity (sounds human, not AI-generated)

Text to rewrite:\n${text}`,
  },
};

/**
 * Get rewrite team by ID
 */
export function getRewriteTeam(teamId: RewriteTeamId): RewriteTeam {
  return REWRITE_TEAMS[teamId];
}

/**
 * Get all rewrite teams
 */
export function getAllRewriteTeams(): RewriteTeam[] {
  return Object.values(REWRITE_TEAMS);
}

/**
 * Validate hallucination level (0-5)
 */
export function validateHallucinationLevel(level: number): number {
  return Math.min(5, Math.max(0, level));
}
