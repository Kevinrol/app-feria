import React, { useState, useEffect } from 'react';
import { Plus, Search, FolderOpen, Calendar, Users, GraduationCap } from 'lucide-react';
import { Button } from '../../components/Button';
import { ProyectoModalDocente } from './ProyectoModalDocente';
import { ProyectoDetalleModal } from './ProyectoDetalleModal';
import { fetchDocenteProyectos } from '../../api/fetch';

export const DocenteProyectos: React.FC = () => {
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadProyectos = async () => {
    setLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const idDocente = user?.id_docente || 1; 

      const data = await fetchDocenteProyectos(idDocente);
      setProyectos(data);
    } catch (error) {
      console.error('Error fetching proyectos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProyectos();
  }, []);

  const filteredProyectos = proyectos.filter(p => 
    p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.carrera?.nombre_carrera || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mis Proyectos</h1>
          <p className="text-gray-500 mt-1">Gestiona los proyectos que estás tutorizando.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar proyecto..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#005c4b]/20 focus:border-[#005c4b] outline-none transition-all"
            />
          </div>
          <Button variant="primary" className="flex items-center whitespace-nowrap" onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Proyecto
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005c4b]"></div>
        </div>
      ) : filteredProyectos.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No hay proyectos</h3>
          <p className="text-gray-500 mb-6">Aún no tienes proyectos asignados o no coinciden con tu búsqueda.</p>
          <Button variant="outline" onClick={() => setShowModal(true)}>
            Crear mi primer proyecto
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProyectos.map((proyecto) => (
            <div 
              key={proyecto.id_proyecto} 
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#005c4b]/30 transition-all cursor-pointer group"
              onClick={() => setSelectedProjectId(proyecto.id_proyecto)}
            >
              <div className="h-32 bg-gray-100 relative">
                {proyecto.imageSrc ? (
                  <img src={proyecto.imageSrc} alt={proyecto.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-emerald-50">
                    <FolderOpen className="w-10 h-10 text-[#005c4b]/30" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-medium text-gray-700 rounded-full shadow-sm">
                    {proyecto.carrera?.nombre_carrera || 'General'}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-[#005c4b] transition-colors">
                  {proyecto.titulo}
                </h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[40px]">
                  {proyecto.descripcion || 'Sin descripción'}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                    {new Date(proyecto.fecha_registro).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1 text-gray-400" />
                    {proyecto.estudiantes?.length || 0} Est.
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <ProyectoModalDocente 
          onClose={() => setShowModal(false)} 
          onSuccess={loadProyectos} 
        />
      )}

      {selectedProjectId && (
        <ProyectoDetalleModal
          projectId={selectedProjectId}
          onClose={() => setSelectedProjectId(null)}
        />
      )}
    </div>
  );
};
