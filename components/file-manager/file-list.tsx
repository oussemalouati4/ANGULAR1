'use client';

import { useState } from 'react';
import { FileItem } from '@/types/file';
import { formatFileSize, getFileIcon } from '@/lib/file-utils';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
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

interface FileListProps {
  files: FileItem[];
  onFileClick: (file: FileItem) => void;
  onFileAction: (action: string, file: FileItem) => void;
  selectedFiles: string[];
  onFileSelect: (fileId: string, selected: boolean) => void;
}

export function FileList({ 
  files, 
  onFileClick, 
  onFileAction, 
  selectedFiles, 
  onFileSelect 
}: FileListProps) {
  const getIconComponent = (fileName: string, isFolder: boolean) => {
    const iconName = getFileIcon(fileName, isFolder);
    const iconClass = "h-5 w-5";
    
    // Map des icônes avec emojis
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
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* En-tête du tableau */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <div className="grid grid-cols-12 gap-4 items-center text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div className="col-span-1">
            <input
              type="checkbox"
              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              onChange={(e) => {
                files.forEach(file => {
                  onFileSelect(file.id, e.target.checked);
                });
              }}
            />
          </div>
          <div className="col-span-5">Nom</div>
          <div className="col-span-2">Taille</div>
          <div className="col-span-2">Modifié</div>
          <div className="col-span-1">Type</div>
          <div className="col-span-1">Actions</div>
        </div>
      </div>

      {/* Contenu du tableau */}
      <div className="divide-y divide-gray-200">
        {files.map((file) => {
          const isSelected = selectedFiles.includes(file.id);
          
          return (
            <div
              key={file.id}
              className={cn(
                "group px-6 py-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer",
                isSelected && "bg-blue-50"
              )}
              onClick={() => onFileClick(file)}
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Checkbox */}
                <div className="col-span-1">
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

                {/* Nom avec icône */}
                <div className="col-span-5">
                  <div className="flex items-center space-x-3">
                    {getIconComponent(file.name, file.type === 'folder')}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {file.path}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Taille */}
                <div className="col-span-2">
                  <p className="text-sm text-gray-900">
                    {file.type === 'folder' ? '—' : formatFileSize(file.size)}
                  </p>
                </div>

                {/* Date de modification */}
                <div className="col-span-2">
                  <p className="text-sm text-gray-900">
                    {format(file.modifiedAt, 'dd MMM yyyy', { locale: fr })}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(file.modifiedAt, 'HH:mm')}
                  </p>
                </div>

                {/* Type */}
                <div className="col-span-1">
                  {file.extension && (
                    <Badge variant="outline" className="text-xs">
                      {file.extension.toUpperCase()}
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="col-span-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
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
                        Favoris
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}