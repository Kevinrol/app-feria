import React from 'react';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, FolderOpen, Settings, LogOut, Plus } from 'lucide-react';

export const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-gray-100">
          <span className="text-xl font-bold text-[#005c4b]">Panel admin</span>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2">
          <Link to="/dashboard" className="flex items-center px-4 py-3 bg-[#e6f2ef] text-[#005c4b] rounded-lg font-medium">
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link to="/dashboard" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
            <FolderOpen className="w-5 h-5 mr-3" />
            Proyectos
          </Link>
          <Link to="/dashboard" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
            <Users className="w-5 h-5 mr-3" />
            Usuarios
          </Link>
          <Link to="/dashboard" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors">
            <Settings className="w-5 h-5 mr-3" />
            Configuración
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-100">
          <Link to="/" className="flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            Cerrar Sesión
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h1 className="text-2xl font-bold text-gray-800">Visión General</h1>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-[#005c4b] rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 flex-1 overflow-y-auto">
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-700">Bienvenido al sistema de administración</h2>
            <Button variant="primary" className="flex items-center" onClick={() => alert('Función de nuevo proyecto en desarrollo')}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Proyecto
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-[#005c4b]">
              <div className="text-sm font-medium text-gray-500 mb-1">Total Proyectos</div>
              <div className="text-3xl font-bold text-gray-900">24</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-blue-500">
              <div className="text-sm font-medium text-gray-500 mb-1">Categorías</div>
              <div className="text-3xl font-bold text-gray-900">8</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm border-l-4 border-l-purple-500">
              <div className="text-sm font-medium text-gray-500 mb-1">Impacto Estimado</div>
              <div className="text-3xl font-bold text-gray-900">+5k</div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Proyectos Recientes</h3>
            <div className="text-center py-12 text-gray-500">
              <FolderOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p>No hay proyectos recientes para mostrar.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
