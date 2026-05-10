import { PROMPT_TEMPLATES } from './templates';

export interface PromptConfig {
  name: string;
  type: string;
  version: number;
  systemPrompt: string;
  userPromptTemplate: string;
  model: string;
  temperature: number;
  maxTokens: number;
  outputSchema?: Record<string, unknown>;
}

class PromptRegistry {
  private prompts: Map<string, PromptConfig> = new Map();

  constructor() {
    for (const prompt of PROMPT_TEMPLATES) {
      this.prompts.set(prompt.name, prompt);
    }
  }

  get(name: string): PromptConfig | undefined {
    return this.prompts.get(name);
  }

  getOrThrow(name: string): PromptConfig {
    const prompt = this.prompts.get(name);
    if (!prompt) throw new Error(`Prompt "${name}" not found in registry`);
    return prompt;
  }

  render(name: string, variables: Record<string, string>): { system: string; user: string } {
    const config = this.getOrThrow(name);
    let userPrompt = config.userPromptTemplate;
    for (const [key, value] of Object.entries(variables)) {
      userPrompt = userPrompt.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return { system: config.systemPrompt, user: userPrompt };
  }

  list(): PromptConfig[] {
    return Array.from(this.prompts.values());
  }
}

export const promptRegistry = new PromptRegistry();

export function getPrompt(name: string, variables: Record<string, string>) {
  return promptRegistry.render(name, variables);
}
