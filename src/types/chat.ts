export interface Message {
    role: 'user' | 'assistant';
    content: string;
    reasoningSteps?: string[];
  }
  
  export interface ReasoningResult {
    original_query: string;
    reasoning_steps: string[];
    solution: string;
  }
  
  