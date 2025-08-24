import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/ui/file-upload";
import { 
  Settings, 
  X, 
  Database, 
  Brain, 
  Zap, 
  Shield,
  Download,
  Upload,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [settings, setSettings] = useState({
    model: "gpt-4",
    temperature: 0.7,
    maxTokens: 2048,
    enableRAG: true,
    enableMemory: true,
    autoSave: true,
    vectorDatabase: "pinecone",
    embeddingModel: "text-embedding-ada-002",
    chunkSize: 512,
    chunkOverlap: 50
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleExportSettings = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'aetherchat-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (files: File[]) => {
    console.log('Uploaded documents:', files);
    // Handle document upload for RAG
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed right-0 top-0 h-full w-96 bg-card border-l border-border shadow-elevated z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Settings</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 chat-scroll">
              {/* AI Model Settings */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    <CardTitle className="text-base">AI Model</CardTitle>
                  </div>
                  <CardDescription>
                    Configure the language model behavior
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Model</Label>
                    <Select
                      value={settings.model}
                      onValueChange={(value) => handleSettingChange('model', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="claude-3">Claude 3</SelectItem>
                        <SelectItem value="llama-2">Llama 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Temperature: {settings.temperature}</Label>
                    <Slider
                      value={[settings.temperature]}
                      onValueChange={([value]) => handleSettingChange('temperature', value)}
                      max={2}
                      min={0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Max Tokens: {settings.maxTokens}</Label>
                    <Slider
                      value={[settings.maxTokens]}
                      onValueChange={([value]) => handleSettingChange('maxTokens', value)}
                      max={4096}
                      min={256}
                      step={256}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* RAG Settings */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-primary" />
                    <CardTitle className="text-base">RAG Configuration</CardTitle>
                  </div>
                  <CardDescription>
                    Retrieval-Augmented Generation settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Enable RAG</Label>
                    <Switch
                      checked={settings.enableRAG}
                      onCheckedChange={(checked) => handleSettingChange('enableRAG', checked)}
                    />
                  </div>

                  {settings.enableRAG && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label>Vector Database</Label>
                        <Select
                          value={settings.vectorDatabase}
                          onValueChange={(value) => handleSettingChange('vectorDatabase', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pinecone">Pinecone</SelectItem>
                            <SelectItem value="weaviate">Weaviate</SelectItem>
                            <SelectItem value="chroma">ChromaDB</SelectItem>
                            <SelectItem value="qdrant">Qdrant</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Embedding Model</Label>
                        <Select
                          value={settings.embeddingModel}
                          onValueChange={(value) => handleSettingChange('embeddingModel', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text-embedding-ada-002">OpenAI Ada 002</SelectItem>
                            <SelectItem value="text-embedding-3-small">OpenAI Embedding 3 Small</SelectItem>
                            <SelectItem value="sentence-transformers">Sentence Transformers</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Chunk Size: {settings.chunkSize}</Label>
                        <Slider
                          value={[settings.chunkSize]}
                          onValueChange={([value]) => handleSettingChange('chunkSize', value)}
                          max={2048}
                          min={128}
                          step={128}
                          className="w-full"
                        />
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>

              {/* Document Upload */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Upload className="h-4 w-4 text-primary" />
                    <CardTitle className="text-base">Document Management</CardTitle>
                  </div>
                  <CardDescription>
                    Upload documents for RAG knowledge base
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload
                    onFileUpload={handleFileUpload}
                    acceptedTypes={['.pdf', '.txt', '.docx', '.md', '.json']}
                    maxSize={25}
                  />
                </CardContent>
              </Card>

              {/* System Settings */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    <CardTitle className="text-base">System</CardTitle>
                  </div>
                  <CardDescription>
                    General application settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Enable Memory</Label>
                    <Switch
                      checked={settings.enableMemory}
                      onCheckedChange={(checked) => handleSettingChange('enableMemory', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Auto-save Chats</Label>
                    <Switch
                      checked={settings.autoSave}
                      onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-border">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportSettings}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}