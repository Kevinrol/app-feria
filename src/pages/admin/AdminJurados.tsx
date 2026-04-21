import React, { useEffect, useState } from 'react';
import { Plus, MoreVertical, ShieldCheck, Trash2 } from 'lucide-react';
import { fetchJurados, createJurado, deleteJurado } from '../../api/fetch';
import { Modal } from '../../components/Modal';

interface Jurado {
  id_jurado: number;
  ci: string;
  nombre: string;
  apellido: string;
  institucion?: string;
  especialidad?: string;
  telefono?: string;
  correo?: string;
  evaluaciones?: any[];
}

export const AdminJurados: React.FC = () => {
  const [jurados, setJurados] = useState<Jurado[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ci: '', nombre: '', apellido: '', institucion: '', especialidad: '', telefono: '', correo: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    fetchJurados()
      .then((data) => setJurados(data))
      .catch(() => setJurados([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createJurado(formData);
      setIsModalOpen(false);
      setFormData({ ci: '', nombre: '', apellido: '', institucion: '', especialidad: '', telefono: '', correo: '' });
      loadData();
    } catch (error) {
      alert('Error al registrar jurado');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este jurado?')) {
      try {
        await deleteJurado(id);
        loadData();
      } catch (error) {
        alert('Error al eliminar jurado');
      }
    }
  };

  const totalJurados = jurados.length;
  const totalProyectosAsignados = jurados.reduce((sum, j) => sum + (j.evaluaciones?.length || 0), 0);
  const instituciones = new Set(jurados.map(j => j.institucion).filter(Boolean)).size;
  const areas = new Set(jurados.map(j => j.especialidad).filter(Boolean)).size;

  const getInitials = (nombre: string, apellido: string) => {
    return `${nombre?.charAt(0) || ''}${apellido?.charAt(0) || ''}`.toUpperCase();
  };

  const areaColors: Record<string, string> = {};
  const colorPalette = [
    "bg-green-200 text-green-800",
    "bg-yellow-300 text-yellow-900",
    "bg-red-200 text-red-800",
    "bg-blue-200 text-blue-800",
    "bg-purple-200 text-purple-800",
    "bg-orange-200 text-orange-800",
  ];
  jurados.forEach((j) => {
    if (j.especialidad && !areaColors[j.especialidad]) {
      areaColors[j.especialidad] = colorPalette[Object.keys(areaColors).length % colorPalette.length];
    }
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Directorio de Jurados</h1>
          <p className="text-gray-500">
            Gestión y asignación de evaluadores para la Feria Técnica 2024.
          </p>
        </div>
        <button 
          className="flex items-center px-4 py-2 bg-[#005c4b] hover:bg-[#004a3c] text-white rounded-md font-medium transition-colors"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="w-5 h-5 mr-2" />
          Registrar Nuevo Jurado
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">Total Jurados</div>
          <div className="text-3xl font-bold text-[#005c4b]">{totalJurados}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">Proyectos Asignados</div>
          <div className="flex items-end space-x-2">
            <div className="text-3xl font-bold text-[#005c4b]">{totalProyectosAsignados}</div>
            <div className="text-xs font-medium text-gray-400 mb-1">Prom. {totalJurados > 0 ? (totalProyectosAsignados / totalJurados).toFixed(1) : '0'} p/j</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">Instituciones</div>
          <div className="flex items-end space-x-2">
            <div className="text-3xl font-bold text-[#005c4b]">{instituciones}</div>
            <div className="text-xs font-medium text-gray-400 mb-1">Convenios activos</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">Áreas Cubiertas</div>
          <div className="flex items-end space-x-2">
            <div className="text-3xl font-bold text-[#005c4b]">{String(areas).padStart(2, '0')}</div>
            <div className="text-xs font-bold text-[#cd9b00] mb-1">Especialidades</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm mb-6 overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Cargando jurados...</div>
        ) : jurados.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No hay jurados registrados.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 uppercase text-[10px] font-bold text-gray-400 tracking-wider">
                  <th className="p-4 pl-6 w-32">CI</th>
                  <th className="p-4">Nombre Completo</th>
                  <th className="p-4 w-48">Institución</th>
                  <th className="p-4 w-48">Área de Especialidad</th>
                  <th className="p-4">Proyectos Asignados</th>
                  <th className="p-4 text-right pr-6">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {jurados.map((jurado) => (
                  <tr key={jurado.id_jurado} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="p-4 pl-6 text-sm text-gray-500">{jurado.ci}</td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#005c4b] font-bold flex items-center justify-center text-xs mr-3">
                          {getInitials(jurado.nombre, jurado.apellido)}
                        </div>
                        <div className="font-bold text-gray-800 text-sm">{jurado.nombre} {jurado.apellido}</div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{jurado.institucion || '-'}</td>
                    <td className="p-4">
                      {jurado.especialidad ? (
                        <span className={`inline-block px-2 py-1 rounded text-[9px] font-bold tracking-widest ${areaColors[jurado.especialidad] || 'bg-gray-200 text-gray-700'}`}>
                          {jurado.especialidad.toUpperCase()}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-sm font-bold text-[#005c4b]">
                        {String(jurado.evaluaciones?.length || 0).padStart(2, '0')}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button className="text-gray-300 hover:text-gray-500 transition-colors p-1" onClick={() => alert('Opciones en desarrollo')}>
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      <button className="text-red-400 hover:text-red-600 transition-colors p-1" onClick={() => handleDelete(jurado.id_jurado)}>
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="flex items-center justify-between p-4 border-t border-gray-100 text-[11px] text-gray-400 font-medium">
          <div>Mostrando {jurados.length} jurados</div>
        </div>
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6 mb-8">
        <div className="bg-[#e4eceb] rounded-xl p-6 relative overflow-hidden h-48 border border-gray-200">
          <div className="relative z-10 w-2/3">
            <h3 className="text-lg font-bold text-[#005c4b] mb-1">Distribución por Áreas</h3>
            <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
              Visualización en tiempo real de la capacidad evaluativa por cada especialidad técnica del instituto.
            </p>
          </div>
        </div>
        <div className="bg-[#004a3c] rounded-xl p-6 text-white flex flex-col justify-between shadow-md relative overflow-hidden h-48">
          <div className="relative z-10">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5 text-[#004a3c]" />
            </div>
            <h3 className="text-[17px] font-bold mb-2 leading-tight">Acceso a<br/>Calificaciones</h3>
            <p className="text-[10px] text-green-100/80 font-medium leading-relaxed">
              Los jurados pueden ahora utilizar la aplicación móvil para calificar proyectos en tiempo real.
            </p>
          </div>
          <button className="relative z-10 w-full py-2 bg-white text-[#004a3c] font-bold text-xs rounded uppercase tracking-wider hover:bg-gray-50 transition-colors shadow-sm">
            Emitir Credenciales
          </button>
        </div>
      </div>

      {/* Modal Crear Jurado */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Nuevo Jurado">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre</label>
              <input required type="text" className="w-full px-3 py-2 bg-gray-100 border-transparent rounded-md focus:ring-1 focus:ring-[#005c4b]" value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Apellido</label>
              <input required type="text" className="w-full px-3 py-2 bg-gray-100 border-transparent rounded-md focus:ring-1 focus:ring-[#005c4b]" value={formData.apellido} onChange={e => setFormData({...formData, apellido: e.target.value})} />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CI</label>
              <input required type="text" className="w-full px-3 py-2 bg-gray-100 border-transparent rounded-md focus:ring-1 focus:ring-[#005c4b]" value={formData.ci} onChange={e => setFormData({...formData, ci: e.target.value})} />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Teléfono</label>
              <input type="text" className="w-full px-3 py-2 bg-gray-100 border-transparent rounded-md focus:ring-1 focus:ring-[#005c4b]" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Correo Electrónico</label>
            <input type="email" className="w-full px-3 py-2 bg-gray-100 border-transparent rounded-md focus:ring-1 focus:ring-[#005c4b]" value={formData.correo} onChange={e => setFormData({...formData, correo: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Institución de Procedencia</label>
            <input required type="text" className="w-full px-3 py-2 bg-gray-100 border-transparent rounded-md focus:ring-1 focus:ring-[#005c4b]" value={formData.institucion} onChange={e => setFormData({...formData, institucion: e.target.value})} placeholder="Ej. INCOS" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Especialidad</label>
            <input required type="text" className="w-full px-3 py-2 bg-gray-100 border-transparent rounded-md focus:ring-1 focus:ring-[#005c4b]" value={formData.especialidad} onChange={e => setFormData({...formData, especialidad: e.target.value})} placeholder="Ej. Sistemas Informáticos" />
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-bold text-white bg-[#005c4b] hover:bg-[#004a3c] rounded-md disabled:opacity-50">
              {isSubmitting ? 'Guardando...' : 'Registrar'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
