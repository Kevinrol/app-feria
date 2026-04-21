import React, { useEffect, useState } from 'react';
import { Plus, MoreVertical, Download, Trash2 } from 'lucide-react';
import { fetchProjects, createProject, deleteProject, fetchCareers, fetchDocentes } from '../../api/fetch';
import { Modal } from '../../components/Modal';

interface Proyecto {
  id_proyecto: number;
  titulo: string;
  descripcion?: string;
  area_tematica?: string;
  fecha_registro: string;
  carrera: { nombre_carrera: string; codigo_carrera: string };
  docente: { nombre: string; apellido: string };
  evaluaciones: any[];
  estudiantes: any[];
}

export const AdminProyectos: React.FC = () => {
  const [projects, setProjects] = useState<Proyecto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [carreras, setCarreras] = useState<any[]>([]);
  const [docentes, setDocentes] = useState<any[]>([]);
  const [formData, setFormData] = useState({ titulo: '', descripcion: '', area_tematica: '', id_carrera: '', id_docente: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([fetchProjects(), fetchCareers(), fetchDocentes()])
      .then(([projs, cars, docs]) => {
        setProjects(projs);
        setCarreras(cars);
        setDocentes(docs);
      })
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createProject({
        ...formData,
        id_carrera: parseInt(formData.id_carrera),
        id_docente: parseInt(formData.id_docente)
      });
      setIsModalOpen(false);
      setFormData({ titulo: '', descripcion: '', area_tematica: '', id_carrera: '', id_docente: '' });
      loadData();
    } catch (error) {
      alert('Error al crear proyecto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este proyecto?')) {
      try {
        await deleteProject(id);
        loadData();
      } catch (error) {
        alert('Error al eliminar proyecto');
      }
    }
  };

  const getStatusInfo = (proj: Proyecto) => {
    if (proj.evaluaciones && proj.evaluaciones.length > 0) {
      const allEvaluated = proj.evaluaciones.every((e: any) => e.puntaje_total !== null);
      if (allEvaluated) return { label: "Evaluado", color: "bg-green-300 text-green-900", dot: "bg-green-700" };
      return { label: "En Evaluación", color: "bg-yellow-400 text-yellow-900", dot: "bg-yellow-700" };
    }
    return { label: "Registrado", color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" };
  };

  const totalProyectos = projects.length;
  const registrados = projects.filter(p => !p.evaluaciones || p.evaluaciones.length === 0).length;
  const enEvaluacion = projects.filter(p => p.evaluaciones?.length > 0 && p.evaluaciones.some((e: any) => e.puntaje_total === null)).length;
  const evaluados = projects.filter(p => p.evaluaciones?.length > 0 && p.evaluaciones.every((e: any) => e.puntaje_total !== null)).length;

  return (
    <div className="p-8 relative min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold text-[#004a3c] mb-4">Listado de Proyectos</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Gestión centralizada de todas las propuestas técnicas registradas para la Feria Anual 2024. Filtre, evalúe y coordine el proceso académico.
          </p>
        </div>
        <button 
          className="flex items-center px-5 py-2.5 bg-[#005c4b] hover:bg-[#004a3c] text-white rounded-md font-medium transition-colors shadow-sm" 
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          Nuevo Proyecto
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">Total Proyectos</div>
          <div className="text-4xl font-bold text-[#005c4b] mb-4">{totalProyectos}</div>
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden"><div className="w-full h-full bg-[#005c4b] rounded-full"></div></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">Registrados</div>
          <div className="text-4xl font-bold text-[#005c4b] mb-4">{registrados}</div>
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: totalProyectos ? `${(registrados / totalProyectos) * 100}%` : '0%' }}></div></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">En Evaluación</div>
          <div className="text-4xl font-bold text-[#005c4b] mb-4">{enEvaluacion}</div>
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-yellow-400 rounded-full" style={{ width: totalProyectos ? `${(enEvaluacion / totalProyectos) * 100}%` : '0%' }}></div></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">Evaluados</div>
          <div className="text-4xl font-bold text-[#005c4b] mb-4">{evaluados}</div>
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-[#005c4b] rounded-full" style={{ width: totalProyectos ? `${(evaluados / totalProyectos) * 100}%` : '0%' }}></div></div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm mb-8 overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Cargando proyectos...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No hay proyectos registrados.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 uppercase text-[10px] font-bold text-gray-400 tracking-wider">
                  <th className="p-5 pl-8 w-24">ID</th>
                  <th className="p-5">Título del Proyecto</th>
                  <th className="p-5 w-32">Carrera</th>
                  <th className="p-5 w-48">Docente Tutor</th>
                  <th className="p-5 w-40">Estado</th>
                  <th className="p-5 text-right pr-6 w-20">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((proj) => {
                  const status = getStatusInfo(proj);
                  return (
                    <tr key={proj.id_proyecto} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-5 pl-8">
                        <span className="text-[11px] font-bold text-gray-400 tracking-widest">
                          #P-{proj.id_proyecto.toString().padStart(3, '0')}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="font-bold text-[#005c4b] text-[15px] mb-1 leading-tight">{proj.titulo}</div>
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{proj.area_tematica || '-'}</div>
                      </td>
                      <td className="p-5">
                        <span className="inline-block bg-emerald-50 text-[#005c4b] text-[9px] font-bold px-2 py-1 rounded uppercase tracking-widest">
                          {proj.carrera?.codigo_carrera || proj.carrera?.nombre_carrera}
                        </span>
                      </td>
                      <td className="p-5">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#005c4b] font-bold flex items-center justify-center text-xs mr-3">
                            {proj.docente?.nombre?.charAt(0)}{proj.docente?.apellido?.charAt(0)}
                          </div>
                          <span className="text-xs text-gray-600 font-medium">
                            {proj.docente?.nombre} {proj.docente?.apellido}
                          </span>
                        </div>
                      </td>
                      <td className="p-5">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${status.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-2 ${status.dot}`}></span>
                          {status.label}
                        </span>
                      </td>
                      <td className="p-5 pr-6 text-right space-x-2">
                        <button className="text-gray-400 hover:text-gray-600 transition-colors p-1" onClick={() => alert('Opciones de proyecto en desarrollo')}>
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        <button className="text-red-400 hover:text-red-600 transition-colors p-1" onClick={() => handleDelete(proj.id_proyecto)}>
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex items-center justify-between p-5 border-t border-gray-100 text-[11px] text-gray-400 font-medium">
          <div>Mostrando {projects.length} proyectos registrados</div>
        </div>
      </div>

      <button className="fixed bottom-8 right-8 w-14 h-14 bg-[#004a3c] hover:bg-[#003B2F] text-white rounded-xl shadow-lg flex items-center justify-center transition-colors z-50" onClick={() => alert('Función de descarga en desarrollo')}>
        <Download className="w-6 h-6" />
      </button>

      {/* Modal Crear Proyecto */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nuevo Proyecto">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título del Proyecto</label>
            <input required type="text" className="w-full px-3 py-2 bg-gray-100 border-transparent rounded-md focus:ring-1 focus:ring-[#005c4b]" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descripción</label>
            <textarea className="w-full px-3 py-2 bg-gray-100 border-transparent rounded-md focus:ring-1 focus:ring-[#005c4b]" rows={3} value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})}></textarea>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Área Temática</label>
            <input required type="text" className="w-full px-3 py-2 bg-gray-100 border-transparent rounded-md focus:ring-1 focus:ring-[#005c4b]" value={formData.area_tematica} onChange={e => setFormData({...formData, area_tematica: e.target.value})} />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Carrera</label>
              <select required className="w-full px-3 py-2 bg-gray-100 border-transparent rounded-md focus:ring-1 focus:ring-[#005c4b]" value={formData.id_carrera} onChange={e => setFormData({...formData, id_carrera: e.target.value})}>
                <option value="" disabled>Seleccionar</option>
                {carreras.map(c => <option key={c.id_carrera} value={c.id_carrera}>{c.nombre_carrera}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Docente Tutor</label>
              <select required className="w-full px-3 py-2 bg-gray-100 border-transparent rounded-md focus:ring-1 focus:ring-[#005c4b]" value={formData.id_docente} onChange={e => setFormData({...formData, id_docente: e.target.value})}>
                <option value="" disabled>Seleccionar</option>
                {docentes.map(d => <option key={d.id_docente} value={d.id_docente}>{d.nombre} {d.apellido}</option>)}
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-bold text-white bg-[#005c4b] hover:bg-[#004a3c] rounded-md disabled:opacity-50">
              {isSubmitting ? 'Guardando...' : 'Guardar Proyecto'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
