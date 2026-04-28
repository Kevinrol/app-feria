import React, { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { fetchCareers, fetchEstudiantesDisponibles, createProject } from '../../api/fetch';
import { X, Search } from 'lucide-react';

interface ProyectoModalDocenteProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const ProyectoModalDocente: React.FC<ProyectoModalDocenteProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    area_tematica: '',
    id_carrera: '',
    imageSrc: '',
  });
  
  const [carreras, setCarreras] = useState<any[]>([]);
  const [estudiantesDisponibles, setEstudiantesDisponibles] = useState<any[]>([]);
  const [estudiantesSeleccionados, setEstudiantesSeleccionados] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingEstudiantes, setLoadingEstudiantes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCarreras();
  }, []);

  const loadCarreras = async () => {
    try {
      const data = await fetchCareers();
      setCarreras(data);
    } catch (err) {
      console.error("Error cargando carreras:", err);
    }
  };

  const handleCarreraChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idCarrera = e.target.value;
    setFormData({ ...formData, id_carrera: idCarrera });
    setEstudiantesSeleccionados([]); // Reset selected students

    if (idCarrera) {
      setLoadingEstudiantes(true);
      try {
        const estudiantes = await fetchEstudiantesDisponibles(Number(idCarrera));
        setEstudiantesDisponibles(estudiantes);
      } catch (err) {
        console.error("Error cargando estudiantes disponibles:", err);
      } finally {
        setLoadingEstudiantes(false);
      }
    } else {
      setEstudiantesDisponibles([]);
    }
  };

  const toggleEstudiante = (id: number) => {
    setEstudiantesSeleccionados(prev => {
      if (prev.includes(id)) {
        return prev.filter(eId => eId !== id);
      } else {
        if (prev.length >= 2) {
          setError('Solo puedes asignar un máximo de 2 estudiantes por proyecto.');
          return prev;
        }
        setError(null);
        return [...prev, id];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (estudiantesSeleccionados.length === 0) {
      setError('Debes seleccionar al menos 1 estudiante para el proyecto.');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const idDocente = user?.id_docente || 1; // Fallback a 1 si no hay usuario

      const payload = {
        ...formData,
        id_carrera: Number(formData.id_carrera),
        id_docente: idDocente, 
        fecha_registro: new Date().toISOString(),
        estudiantesIds: estudiantesSeleccionados
      };
      await createProject(payload);
      alert('Proyecto creado exitosamente.');
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Error al crear el proyecto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Crear Nuevo Proyecto</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form id="proyecto-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Título del Proyecto</label>
                <input
                  type="text"
                  required
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#005c4b]/20 focus:border-[#005c4b] outline-none"
                  placeholder="Ej. Sistema de Riego Automatizado"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  rows={3}
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#005c4b]/20 focus:border-[#005c4b] outline-none resize-none"
                  placeholder="Breve descripción del proyecto..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Área Temática</label>
                <input
                  type="text"
                  value={formData.area_tematica}
                  onChange={(e) => setFormData({ ...formData, area_tematica: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#005c4b]/20 focus:border-[#005c4b] outline-none"
                  placeholder="Ej. Internet de las Cosas"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">URL de Fotografía (Opcional)</label>
                <input
                  type="url"
                  value={formData.imageSrc}
                  onChange={(e) => setFormData({ ...formData, imageSrc: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#005c4b]/20 focus:border-[#005c4b] outline-none"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Carrera</label>
                <select
                  required
                  value={formData.id_carrera}
                  onChange={handleCarreraChange}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#005c4b]/20 focus:border-[#005c4b] outline-none"
                >
                  <option value="">Seleccione una carrera</option>
                  {carreras.map((c) => (
                    <option key={c.id_carrera} value={c.id_carrera}>
                      {c.nombre_carrera}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selector de Estudiantes */}
            {formData.id_carrera && (
              <div className="mt-6 border-t border-gray-100 pt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Asignar Estudiantes</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Selecciona a los estudiantes que participarán en este proyecto. Solo se muestran los estudiantes de la carrera seleccionada que <strong>aún no tienen un proyecto asignado</strong>.
                </p>

                {loadingEstudiantes ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005c4b]"></div>
                  </div>
                ) : estudiantesDisponibles.length > 0 ? (
                  <div className="bg-gray-50 rounded-lg border border-gray-200 max-h-64 overflow-y-auto p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {estudiantesDisponibles.map(est => (
                        <label 
                          key={est.id_estudiante} 
                          className={`flex items-center p-3 rounded-md cursor-pointer border transition-colors ${
                            estudiantesSeleccionados.includes(est.id_estudiante)
                              ? 'bg-emerald-50 border-[#005c4b] text-[#005c4b]'
                              : 'bg-white border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 text-[#005c4b] rounded border-gray-300 focus:ring-[#005c4b] mr-3"
                            checked={estudiantesSeleccionados.includes(est.id_estudiante)}
                            onChange={() => toggleEstudiante(est.id_estudiante)}
                          />
                          <div>
                            <p className="text-sm font-medium">{est.nombre} {est.apellido}</p>
                            <p className="text-xs opacity-70">CI: {est.ci}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
                    <p className="text-gray-500">No hay estudiantes disponibles sin proyecto en esta carrera.</p>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3 rounded-b-xl">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" form="proyecto-form" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Proyecto'}
          </Button>
        </div>
      </div>
    </div>
  );
};
