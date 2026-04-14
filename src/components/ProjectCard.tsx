import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  imageSrc: string;
  category: string;
  title: string;
  description: string;
  projectId: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ 
  imageSrc, category, title, description, projectId 
}) => {
  return (
    <div className="flex flex-col sm:flex-row bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-4 gap-6 items-center">
      <div className="w-full sm:w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden hidden sm:block">
        <img src={imageSrc} alt={title} className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-300" />
      </div>
      
      <div className="flex-1 flex flex-col justify-center text-left">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-[#005c4b] bg-[#e6f2ef] px-2 py-1 rounded">CATEGORÍA</span>
          <span className="text-xs text-gray-500 font-medium">{category}</span>
        </div>
        <h3 className="font-heading text-xl font-bold text-[#005c4b] mb-2">{title}</h3>
        <p className="font-description text-sm text-[#374151] line-clamp-2">{description}</p>
      </div>
      
      <div className="flex-shrink-0 flex items-center justify-end sm:justify-center w-full sm:w-auto mt-4 sm:mt-0">
        <Link to={`/proyectos/${projectId}`} className="inline-flex items-center text-sm font-bold text-gray-600 hover:text-[#005c4b] transition-colors group">
          VER DETALLES <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
