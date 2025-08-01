import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../services/document.service';
import { Document, DocumentFilter } from '../../models/document.model';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent implements OnInit {
  documents$!: Observable<Document[]>;
  searchControl = new FormControl('');
  filterSubject = new BehaviorSubject<DocumentFilter>({});
  
  viewMode: 'grid' | 'list' = 'grid';
  sortBy: 'title' | 'date' | 'size' = 'date';
  sortOrder: 'asc' | 'desc' = 'desc';

  categories = [
    { id: '1', name: 'Rapports', color: '#2196F3' },
    { id: '2', name: 'Présentations', color: '#FF9800' },
    { id: '3', name: 'Documentation', color: '#9C27B0' }
  ];

  constructor(
    private documentService: DocumentService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.documents$ = combineLatest([
      this.searchControl.valueChanges.pipe(startWith('')),
      this.filterSubject.asObservable()
    ]).pipe(
      switchMap(([searchTerm, filter]) => {
        const combinedFilter: DocumentFilter = {
          ...filter,
          searchTerm: searchTerm || undefined
        };
        return this.documentService.getDocuments(combinedFilter);
      })
    );
  }

  onFilterChange(filter: Partial<DocumentFilter>): void {
    const currentFilter = this.filterSubject.value;
    this.filterSubject.next({ ...currentFilter, ...filter });
  }

  onSortChange(): void {
    // Implémentation du tri
    console.log('Sort changed:', this.sortBy, this.sortOrder);
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  getFileIcon(mimeType: string): string {
    if (mimeType.includes('pdf')) return 'picture_as_pdf';
    if (mimeType.includes('word')) return 'description';
    if (mimeType.includes('presentation')) return 'slideshow';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'table_chart';
    if (mimeType.includes('image')) return 'image';
    return 'insert_drive_file';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  downloadDocument(doc: Document): void {
    console.log('Downloading:', doc.title);
    // Implémentation du téléchargement
  }

  deleteDocument(doc: Document): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${doc.title}" ?`)) {
      this.documentService.deleteDocument(doc.id).subscribe(success => {
        if (success) {
          console.log('Document supprimé avec succès');
        }
      });
    }
  }

  previewDocument(doc: Document): void {
    console.log('Previewing:', doc.title);
    // Implémentation de la prévisualisation
  }
}