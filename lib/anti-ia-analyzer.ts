/**
 * Anti-IA Analyzer - Detect AI-generated content and provide authenticity score
 */

export interface AuthenticityAnalysis {
  score: number; // 0-100 (0=likely AI, 100=likely human)
  level: "very_likely_ai" | "likely_ai" | "uncertain" | "likely_human" | "very_likely_human";
  indicators: {
    name: string;
    value: boolean;
    weight: number;
  }[];
  suggestions: string[];
  confidence: number; // 0-100
}

/**
 * Analyze text for AI authenticity
 */
export function analyzeAuthenticity(text: string): AuthenticityAnalysis {
  const indicators = [
    checkForAIPatterns(text),
    checkForRepetition(text),
    checkForNaturalVariation(text),
    checkForContractions(text),
    checkForColloquialisms(text),
    checkForGrammaticalErrors(text),
    checkForEmotionalDepth(text),
    checkForPersonalVoice(text),
    checkForPunctuation(text),
    checkForSentenceVariation(text),
  ];

  const score = calculateScore(indicators);
  const level = getLevel(score);
  const suggestions = generateSuggestions(indicators, score);
  const confidence = calculateConfidence(indicators);

  return {
    score,
    level,
    indicators,
    suggestions,
    confidence,
  };
}

/**
 * Check for common AI patterns
 */
function checkForAIPatterns(text: string): {
  name: string;
  value: boolean;
  weight: number;
} {
  const aiPatterns = [
    /I'm (an|a) AI/i,
    /As an AI/i,
    /I'm here to help/i,
    /Let me (help|assist)/i,
    /I appreciate your question/i,
    /I understand your concern/i,
    /I'd be happy to/i,
    /I hope this helps/i,
    /I've analyzed/i,
    /I notice that/i,
  ];

  const hasAIPatterns = aiPatterns.some((pattern) => pattern.test(text));
  return {
    name: "AI Language Patterns",
    value: !hasAIPatterns,
    weight: 0.15,
  };
}

/**
 * Check for repetition (AI tends to repeat)
 */
function checkForRepetition(text: string): {
  name: string;
  value: boolean;
  weight: number;
} {
  const words = text.toLowerCase().split(/\s+/);
  const wordFreq: Record<string, number> = {};

  words.forEach((word) => {
    if (word.length > 4) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });

  const repetitionCount = Object.values(wordFreq).filter((count) => count > 3).length;
  const repetitionRatio = repetitionCount / Object.keys(wordFreq).length;

  return {
    name: "Low Repetition",
    value: repetitionRatio < 0.1,
    weight: 0.1,
  };
}

/**
 * Check for natural variation in sentence length
 */
function checkForNaturalVariation(text: string): {
  name: string;
  value: boolean;
  weight: number;
} {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const lengths = sentences.map((s) => s.trim().split(/\s+/).length);

  if (lengths.length < 3) {
    return { name: "Sentence Variation", value: true, weight: 0.08 };
  }

  const avg = lengths.reduce((a, b) => a + b) / lengths.length;
  const variance =
    lengths.reduce((sum, len) => sum + Math.pow(len - avg, 2), 0) / lengths.length;
  const stdDev = Math.sqrt(variance);

  // Natural text has good variation (std dev > 3)
  return {
    name: "Sentence Variation",
    value: stdDev > 3,
    weight: 0.12,
  };
}

/**
 * Check for contractions (humans use them, AI often doesn't)
 */
function checkForContractions(text: string): {
  name: string;
  value: boolean;
  weight: number;
} {
  const contractions = /\b(don't|can't|won't|isn't|aren't|wasn't|weren't|haven't|hasn't|hadn't|doesn't|didn't|shouldn't|couldn't|wouldn't|mightn't|mustn't|I'm|you're|he's|she's|it's|we're|they're|I've|you've|we've|they've|I'll|you'll|he'll|she'll|it'll|we'll|they'll)\b/gi;

  const matches = text.match(contractions) || [];
  const contractionRatio = matches.length / text.split(/\s+/).length;

  // Natural text has some contractions (>2%)
  return {
    name: "Contractions",
    value: contractionRatio > 0.02,
    weight: 0.1,
  };
}

/**
 * Check for colloquialisms and informal language
 */
function checkForColloquialisms(text: string): {
  name: string;
  value: boolean;
  weight: number;
} {
  const colloquialisms = /\b(gonna|wanna|kinda|sorta|gotta|ain't|y'all|yeah|nope|yep|hmm|uh|um|like|actually|basically|literally|totally|really|very|pretty|quite)\b/gi;

  const matches = text.match(colloquialisms) || [];
  const hasColloquialisms = matches.length > 0;

  return {
    name: "Colloquialisms",
    value: hasColloquialisms,
    weight: 0.08,
  };
}

/**
 * Check for grammatical errors (humans make them, AI usually doesn't)
 */
function checkForGrammaticalErrors(text: string): {
  name: string;
  value: boolean;
  weight: number;
} {
  // Common human errors
  const humanErrors = /\b(their|there|they're)\b(?!.*\1)/gi;
  const matches = text.match(humanErrors) || [];

  // Some errors suggest human writing
  return {
    name: "Natural Imperfections",
    value: matches.length > 0,
    weight: 0.05,
  };
}

/**
 * Check for emotional depth and personal perspective
 */
function checkForEmotionalDepth(text: string): {
  name: string;
  value: boolean;
  weight: number;
} {
  const emotionalWords = /\b(feel|felt|love|hate|fear|hope|dream|believe|trust|doubt|regret|proud|ashamed|angry|happy|sad|scared|excited)\b/gi;
  const personalPerspective = /\b(I|me|my|we|us|our)\b/gi;

  const emotionalMatches = text.match(emotionalWords) || [];
  const personalMatches = text.match(personalPerspective) || [];

  const hasEmotionalDepth =
    emotionalMatches.length > 0 && personalMatches.length > text.split(/\s+/).length * 0.02;

  return {
    name: "Emotional Depth",
    value: hasEmotionalDepth,
    weight: 0.12,
  };
}

/**
 * Check for personal voice and unique perspective
 */
function checkForPersonalVoice(text: string): {
  name: string;
  value: boolean;
  weight: number;
} {
  // Unique phrases and expressions
  const uniqueExpressions = /\b(I think|in my opinion|I believe|from my perspective|my experience|I've noticed)\b/gi;
  const matches = text.match(uniqueExpressions) || [];

  return {
    name: "Personal Voice",
    value: matches.length > 0,
    weight: 0.1,
  };
}

/**
 * Check for punctuation variety
 */
function checkForPunctuation(text: string): {
  name: string;
  value: boolean;
  weight: number;
} {
  const hasEllipsis = /\.\.\./.test(text);
  const hasDashes = /—|--/.test(text);
  const hasExclamation = /!/.test(text);
  const hasQuestion = /\?/.test(text);

  const varietyScore = [hasEllipsis, hasDashes, hasExclamation, hasQuestion].filter(
    (v) => v
  ).length;

  return {
    name: "Punctuation Variety",
    value: varietyScore >= 2,
    weight: 0.08,
  };
}

/**
 * Check for sentence variation
 */
function checkForSentenceVariation(text: string): {
  name: string;
  value: boolean;
  weight: number;
} {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);

  if (sentences.length < 3) {
    return { name: "Sentence Variety", value: true, weight: 0.06 };
  }

  // Check for different sentence starters
  const starters = new Set(
    sentences.map((s) => s.trim().split(/\s+/)[0].toLowerCase())
  );

  const varietyRatio = starters.size / sentences.length;

  return {
    name: "Sentence Variety",
    value: varietyRatio > 0.4,
    weight: 0.06,
  };
}

/**
 * Calculate authenticity score
 */
function calculateScore(
  indicators: {
    name: string;
    value: boolean;
    weight: number;
  }[]
): number {
  const totalWeight = indicators.reduce((sum, ind) => sum + ind.weight, 0);
  const score = indicators.reduce((sum, ind) => sum + (ind.value ? ind.weight : 0), 0);

  return Math.round((score / totalWeight) * 100);
}

/**
 * Get authenticity level
 */
function getLevel(
  score: number
): "very_likely_ai" | "likely_ai" | "uncertain" | "likely_human" | "very_likely_human" {
  if (score < 20) return "very_likely_ai";
  if (score < 40) return "likely_ai";
  if (score < 60) return "uncertain";
  if (score < 80) return "likely_human";
  return "very_likely_human";
}

/**
 * Generate suggestions to improve authenticity
 */
function generateSuggestions(
  indicators: {
    name: string;
    value: boolean;
    weight: number;
  }[],
  score: number
): string[] {
  const suggestions: string[] = [];

  const failedIndicators = indicators.filter((ind) => !ind.value);

  failedIndicators.forEach((ind) => {
    switch (ind.name) {
      case "AI Language Patterns":
        suggestions.push(
          "Avoid phrases like 'As an AI' or 'I'm here to help'. Write more naturally."
        );
        break;
      case "Low Repetition":
        suggestions.push("Vary your vocabulary more. Avoid repeating the same words.");
        break;
      case "Sentence Variation":
        suggestions.push(
          "Vary your sentence lengths. Mix short, punchy sentences with longer ones."
        );
        break;
      case "Contractions":
        suggestions.push("Use more contractions (don't, can't, won't) to sound more natural.");
        break;
      case "Colloquialisms":
        suggestions.push("Add some informal language or colloquialisms to sound more human.");
        break;
      case "Emotional Depth":
        suggestions.push(
          "Express more personal feelings and emotions. Share your perspective."
        );
        break;
      case "Personal Voice":
        suggestions.push(
          "Use phrases like 'I think' or 'in my opinion' to show personal perspective."
        );
        break;
      case "Punctuation Variety":
        suggestions.push(
          "Use more varied punctuation (dashes, ellipsis, exclamation marks) naturally."
        );
        break;
    }
  });

  if (suggestions.length === 0) {
    suggestions.push("This text appears authentic and human-written.");
  }

  return suggestions;
}

/**
 * Calculate confidence level
 */
function calculateConfidence(
  indicators: {
    name: string;
    value: boolean;
    weight: number;
  }[]
): number {
  // Confidence is based on how many indicators we could check
  const checkedIndicators = indicators.length;
  const maxIndicators = 10;

  return Math.round((checkedIndicators / maxIndicators) * 100);
}
