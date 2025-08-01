'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Upload, 
  Settings, 
  Users, 
  BarChart3,
  Archive,
  Trash2 
} from 'lucide-react';

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard
  },
  {
    title: 'Gestionnaire',
    href: '/files',
    icon: FolderOpen
  },
  {
    title: 'Uploads',
    href: '/uploads',
    icon: Upload
  },
  {
    title: 'Archives',
    href: '/archives',
    icon: Archive
  },
  {
    title: 'Corbeille',
    href: '/trash',
    icon: Trash2
  },
  {
    title: 'Analytiques',
    href: '/analytics',
    icon: BarChart3
  },
  {
    title: 'Utilisateurs',
    href: '/users',
    icon: Users
  },
  {
    title: 'Paramètres',
    href: '/settings',
    icon: Settings
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">FileAdmin</h1>
              <p className="text-xs text-gray-500">Gestion de fichiers</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex-grow flex flex-col">
          <nav className="flex-1 px-4 space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon
                    className={cn(
                      'mr-3 h-5 w-5 transition-colors',
                      isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    )}
                  />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="flex-shrink-0 px-4 pb-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white">
            <h3 className="text-sm font-semibold mb-1">Stockage</h3>
            <div className="text-xs opacity-90 mb-2">2.4 GB / 10 GB utilisés</div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-white h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}