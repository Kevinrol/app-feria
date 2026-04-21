import React, { useEffect, useState } from 'react';
import { Folder, Search, Save, Info, Check } from 'lucide-react';
import { fetchProjects, fetchJurados } from '../../api/fetch';

interface Proyecto {
  id_proyecto: number;
  titulo: string;
  carrera: { nombre_carrera: string; codigo_carrera: string };
  evaluaciones: { id_jurado: number; jurado: any }[];
}

interface Jurado {
  id_jurado: number;
  nombre: string;
  apellido: string;
  especialidad?: string;
}

export const AdminAsignaciones: React.FC = () => {
  const [projects, setProjects] = useState<Proyecto[]>([]);
  const [jurados, setJurados] = useState<Jurado[]>([]);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchProjects(), fetchJurados()])
      .then(([projs, jurs]) => {
        setProjects(projs);
        setJurados(jurs);
        if (projs.length > 0) setSelectedProject(projs[0].id_proyecto);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const selectedProj = projects.find(p => p.id_proyecto === selectedProject);
  const assignedJuradoIds = selectedProj?.evaluaciones?.map((e: any) => e.id_jurado) || [];

  const getInitials = (nombre: string, apellido: string) =>
    `${nombre?.charAt(0) || ''}${apellido?.charAt(0) || ''}`.toUpperCase();

  const careerColors: Record<string, string> = {};
  const palette = ["bg-emerald-200 text-emerald-800", "bg-yellow-200 text-yellow-800", "bg-blue-200 text-blue-800", "bg-red-200 text-red-800"];
  projects.forEach((p) => {
    const key = p.carrera?.nombre_carrera || '-';
    if (!careerColors[key]) careerColors[key] = palette[Object.keys(careerColors).length % palette.length];
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-2">
        <span className="text-[10px] font-bold text-[#b58e2d] uppercase tracking-widest">ADMINISTRACIÓN DE FERIA 2024</span>
      </div>
      <div className="flex justify-between items-start mb-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold text-[#005c4b] mb-4">Asignación de Jurados</h1>
          <p className="text-gray-600 text-base">Vincule expertos técnicos a los proyectos registrados para el proceso de evaluación anual.</p>
        </div>
        <button className="flex items-center px-6 py-3 bg-[#005c4b] hover:bg-[#004a3c] text-white rounded-lg font-bold transition-colors shadow-sm">
          <Save className="w-5 h-5 mr-3 opacity-90" />
          Guardar asignaciones
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Cargando datos...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Projects */}
          <div className="lg:col-span-5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center text-lg font-bold text-gray-900">
                <Folder className="w-5 h-5 mr-2 text-gray-700" />
                Proyectos Registrados
              </div>
              <span className="bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                {projects.length} Total
              </span>
            </div>

            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {projects.map((project) => {
                const jurorsCount = project.evaluaciones?.length || 0;
                const isSelected = selectedProject === project.id_proyecto;
                const careerKey = project.carrera?.nombre_carrera || '-';
                const isComplete = jurorsCount >= 3;

                return (
                  <div
                    key={project.id_proyecto}
                    onClick={() => setSelectedProject(project.id_proyecto)}
                    className={`bg-white rounded-xl p-5 shadow-sm border cursor-pointer transition-all relative overflow-hidden ${
                      isSelected ? 'border-gray-200 shadow-md scale-[1.01]' : 'border-transparent hover:border-gray-200'
                    }`}
                  >
                    {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#005c4b]"></div>}
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest ${careerColors[careerKey] || 'bg-gray-200 text-gray-700'}`}>
                        {careerKey}
                      </span>
                      <div className="text-right">
                        <span className={`text-2xl font-bold leading-none ${isComplete ? 'text-emerald-500' : 'text-gray-800'}`}>{jurorsCount}</span>
                        <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                          {isComplete ? 'COMPLETADO' : 'JURADOS'}
                        </span>
                      </div>
                    </div>
                    <h3 className="font-bold text-lg leading-tight mb-4 pr-12 text-gray-800">{project.titulo}</h3>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-4">
                      <div className="h-full bg-[#005c4b] rounded-full" style={{ width: `${Math.min((jurorsCount / 3) * 100, 100)}%` }}></div>
                    </div>
                    <div className="flex -space-x-2">
                      {project.evaluaciones?.slice(0, 4).map((ev: any, i: number) => (
                        <div key={i} className="w-7 h-7 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-[#005c4b]">
                          {ev.jurado ? getInitials(ev.jurado.nombre, ev.jurado.apellido) : '?'}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Jurados */}
          <div className="lg:col-span-7 bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-8">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">Jurados<br/>Disponibles</h2>
                <p className="text-sm text-gray-500 mt-2">Seleccione los evaluadores<br/>para el proyecto actual</p>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Buscar jurado..." className="w-full pl-10 pr-4 py-3 bg-white border-transparent rounded-lg focus:ring-2 focus:ring-[#005c4b] shadow-sm text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {jurados.map((jurado) => {
                const isAssigned = assignedJuradoIds.includes(jurado.id_jurado);
                return (
                  <div
                    key={jurado.id_jurado}
                    className={`bg-white rounded-xl p-4 flex items-center border shadow-sm cursor-pointer transition-colors ${
                      isAssigned ? 'border-[#005c4b] shadow-md' : 'border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#005c4b] font-bold flex items-center justify-center text-sm mr-4">
                      {getInitials(jurado.nombre, jurado.apellido)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-[#005c4b] leading-tight mb-1">{jurado.nombre} {jurado.apellido}</h4>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide leading-tight">
                        {jurado.especialidad || 'Sin especialidad'}
                      </p>
                    </div>
                    <div className={`w-5 h-5 rounded flex items-center justify-center border-2 ml-2 flex-shrink-0 transition-colors ${
                      isAssigned ? 'bg-[#005c4b] border-[#005c4b]' : 'border-gray-300'
                    }`}>
                      {isAssigned && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Info Box */}
            <div className="bg-[#e4eceb] rounded-xl p-6 flex items-start text-[#004a3c]">
              <div className="w-8 h-8 bg-[#005c4b] rounded-full flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                <Info className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-[#005c4b] mb-1">Regla de Asignación</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Se requiere un mínimo de 2 jurados y un máximo de 3 por cada proyecto técnico.
                  {selectedProj && (
                    <> Las asignaciones actuales para "{selectedProj.titulo}" tienen {assignedJuradoIds.length} jurado(s) asignado(s).</>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
