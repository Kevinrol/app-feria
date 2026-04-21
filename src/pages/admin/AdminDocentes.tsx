import React, { useEffect, useState } from 'react';
import { Download, UserPlus, Eye, Edit2, Filter, Trash2 } from 'lucide-react';
import { fetchDocentes, createDocente, deleteDocente } from '../../api/fetch';
import { Modal } from '../../components/Modal';

interface Docente {
  id_docente: number;
  ci: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  correo?: string;
  especialidad?: string;
  proyectos: any[];
}

export const AdminDocentes: React.FC = () => {
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ ci: '', nombre: '', apellido: '', telefono: '', correo: '', especialidad: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = () => {
    setLoading(true);
    fetchDocentes()
      .then((data) => setDocentes(data))
      .catch(() => setDocentes([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createDocente(formData);
      setIsModalOpen(false);
      setFormData({ ci: '', nombre: '', apellido: '', telefono: '', correo: '', especialidad: '' });
      loadData();
    } catch (error) {
      alert('Error al registrar docente');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este docente?')) {
      try {
        await deleteDocente(id);
        loadData();
      } catch (error) {
        alert('Error al eliminar docente');
      }
    }
  };

  const totalDocentes = docentes.length;
  const totalTutorias = docentes.reduce((sum, d) => sum + (d.proyectos?.length || 0), 0);
  const pendientesCi = docentes.filter(d => !d.ci || d.ci.trim() === '').length;
  const promedioCarga = totalDocentes > 0 ? (totalTutorias / totalDocentes).toFixed(1) : '0';

  const getInitials = (nombre: string, apellido: string) => {
    return `${nombre?.charAt(0) || ''}${apellido?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#005c4b] mb-2">Plantel Docente</h1>
          <p className="text-gray-500 max-w-xl">
            Gestión y monitoreo del cuerpo académico y sus tutorías vigentes en la Feria Técnica 2024.
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-emerald-50 text-[#005c4b] hover:bg-emerald-100 rounded-md font-medium transition-colors">
            <Download className="w-5 h-5 mr-2" />
            Exportar Reporte
          </button>
          <button 
            className="flex items-center px-4 py-2 bg-[#005c4b] hover:bg-[#004a3c] text-white rounded-md font-medium transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Vincular Docente
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#005c4b]"></div>
          <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Total Docentes</div>
          <div className="text-4xl font-bold text-[#005c4b]">{totalDocentes}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500"></div>
          <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Tutorías Activas</div>
          <div className="text-4xl font-bold text-[#005c4b]">{totalTutorias}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
          <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Pendientes CI</div>
          <div className="text-4xl font-bold text-[#005c4b]">{String(pendientesCi).padStart(2, '0')}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-300"></div>
          <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Promedio Carga</div>
          <div className="text-4xl font-bold text-[#005c4b]">{promedioCarga}</div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-white border border-gray-200 text-[#005c4b] font-medium rounded-md shadow-sm">Todos</button>
          </div>
          <button className="flex items-center text-gray-400 hover:text-gray-600 text-sm font-medium uppercase tracking-wider">
            <Filter className="w-4 h-4 mr-2" />
            Filtrar por Carga
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Cargando docentes...</div>
        ) : docentes.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No hay docentes registrados.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 uppercase text-xs font-bold text-gray-400 tracking-wider">
                  <th className="p-4 pl-6">CI</th>
                  <th className="p-4">Nombre Completo</th>
                  <th className="p-4">Especialidad</th>
                  <th className="p-4 text-center">Proyectos Tutoreados</th>
                  <th className="p-4">Teléfono</th>
                  <th className="p-4 text-right pr-6">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {docentes.map((docente) => (
                  <tr key={docente.id_docente} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="p-4 pl-6 text-sm text-gray-500">{docente.ci}</td>
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-[#005c4b] font-bold flex items-center justify-center text-sm mr-3">
                          {getInitials(docente.nombre, docente.apellido)}
                        </div>
                        <div>
                          <div className="font-bold text-[#005c4b] leading-tight">{docente.nombre} {docente.apellido}</div>
                          <div className="text-[10px] text-gray-400 uppercase tracking-widest">{docente.especialidad || '-'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-600 font-medium">{docente.especialidad || '-'}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold ${
                        (docente.proyectos?.length || 0) > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {docente.proyectos?.length || 0} Proyectos
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{docente.telefono || '-'}</td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <button className="text-gray-400 hover:text-[#005c4b] transition-colors"><Eye className="w-5 h-5" /></button>
                        <button className="text-red-400 hover:text-red-600 transition-colors" onClick={() => handleDelete(docente.id_docente)}><Trash2 className="w-5 h-5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="flex items-center justify-between p-4 border-t border-gray-100 text-sm text-gray-500 font-medium">
          <div>MOSTRANDO {docentes.length} DOCENTES</div>
        </div>
      </div>

      {/* Modal Crear Docente */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Docente">
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
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Especialidad / Cargo</label>
            <input required type="text" className="w-full px-3 py-2 bg-gray-100 border-transparent rounded-md focus:ring-1 focus:ring-[#005c4b]" value={formData.especialidad} onChange={e => setFormData({...formData, especialidad: e.target.value})} placeholder="Ej. Docente Sistemas" />
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
