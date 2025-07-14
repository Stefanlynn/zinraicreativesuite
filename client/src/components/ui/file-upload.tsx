import { useState, useRef } from "react";
import { Upload, X, File } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeInMB?: number;
  acceptedTypes?: string[];
}

export default function FileUpload({ 
  onFilesChange, 
  maxFiles = 5, 
  maxSizeInMB = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFiles: FileList) => {
    const validFiles: File[] = [];
    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

    Array.from(selectedFiles).forEach((file) => {
      if (validFiles.length >= maxFiles) return;
      
      if (file.size > maxSizeInBytes) {
        alert(`File "${file.name}" is too large. Maximum size is ${maxSizeInMB}MB.`);
        return;
      }
      
      if (!acceptedTypes.includes(file.type)) {
        alert(`File "${file.name}" is not a supported format.`);
        return;
      }
      
      validFiles.push(file);
    });

    const newFiles = [...files, ...validFiles].slice(0, maxFiles);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
          isDragging ? 'border-zinrai-accent bg-zinc-800' : 'border-zinrai-border hover:border-zinrai-accent'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          className="hidden"
        />
        
        <Upload className="h-12 w-12 text-zinrai-muted mx-auto mb-4" />
        <p className="text-zinrai-muted mb-2">
          Drop files here or click to browse
        </p>
        <p className="text-xs text-gray-500">
          Support: JPG, PNG, PDF, DOC (Max {maxSizeInMB}MB, {maxFiles} files)
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-white">Selected Files:</h4>
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-zinrai-secondary rounded-lg">
              <div className="flex items-center space-x-2">
                <File className="h-4 w-4 text-zinrai-muted" />
                <span className="text-sm text-white">{file.name}</span>
                <span className="text-xs text-zinrai-muted">
                  ({(file.size / 1024 / 1024).toFixed(1)}MB)
                </span>
              </div>
              <Button
                onClick={() => removeFile(index)}
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
