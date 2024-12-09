import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Send } from 'lucide-react'
import { useChatState } from '../hooks/useChatState';
import { Message } from '../types/chat';

const Chat: React.FC = () => {
  const [input, setInput] = useState('');
  const { messages, isLoading, sendMessage } = useChatState();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-[495px] w-full max-w-2xl mx-auto bg-white border rounded-lg overflow-hidden shadow-lg">
      <ScrollArea className="flex-grow p-4">
        {messages.map((message: Message, index: number) => (
          <div key={index} className={`mb-3 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
            {message.reasoningSteps && (
              <Accordion type="single" collapsible className="w-full mt-1">
                <AccordionItem value="reasoning-steps">
                  <AccordionTrigger>View Reasoning Steps</AccordionTrigger>
                  <AccordionContent>
                    <ol className="list-decimal list-inside space-y-1">
                      {message.reasoningSteps.map((step: string, stepIndex: number) => (
                        <li key={stepIndex}>
                          <ReactMarkdown 
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({node, ...props}) => <span {...props} />,
                            }}
                          >
                            {step}
                          </ReactMarkdown>
                        </li>
                      ))}
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
            <div
              className={`inline-block p-2 mt-2 rounded-lg ${
                message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
              }`}
            >
                
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({node, ...props}) => <p className="mb-2" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                  li: ({node, ...props}) => <li className="mb-1" {...props} />,
                  a: ({node, ...props}) => <a className="text-blue-600 hover:underline" {...props} />,
                  code: ({node, ...props}) => 
                    true ? (
                      <code className="bg-gray-100 rounded px-1 " {...props} />
                    ) : (
                      <code className="block bg-gray-100 rounded p-2 my-2" {...props} />
                    ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
            
          </div>
        ))}
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        )}
      </ScrollArea>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow"
          />
          <Button type="submit" disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
