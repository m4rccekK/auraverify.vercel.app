export enum PlanType {
  REGULAR = 'REGULAR',
  PREMIUM = 'PREMIUM'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'google' | 'facebook';
}

export interface GroundingSource {
  title?: string;
  uri?: string;
}

export interface DetectionResult {
  aiProbability: number;
  detectedTool: string;
  reasoning: string;
  sources?: GroundingSource[];
  recommendations?: {
    toolName: string;
    description: string;
    benefits: string[];
  }[];
}
