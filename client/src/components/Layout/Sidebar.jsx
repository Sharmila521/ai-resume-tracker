import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Upload, BarChart3, FileText, 
  Briefcase, Clock, Settings, Menu, X 
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Upload Resume', icon: Upload, path: '/upload' },
  { name: 'Resume Analysis', icon: BarChart3, path: '/analysis' },
  { name: 'Resume Versions', icon: FileText, path: '/versions' },
  { name: 'Job Applications', icon: Briefcase, path: '/jobs' },
  { name: 'Activity History', icon: Clock, path: '/history' },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded-lg"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className={`
        fixed md:static
        top-0 left-0
        w-64 h-screen
        bg-white dark:bg-slate-800
        border-r border-slate-200 dark:border-slate-700
        p-6
        overflow-y-auto
        transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        z-40
      `}>
        <div className="mb-8 flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">AI</span>
          </div>
          <div>
            <h1 className="font-bold text-slate-900 dark:text-white">Resume Tracker</h1>
            <p className="text-xs text-slate-500">SaaS</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}