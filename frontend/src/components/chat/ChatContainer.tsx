import { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import { ChatInput } from "./ChatInput";
import { ParticleBackground } from "../effects/ParticleBackground";
import { cn } from "@/lib/utils";
import api from "@/api";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatContainerProps {
  className?: string;
}

export function ChatContainer({ className }: ChatContainerProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your Machine Learning Tutor, your AI assistant with RAG capabilities. I can help you analyze concepets, answer questions based on your uploaded content, and provide intelligent responses. Ask me anything **Related to ML**?",
      role: "assistant",
      timestamp: new Date()
    }
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Fetch RAG response from backend
  const fetchRagResponse = async (message: string) => {
    try {
      const response = await api.post("/query?session_id=123456", { user_query: message })
      console.log(response)
      return response.data.rag_response
    } catch (error) {
      console.error("Error fetching cars:", error);
      return "Sorry, I couldn't fetch a response.";
    }
  }

  const handleSendMessage = async (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setIsTyping(true);

    // Fetch response from backend
    const ragResponse = await fetchRagResponse(content)


    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: ragResponse,
      role: 'assistant',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
};

return (
  <div className={cn("flex flex-col h-full relative", className)}>
    <ParticleBackground />

    {/* Messages Area */}
    <div className="flex-1 relative">
      <ScrollArea ref={scrollAreaRef} className="h-full">
        <div className="flex-1 overflow-y:auto p-6 space-y-4" style={{ maxHeight: "calc(100vh - 200px)" }}>
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground text-lg mb-4">
                Start a conversation with AetherChat
              </div>
              <div className="text-sm text-muted-foreground">
                Upload documents for RAG-powered responses or just ask me anything!
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <ChatMessage
              key={message.id}
              message={message}
              index={index}
            />
          ))}

          <AnimatePresence>
            {isTyping && <TypingIndicator />}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>

    {/* Input Area */}
    <ChatInput
      onSendMessage={handleSendMessage}
      isLoading={isTyping}
    />
  </div>
);
}
