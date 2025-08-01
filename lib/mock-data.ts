import { FileItem } from '@/types/file';

export const mockFiles: FileItem[] = [
  {
    id: '1',
    name: 'Documents',
    type: 'folder',
    size: 0,
    createdAt: new Date('2024-01-15'),
    modifiedAt: new Date('2024-01-20'),
    path: '/Documents'
  },
  {
    id: '2',
    name: 'Images',
    type: 'folder',
    size: 0,
    createdAt: new Date('2024-01-10'),
    modifiedAt: new Date('2024-01-25'),
    path: '/Images'
  },
  {
    id: '3',
    name: 'rapport-2024.pdf',
    type: 'file',
    size: 2453678,
    mimeType: 'application/pdf',
    extension: 'pdf',
    createdAt: new Date('2024-01-18'),
    modifiedAt: new Date('2024-01-18'),
    path: '/rapport-2024.pdf'
  },
  {
    id: '4',
    name: 'presentation.pptx',
    type: 'file',
    size: 5678234,
    mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    extension: 'pptx',
    createdAt: new Date('2024-01-12'),
    modifiedAt: new Date('2024-01-22'),
    path: '/presentation.pptx'
  },
  {
    id: '5',
    name: 'photo-profile.jpg',
    type: 'file',
    size: 1234567,
    mimeType: 'image/jpeg',
    extension: 'jpg',
    createdAt: new Date('2024-01-08'),
    modifiedAt: new Date('2024-01-08'),
    path: '/photo-profile.jpg'
  },
  {
    id: '6',
    name: 'config.json',
    type: 'file',
    size: 2048,
    mimeType: 'application/json',
    extension: 'json',
    createdAt: new Date('2024-01-05'),
    modifiedAt: new Date('2024-01-24'),
    path: '/config.json'
  },
  {
    id: '7',
    name: 'video-demo.mp4',
    type: 'file',
    size: 15678234,
    mimeType: 'video/mp4',
    extension: 'mp4',
    createdAt: new Date('2024-01-14'),
    modifiedAt: new Date('2024-01-14'),
    path: '/video-demo.mp4'
  },
  {
    id: '8',
    name: 'Projets',
    type: 'folder',
    size: 0,
    createdAt: new Date('2024-01-01'),
    modifiedAt: new Date('2024-01-26'),
    path: '/Projets'
  }
];

export const dashboardStats = {
  totalFiles: 156,
  totalSize: '2.4 GB',
  recentUploads: 12,
  storageUsed: 65
};