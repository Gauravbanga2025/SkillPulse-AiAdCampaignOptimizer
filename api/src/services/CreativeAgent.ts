import { GoogleGenAI, Type, Schema } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({});

export interface GeneratedCreative {
  headline: string;
  bodyCopy: string;
  imagePrompt: string;
  predictedCTR: string;
}

export interface CampaignContext {
  businessContext: string;
  landingPageUrl?: string;
  targetRoas?: number;
  dailyBudget?: number;
}

export class CreativeAgent {
  async generateAdConcepts(
    context: CampaignContext | string,
    count: number = 3
  ): Promise<GeneratedCreative[]> {

    const enrichedPrompt = this.buildPrompt(context, count);

    const responseSchema: Schema = {
      type: Type.ARRAY,
      description: "A list of ad creative concepts",
      items: {
        type: Type.OBJECT,
        properties: {
          headline: {
            type: Type.STRING,
            description: "A punchy, high-converting ad headline (max 40 chars) — MUST reference the specific product or course name",
          },
          bodyCopy: {
            type: Type.STRING,
            description: "The primary text/body copy for the ad (max 125 chars) — MUST include specific product details, not generic copy",
          },
          imagePrompt: {
            type: Type.STRING,
            description: "A highly detailed prompt for an image generation model to create the visual asset — must match the product theme (e.g. DevOps = terminals, pipelines, Kubernetes)",
          },
          predictedCTR: {
            type: Type.STRING,
            description: "A simulated predicted Click-Through-Rate percentage (e.g. '3.2%')"
          }
        },
        required: ["headline", "bodyCopy", "imagePrompt", "predictedCTR"],
      },
    };

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: enrichedPrompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
          temperature: 0.7,
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text) as GeneratedCreative[];
        return parsed;
      }
      return [];
    } catch (error) {
      console.error("Agent failed to generate creatives:", error);
      return [];
    }
  }

  private buildPrompt(context: CampaignContext | string, count: number): string {
    if (typeof context === 'string') {
      return this.buildLegacyPrompt(context, count);
    }

    const { businessContext, landingPageUrl, targetRoas, dailyBudget } = context;

    const isDevOps = /devops|docker|kubernetes|k8s|ci\/cd|jenkins|terraform|ansible/i.test(businessContext);
    const isCourse = /batch|course|bootcamp|training|learn|josh|shubham/i.test(businessContext);
    const themeHint = isDevOps
      ? 'dark terminal screens, Kubernetes pod diagrams, CI/CD pipeline flowcharts, neon green/blue tech aesthetics'
      : 'professional, clean, modern business aesthetic';

    return `
You are an elite performance marketing AI for AdOptimizer.

YOUR TASK:
Generate exactly ${count} distinctly different, high-converting ad creative concepts.

STRICT RULES — MUST FOLLOW:
1. Every headline MUST reference the SPECIFIC product name or course below — never generic phrases like "Transform Your Results" or "The Smarter Way"
2. Every body copy MUST include at least one specific detail (batch number, instructor name, a concrete outcome, or enrollment deadline)
3. Image prompts MUST match the product domain: ${themeHint}
4. Use different psychological angles across the ${count} concepts: e.g. Urgency, Social Proof, FOMO, Outcome-focused, Fear of Missing Out
5. Headlines max 40 characters. Body copy max 125 characters.

CAMPAIGN DETAILS:
- Product / Course: ${businessContext}
- Landing Page: ${landingPageUrl ?? 'not provided'}
- Target ROAS: ${targetRoas ? `${targetRoas}x return on ad spend` : 'not specified'}
- Daily Budget: ${dailyBudget ? `$${dailyBudget}/day` : 'not specified'}
- Campaign Goal: Drive enrollments / sign-ups to the landing page

${isCourse ? `COURSE-SPECIFIC GUIDANCE:
- Emphasize limited batch seats and enrollment deadline
- Mention the instructor by name if present in the product name
- Outcomes should be career/skill focused (e.g. "get hired", "go from 0 to job-ready", "master DevOps")
- CTAs should be enrollment-driven: "Enroll Now", "Join Batch 10", "Secure Your Seat"
` : ''}

BAD EXAMPLES (too generic — never do this):
- ❌ Headline: "Transform Your Results Today"
- ❌ Body: "Powered by AI. Built for performance."
- ❌ Image: "Modern abstract technology visual with bright gradients"

GOOD EXAMPLES (specific — do this):
- ✅ Headline: "DevOps Batch 10 is Live!"
- ✅ Body: "Go from Zero to DevOps Engineer with Josh. Batch 10 seats filling fast — enroll today."
- ✅ Image: "Dark background with glowing Kubernetes node diagram, terminal window showing a successful CI/CD pipeline run, neon green text, professional tech course aesthetic"

Now generate ${count} ad concepts for: "${businessContext}"
`;
  }

  private buildLegacyPrompt(context: string, count: number): string {
    return `
You are an elite AI media buyer for AdOptimizer.

Generate ${count} distinctly different, high-converting ad creative concepts for:
"${context}"

RULES:
- Every headline MUST specifically reference the product/course name above — no generic copy
- Use different psychological angles: Urgency, Social Proof, FOMO, Outcome-focused
- Headlines max 40 chars. Body copy max 125 chars.
- Image prompts must visually match the product domain
`;
  }
}
