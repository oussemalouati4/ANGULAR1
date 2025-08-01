import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, delay } from 'rxjs';
import { Document, DocumentFilter, DocumentStats, UploadProgress } from '../models/document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documentsSubject = new BehaviorSubject<Document[]>([]);
  public documents$ = this.documentsSubject.asObservable();

  private mockDocuments: Document[] = [
    {
      id: '1',
      title: 'Rapport Annuel 2024',
      description: 'Rapport financier annuel de l\'entreprise',
      fileName: 'rapport-annuel-2024.pdf',
      fileSize: 2453678,
      mimeType: 'application/pdf',
      uploadDate: new Date('2024-01-15'),
      lastModified: new Date('2024-01-20'),
      tags: ['rapport', 'finance', '2024'],
      category: { id: '1', name: 'Rapports', color: '#2196F3' },
      status: { id: '1', name: 'Publié', color: '#4CAF50' },
      uploadedBy: 'Jean Dupont',
      version: 1,
      filePath: '/documents/rapport-annuel-2024.pdf'
    },
    {
      id: '2',
      title: 'Présentation Projet Alpha',
      description: 'Présentation du nouveau projet Alpha',
      fileName: 'presentation-alpha.pptx',
      fileSize: 5678234,
      mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      uploadDate: new Date('2024-01-12'),
      lastModified: new Date('2024-01-22'),
      tags: ['présentation', 'projet', 'alpha'],
      category: { id: '2', name: 'Présentations', color: '#FF9800' },
      status: { id: '2', name: 'En révision', color: '#FFC107' },
      uploadedBy: 'Marie Martin',
      version: 2,
      filePath: '/documents/presentation-alpha.pptx'
    },
    {
      id: '3',
      title: 'Manuel Utilisateur',
      description: 'Guide d\'utilisation de l\'application',
      fileName: 'manuel-utilisateur.docx',
      fileSize: 1234567,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      uploadDate: new Date('2024-01-08'),
      lastModified: new Date('2024-01-08'),
      tags: ['manuel', 'documentation', 'utilisateur'],
      category: { id: '3', name: 'Documentation', color: '#9C27B0' },
      status: { id: '1', name: 'Publié', color: '#4CAF50' },
      uploadedBy: 'Pierre Durand',
      version: 1,
      filePath: '/documents/manuel-utilisateur.docx'
    }
  ];

  constructor() {
    this.documentsSubject.next(this.mockDocuments);
  }

  getDocuments(filter?: DocumentFilter): Observable<Document[]> {
    let filteredDocs = [...this.mockDocuments];

    if (filter) {
      if (filter.searchTerm) {
        const term = filter.searchTerm.toLowerCase();
        filteredDocs = filteredDocs.filter(doc => 
          doc.title.toLowerCase().includes(term) ||
          doc.description?.toLowerCase().includes(term) ||
          doc.tags.some(tag => tag.toLowerCase().includes(term))
        );
      }

      if (filter.category) {
        filteredDocs = filteredDocs.filter(doc => doc.category.id === filter.category);
      }

      if (filter.dateFrom) {
        filteredDocs = filteredDocs.filter(doc => doc.uploadDate >= filter.dateFrom!);
      }

      if (filter.dateTo) {
        filteredDocs = filteredDocs.filter(doc => doc.uploadDate <= filter.dateTo!);
      }

      if (filter.tags && filter.tags.length > 0) {
        filteredDocs = filteredDocs.filter(doc => 
          filter.tags!.some(tag => doc.tags.includes(tag))
        );
      }
    }

    return of(filteredDocs).pipe(delay(300));
  }

  getDocumentById(id: string): Observable<Document | undefined> {
    const document = this.mockDocuments.find(doc => doc.id === id);
    return of(document).pipe(delay(200));
  }

  uploadDocument(file: File, metadata: Partial<Document>): Observable<UploadProgress> {
    return new Observable(observer => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          observer.next({
            fileName: file.name,
            progress: 100,
            status: 'completed'
          });
          observer.complete();
          clearInterval(interval);

          // Ajouter le document à la liste
          const newDoc: Document = {
            id: Date.now().toString(),
            title: metadata.title || file.name,
            description: metadata.description,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
            uploadDate: new Date(),
            lastModified: new Date(),
            tags: metadata.tags || [],
            category: metadata.category || { id: '1', name: 'Général', color: '#757575' },
            status: { id: '2', name: 'En révision', color: '#FFC107' },
            uploadedBy: 'Utilisateur actuel',
            version: 1,
            filePath: `/documents/${file.name}`
          };

          this.mockDocuments.unshift(newDoc);
          this.documentsSubject.next([...this.mockDocuments]);
        } else {
          observer.next({
            fileName: file.name,
            progress: Math.round(progress),
            status: 'uploading'
          });
        }
      }, 200);
    });
  }

  deleteDocument(id: string): Observable<boolean> {
    const index = this.mockDocuments.findIndex(doc => doc.id === id);
    if (index > -1) {
      this.mockDocuments.splice(index, 1);
      this.documentsSubject.next([...this.mockDocuments]);
      return of(true).pipe(delay(300));
    }
    return of(false).pipe(delay(300));
  }

  updateDocument(id: string, updates: Partial<Document>): Observable<Document | null> {
    const index = this.mockDocuments.findIndex(doc => doc.id === id);
    if (index > -1) {
      this.mockDocuments[index] = { ...this.mockDocuments[index], ...updates, lastModified: new Date() };
      this.documentsSubject.next([...this.mockDocuments]);
      return of(this.mockDocuments[index]).pipe(delay(300));
    }
    return of(null).pipe(delay(300));
  }

  getStats(): Observable<DocumentStats> {
    const totalSize = this.mockDocuments.reduce((sum, doc) => sum + doc.fileSize, 0);
    const recentUploads = this.mockDocuments.filter(doc => {
      const daysDiff = (new Date().getTime() - doc.uploadDate.getTime()) / (1000 * 3600 * 24);
      return daysDiff <= 7;
    }).length;

    const categories = new Set(this.mockDocuments.map(doc => doc.category.id));

    return of({
      totalDocuments: this.mockDocuments.length,
      totalSize: this.formatFileSize(totalSize),
      recentUploads,
      categoriesCount: categories.size
    }).pipe(delay(200));
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}