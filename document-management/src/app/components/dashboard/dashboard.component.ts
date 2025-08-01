import { Component, OnInit } from '@angular/core';
import { DocumentService } from '../../services/document.service';
import { Document, DocumentStats } from '../../models/document.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats$!: Observable<DocumentStats>;
  recentDocuments$!: Observable<Document[]>;

  constructor(private documentService: DocumentService) {}

  ngOnInit(): void {
    this.stats$ = this.documentService.getStats();
    this.recentDocuments$ = this.documentService.getDocuments();
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
}