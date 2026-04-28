import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FolderOpen, 
  HelpCircle, 
  LogOut, 
  Plus,
  Bell
} from 'lucide-react';
import { Button } from './Button';

export const DocenteLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getMenuClasses = (path: string) => {
    const isActive = location.pathname === path || location.pathname.startsWith(path);
    return `flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
      isActive
        ? 'bg-emerald-50 text-[#005c4b] shadow-sm'
        : 'text-gray-500 hover:bg-gray-50'
    }`;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="p-6">
            <h2 className="text-sm font-semibold text-gray-500 mb-1 uppercase tracking-wider">
              Panel Docente
            </h2>
            <p className="text-xs text-gray-400 font-medium">FERIA TÉCNICA 2024</p>
          </div>

          <nav className="px-4 space-y-1">
            <Link to="/docente/proyectos" className={getMenuClasses('/docente/proyectos')}>
              <FolderOpen className="w-5 h-5 mr-3" />
              Mis Proyectos
            </Link>
          </nav>
        </div>

        <div className="p-4 space-y-2">
          <a href="mailto:soporte@incos.edu.bo" className="flex items-center px-4 py-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors">
            <HelpCircle className="w-4 h-4 mr-3" />
            Soporte
          </a>
          <Link to="/" className="flex items-center px-4 py-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors">
            <LogOut className="w-4 h-4 mr-3" />
            Cerrar Sesión
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-[72px] bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="flex items-center">
            <span className="text-xl font-bold tracking-tight text-[#005c4b]">
              INCOS <span className="font-semibold text-gray-700">Docente</span>
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <button className="text-gray-400 hover:text-gray-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            
            <div className="flex items-center pr-2 border-l border-gray-200 pl-6">
              <div className="text-right mr-3 hidden md:block">
                <div className="text-sm font-bold text-gray-800">Docente Tutor</div>
                <div className="text-xs text-gray-500 font-medium">PROYECTOS</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#005c4b] text-white flex items-center justify-center font-bold border-2 border-white shadow-sm overflow-hidden">
                D
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
