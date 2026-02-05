import { GoogleGenAI, Type } from "@google/genai";
import { DetectionResult, GroundingSource } from "../types";

export interface AnalysisInput {
  text?: string;
  fileData?: {
    base64: string;
    mimeType: string;
  };
}

export async function analyzeContent(
  input: AnalysisInput, 
  isPremium: boolean
): Promise<DetectionResult> {
  // Use named parameter for apiKey as per instructions
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  const modelName = isPremium ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      aiProbability: { 
        type: Type.NUMBER, 
        description: "Confidence level 0-100 that this content is AI generated." 
      },
      detectedTool: { 
        type: Type.STRING, 
        description: "Likely source (e.g., ChatGPT-4, Claude 3.5, Midjourney, Sora, or Human)." 
      },
      reasoning: { 
        type: Type.STRING, 
        description: "Deep technical analysis of structural markers, linguistic patterns, or metadata anomalies." 
      },
      recommendations: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            toolName: { type: Type.STRING },
            description: { type: Type.STRING },
            benefits: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["toolName", "description", "benefits"]
        }
      }
    },
    required: ["aiProbability", "detectedTool", "reasoning"]
  };

  const prompt = `
    Role: Senior Forensic Content Analyst.
    Task: Analyze the provided content for signatures of Generative AI.
    
    Criteria for Analysis:
    1. Linguistic "Burstiness" and Perplexity (for text).
    2. Structural repetition and perfect grammar markers.
    3. For files: Look for metadata artifacts or compression patterns typical of AI generators.
    4. Provide an "Enhancement Suite" recommendation if AI is detected to help the user humanize or improve the content.

    ${isPremium ? "PREMIUM MODE: Perform grounding checks for factual hallucinations and cross-reference with known AI datasets." : "STANDARD MODE: Focus on structural pattern analysis."}
  `;

  const parts: any[] = [{ text: prompt }];
  
  if (input.text) {
    parts.push({ text: `CONTENT TO ANALYZE:\n${input.text}` });
  }
  
  if (input.fileData) {
    parts.push({
      inlineData: {
        data: input.fileData.base64,
        mimeType: input.fileData.mimeType
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema as any,
        tools: isPremium ? [{ googleSearch: {} }] : undefined,
      }
    });

    // Access .text property directly, do not use .text()
    const textOutput = response.text;
    if (!textOutput) throw new Error("Analysis engine returned no data.");
    
    const result = JSON.parse(textOutput) as DetectionResult;
    
    if (isPremium && response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      const chunks = response.candidates[0].groundingMetadata.groundingChunks;
      result.sources = chunks
        .filter(c => c.web)
        .map(c => ({ title: c.web?.title, uri: c.web?.uri }));
    }

    return result;
  } catch (error) {
    console.error("AuraVerify Analysis Failure:", error);
    throw error;
  }
}
