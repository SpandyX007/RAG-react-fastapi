import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChatHeader } from "@/components/layout/ChatHeader";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { SettingsPanel } from "@/components/chat/SettingsPanel";

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState("1");

  // Set dark mode by default
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleNewChat = () => {
    const newSessionId = Date.now().toString();
    setCurrentSessionId(newSessionId);
    console.log("Starting new chat session:", newSessionId);
  };

  const handleExportChat = () => {
    console.log("Exporting chat...");
    // Implementation would download chat history
  };

  const handleSessionSelect = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    console.log("Selected session:", sessionId);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-background">
      {/* Header */}
      <ChatHeader
        onToggleTheme={handleToggleTheme}
        isDarkMode={isDarkMode}
        onNewChat={handleNewChat}
        onExportChat={handleExportChat}
        onSettings={() => setSettingsOpen(true)}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {/* <ChatSidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          currentSessionId={currentSessionId}
          onSessionSelect={handleSessionSelect}
          onNewChat={handleNewChat}
        /> */}

        {/* Chat Area */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col overflow-hidden relative"
        >
          <ChatContainer />
        </motion.main>
      </div>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
};

export default Index;
