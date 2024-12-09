import { useState } from 'react';
import { Message, ReasoningResult } from '../types/chat';
import { solveQuery } from '../utils/api';

export function useChatState() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: 'user', content }]);

    try {
      const response: ReasoningResult = await solveQuery(content);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.solution,
          reasoningSteps: response.reasoning_steps,
        },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, there was an error processing your request.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, sendMessage };
}

