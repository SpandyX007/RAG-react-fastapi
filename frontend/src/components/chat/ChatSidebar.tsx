import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  MessageSquare, 
  Plus, 
  Settings, 
  Trash2, 
  ChevronLeft,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

interface ChatSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  currentSessionId?: string;
  onSessionSelect: (sessionId: string) => void;
  onNewChat: () => void;
}

export function ChatSidebar({ 
  isCollapsed, 
  onToggle, 
  currentSessionId, 
  onSessionSelect, 
  onNewChat 
}: ChatSidebarProps) {
  const [sessions] = useState<ChatSession[]>([
    {
      id: "1",
      title: "Machine Learning Concepts",
      lastMessage: "How can I fine tune LinearRegression model?",
      timestamp: new Date(),
      messageCount: 1
    },
    // {
    //   id: "2", 
    //   title: "Vector Database Setup",
    //   lastMessage: "What's the best embedding model?",
    //   timestamp: new Date(Date.now() - 3600000),
    //   messageCount: 8
    // },
    // {
    //   id: "3",
    //   title: "Semantic Search Optimization",
    //   lastMessage: "Can you help optimize my search results?",
    //   timestamp: new Date(Date.now() - 86400000),
    //   messageCount: 15
    // }
  ]);

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? 60 : 320 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-full bg-card border-r border-border/50 flex flex-col glass"
    >
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="text-lg font-semibold text-foreground"
              >
                Chat History
              </motion.h2>
            )}
          </AnimatePresence>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0 hover:bg-muted"
          >
            <ChevronLeft 
              className={cn(
                "h-4 w-4 transition-transform duration-300",
                isCollapsed && "rotate-180"
              )} 
            />
          </Button>
        </div>

        {/* New Chat Button */}
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="mt-3"
            >
              <Button
                onClick={onNewChat}
                className="w-full bg-primary hover:bg-primary/90 shadow-glow"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Chat
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {isCollapsed && (
          <Button
            onClick={onNewChat}
            variant="ghost"
            size="sm"
            className="w-full mt-3 h-8 p-0 hover:bg-muted"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Chat Sessions */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-2 py-2">
          {sessions.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Button
                variant="ghost"
                onClick={() => onSessionSelect(session.id)}
                className={cn(
                  "w-full p-3 h-auto justify-start text-left hover:bg-muted/50",
                  currentSessionId === session.id && "bg-muted text-primary",
                  isCollapsed && "px-2"
                )}
              >
                <MessageSquare className={cn(
                  "h-4 w-4 shrink-0",
                  !isCollapsed && "mr-3"
                )} />
                
                <AnimatePresence mode="wait">
                  {!isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 min-w-0"
                    >
                      <div className="font-medium text-sm truncate">
                        {session.title}
                      </div>
                      <div className="text-xs text-muted-foreground truncate mt-1">
                        {session.lastMessage}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {session.messageCount} messages
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <AnimatePresence mode="wait">
          {!isCollapsed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-muted/50"
              >
                <Search className="h-4 w-4 mr-3" />
                Search Chats
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-muted/50"
              >
                <Settings className="h-4 w-4 mr-3" />
                Settings
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-8 p-0 hover:bg-muted"
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-8 p-0 hover:bg-muted"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}