'use client';

import { useState } from 'react';
import { FileItem, ViewMode, SortBy, SortOrder } from '@/types/file';
import { mockFiles } from '@/lib/mock-data';
import { generateBreadcrumbs } from '@/lib/file-utils';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { FileGrid } from '@/components/file-manager/file-grid';
import { FileList } from '@/components/file-manager/file-list';
import { UploadZone } from '@/components/file-manager/upload-zone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Grid3X3, 
  List, 
  Upload, 
  Search, 
  Filter,
  ChevronRight,
  FolderPlus,
  ArrowUpDown,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPath, setCurrentPath] = useState('/');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const breadcrumbs = generateBreadcrumbs(currentPath);

  const filteredAndSortedFiles = files
    .filter(file => 
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      file.path.startsWith(currentPath)
    )
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'size':
          comparison = a.size - b.size;
          break;
        case 'modified':
          comparison = a.modifiedAt.getTime() - b.modifiedAt.getTime();
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleFileClick = (file: FileItem) => {
    if (file.type === 'folder') {
      setCurrentPath(file.path);
    } else {
      // Ouvrir le fichier ou afficher un aperçu
      console.log('Opening file:', file.name);
    }
  };

  const handleFileAction = (action: string, file: FileItem) => {
    switch (action) {
      case 'download':
        console.log('Downloading:', file.name);
        break;
      case 'delete':
        setFiles(prev => prev.filter(f => f.id !== file.id));
        break;
      case 'rename':
        console.log('Renaming:', file.name);
        break;
      case 'share':
        console.log('Sharing:', file.name);
        break;
      case 'copy':
        console.log('Copying:', file.name);
        break;
      case 'favorite':
        console.log('Adding to favorites:', file.name);
        break;
      case 'preview':
        console.log('Previewing:', file.name);
        break;
      default:
        console.log('Unknown action:', action);
    }
  };

  const handleFileSelect = (fileId: string, selected: boolean) => {
    setSelectedFiles(prev => 
      selected 
        ? [...prev, fileId]
        : prev.filter(id => id !== fileId)
    );
  };

  const handleFilesUpload = (uploadedFiles: File[]) => {
    const newFiles: FileItem[] = uploadedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: 'file',
      size: file.size,
      mimeType: file.type,
      extension: file.name.split('.').pop()?.toLowerCase(),
      createdAt: new Date(),
      modifiedAt: new Date(),
      path: currentPath === '/' ? `/${file.name}` : `${currentPath}/${file.name}`
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    setShowUploadModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="lg:pl-64">
        <Header />
        
        <main className="p-6">
          {/* En-tête */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Gestionnaire de Fichiers
              </h1>
              
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.path} className="flex items-center">
                    <button
                      onClick={() => setCurrentPath(crumb.path)}
                      className={cn(
                        "hover:text-blue-600 transition-colors",
                        index === breadcrumbs.length - 1 
                          ? "text-gray-900 font-medium" 
                          : "text-gray-500"
                      )}
                    >
                      {crumb.name}
                    </button>
                    {index < breadcrumbs.length - 1 && (
                      <ChevronRight className="h-4 w-4 text-gray-400 mx-2" />
                    )}
                  </div>
                ))}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Uploader des Fichiers</DialogTitle>
                    <DialogDescription>
                      Glissez-déposez vos fichiers ou cliquez pour les sélectionner
                    </DialogDescription>
                  </DialogHeader>
                  <UploadZone onFilesUpload={handleFilesUpload} />
                </DialogContent>
              </Dialog>

              <Button variant="outline">
                <FolderPlus className="h-4 w-4 mr-2" />
                Nouveau Dossier
              </Button>
            </div>
          </div>

          {/* Barre d'outils */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Recherche */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Rechercher des fichiers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>

                {/* Filtres */}
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres
                </Button>

                {/* Tri */}
                <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
                  const [newSortBy, newSortOrder] = value.split('-') as [SortBy, SortOrder];
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                }}>
                  <SelectTrigger className="w-48">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-asc">Nom (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Nom (Z-A)</SelectItem>
                    <SelectItem value="size-asc">Taille (Croissant)</SelectItem>
                    <SelectItem value="size-desc">Taille (Décroissant)</SelectItem>
                    <SelectItem value="modified-desc">Plus récent</SelectItem>
                    <SelectItem value="modified-asc">Plus ancien</SelectItem>
                    <SelectItem value="type-asc">Type (A-Z)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                {/* Actions sur la sélection */}
                {selectedFiles.length > 0 && (
                  <div className="flex items-center space-x-2 mr-4">
                    <span className="text-sm text-gray-600">
                      {selectedFiles.length} sélectionné(s)
                    </span>
                    <Button variant="outline" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Mode d'affichage */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-8 w-8 p-0"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Contenu des fichiers */}
          {filteredAndSortedFiles.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun fichier trouvé
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery 
                  ? `Aucun résultat pour "${searchQuery}"`
                  : "Ce dossier est vide"
                }
              </p>
              {!searchQuery && (
                <Button onClick={() => setShowUploadModal(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Uploader des fichiers
                </Button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <FileGrid
              files={filteredAndSortedFiles}
              onFileClick={handleFileClick}
              onFileAction={handleFileAction}
              selectedFiles={selectedFiles}
              onFileSelect={handleFileSelect}
            />
          ) : (
            <FileList
              files={filteredAndSortedFiles}
              onFileClick={handleFileClick}
              onFileAction={handleFileAction}
              selectedFiles={selectedFiles}
              onFileSelect={handleFileSelect}
            />
          )}
        </main>
      </div>
    </div>
  );
}