import React, { useState, useEffect } from 'react';
import { X, Calendar, Users, FolderOpen } from 'lucide-react';
import { fetchProjectById } from '../../api/fetch';

interface ProyectoDetalleModalProps {
  projectId: number;
  onClose: () => void;
}

export const ProyectoDetalleModal: React.FC<ProyectoDetalleModalProps> = ({ projectId, onClose }) => {
  const [proyecto, setProyecto] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const data = await fetchProjectById(projectId);
        setProyecto(data);
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [projectId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-xl p-10 flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#005c4b] mb-4"></div>
          <p className="text-gray-500 font-medium">Cargando detalles...</p>
        </div>
      </div>
    );
  }

  if (!proyecto) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-xl p-10 text-center">
          <p className="text-red-500 font-medium mb-4">No se pudo cargar el proyecto.</p>
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">Cerrar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Detalles del Proyecto</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1">
          <div className="w-full h-64 bg-gray-100 relative">
            {proyecto.imageSrc ? (
              <img src={proyecto.imageSrc} alt={proyecto.titulo} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <FolderOpen className="w-16 h-16 mb-2 opacity-50" />
                <span>Sin fotografía</span>
              </div>
            )}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-[#005c4b] text-white px-3 py-1 text-xs font-bold uppercase rounded shadow-sm">
                {proyecto.carrera?.nombre_carrera || 'General'}
              </span>
              {proyecto.area_tematica && (
                <span className="bg-white text-gray-700 px-3 py-1 text-xs font-bold uppercase rounded shadow-sm">
                  {proyecto.area_tematica}
                </span>
              )}
            </div>
          </div>

          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 font-heading">{proyecto.titulo}</h1>
            
            <div className="flex flex-wrap gap-6 mb-8 border-b border-gray-100 pb-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-[#005c4b]" />
                <span>Registrado: <span className="font-medium text-gray-900">{new Date(proyecto.fecha_registro).toLocaleDateString()}</span></span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-[#005c4b]" />
                <span>Docente: <span className="font-medium text-gray-900">{proyecto.docente?.nombre} {proyecto.docente?.apellido}</span></span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Descripción</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {proyecto.descripcion || 'Este proyecto no cuenta con una descripción detallada.'}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Estudiantes Participantes ({proyecto.estudiantes?.length || 0})</h3>
              {proyecto.estudiantes && proyecto.estudiantes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {proyecto.estudiantes.map((pe: any) => (
                    <div key={pe.estudiante.id_estudiante} className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#005c4b] flex items-center justify-center font-bold mr-4">
                        {pe.estudiante.nombre.charAt(0)}{pe.estudiante.apellido.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{pe.estudiante.nombre} {pe.estudiante.apellido}</p>
                        <p className="text-xs text-gray-500">CI: {pe.estudiante.ci}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No hay estudiantes asignados.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
