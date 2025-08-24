import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Download, 
  RefreshCw, 
  Moon, 
  Sun,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatHeaderProps {
  onToggleTheme: () => void;
  isDarkMode: boolean;
  onNewChat: () => void;
  onExportChat: () => void;
  onSettings: () => void;
}

export function ChatHeader({ 
  onToggleTheme, 
  isDarkMode, 
  onNewChat, 
  onExportChat, 
  onSettings 
}: ChatHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border-b border-border/50 bg-background/80 backdrop-blur-sm px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="relative"
          >
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
              <Zap className="w-4 h-4 text-white" />
            </div>
          </motion.div>
          
          <div>
            <h1 className="text-xl font-bold text-foreground">
              RAG ML Tutor
            </h1>
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className="text-xs bg-primary/10 text-primary border-primary/20"
              >
                RAG Enabled
              </Badge>
              <Badge 
                variant="outline" 
                className="text-xs border-green-500/30 text-green-600"
              >
                • Online
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onNewChat}
            className="hover:bg-muted"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            New Chat
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onExportChat}
            className="hover:bg-muted"
          >
            <Download className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleTheme}
            className="hover:bg-muted"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettings}
            className="hover:bg-muted"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
}