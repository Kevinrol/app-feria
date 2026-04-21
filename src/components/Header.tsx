import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import incosLogo from '../assets/LOGOINCOS.png';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img src={incosLogo} alt="Logo INCOS" className="h-10 w-auto object-contain" />
              <span className="font-heading text-xl font-bold text-[#005c4b] tracking-tight">
                INCOS El Alto
              </span>
            </Link>
          </div>
          
          <nav className="font-heading hidden md:flex space-x-10">
            <Link to="/" className="text-gray-600 hover:text-[#005c4b] font-medium border-b-2 border-[#005c4b] transition-colors py-2">
              Inicio
            </Link>
            <a href="#proyectos" className="text-gray-500 hover:text-gray-900 font-medium py-2 transition-colors">
              Proyectos
            </a>
            <Link to="/resultados" className="text-gray-500 hover:text-gray-900 font-medium py-2 transition-colors">
              Resultados
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link to="/select-role?action=login">
              <Button variant="primary">Iniciar Sesion</Button>
            </Link>
            <Link to="/select-role?action=register">
              <Button variant="outline">Registrarse</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
