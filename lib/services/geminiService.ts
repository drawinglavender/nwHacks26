import { SOUL_COLORS, getSoulColorById } from '@/lib/constants/soulColors';

// Using Google's official SDK
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function assignSoulColor(userResponses: string[]): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const soulColorList = SOUL_COLORS.map(sc => `- ${sc.id}: ${sc.name} - ${sc.line1} ${sc.line2}`).join('\n');

    const prompt = `You are a Soul Color analyzer. Based on these user responses, assign ONE of these Soul Colors that best matches their personality and communication style.

Available Soul Colors:
${soulColorList}

User Responses:
${userResponses.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Respond with ONLY the soul color ID (e.g., "obsidian-violet"), nothing else.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim().toLowerCase();

    // Extract the color ID from the response
    const colorId = responseText.split('\n')[0].trim();

    // Validate that it's a real color ID
    if (getSoulColorById(colorId)) {
      return colorId;
    }

    // Fallback to a random color if response is invalid
    return SOUL_COLORS[Math.floor(Math.random() * SOUL_COLORS.length)].id;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // Fallback to random color on error
    return SOUL_COLORS[Math.floor(Math.random() * SOUL_COLORS.length)].id;
  }
}

export async function analyzeSoulColorWithReasoning(userResponses: string[]): Promise<{
  soulColorId: string;
  reasoning: string;
}> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const soulColorList = SOUL_COLORS.map(sc => `- ${sc.id}: ${sc.name} - ${sc.line1} ${sc.line2}`).join('\n');

    const prompt = `You are a Soul Color analyzer. Based on these user responses, analyze and assign ONE Soul Color that best matches their personality.

Available Soul Colors:
${soulColorList}

User Responses:
${userResponses.map((r, i) => `${i + 1}. ${r}`).join('\n')}

Respond in this format ONLY:
soul_color_id: [ID]
reasoning: [1-2 sentence explanation]`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    // Parse the response
    const lines = responseText.split('\n');
    let soulColorId = '';
    let reasoning = '';

    for (const line of lines) {
      if (line.startsWith('soul_color_id:')) {
        soulColorId = line.replace('soul_color_id:', '').trim().toLowerCase();
      } else if (line.startsWith('reasoning:')) {
        reasoning = line.replace('reasoning:', '').trim();
      }
    }

    // Validate color ID
    if (!getSoulColorById(soulColorId)) {
      soulColorId = SOUL_COLORS[Math.floor(Math.random() * SOUL_COLORS.length)].id;
      reasoning = 'Auto-assigned based on availability';
    }

    return { soulColorId, reasoning };
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return {
      soulColorId: SOUL_COLORS[Math.floor(Math.random() * SOUL_COLORS.length)].id,
      reasoning: 'Assigned due to API error',
    };
  }
}
