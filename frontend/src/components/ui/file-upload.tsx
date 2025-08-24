import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  File, 
  X, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Image as ImageIcon,
  Music,
  Video
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'completed' | 'error';
  progress: number;
}

interface FileUploadProps {
  onFileUpload: (files: File[]) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  className?: string;
}

export function FileUpload({ 
  onFileUpload, 
  acceptedTypes = ['.pdf', '.txt', '.docx', '.md'],
  maxSize = 10,
  className 
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return ImageIcon;
    if (type.includes('video')) return Video;
    if (type.includes('audio')) return Music;
    if (type.includes('text') || type.includes('pdf') || type.includes('document')) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFiles = (files: FileList) => {
    const fileArray = Array.from(files);
    
    // Validate files
    const validFiles = fileArray.filter(file => {
      const sizeValid = file.size <= maxSize * 1024 * 1024;
      const typeValid = acceptedTypes.some(type => 
        file.name.toLowerCase().endsWith(type.toLowerCase())
      );
      return sizeValid && typeValid;
    });

    if (validFiles.length > 0) {
      // Simulate upload process
      const newFiles: UploadedFile[] = validFiles.map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'uploading',
        progress: 0
      }));

      setUploadedFiles(prev => [...prev, ...newFiles]);

      // Simulate upload progress
      newFiles.forEach(file => {
        const interval = setInterval(() => {
          setUploadedFiles(prev => prev.map(f => {
            if (f.id === file.id) {
              const newProgress = Math.min(f.progress + Math.random() * 30, 100);
              return {
                ...f,
                progress: newProgress,
                status: newProgress >= 100 ? 'completed' : 'uploading'
              };
            }
            return f;
          }));
        }, 200);

        setTimeout(() => {
          clearInterval(interval);
          setUploadedFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, progress: 100, status: 'completed' } : f
          ));
        }, 2000);
      });

      onFileUpload(validFiles);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  return (
    <div className={cn("w-full", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors",
          dragActive 
            ? "border-primary bg-primary/10" 
            : "border-border hover:border-primary/50"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleChange}
          accept={acceptedTypes.join(',')}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="text-center">
          <motion.div
            animate={{ 
              scale: dragActive ? 1.1 : 1,
              rotate: dragActive ? 5 : 0 
            }}
            transition={{ type: "spring", stiffness: 300 }}
            className="mx-auto h-12 w-12 text-muted-foreground mb-4"
          >
            <Upload className="h-full w-full" />
          </motion.div>
          
          <h3 className="text-lg font-medium mb-2">
            Drop files here or click to upload
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4">
            Supports: {acceptedTypes.join(', ')} (max {maxSize}MB)
          </p>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
            className="mx-auto"
          >
            Choose Files
          </Button>
        </div>
      </motion.div>

      {/* Uploaded Files List */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2"
          >
            {uploadedFiles.map((file) => {
              const FileIcon = getFileIcon(file.type);
              
              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card className="p-3">
                    <div className="flex items-center gap-3">
                      <FileIcon className="h-8 w-8 text-primary" />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium truncate">
                            {file.name}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(file.id)}
                            className="h-6 w-6 p-0 hover:bg-destructive/20"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                        
                        {file.status === 'uploading' && (
                          <Progress 
                            value={file.progress} 
                            className="h-1 mt-2"
                          />
                        )}
                      </div>
                      
                      <div className="flex items-center">
                        {file.status === 'completed' && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        {file.status === 'error' && (
                          <AlertCircle className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}