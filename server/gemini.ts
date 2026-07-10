/**
 * Gemini API Integration Service
 * Handles all communication with Google Gemini API
 * Provides analysis, chat, and rewriting capabilities
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is not set");
}

const genAI = new GoogleGenerativeAI(apiKey);

export type SpecialistId =
  | "corrector"
  | "analyst"
  | "editor"
  | "translator"
  | "kdp"
  | "marketing"
  | "illustrator"
  | "economist"
  | "rewriter"
  | "antiAi"
  | "director";

export interface AnalysisRequest {
  text: string;
  specialistId: SpecialistId;
  targetLanguage?: string;
}

export interface ChatRequest {
  specialistId: SpecialistId;
  userQuestion: string;
  textContext: string;
}

export interface ParagraphEditRequest {
  paragraph: string;
  action: "rewrite" | "summarize" | "improve" | "expand" | "simplify";
}

/**
 * Analyze text with a specific specialist using Gemini
 */
export async function analyzeWithSpecialist(
  request: AnalysisRequest
): Promise<string> {
  try {
    const { SPECIALIST_SYSTEM_PROMPTS, SPECIALIST_USER_PROMPTS } = await import(
      "./prompts"
    );

    const systemPrompt = SPECIALIST_SYSTEM_PROMPTS[request.specialistId];
    const userPrompt =
      request.specialistId === "translator"
        ? SPECIALIST_USER_PROMPTS.translator(
            request.text,
            request.targetLanguage || "English"
          )
        : SPECIALIST_USER_PROMPTS[request.specialistId](request.text);

    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(userPrompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API error in analyzeWithSpecialist:", error);
    throw new Error(
      `Failed to analyze text with ${request.specialistId}: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Chat with a specialist about the manuscript
 */
export async function chatWithSpecialist(
  request: ChatRequest
): Promise<string> {
  try {
    const { SPECIALIST_SYSTEM_PROMPTS } = await import("./prompts");

    const specialistSystemPrompt = SPECIALIST_SYSTEM_PROMPTS[request.specialistId];
    const combinedSystemPrompt = `${specialistSystemPrompt}\n\nManuscript Context (first 500 chars):\n${request.textContext}`;

    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      systemInstruction: combinedSystemPrompt,
    });

    const result = await model.generateContent(request.userQuestion);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API error in chatWithSpecialist:", error);
    throw new Error(
      `Failed to chat with specialist: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Edit a specific paragraph
 */
export async function editParagraph(
  request: ParagraphEditRequest
): Promise<string> {
  try {
    const { PARAGRAPH_EDITING_PROMPT } = await import("./prompts");

    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      systemInstruction:
        "You are a professional editor. Provide clear, actionable edits. Write naturally without AI patterns.",
    });

    const prompt = PARAGRAPH_EDITING_PROMPT(request.paragraph, request.action);
    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API error in editParagraph:", error);
    throw new Error(
      `Failed to edit paragraph: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Analyze all specialists in parallel
 */
export async function analyzeWithAllSpecialists(text: string): Promise<
  Record<SpecialistId, string>
> {
  const specialists: SpecialistId[] = [
    "corrector",
    "analyst",
    "editor",
    "translator",
    "kdp",
    "marketing",
    "illustrator",
    "economist",
  ];

  try {
    const results = await Promise.all(
      specialists.map(async (specialistId) => {
        try {
          const analysis = await analyzeWithSpecialist({
            text,
            specialistId,
          });
          return { specialistId, analysis };
        } catch (error) {
          console.error(`Error analyzing with ${specialistId}:`, error);
          return {
            specialistId,
            analysis: `Error: Failed to analyze with ${specialistId}`,
          };
        }
      })
    );

    const analysisMap: Record<SpecialistId, string> = {} as Record<
      SpecialistId,
      string
    >;
    results.forEach(({ specialistId, analysis }) => {
      analysisMap[specialistId] = analysis;
    });

    return analysisMap;
  } catch (error) {
    console.error("Gemini API error in analyzeWithAllSpecialists:", error);
    throw new Error(
      `Failed to analyze with all specialists: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Rewrite entire text with improved prose while maintaining author's voice
 */
export async function rewriteText(text: string): Promise<string> {
  try {
    const { SPECIALIST_SYSTEM_PROMPTS, SPECIALIST_USER_PROMPTS } = await import(
      "./prompts"
    );

    const systemPrompt = SPECIALIST_SYSTEM_PROMPTS.rewriter;
    const userPrompt = SPECIALIST_USER_PROMPTS.rewriter(text);

    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(userPrompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API error in rewriteText:", error);
    throw new Error(
      `Failed to rewrite text: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Verify text authenticity and detect AI patterns
 */
export async function verifyTextAuthenticity(text: string): Promise<string> {
  try {
    const { SPECIALIST_SYSTEM_PROMPTS, SPECIALIST_USER_PROMPTS } = await import(
      "./prompts"
    );

    const systemPrompt = SPECIALIST_SYSTEM_PROMPTS.antiAi;
    const userPrompt = SPECIALIST_USER_PROMPTS.antiAi(text);

    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      systemInstruction: systemPrompt,
    });

    const result = await model.generateContent(userPrompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API error in verifyTextAuthenticity:", error);
    throw new Error(
      `Failed to verify text authenticity: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Generate text-to-speech audio (returns prompt for external TTS service)
 */
export async function generateAudioPrompt(text: string): Promise<string> {
  const { AUDIO_GENERATION_PROMPT } = await import("./prompts");
  return AUDIO_GENERATION_PROMPT(text, "neutral");
}

/**
 * Health check for Gemini API
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(
      "Respond with a single word: working"
    );
    const response = result.response;
    return response.text().toLowerCase().includes("working");
  } catch (error) {
    console.error("Gemini API health check failed:", error);
    return false;
  }
}
