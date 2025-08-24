import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInput({ onSendMessage, isLoading = false }: ChatInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-t border-border/50 bg-background/80 backdrop-blur-sm p-4"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className={cn(
                "min-h-[52px] max-h-32 resize-none pr-12 pl-4 py-3",
                "bg-card border-border focus:ring-2 focus:ring-primary/20",
                "rounded-2xl shadow-chat"
              )}
              disabled={isLoading}
            />
            
            {/* File upload button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 bottom-2 h-8 w-8 p-0 hover:bg-muted"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
          </div>

          {/* Voice input button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-[52px] w-12 p-0 border-border hover:bg-muted"
          >
            <Mic className="h-4 w-4" />
          </Button>

          {/* Send button */}
          <Button
            type="submit"
            disabled={!message.trim() || isLoading}
            className={cn(
              "h-[52px] w-12 p-0 bg-primary hover:bg-primary/90",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "shadow-glow"
            )}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </motion.div>
  );
}