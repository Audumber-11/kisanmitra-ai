// ============================================================
// KisanMitra AI - OpenRouter Client (Browser-Side)
// Falls back to local knowledge base when AI is unavailable
// ============================================================

import type { Language } from "./farming-knowledge";

// ============================================================
// CONFIGURATION
// ============================================================

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "qwen/qwen-2.5-7b-instruct:free";

function getModel(): string {
  if (typeof window !== "undefined") {
    return (
      process.env.NEXT_PUBLIC_OPENROUTER_MODEL ||
      (window as any).__ENV__?.NEXT_PUBLIC_OPENROUTER_MODEL ||
      DEFAULT_MODEL
    );
  }
  return DEFAULT_MODEL;
}

function getApiKey(): string | null {
  if (typeof window !== "undefined") {
    return (
      process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ||
      (window as any).__ENV__?.NEXT_PUBLIC_OPENROUTER_API_KEY ||
      null
    );
  }
  return null;
}

// ============================================================
// SYSTEM PROMPT
// ============================================================

function buildSystemPrompt(language: Language): string {
  const languageNames: Record<Language, string> = {
    hindi: "Hindi (हिंदी)",
    marathi: "Marathi (मराठी)",
  };

  return `You are KisanMitra AI, a friendly Hindi-speaking agricultural advisor for Indian farmers.

IMPORTANT RULES:
1. ALWAYS respond in ${languageNames[language]} only
2. Be helpful, concise, and practical
3. Give farming advice specific to Indian agriculture
4. Mention recommended crop varieties suitable for Indian conditions
5. Give specific fertilizer dosages (kg/acre), pesticide names and dosages (ml/g per liter)
6. Mention Indian government schemes by their Hindi names (PM-KISAN, PMFBY, KCC etc.)
7. Give MSP (Minimum Support Price) figures in rupees when relevant
8. Keep answers to 2-4 short sentences maximum
9. Do not make up crop prices - if unsure, say "check your local mandi"
10. If you don't know something specific, say so honestly

Farming knowledge to draw from:
- Major crops: wheat, rice, maize, bajra, jowar, cotton, sugarcane, soybean, groundnut, mustard
- Horticulture: tomato, onion, potato, chili, brinjal, cauliflower, mango, banana, grapes, papaya
- Common diseases: late blight, leaf curl, rust, powdery mildew, bacterial blight
- Common pests: whitefly, aphid, bollworm, fruit fly, stem borer
- Fertilizers: urea, DAP, MOP, NPK 12:32:16, 19:19:19
- Government schemes: PM-KISAN, PMFBY, KCC, PKVY, PMKSY, eNAM
- Irrigation: drip, sprinkler systems
- MSP crops: wheat ₹2275/q, paddy ₹2200/q, cotton ₹7521/q

Always sign off as "किसान मित्र AI" or "किसान मित्र" at the end.`;
}

// ============================================================
// MAIN FUNCTION: Ask OpenRouter
// ============================================================

export interface AskAIResult {
  answer: string;
  source: "ai" | "kb";
  model?: string;
  error?: string;
}

export async function askOpenRouter(
  query: string,
  language: Language
): Promise<AskAIResult> {
  const apiKey = getApiKey();

  // Fall back to KB if no API key
  if (!apiKey) {
    const { getKnowledgeAnswer } = await import("./farming-knowledge");
    return {
      answer: getKnowledgeAnswer(query, language),
      source: "kb",
    };
  }

  try {
    const model = getModel();
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": typeof window !== "undefined" ? window.location.href : "",
        "X-Title": "KisanMitra AI",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: buildSystemPrompt(language) },
          { role: "user", content: query },
        ],
        temperature: 0.4,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API error:", response.status, errorText);

      // Fall back to KB on error
      const { getKnowledgeAnswer } = await import("./farming-knowledge");
      return {
        answer: getKnowledgeAnswer(query, language),
        source: "kb",
        error: `API error ${response.status}`,
      };
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error("Invalid response from OpenRouter");
    }

    const answer = data.choices[0].message.content.trim();

    return {
      answer,
      source: "ai",
      model,
    };
  } catch (err) {
    console.error("OpenRouter fetch error:", err);

    // Fall back to KB on exception
    try {
      const { getKnowledgeAnswer } = await import("./farming-knowledge");
      return {
        answer: getKnowledgeAnswer(query, language),
        source: "kb",
        error: err instanceof Error ? err.message : "Unknown error",
      };
    } catch {
      return {
        answer: "क्षमा करें, कुछ तकनीकी समस्या है। कृपया फिर से पूछें।",
        source: "kb",
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  }
}

// ============================================================
// UTILITY: Check if AI is available
// ============================================================

export function isAIAvailable(): boolean {
  return !!getApiKey();
}

// ============================================================
// UTILITY: Get status info
// ============================================================

export function getAIStatus(): { available: boolean; model: string | null; keyConfigured: boolean } {
  return {
    available: isAIAvailable(),
    model: getModel(),
    keyConfigured: !!getApiKey(),
  };
}
