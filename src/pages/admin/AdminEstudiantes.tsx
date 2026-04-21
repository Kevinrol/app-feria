import React, { useEffect, useState } from 'react';
import { Download, UserPlus, Filter, MoreHorizontal, Trash2 } from 'lucide-react';
import { fetchEstudiantes, createEstudiante, deleteEstudiante, fetchCareers } from '../../api/fetch';
import { Modal } from '../../components/Modal';

interface Estudiante {
  id_estudiante: number;
  ci: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  correo?: string;
  carrera: { nombre_carrera: string; codigo_carrera: string };
  proyectos: { proyecto: { titulo: string } }[];
}

export const AdminEstudiantes: React.FC = () => {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [carreras, setCarreras] = useState<any[]>([]);
  const [formData, setFormData] = useState({ ci: '', nombre: '', apellido: '', telefono: '', correo: '', id_carrera: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    Promise.all([fetchEstudiantes(), fetchCareers()])
      .then(([estuds, cars]) => {
        setEstudiantes(estuds);
        setCarreras(cars);
      })
      .catch(() => setEstudiantes([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createEstudiante({
        ...formData,
        id_carrera: parseInt(formData.id_carrera)
      });
      setIsModalOpen(false);
      setFormData({ ci: '', nombre: '', apellido: '', telefono: '', correo: '', id_carrera: '' });
      loadData();
    } catch (error) {
      alert('Error al registrar estudiante');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este estudiante?')) {
      try {
        await deleteEstudiante(id);
        loadData();
      } catch (error) {
        alert('Error al eliminar estudiante');
      }
    }
  };

  const totalRegistrados = estudiantes.length;
  const conProyecto = estudiantes.filter(e => e.proyectos && e.proyectos.length > 0).length;
  const pendientesCi = estudiantes.filter(e => !e.ci || e.ci.trim() === '').length;

  const getInitials = (nombre: string, apellido: string) => {
    return `${nombre?.charAt(0) || ''}${apellido?.charAt(0) || ''}`.toUpperCase();
  };

  const avatarColors = [
    "bg-green-100 text-green-800",
    "bg-yellow-400 text-yellow-900",
    "bg-green-800 text-white",
    "bg-red-200 text-red-800",
    "bg-blue-100 text-blue-800",
    "bg-purple-100 text-purple-800",
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#005c4b] mb-2">Directorio de Estudiantes</h1>
          <p className="text-gray-500 max-w-2xl">
            Registro consolidado de participantes para la Feria Técnica 2024.
            Gestione inscripciones, asignaciones de proyectos y documentación académica.
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md font-medium transition-colors">
            <Download className="w-5 h-5 mr-2" />
            Exportar PDF
          </button>
          <button 
            className="flex items-center px-4 py-2 bg-[#005c4b] hover:bg-[#004a3c] text-white rounded-md font-medium transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Registrar Estudiante
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Total Registrados</div>
          <div className="text-4xl font-bold text-[#005c4b] mb-2">{totalRegistrados.toLocaleString()}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Con Proyecto</div>
          <div className="text-4xl font-bold text-[#005c4b] mb-2">{conProyecto}</div>
          <div className="text-xs font-medium text-gray-400">
            {totalRegistrados > 0 ? Math.round((conProyecto / totalRegistrados) * 100) : 0}% del total actual
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Pendientes CI</div>
          <div className="text-4xl font-bold text-red-600 mb-2">{pendientesCi}</div>
          <div className="text-xs font-medium text-gray-400">Acción requerida</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wide">Sin Proyecto</div>
          <div className="text-4xl font-bold text-[#005c4b] mb-2">{totalRegistrados - conProyecto}</div>
          <div className="text-xs font-medium text-gray-400">Pendientes de asignación</div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex space-x-2">
            <button className="px-4 py-2 bg-white border border-gray-200 text-[#005c4b] font-bold rounded-md shadow-sm text-sm">Todos</button>
          </div>
          <button className="flex items-center text-gray-400 hover:text-gray-600">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Cargando estudiantes...</div>
        ) : estudiantes.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No hay estudiantes registrados.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 uppercase text-xs font-bold text-gray-400 tracking-wider">
                  <th className="p-4 pl-6 w-32">CI</th>
                  <th className="p-4">Nombre Completo</th>
                  <th className="p-4">Carrera</th>
                  <th className="p-4 w-48">Proyecto Asignado</th>
                  <th className="p-4">Correo Electrónico</th>
                  <th className="p-4 text-right pr-6">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {estudiantes.map((est, idx) => {
                  const hasProject = est.proyectos && est.proyectos.length > 0;
                  const projectTitle = hasProject ? est.proyectos[0].proyecto.titulo : null;
                  const colorClass = avatarColors[idx % avatarColors.length];

                  return (
                    <tr key={est.id_estudiante} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-4 pl-6 text-sm text-gray-500">{est.ci}</td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-md ${colorClass} font-bold flex items-center justify-center text-xs mr-3`}>
                            {getInitials(est.nombre, est.apellido)}
                          </div>
                          <div className="font-bold text-[#005c4b]">{est.apellido}, {est.nombre}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-md">
                          {est.carrera?.nombre_carrera || '-'}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-medium text-gray-500">
                        {hasProject ? (
                          <div className="text-gray-600 leading-tight">"{projectTitle}"</div>
                        ) : (
                          <span className="inline-block bg-red-100 text-red-600 px-2 py-1 rounded text-[10px] font-bold">
                            SIN ASIGNAR
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-gray-500">{est.correo || '-'}</td>
                      <td className="p-4 pr-6 text-right space-x-2">
                        <button className="text-gray-300 hover:text-gray-500 transition-colors p-1" onClick={() => alert('Opciones en desarrollo')}>
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                        <button className="text-red-400 hover:text-red-600 transition-colors p-1" onClick={() => handleDelete(est.id_estudiante)}>
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
        
        <div className="flex items-center justify-between p-4 border-t border-gray-100 text-sm text-gray-500 font-medium">
          <div>Mostrando {estudiantes.length} estudiantes</div>
        </div>
      </div>

      {/* Modal Crear Estudiante */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Registrar Estudiante">
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
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Carrera</label>
            <select required className="w-full px-3 py-2 bg-gray-100 border-transparent rounded-md focus:ring-1 focus:ring-[#005c4b]" value={formData.id_carrera} onChange={e => setFormData({...formData, id_carrera: e.target.value})}>
              <option value="" disabled>Seleccionar</option>
              {carreras.map(c => <option key={c.id_carrera} value={c.id_carrera}>{c.nombre_carrera}</option>)}
            </select>
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
