import React, { useEffect, useState } from 'react';
import { Plus, Filter, ArrowDownAZ, Lightbulb, Settings2, Globe, Users, Clock, User, CheckCircle2, Trash2 } from 'lucide-react';
import { fetchCriterios, createCriterio, deleteCriterio } from '../../api/fetch';
import { Modal } from '../../components/Modal';

interface Criterio {
  id_criterio: number;
  nombre_criterio: string;
  descripcion?: string;
  puntaje_maximo: string | number;
}

const iconMap: Record<number, React.FC<{ className?: string }>> = {
  0: Lightbulb,
  1: Settings2,
  2: Globe,
  3: Users,
};

const badgeMap = [
  { label: "PRIORIDAD ALTA", color: "bg-yellow-100 text-yellow-800" },
  { label: "ESTRUCTURAL", color: "bg-emerald-100 text-emerald-800" },
  { label: "TRANSVERSAL", color: "bg-gray-200 text-gray-700" },
  { label: "COMUNICACIÓN", color: "bg-gray-200 text-gray-700" },
];

export const AdminConfiguracion: React.FC = () => {
  const [criterios, setCriterios] = useState<Criterio[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nombre_criterio: '', descripcion: '', puntaje_maximo: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = () => {
    setLoading(true);
    fetchCriterios()
      .then((data) => {
        setCriterios(data);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
      })
      .catch(() => setCriterios([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createCriterio({
        ...formData,
        puntaje_maximo: parseFloat(formData.puntaje_maximo)
      });
      setIsModalOpen(false);
      setFormData({ nombre_criterio: '', descripcion: '', puntaje_maximo: '' });
      loadData();
    } catch (error) {
      alert('Error al registrar criterio');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este criterio?')) {
      try {
        await deleteCriterio(id);
        loadData();
      } catch (error) {
        alert('Error al eliminar criterio');
      }
    }
  };

  const totalPonderacion = criterios.reduce((sum, c) => sum + Number(c.puntaje_maximo), 0);
  const totalCriterios = criterios.length;

  return (
    <div className="p-8 relative min-h-full pb-24">
      {/* Header */}
      <div className="mb-2">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">GESTIÓN DE EVALUACIÓN</span>
      </div>
      <div className="flex justify-between items-start mb-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Criterios de Ponderación Técnica</h1>
          <p className="text-gray-500 leading-relaxed text-sm">
            Configure las dimensiones académicas para la Feria Técnica 2024. Estos criterios determinarán el puntaje final de los proyectos presentados por los estudiantes de todas las carreras.
          </p>
        </div>
        <button 
          className="flex items-center px-5 py-2.5 bg-[#005c4b] hover:bg-[#004a3c] text-white rounded-md font-medium transition-colors shadow-sm"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          Añadir Criterio
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 relative overflow-hidden">
          <div className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">Total Ponderación</div>
          <div className="flex items-end mb-3">
            <div className="text-4xl font-bold text-[#005c4b]">{totalPonderacion}</div>
            <div className="text-xs text-gray-400 font-medium ml-2 mb-1">pts. máximo</div>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-[#005c4b] rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 relative">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#005c4b] rounded-l-xl"></div>
          <div className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider pl-2">Criterios Activos</div>
          <div className="flex items-end pl-2">
            <div className="text-4xl font-bold text-gray-900">{String(totalCriterios).padStart(2, '0')}</div>
            <div className="text-xs text-gray-400 font-medium ml-2 mb-1">Categorías</div>
          </div>
        </div>
        <div className="bg-[#004a3c] p-6 rounded-xl text-white relative overflow-hidden shadow-md">
          <div className="relative z-10">
            <div className="text-[10px] font-bold text-emerald-100 mb-2 uppercase tracking-wider">Última Actualización</div>
            <div className="text-xl font-bold mb-1">Datos en tiempo real</div>
            <div className="text-xs text-emerald-100/80 font-medium">Desde la base de datos</div>
          </div>
        </div>
      </div>

      {/* List Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-[#005c4b] uppercase tracking-wider">Listado de Dimensiones</h3>
        <div className="flex space-x-3 text-gray-400">
          <button className="hover:text-gray-600 transition-colors"><Filter className="w-5 h-5" /></button>
          <button className="hover:text-gray-600 transition-colors"><ArrowDownAZ className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Dimensions List */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Cargando criterios...</div>
      ) : criterios.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No hay criterios registrados.</div>
      ) : (
        <div className="space-y-4 mb-8">
          {criterios.map((item, idx) => {
            const IconComp = iconMap[idx % Object.keys(iconMap).length] || Lightbulb;
            const badge = badgeMap[idx % badgeMap.length];
            return (
              <div key={item.id_criterio} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm flex items-start hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#005c4b] flex items-center justify-center flex-shrink-0 mr-6">
                  <IconComp className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h4 className="text-lg font-bold text-gray-900 mr-3">{item.nombre_criterio}</h4>
                    <span className={`text-[9px] font-bold px-2 py-1 rounded uppercase tracking-wider ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4 max-w-4xl">
                    {item.descripcion || 'Sin descripción disponible.'}
                  </p>
                  <div className="flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-wider space-x-6">
                    <div className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1.5" />
                      ID: {item.id_criterio}
                    </div>
                    <div className="flex items-center">
                      <User className="w-3.5 h-3.5 mr-1.5" />
                      Puntaje Máx: {Number(item.puntaje_maximo)}
                    </div>
                  </div>
                </div>
                <div className="ml-6 text-right flex flex-col items-end justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Peso</div>
                    <div className="text-3xl font-bold text-[#005c4b]">
                      {totalPonderacion > 0 ? Math.round((Number(item.puntaje_maximo) / totalPonderacion) * 100) : 0}%
                    </div>
                  </div>
                  <button 
                    className="mt-4 text-red-400 hover:text-red-600 transition-colors p-1"
                    onClick={() => handleDelete(item.id_criterio)}
                    title="Eliminar criterio"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Box */}
      <button 
        className="w-full border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 hover:text-[#005c4b] hover:border-[#005c4b] hover:bg-emerald-50/30 transition-all group"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-emerald-100 flex items-center justify-center mb-3 transition-colors">
          <Plus className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest">
          Haz clic para añadir una nueva dimensión evaluativa
        </span>
      </button>

      {/* Modal Crear Criterio */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Añadir Criterio de Evaluación">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre del Criterio</label>
            <input required type="text" className="w-full px-3 py-2 bg-gray-100 border-transparent rounded-md focus:ring-1 focus:ring-[#005c4b]" value={formData.nombre_criterio} onChange={e => setFormData({...formData, nombre_criterio: e.target.value})} placeholder="Ej. Innovación y Originalidad" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descripción</label>
            <textarea className="w-full px-3 py-2 bg-gray-100 border-transparent rounded-md focus:ring-1 focus:ring-[#005c4b]" rows={3} value={formData.descripcion} onChange={e => setFormData({...formData, descripcion: e.target.value})} placeholder="Detalles de lo que evalúa este criterio..."></textarea>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Puntaje Máximo</label>
            <input required type="number" step="0.5" className="w-full px-3 py-2 bg-gray-100 border-transparent rounded-md focus:ring-1 focus:ring-[#005c4b]" value={formData.puntaje_maximo} onChange={e => setFormData({...formData, puntaje_maximo: e.target.value})} placeholder="Ej. 20" />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-bold text-white bg-[#005c4b] hover:bg-[#004a3c] rounded-md disabled:opacity-50">
              {isSubmitting ? 'Guardando...' : 'Guardar Criterio'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-[#111827] text-white p-4 rounded-xl shadow-xl flex items-center justify-between w-96">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#005c4b] flex items-center justify-center mr-3">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold">Datos cargados</div>
              <div className="text-xs text-gray-400">{totalCriterios} criterios con ponderación total de {totalPonderacion} pts.</div>
            </div>
          </div>
          <button onClick={() => setShowToast(false)} className="text-[10px] font-bold text-gray-400 hover:text-white uppercase tracking-wider">
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
};
