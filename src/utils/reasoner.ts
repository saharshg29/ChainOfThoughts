import { Groq } from 'groq-sdk';

export class ChainOfThoughtReasoner {
  private client: Groq;
  private model: string;

  constructor(apiKey: string | undefined) {
    if (!apiKey) {
      throw new Error('REACT_APP_GROQ_API_KEY is not set');
    }
    this.client = new Groq({apiKey, dangerouslyAllowBrowser: true});
    this.model = 'llama-3.3-70b-versatile';
  }

  private async _generate_reasoning_steps(query: string): Promise<string[]> {
    const reasoning_prompt = `
      For the following query, break down the problem-solving process into clear, logical steps:

      Query: ${query}

      Provide a detailed step-by-step approach that explains how you would systematically 
      solve or address this query. Focus on:
      1. Understanding the core problem
      2. Breaking down the problem into sub-problems
      3. Identifying required resources or information
      4. Outlining a strategic approach
      5. Potential challenges and how to mitigate them

      Response format: 
      - Numbered list of steps
      - Each step should be a clear, actionable instruction
    `;

    const response = await this.client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert problem solver that breaks down complex queries into systematic steps.',
        },
        {
          role: 'user',
          content: reasoning_prompt,
        },
      ],
      model: this.model,
      temperature: 0.7,
      max_tokens: 500,
    });

    const reasoning_text = response.choices[0].message.content;
    return (reasoning_text ?? '').split('\n').filter((step) => step.trim());
  }

  private async _solve_with_reasoning_steps(query: string, reasoning_steps: string[]): Promise<string> {
    const solution_prompt = `
      Problem: ${query}

      Reasoning Steps Previously Identified:
      ${reasoning_steps.join('\n')}

      Now, systematically solve the problem by carefully following these reasoning steps. 
      Provide a detailed, step-by-step solution that demonstrates how each step 
      contributes to solving the original problem.

      Important: Do not include any internal thinking or meta-commentary in your response. 
      Focus solely on providing the solution based on the reasoning steps.
    `;

    const response = await this.client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert problem solver that meticulously follows reasoning steps. Provide solutions without revealing internal thought processes.',
        },
        {
          role: 'user',
          content: solution_prompt,
        },
      ],
      model: this.model,
      temperature: 0.6,
      max_tokens: 1000,
    });

    return response.choices[0].message.content ?? '';
}

  async solve_query(query: string) {
    const reasoning_steps = await this._generate_reasoning_steps(query);
    let solution = await this._solve_with_reasoning_steps(query, reasoning_steps);

    const response = await this.client.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an excellent LLM given the text from the user, just use the content or the answer and return the user back with only the solution and response to answer thier problem',
          },
          {
            role: 'user',
            content: solution,
          },
        ],
        model: this.model,
        temperature: 0.9,
        max_tokens: 1000,
      });
  
      solution = response.choices[0].message.content ?? '';

    return {
      original_query: query,
      reasoning_steps: reasoning_steps,
      solution: solution,
    };
  }
}

