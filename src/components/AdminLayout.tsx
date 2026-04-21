import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FolderOpen, 
  Users, 
  GraduationCap, 
  Gavel, 
  Settings, 
  HelpCircle, 
  LogOut, 
  Plus,
  Search,
  Bell
} from 'lucide-react';
import { Button } from './Button';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getMenuClasses = (path: string) => {
    // If the path exactly matches or if we're in a subpath. We do an exact or startsWith roughly.
    const isActive = location.pathname === path || (path !== '/admin' && location.pathname.startsWith(path));
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
              Panel de Control
            </h2>
            <p className="text-xs text-gray-400 font-medium">FERIA TÉCNICA 2024</p>
          </div>

          <nav className="px-4 space-y-1">
            <Link to="/admin" className={getMenuClasses('/admin') + (location.pathname === '/admin' ? ' hidden' : ' hidden')}>
              {/* Hidden dashboard link in sidebar */}
            </Link>

            <Link to="/admin" className={getMenuClasses('/admin')}>
               <div className="w-5 h-5 mr-3 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
               </div>
               Panel de Control
            </Link>

            <Link to="/admin/proyectos" className={getMenuClasses('/admin/proyectos')}>
              <FolderOpen className="w-5 h-5 mr-3" />
              Proyectos
            </Link>
            
            <Link to="/admin/estudiantes" className={getMenuClasses('/admin/estudiantes')}>
              <Users className="w-5 h-5 mr-3" />
              Estudiantes
            </Link>
            
            <Link to="/admin/docentes" className={getMenuClasses('/admin/docentes')}>
              <GraduationCap className="w-5 h-5 mr-3" />
              Docentes
            </Link>

            <Link to="/admin/jurados" className={getMenuClasses('/admin/jurados')}>
              <Gavel className="w-5 h-5 mr-3" />
              Jurados
            </Link>

            <Link to="/admin/configuracion" className={getMenuClasses('/admin/configuracion')}>
              <div className="w-5 h-5 mr-3 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
              </div>
              Criterios
            </Link>

            <Link to="/admin/asignaciones" className={getMenuClasses('/admin/asignaciones')}>
              <div className="w-5 h-5 mr-3 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
              </div>
              Asignaciones
            </Link>

            <Link to="/admin/resultados" className={getMenuClasses('/admin/resultados')}>
              <div className="w-5 h-5 mr-3 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
              </div>
              Resultados
            </Link>

            <div className="pt-6 mt-6 border-t border-gray-100">
              <Link to="/admin/configuracion" className={getMenuClasses('/admin/configuracion')}>
                <Settings className="w-5 h-5 mr-3" />
                Configuración
              </Link>
            </div>
          </nav>
        </div>

        <div className="p-4 space-y-2">
          <Button 
            variant="primary" 
            className="w-full flex items-center justify-center bg-[#005c4b] hover:bg-[#004a3c] text-white"
            onClick={() => navigate('/admin/proyectos')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Proyecto
          </Button>

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
              INCOS <span className="font-semibold text-gray-700">Admin</span>
            </span>
            
            <div className="ml-10 relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar docentes o CI..." 
                className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-md text-sm w-64 focus:ring-1 focus:ring-[#005c4b] focus:bg-white outline-none"
              />
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button className="text-gray-400 hover:text-gray-600 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            
            <div className="flex items-center pr-2 border-l border-gray-200 pl-6">
              <div className="text-right mr-3 hidden md:block">
                <div className="text-sm font-bold text-gray-800">Admin Principal</div>
                <div className="text-xs text-gray-500 font-medium">GESTIÓN ACADÉMICA</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                {/* Fallback avatar */}
                <Users className="w-5 h-5 text-gray-400" />
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
