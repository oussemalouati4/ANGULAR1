'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { 
  FolderOpen, 
  Upload, 
  HardDrive, 
  TrendingUp,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  Users,
  Clock,
  Download
} from 'lucide-react';
import { mockFiles, dashboardStats } from '@/lib/mock-data';
import { formatFileSize } from '@/lib/file-utils';

export default function Dashboard() {
  const recentFiles = mockFiles.slice(0, 6);
  
  const fileTypeStats = [
    { type: 'Documents', count: 45, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
    { type: 'Images', count: 32, icon: Image, color: 'text-green-500', bg: 'bg-green-50' },
    { type: 'Vidéos', count: 18, icon: Video, color: 'text-purple-500', bg: 'bg-purple-50' },
    { type: 'Audio', count: 12, icon: Music, color: 'text-pink-500', bg: 'bg-pink-50' },
    { type: 'Archives', count: 8, icon: Archive, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="lg:pl-64">
        <Header />
        
        <main className="p-6">
          {/* En-tête du dashboard */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600">
              Vue d'ensemble de votre système de gestion de fichiers
            </p>
          </div>

          {/* Statistiques principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Fichiers</CardTitle>
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.totalFiles}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12%</span> ce mois
                </p>
              </CardContent>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-600"></div>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Espace Utilisé</CardTitle>
                <HardDrive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.totalSize}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-orange-600">65%</span> de 10 GB
                </p>
              </CardContent>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-600"></div>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Uploads Récents</CardTitle>
                <Upload className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.recentUploads}</div>
                <p className="text-xs text-muted-foreground">
                  Dernières 24h
                </p>
              </CardContent>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
            </Card>

            <Card className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Activité</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">248</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+8%</span> vs hier
                </p>
              </CardContent>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-600"></div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Fichiers récents */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Fichiers Récents</span>
                  </CardTitle>
                  <CardDescription>
                    Derniers fichiers ajoutés ou modifiés
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            {file.type === 'folder' ? '📁' : '📄'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {file.type === 'file' ? formatFileSize(file.size) : 'Dossier'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {file.extension && (
                            <Badge variant="outline" className="text-xs">
                              {file.extension.toUpperCase()}
                            </Badge>
                          )}
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Répartition par type */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FolderOpen className="h-5 w-5" />
                    <span>Types de Fichiers</span>
                  </CardTitle>
                  <CardDescription>
                    Répartition par catégorie
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {fileTypeStats.map((stat) => {
                      const Icon = stat.icon;
                      return (
                        <div key={stat.type} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                              <Icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                            <span className="font-medium text-sm">{stat.type}</span>
                          </div>
                          <Badge variant="secondary">{stat.count}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Actions rapides */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Actions Rapides</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button className="w-full justify-start" variant="outline">
                      <Upload className="mr-2 h-4 w-4" />
                      Uploader des fichiers
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <FolderOpen className="mr-2 h-4 w-4" />
                      Créer un dossier
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="mr-2 h-4 w-4" />
                      Partager un fichier
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}