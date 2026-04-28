import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, FolderOpen } from 'lucide-react';
import { fetchProjectById } from '../api/fetch';

export const ProyectoDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [proyecto, setProyecto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      if (!id) return;
      try {
        const data = await fetchProjectById(Number(id));
        setProyecto(data);
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("No se pudo cargar la información del proyecto.");
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pt-20">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005c4b]"></div>
        </div>
      </div>
    );
  }

  if (error || !proyecto) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col pt-20">
        <div className="max-w-3xl mx-auto w-full px-4 py-16 text-center">
          <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Proyecto no encontrado</h2>
          <p className="text-gray-500 mb-8">{error || "El proyecto que buscas no existe o ha sido eliminado."}</p>
          <Link to="/" className="inline-flex items-center text-[#005c4b] font-medium hover:underline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a la página principal
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="bg-gray-50 border-b border-gray-200 pt-24 pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#005c4b] mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a inicio
          </Link>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-[#005c4b] text-white px-3 py-1 text-xs font-bold uppercase rounded shadow-sm tracking-wider">
              {proyecto.carrera?.nombre_carrera || 'General'}
            </span>
            {proyecto.area_tematica && (
              <span className="bg-white border border-gray-200 text-gray-700 px-3 py-1 text-xs font-bold uppercase rounded shadow-sm tracking-wider">
                {proyecto.area_tematica}
              </span>
            )}
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            {proyecto.titulo}
          </h1>
          <div className="flex flex-wrap gap-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-[#005c4b]" />
              <span>{new Date(proyecto.fecha_registro).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2 text-[#005c4b]" />
              <span>Tutor: {proyecto.docente?.nombre} {proyecto.docente?.apellido}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {proyecto.imageSrc && (
              <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                <img src={proyecto.imageSrc} alt={proyecto.titulo} className="w-full h-auto object-cover max-h-[500px]" />
              </div>
            )}
            
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 font-heading border-b border-gray-100 pb-2">Descripción del Proyecto</h2>
              <div className="prose max-w-none text-gray-600 leading-relaxed whitespace-pre-wrap">
                {proyecto.descripcion || 'Este proyecto no cuenta con una descripción detallada en este momento.'}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 font-heading flex items-center">
                <Users className="w-5 h-5 mr-2 text-[#005c4b]" />
                Equipo Emprendedor
              </h3>
              
              {proyecto.estudiantes && proyecto.estudiantes.length > 0 ? (
                <ul className="space-y-4">
                  {proyecto.estudiantes.map((pe: any) => (
                    <li key={pe.estudiante.id_estudiante} className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-white border border-gray-200 text-[#005c4b] flex items-center justify-center font-bold mr-3 shadow-sm">
                        {pe.estudiante.nombre.charAt(0)}{pe.estudiante.apellido.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{pe.estudiante.nombre} {pe.estudiante.apellido}</p>
                        <p className="text-xs text-gray-500">Estudiante</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">No hay estudiantes registrados.</p>
              )}
            </div>
            
            <div className="bg-[#005c4b] rounded-2xl p-6 text-white text-center shadow-lg">
              <h3 className="font-heading font-bold text-lg mb-2">¿Interesado en este proyecto?</h3>
              <p className="text-emerald-100 text-sm mb-4">Contacta con el equipo o la dirección académica para más información comercial o técnica.</p>
              <button className="w-full bg-white text-[#005c4b] py-2 rounded-lg font-bold text-sm hover:bg-emerald-50 transition-colors">
                Contactar INCOS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
