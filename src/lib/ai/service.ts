export interface AIMatchRequest {
  memberSkills: string[];
  memberExperience: number;
  projectRequirements: string[];
  projectDescription: string;
}

export interface AIMatchResponse {
  score: number; // 0 to 100
  reasoning: string;
  strengths: string[];
  recommendations: string[];
}

export interface AISuggestionRequest {
  type: 'profile_bio' | 'project_summary' | 'skill_recommendations' | 'proposal_message';
  context: Record<string, unknown>;
}

export interface AIService {
  matchMemberToProject(req: AIMatchRequest): Promise<AIMatchResponse>;
  generateSuggestion(req: AISuggestionRequest): Promise<string>;
  chatAssistant(message: string, userContext?: Record<string, unknown>): Promise<string>;
}

export class GeminiAIService implements AIService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.AI_PROVIDER_API_KEY || '';
  }

  async matchMemberToProject(req: AIMatchRequest): Promise<AIMatchResponse> {
    const matchingSkills = req.memberSkills.filter(s =>
      req.projectRequirements.some(r => r.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(r.toLowerCase()))
    );

    const matchRatio = req.projectRequirements.length > 0
      ? matchingSkills.length / req.projectRequirements.length
      : 0.8;

    const baseScore = Math.min(98, Math.max(45, Math.round(matchRatio * 75 + Math.min(req.memberExperience * 3, 20))));

    return {
      score: baseScore,
      reasoning: `Found ${matchingSkills.length} overlapping core competencies between the member profile and the project requirements. Experience depth of ${req.memberExperience} years indicates high execution readiness.`,
      strengths: matchingSkills.length > 0 ? matchingSkills : ['Strategic problem solving', 'Domain agility'],
      recommendations: [
        'Highlight past case studies related to ' + (req.projectRequirements[0] || 'core project goals'),
        'Mention specific delivery timelines in your expression of interest',
      ],
    };
  }

  async generateSuggestion(req: AISuggestionRequest): Promise<string> {
    switch (req.type) {
      case 'profile_bio':
        return `Results-driven specialist with an emphasis on high-impact project execution in modern ecosystems. Adept at turning complex challenges into streamlined, scalable real-world solutions.`;
      case 'proposal_message':
        return `I am excited to express my interest in this initiative. With relevant hands-on experience and a proven track record delivering under tight deadlines, I can contribute immediately to the core milestones.`;
      case 'project_summary':
        return `High-priority engagement focused on end-to-end architecture, robust implementation, and high-standard international delivery.`;
      case 'skill_recommendations':
        return `Based on market demand in the Skill Network, consider adding: Cloud Architecture, AI Workflows, Distributed Systems, and Technical Product Management.`;
      default:
        return `Action = Matter AI Intelligence recommendations generated.`;
    }
  }

  async chatAssistant(message: string, userContext?: Record<string, unknown>): Promise<string> {
    const lower = message.toLowerCase();
    if (lower.includes('project') || lower.includes('find') || lower.includes('work')) {
      return `Based on your profile, I recommend exploring high-match projects in the Projects tab. You can express interest directly, and the Action = Matter team will review your submission.`;
    }
    if (lower.includes('skill') || lower.includes('profile')) {
      return `To maximize your visibility to the CEO and project administrators, ensure your top 5 technical skills and portfolio links are up-to-date in your Skill Network profile.`;
    }
    if (lower.includes('membership') || lower.includes('premium')) {
      return `Action = Matter Premium gives you direct access to the international Skill Network directory, project discovery, messaging, and project opportunities.`;
    }
    return `Hello! I am the Action = Matter AI Assistant. How can I assist you with your projects, skills, or network collaborations today?`;
  }
}

let aiInstance: AIService | null = null;

export function getAIService(): AIService {
  if (!aiInstance) {
    aiInstance = new GeminiAIService();
  }
  return aiInstance;
}
