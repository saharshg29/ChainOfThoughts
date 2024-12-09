import { ReasoningResult } from '../types/chat';
import { ChainOfThoughtReasoner } from './reasoner';

const reasoner = new ChainOfThoughtReasoner(import.meta.env.VITE_GROQ_API_KEY);

export async function solveQuery(query: string): Promise<ReasoningResult> {
  try {
    const result = await reasoner.solve_query(query);
    return result;
  } catch (error) {
    console.error('Error in solveQuery:', error);
    throw new Error('Failed to process query');
  }
}