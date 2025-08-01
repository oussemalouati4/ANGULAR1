import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentService } from '../../services/document.service';
import { UploadProgress } from '../../models/document.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  uploadForm!: FormGroup;
  selectedFiles: File[] = [];
  uploadProgress: UploadProgress[] = [];
  isDragOver = false;

  categories = [
    { id: '1', name: 'Rapports', color: '#2196F3' },
    { id: '2', name: 'Présentations', color: '#FF9800' },
    { id: '3', name: 'Documentation', color: '#9C27B0' }
  ];

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.uploadForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      category: ['', Validators.required],
      tags: ['']
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = Array.from(event.dataTransfer?.files || []);
    this.addFiles(files);
  }

  onFileSelected(event: any): void {
    const files = Array.from(event.target.files || []);
    this.addFiles(files);
  }

  addFiles(files: File[]): void {
    this.selectedFiles = [...this.selectedFiles, ...files];
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  onSubmit(): void {
    if (this.uploadForm.valid && this.selectedFiles.length > 0) {
      const formValue = this.uploadForm.value;
      const tags = formValue.tags ? formValue.tags.split(',').map((tag: string) => tag.trim()) : [];
      const category = this.categories.find(cat => cat.id === formValue.category);

      this.selectedFiles.forEach(file => {
        const metadata = {
          title: formValue.title || file.name,
          description: formValue.description,
          category: category,
          tags: tags
        };

        this.documentService.uploadDocument(file, metadata).subscribe(progress => {
          const existingIndex = this.uploadProgress.findIndex(p => p.fileName === progress.fileName);
          if (existingIndex >= 0) {
            this.uploadProgress[existingIndex] = progress;
          } else {
            this.uploadProgress.push(progress);
          }

          if (progress.status === 'completed') {
            setTimeout(() => {
              this.uploadProgress = this.uploadProgress.filter(p => p.fileName !== progress.fileName);
              if (this.uploadProgress.length === 0) {
                this.router.navigate(['/documents']);
              }
            }, 2000);
          }
        });
      });

      this.selectedFiles = [];
      this.uploadForm.reset();
    }
  }

  getFileIcon(file: File): string {
    const type = file.type;
    if (type.includes('pdf')) return 'picture_as_pdf';
    if (type.includes('word')) return 'description';
    if (type.includes('presentation')) return 'slideshow';
    if (type.includes('spreadsheet') || type.includes('excel')) return 'table_chart';
    if (type.includes('image')) return 'image';
    return 'insert_drive_file';
  }
}