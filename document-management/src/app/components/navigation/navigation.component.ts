import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  menuItems = [
    { icon: 'dashboard', label: 'Tableau de bord', route: '/dashboard' },
    { icon: 'folder', label: 'Documents', route: '/documents' },
    { icon: 'cloud_upload', label: 'Upload', route: '/upload' },
    { icon: 'category', label: 'Catégories', route: '/categories' },
    { icon: 'assessment', label: 'Rapports', route: '/reports' },
    { icon: 'settings', label: 'Paramètres', route: '/settings' }
  ];
}