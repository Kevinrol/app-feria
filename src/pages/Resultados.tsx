import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Award, Users, ArrowLeft, Trophy } from 'lucide-react';
import { fetchProjects, fetchEvaluaciones } from '../api/fetch';

interface RankedProject {
  id: number;
  titulo: string;
  carrera: string;
  promedio: number;
  evalCount: number;
  maxEvals: number
  isFinalist: boolean;
}

export const Resultados: React.FC = () => {
  const [ranking, setRanking] = useState<RankedProject[]>([]);
  const [stats, setStats] = useState({ total: 0, promedio: 0, evalPercent: 0 });
  const [loading, setLoading] = useState(true);
  const [bestCareer, setBestCareer] = useState({ name: '-', avg: 0, count: 0 });

  useEffect(() => {
    Promise.all([fetchProjects(), fetchEvaluaciones()])
      .then(([proyectos, evaluaciones]) => {
        const projectData: RankedProject[] = proyectos
          .map((p: any) => {
            const evals = p.evaluaciones || [];
            const scores = evals
              .filter((e: any) => e.puntaje_total !== null && e.puntaje_total !== undefined)
              .map((e: any) => Number(e.puntaje_total));
            const promedio = scores.length > 0 ? scores.reduce((a: number, b: number) => a + b, 0) / scores.length : 0;
            return {
              id: p.id_proyecto,
              titulo: p.titulo,
              carrera: p.carrera?.nombre_carrera || '-',
              promedio,
              evalCount: evals.length,
              maxEvals: evals.length,
              isFinalist: promedio >= 90,
            };
          })
          .filter((p: RankedProject) => p.evalCount > 0)
          .sort((a: RankedProject, b: RankedProject) => b.promedio - a.promedio);

        setRanking(projectData);

        const allScores = projectData.map((p: RankedProject) => p.promedio);
        const avgGeneral = allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0;
        const projectsWithEvals = projectData.length;
        const evalPercent = proyectos.length > 0 ? Math.round((projectsWithEvals / proyectos.length) * 100) : 0;

        setStats({
          total: proyectos.length,
          promedio: Number(avgGeneral.toFixed(1)),
          evalPercent,
        });

        const careerScores: Record<string, { sum: number; count: number }> = {};
        projectData.forEach((p: RankedProject) => {
          if (!careerScores[p.carrera]) careerScores[p.carrera] = { sum: 0, count: 0 };
          careerScores[p.carrera].sum += p.promedio;
          careerScores[p.carrera].count += 1;
        });
        let best = { name: '-', avg: 0, count: 0 };
        Object.entries(careerScores).forEach(([name, data]) => {
          const avg = data.count > 0 ? data.sum / data.count : 0;
          if (avg > best.avg) best = { name, avg: Number(avg.toFixed(1)), count: data.count };
        });
        setBestCareer(best);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero banner */}
      <section className="relative bg-gradient-to-br from-[#003B2F] to-[#001D17] text-white py-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-emerald-200 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Inicio
          </Link>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 px-3 py-1 rounded-full text-xs font-bold text-emerald-200 uppercase tracking-wider mb-4">
                <Trophy className="w-3.5 h-3.5" />
                Resultados Oficiales
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-3 text-white">
                Ranking de<br />Proyectos
              </h1>
              <p className="text-emerald-100/70 max-w-lg">
                Visualización consolidada de puntajes finales por categorías y carreras. Los proyectos destacados serán acreedores a la acreditación nacional.
              </p>
            </div>
            <div className="flex space-x-2">
              <span className="bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">Acreditados</span>
              <span className="bg-white/10 border border-white/20 text-white/70 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">En Vivo</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="text-center py-20 text-gray-400">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            Cargando resultados...
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_2fr] gap-4 mb-10 -mt-8">
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Total Proyectos</div>
                <div className="text-4xl font-bold text-[#005c4b]">{stats.total}</div>
              </div>
              <div className="bg-[#004a3c] rounded-xl p-6 shadow-md flex flex-col justify-center text-white">
                <div className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider mb-2">Promedio General</div>
                <div className="text-4xl font-bold">{stats.promedio}</div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm flex flex-col justify-center">
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Estado de Evaluación</div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-[#005c4b] rounded-full transition-all duration-700" style={{ width: `${stats.evalPercent}%` }}></div>
                </div>
                <div className="text-[11px] font-bold text-[#005c4b] flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                  {stats.evalPercent}% de evaluaciones concluidas
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm mb-12 overflow-hidden">
              {ranking.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">No hay proyectos evaluados aún.</p>
                  <p className="text-sm mt-1">Los resultados aparecerán cuando los jurados completen sus evaluaciones.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#f8f9fa] border-b border-gray-100 uppercase text-[10px] font-bold text-gray-500 tracking-wider">
                        <th className="p-5 pl-8 w-24">Posición</th>
                        <th className="p-5">Proyecto</th>
                        <th className="p-5 w-48">Carrera</th>
                        <th className="p-5 w-32">Puntaje Promedio</th>
                        <th className="p-5 w-24">N° Eval.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ranking.map((item, idx) => (
                        <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="p-5 pl-8">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl font-bold text-gray-300">{String(idx + 1).padStart(2, '0')}</span>
                              {idx < 3 && (
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${idx === 0 ? 'bg-[#005c4b] text-white' : idx === 1 ? 'bg-gray-300 text-gray-600' : 'bg-amber-200 text-amber-700'}`}>
                                  <Award className="w-3.5 h-3.5" />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="font-bold text-gray-900 mb-2">{item.titulo}</div>
                            {item.isFinalist && (
                              <span className="inline-flex items-center bg-emerald-100 text-emerald-700 border border-emerald-200 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                                <CheckCircle2 className="w-3 h-3 mr-1" /> Finalista
                              </span>
                            )}
                          </td>
                          <td className="p-5 text-sm text-gray-600 font-medium">{item.carrera}</td>
                          <td className="p-5">
                            <div className="flex items-baseline space-x-1 font-bold">
                              <span className="text-xl text-[#005c4b]">{item.promedio.toFixed(1)}</span>
                              <span className="text-xs text-gray-400">/ 100</span>
                            </div>
                          </td>
                          <td className="p-5 text-xs text-gray-500 font-medium tracking-wide">
                            {String(item.evalCount).padStart(2, '0')}/{String(item.maxEvals).padStart(2, '0')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="flex items-center justify-between p-5 bg-[#f8f9fa] border-t border-gray-100 text-[11px] text-gray-500 font-bold">
                <div>Mostrando {ranking.length} de {stats.total} proyectos registrados</div>
              </div>
            </div>

            {/* Bottom Cards */}
            <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-6">
              <div>
                <h3 className="text-2xl font-bold mb-3">Métricas<br/>Institucionales</h3>
                <p className="text-gray-500 text-xs leading-relaxed max-w-sm mb-6">Análisis de participación por carrera y nivel de competitividad académica.</p>
                <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wider">Mejor Carrera</span>
                    <span className="bg-yellow-400 text-yellow-900 text-[9px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">Destacado</span>
                  </div>
                  <div className="flex items-end space-x-3 mb-2">
                    <h4 className="text-3xl font-bold text-[#005c4b] leading-none">{bestCareer.name}</h4>
                    <span className="text-sm font-bold text-emerald-500 pb-0.5">Avg {bestCareer.avg}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium">Basado en el puntaje acumulado de {bestCareer.count} proyectos.</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#003B2F] to-[#001D17] rounded-xl p-8 relative overflow-hidden shadow-md flex flex-col justify-end text-white">
                <div className="absolute top-0 right-0 left-0 bottom-0 m-auto w-48 h-48 bg-emerald-500/20 rounded-full blur-[50px] pointer-events-none"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-3 leading-tight text-white">Tecnología de<br/>Vanguardia</h3>
                  <p className="text-[10px] text-emerald-50/70 font-medium leading-relaxed">Los mejores proyectos serán incubados en el laboratorio de innovación de El Alto.</p>
                </div>
              </div>
              <div className="bg-[#f1f3f5] rounded-xl p-8 flex flex-col justify-center">
                <Users className="w-8 h-8 text-[#005c4b] mb-4" />
                <h3 className="text-lg font-bold text-gray-800 mb-2">Jurado Calificado</h3>
                <p className="text-[10px] text-gray-500 font-medium leading-relaxed">Un panel de expertos nacionales e internacionales avala estos resultados.</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
