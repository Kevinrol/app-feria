import React from 'react';
import { Globe, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-8 text-xs text-gray-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h4 className="font-heading font-bold text-[#005c4b] mb-1">INCOS EL ALTO</h4>
            <p className="font-description">© 2024 INSTITUTO TECNICO COMERCIAL INCOS EL ALTO.<br/>
            EXCELENCIA TECNICA PARA EL DESARROLLO NACIONAL.</p>
          </div>
          
          <div className="flex space-x-6 uppercase font-semibold">
            <a href="#" className="hover:text-[#005c4b] transition-colors">Privacidad</a>
            <a href="#" className="hover:text-[#005c4b] transition-colors">Soporte</a>
            <a href="#" className="hover:text-[#005c4b] transition-colors">Contacto</a>
          </div>
          
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-[#005c4b] transition-colors">
              <Globe className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-[#005c4b] transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
