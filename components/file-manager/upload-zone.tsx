'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { UploadProgress } from '@/types/file';

interface UploadZoneProps {
  onFilesUpload: (files: File[]) => void;
  className?: string;
}

export function UploadZone({ onFilesUpload, className }: UploadZoneProps) {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesUpload(acceptedFiles);
    
    // Simuler l'upload avec progress
    const newUploads: UploadProgress[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      fileName: file.name,
      progress: 0,
      status: 'uploading'
    }));
    
    setUploadProgress(prev => [...prev, ...newUploads]);
    
    // Simuler le progrès d'upload
    newUploads.forEach(upload => {
      const interval = setInterval(() => {
        setUploadProgress(prev => 
          prev.map(item => {
            if (item.id === upload.id) {
              const newProgress = Math.min(item.progress + Math.random() * 20, 100);
              return {
                ...item,
                progress: newProgress,
                status: newProgress >= 100 ? 'completed' : 'uploading'
              };
            }
            return item;
          })
        );
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        setUploadProgress(prev => 
          prev.map(item => 
            item.id === upload.id 
              ? { ...item, progress: 100, status: 'completed' }
              : item
          )
        );
      }, 3000);
    });
  }, [onFilesUpload]);

  const { getRootProps, getInputProps, isDragActive: dropzoneActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/*': ['.txt', '.csv'],
      'application/zip': ['.zip'],
      'video/*': ['.mp4', '.avi', '.mov'],
      'audio/*': ['.mp3', '.wav']
    }
  });

  const removeUpload = (id: string) => {
    setUploadProgress(prev => prev.filter(item => item.id !== id));
  };

  const clearCompleted = () => {
    setUploadProgress(prev => prev.filter(item => item.status !== 'completed'));
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Zone de drop */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer",
          dropzoneActive || isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        )}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center transition-colors",
            dropzoneActive || isDragActive 
              ? "bg-blue-100 text-blue-600" 
              : "bg-gray-100 text-gray-400"
          )}>
            <Upload className="w-8 h-8" />
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900 mb-1">
              {dropzoneActive ? 'Déposez vos fichiers ici' : 'Glissez-déposez vos fichiers'}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              ou cliquez pour sélectionner des fichiers
            </p>
            <Button variant="outline" size="sm">
              Parcourir les fichiers
            </Button>
          </div>
        </div>
        
        <div className="mt-6 text-xs text-gray-400">
          Supports: Images, PDF, Documents, Archives, Vidéos, Audio (Max 10MB par fichier)
        </div>
      </div>

      {/* Liste des uploads en cours */}
      {uploadProgress.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">
              Uploads en cours ({uploadProgress.length})
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearCompleted}
              className="text-xs"
            >
              Nettoyer
            </Button>
          </div>
          
          <div className="space-y-3">
            {uploadProgress.map(upload => (
              <div key={upload.id} className="flex items-center space-x-3">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {upload.fileName}
                    </span>
                    <div className="flex items-center space-x-2">
                      {upload.status === 'completed' && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      {upload.status === 'error' && (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUpload(upload.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <Progress value={upload.progress} className="h-2" />
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>
                      {upload.status === 'completed' 
                        ? 'Terminé' 
                        : upload.status === 'error'
                        ? 'Erreur'
                        : `${Math.round(upload.progress)}%`
                      }
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}