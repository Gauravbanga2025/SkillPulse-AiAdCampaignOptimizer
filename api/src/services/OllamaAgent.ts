export interface GeneratedCreative {
  headline: string;
  bodyCopy: string;
  imagePrompt: string;
  predictedCTR: string;
}

const OLLAMA_BASE_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

async function getAvailableModel(): Promise<string> {
  try {
    const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    if (!res.ok) throw new Error('Ollama not reachable');
    const data: any = await res.json();
    const models: string[] = (data.models || []).map((m: any) => m.name as string);
    const preferred = ['llama3.2', 'llama3', 'llama3.1', 'mistral', 'mixtral', 'phi3', 'gemma2', 'qwen2.5'];
    for (const p of preferred) {
      const found = models.find(m => m.toLowerCase().startsWith(p));
      if (found) return found;
    }
    if (models.length > 0) return models[0];
    throw new Error('No models available in Ollama');
  } catch (err) {
    console.error('[OllamaAgent] Could not detect model:', err);
    return 'qwen2.5:0.5b';
  }
}

export class OllamaAgent {
  async generateAdConcepts(context: string, count: number = 3): Promise<GeneratedCreative[]> {
    const model = await getAvailableModel();
    console.log(`[OllamaAgent] Using model: ${model}`);

    // 🔑 FIX: Enriched prompt — forces product-specific output
    const prompt = `You are an elite AI media buyer for AdOptimizer.

Generate exactly ${count} distinctly different, high-converting ad creative concepts for:
"${context}"

STRICT RULES:
- Every headline MUST reference the specific product/course name above — never generic phrases
- Body copy MUST include specific details (batch number, instructor name, concrete outcome)
- Use different psychological angles: Urgency, Social Proof, FOMO, Outcome-focused
- Headlines max 40 chars. Body copy max 125 chars.

Respond ONLY with a valid JSON array. No explanation, no markdown, no extra text:
[
  {
    "headline": "specific headline referencing the product",
    "bodyCopy": "specific body copy with product details",
    "imagePrompt": "detailed image prompt matching the product domain",
    "predictedCTR": "X.X%"
  }
]`;

    try {
      const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt,
          stream: false,
          options: { temperature: 0.7, num_predict: 1024 }
        }),
      });

      if (!response.ok) throw new Error(`Ollama HTTP error ${response.status}`);

      const data: any = await response.json();
      const rawText: string = data.response || '';
      const jsonMatch = rawText.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.error('[OllamaAgent] Could not parse JSON:', rawText.slice(0, 300));
        return fallbackCreatives(context, count);
      }

      const parsed = JSON.parse(jsonMatch[0]) as GeneratedCreative[];
      return parsed.slice(0, count);
    } catch (error) {
      console.error('[OllamaAgent] Generation failed:', error);
      return fallbackCreatives(context, count);
    }
  }
}

// 🔑 FIX: Fallback now uses the actual context string so it's never fully generic
function fallbackCreatives(context: string, count: number): GeneratedCreative[] {
  const short = context.slice(0, 50);
  const templates: GeneratedCreative[] = [
    {
      headline: `Join Now: ${short.slice(0, 30)}`,
      bodyCopy: `Limited seats available for ${short}. Enroll today before Batch closes.`,
      imagePrompt: `Dark tech background with terminal screen, course enrollment UI, neon green text, professional DevOps aesthetic`,
      predictedCTR: "3.2%"
    },
    {
      headline: `${short.slice(0, 32)} — Live!`,
      bodyCopy: `Go from zero to job-ready. ${short} — real projects, real skills, real results.`,
      imagePrompt: `Kubernetes pod diagram glowing on dark screen, CI/CD pipeline flowchart, blue and green neon tech aesthetic`,
      predictedCTR: "2.8%"
    },
    {
      headline: `Last Seats: ${short.slice(0, 28)}`,
      bodyCopy: `Don't miss ${short}. Batch filling fast — secure your seat now.`,
      imagePrompt: `Countdown timer UI on dark background, DevOps tools logos, urgency-focused tech course visual`,
      predictedCTR: "4.1%"
    }
  ];
  return templates.slice(0, count);
}
