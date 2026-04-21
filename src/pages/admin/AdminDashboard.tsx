import React, { useEffect, useState } from 'react';
import { Filter, Download, MoreVertical, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchProjects, fetchJurados, fetchEstudiantes, fetchEvaluaciones } from '../../api/fetch';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({ proyectos: 0, jurados: 0, evaluaciones: 0, estudiantes: 0 });
  const [topProjects, setTopProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([fetchProjects(), fetchJurados(), fetchEstudiantes(), fetchEvaluaciones()])
      .then(([proyectos, jurados, estudiantes, evaluaciones]) => {
        setStats({
          proyectos: proyectos.length,
          jurados: jurados.length,
          evaluaciones: evaluaciones.length,
          estudiantes: estudiantes.length,
        });

        // Calculate top projects by average score
        const projectScores: Record<number, { titulo: string; carrera: string; scores: number[]; evalCount: number }> = {};
        proyectos.forEach((p: any) => {
          projectScores[p.id_proyecto] = {
            titulo: p.titulo,
            carrera: p.carrera?.nombre_carrera || '-',
            scores: [],
            evalCount: p.evaluaciones?.length || 0,
          };
          if (p.evaluaciones) {
            p.evaluaciones.forEach((ev: any) => {
              if (ev.puntaje_total !== null && ev.puntaje_total !== undefined) {
                projectScores[p.id_proyecto].scores.push(Number(ev.puntaje_total));
              }
            });
          }
        });

        const ranked = Object.entries(projectScores)
          .map(([id, data]) => ({
            id: Number(id),
            titulo: data.titulo,
            carrera: data.carrera,
            promedio: data.scores.length > 0 ? data.scores.reduce((a, b) => a + b, 0) / data.scores.length : 0,
            evalCount: data.evalCount,
            hasEvals: data.scores.length > 0,
          }))
          .filter(p => p.hasEvals)
          .sort((a, b) => b.promedio - a.promedio)
          .slice(0, 5);

        setTopProjects(ranked);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const evalPercent = stats.proyectos > 0 ? Math.round((topProjects.length / stats.proyectos) * 100) : 0;

  return (
    <div className="p-8 relative">
      {/* Header */}
      <div className="mb-8">
        <div className="text-[10px] font-bold text-[#005c4b] tracking-widest uppercase mb-1">Vigésima Edición</div>
        <h1 className="text-3xl font-bold text-gray-800">Panel de Control</h1>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Cargando datos del panel...</div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-[6px] border-l-[#005c4b]">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#005c4b]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
                </div>
              </div>
              <div className="text-xs font-medium text-gray-500 mb-1">Total Proyectos</div>
              <div className="text-3xl font-bold text-gray-900">{stats.proyectos}</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-yellow-400 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full">Activo</span>
              </div>
              <div className="text-xs font-medium text-gray-500 mb-1">Jurados Asignados</div>
              <div className="text-3xl font-bold text-gray-900">{stats.jurados}</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-200 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                </div>
                <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded-full">{evalPercent}%</span>
              </div>
              <div className="text-xs font-medium text-gray-500 mb-1">Evaluaciones</div>
              <div className="text-3xl font-bold text-gray-900">{stats.evaluaciones}</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.5m0-6.5v6.5" /></svg>
                </div>
              </div>
              <div className="text-xs font-medium text-gray-500 mb-1">Estudiantes</div>
              <div className="text-3xl font-bold text-gray-900">{stats.estudiantes}</div>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="bg-[#f0f5f4] rounded-xl mb-8 p-6 relative h-48 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[#005c4b]">Proyectos por Carrera</h3>
              <div className="flex items-center space-x-4 text-[10px] font-bold tracking-widest text-[#005c4b] uppercase">
                <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-[#005c4b] mr-2"></span> DATOS EN VIVO</div>
              </div>
            </div>
            <p className="text-sm text-gray-500">{stats.proyectos} proyectos distribuidos entre {stats.estudiantes} estudiantes y {stats.jurados} jurados evaluadores.</p>
          </div>

          {/* Top Projects Ranking */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-16">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Top Proyectos Ranking</h3>
              <div className="flex space-x-2 text-gray-400">
                <button className="p-1 hover:text-gray-600 transition-colors" onClick={() => alert('Función de filtro en desarrollo')}><Filter className="w-5 h-5" /></button>
                <button className="p-1 hover:text-gray-600 transition-colors" onClick={() => alert('Función de descarga en desarrollo')}><Download className="w-5 h-5" /></button>
              </div>
            </div>

            {topProjects.length === 0 ? (
              <div className="text-center py-12 text-gray-400">No hay proyectos evaluados aún.</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="uppercase text-[10px] font-bold text-gray-400 tracking-wider">
                    <th className="p-4 pl-6 w-24">Ranking</th>
                    <th className="p-4">Nombre del Proyecto</th>
                    <th className="p-4">Carrera</th>
                    <th className="p-4 w-24">Puntaje</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-center pr-6 w-24">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {topProjects.map((proj, idx) => (
                    <tr key={proj.id} className={`${idx % 2 === 0 ? 'bg-emerald-50/50' : 'bg-white'} hover:bg-emerald-50 transition-colors border-b border-gray-50`}>
                      <td className="p-4 pl-6">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${idx < 3 ? 'bg-[#005c4b] text-white' : 'bg-gray-200 text-gray-600'}`}>
                          {String(idx + 1).padStart(2, '0')}
                        </div>
                      </td>
                      <td className="p-4 font-bold text-[#005c4b]">{proj.titulo}</td>
                      <td className="p-4 text-sm text-gray-600">{proj.carrera}</td>
                      <td className="p-4 font-bold text-[#005c4b]">{proj.promedio.toFixed(1)}</td>
                      <td className="p-4">
                        <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-green-200 text-green-800">
                          {proj.evalCount > 0 ? 'EVALUADO' : 'PENDIENTE'}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-center">
                        <button className="text-gray-400 hover:text-[#005c4b] transition-colors" onClick={() => alert('Opciones de proyecto en desarrollo')}>
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* FAB */}
      <button 
        className="fixed bottom-8 right-8 w-14 h-14 bg-[#005c4b] text-white rounded-2xl shadow-lg flex items-center justify-center hover:bg-[#004a3c] transition-colors z-50"
        onClick={() => navigate('/admin/proyectos')}
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};
