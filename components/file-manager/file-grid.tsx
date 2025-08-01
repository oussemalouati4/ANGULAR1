'use client';

import { useState } from 'react';
import { FileItem } from '@/types/file';
import { formatFileSize, getFileIcon, isImageFile } from '@/lib/file-utils';
import { cn } from '@/lib/utils';
import { 
  MoreVertical, 
  Download, 
  Trash2, 
  Edit3, 
  Eye,
  Share2,
  Star,
  Copy
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FileGridProps {
  files: FileItem[];
  onFileClick: (file: FileItem) => void;
  onFileAction: (action: string, file: FileItem) => void;
  selectedFiles: string[];
  onFileSelect: (fileId: string, selected: boolean) => void;
}

export function FileGrid({ 
  files, 
  onFileClick, 
  onFileAction, 
  selectedFiles, 
  onFileSelect 
}: FileGridProps) {
  const [hoveredFile, setHoveredFile] = useState<string | null>(null);

  const getIconComponent = (fileName: string, isFolder: boolean) => {
    const iconName = getFileIcon(fileName, isFolder);
    const iconClass = "h-8 w-8";
    
    // Map des icônes Lucide
    const iconMap: Record<string, any> = {
      folder: () => <div className={cn(iconClass, "text-blue-500")}>📁</div>,
      image: () => <div className={cn(iconClass, "text-green-500")}>🖼️</div>,
      'file-text': () => <div className={cn(iconClass, "text-red-500")}>📄</div>,
      sheet: () => <div className={cn(iconClass, "text-green-600")}>📊</div>,
      presentation: () => <div className={cn(iconClass, "text-orange-500")}>📋</div>,
      code: () => <div className={cn(iconClass, "text-purple-500")}>💻</div>,
      archive: () => <div className={cn(iconClass, "text-yellow-600")}>📦</div>,
      video: () => <div className={cn(iconClass, "text-pink-500")}>🎥</div>,
      music: () => <div className={cn(iconClass, "text-indigo-500")}>🎵</div>,
      file: () => <div className={cn(iconClass, "text-gray-500")}>📎</div>,
    };
    
    const IconComponent = iconMap[iconName] || iconMap.file;
    return <IconComponent />;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-4">
      {files.map((file) => {
        const isSelected = selectedFiles.includes(file.id);
        const isHovered = hoveredFile === file.id;
        
        return (
          <div
            key={file.id}
            className={cn(
              "group relative bg-white rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-lg",
              isSelected 
                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200" 
                : "border-gray-200 hover:border-gray-300"
            )}
            onMouseEnter={() => setHoveredFile(file.id)}
            onMouseLeave={() => setHoveredFile(null)}
            onClick={() => onFileClick(file)}
          >
            {/* Checkbox de sélection */}
            <div className={cn(
              "absolute top-2 left-2 z-10 transition-opacity duration-200",
              isSelected || isHovered ? "opacity-100" : "opacity-0"
            )}>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => {
                  e.stopPropagation();
                  onFileSelect(file.id, e.target.checked);
                }}
                className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
            </div>

            {/* Menu d'actions */}
            <div className={cn(
              "absolute top-2 right-2 z-10 transition-opacity duration-200",
              isSelected || isHovered ? "opacity-100" : "opacity-0"
            )}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 bg-white/80 backdrop-blur-sm hover:bg-white"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => onFileAction('preview', file)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Aperçu
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onFileAction('download', file)}>
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onFileAction('share', file)}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Partager
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onFileAction('copy', file)}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copier
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onFileAction('rename', file)}>
                    <Edit3 className="mr-2 h-4 w-4" />
                    Renommer
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onFileAction('favorite', file)}>
                    <Star className="mr-2 h-4 w-4" />
                    Ajouter aux favoris
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onFileAction('delete', file)}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Contenu du fichier */}
            <div className="p-4 text-center">
              {/* Icône ou preview */}
              <div className="mb-3 flex justify-center">
                {isImageFile(file.name) ? (
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src={`https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=64&h=64`}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center">
                    {getIconComponent(file.name, file.type === 'folder')}
                  </div>
                )}
              </div>

              {/* Nom du fichier */}
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                  {file.name}
                </p>
                {file.type === 'file' && (
                  <p className="text-xs text-gray-500 mt-1">
                    {formatFileSize(file.size)}
                  </p>
                )}
              </div>

              {/* Badge pour le type */}
              {file.extension && (
                <Badge variant="secondary" className="text-xs">
                  {file.extension.toUpperCase()}
                </Badge>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}