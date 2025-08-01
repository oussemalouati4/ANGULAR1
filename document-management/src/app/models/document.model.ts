export interface Document {
  id: string;
  title: string;
  description?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadDate: Date;
  lastModified: Date;
  tags: string[];
  category: DocumentCategory;
  status: DocumentStatus;
  uploadedBy: string;
  version: number;
  filePath: string;
}

export interface DocumentCategory {
  id: string;
  name: string;
  color: string;
}

export interface DocumentStatus {
  id: string;
  name: string;
  color: string;
}

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

export interface DocumentFilter {
  searchTerm?: string;
  category?: string;
  dateFrom?: Date;
  dateTo?: Date;
  tags?: string[];
  fileType?: string;
}

export interface DocumentStats {
  totalDocuments: number;
  totalSize: string;
  recentUploads: number;
  categoriesCount: number;
}