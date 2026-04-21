import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==================== AUTH ====================
export const loginUsuario = async (correo: string, password: string): Promise<any> => {
  const response = await api.post('/auth/login', { correo, password });
  return response.data;
};

export const registerUsuario = async (data: any): Promise<any> => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

// ==================== PROYECTOS ====================
export const fetchProjects = async () => {
  const response = await api.get('/proyecto');
  return response.data;
};

export const fetchProjectById = async (id: number) => {
  const response = await api.get(`/proyecto/${id}`);
  return response.data;
};

export const createProject = async (data: any) => {
  const response = await api.post('/proyecto', data);
  return response.data;
};

export const updateProject = async (id: number, data: any) => {
  const response = await api.patch(`/proyecto/${id}`, data);
  return response.data;
};

export const deleteProject = async (id: number) => {
  const response = await api.delete(`/proyecto/${id}`);
  return response.data;
};

// ==================== CARRERAS ====================
export const fetchCareers = async () => {
  const response = await api.get('/carrera');
  return response.data;
};

// ==================== DOCENTES ====================
export const fetchDocentes = async () => {
  const response = await api.get('/docente');
  return response.data;
};

export const fetchDocenteById = async (id: number) => {
  const response = await api.get(`/docente/${id}`);
  return response.data;
};

export const fetchDocenteProyectos = async (id: number) => {
  const response = await api.get(`/docente/${id}/proyectos`);
  return response.data;
};

export const createDocente = async (data: any) => {
  const response = await api.post('/docente', data);
  return response.data;
};

export const updateDocente = async (id: number, data: any) => {
  const response = await api.patch(`/docente/${id}`, data);
  return response.data;
};

export const deleteDocente = async (id: number) => {
  const response = await api.delete(`/docente/${id}`);
  return response.data;
};

// ==================== ESTUDIANTES ====================
export const fetchEstudiantes = async () => {
  const response = await api.get('/estudiante');
  return response.data;
};

export const fetchEstudianteById = async (id: number) => {
  const response = await api.get(`/estudiante/${id}`);
  return response.data;
};

export const fetchEstudiantesByCarrera = async (idCarrera: number) => {
  const response = await api.get(`/estudiante/carrera/${idCarrera}`);
  return response.data;
};

export const createEstudiante = async (data: any) => {
  const response = await api.post('/estudiante', data);
  return response.data;
};

export const updateEstudiante = async (id: number, data: any) => {
  const response = await api.patch(`/estudiante/${id}`, data);
  return response.data;
};

export const deleteEstudiante = async (id: number) => {
  const response = await api.delete(`/estudiante/${id}`);
  return response.data;
};

// ==================== JURADOS ====================
export const fetchJurados = async () => {
  const response = await api.get('/jurado');
  return response.data;
};

export const fetchJuradoById = async (id: number) => {
  const response = await api.get(`/jurado/${id}`);
  return response.data;
};

export const fetchJuradoEvaluaciones = async (id: number) => {
  const response = await api.get(`/jurado/${id}/evaluaciones`);
  return response.data;
};

export const createJurado = async (data: any) => {
  const response = await api.post('/jurado', data);
  return response.data;
};

export const updateJurado = async (id: number, data: any) => {
  const response = await api.patch(`/jurado/${id}`, data);
  return response.data;
};

export const deleteJurado = async (id: number) => {
  const response = await api.delete(`/jurado/${id}`);
  return response.data;
};

// ==================== CRITERIOS ====================
export const fetchCriterios = async () => {
  const response = await api.get('/criterio');
  return response.data;
};

export const fetchCriterioById = async (id: number) => {
  const response = await api.get(`/criterio/${id}`);
  return response.data;
};

export const createCriterio = async (data: any) => {
  const response = await api.post('/criterio', data);
  return response.data;
};

export const updateCriterio = async (id: number, data: any) => {
  const response = await api.patch(`/criterio/${id}`, data);
  return response.data;
};

export const deleteCriterio = async (id: number) => {
  const response = await api.delete(`/criterio/${id}`);
  return response.data;
};

// ==================== EVALUACIONES ====================
export const fetchEvaluaciones = async () => {
  const response = await api.get('/evaluacion');
  return response.data;
};

export const fetchEvaluacionById = async (id: number) => {
  const response = await api.get(`/evaluacion/${id}`);
  return response.data;
};

export const fetchEvaluacionesByProyecto = async (idProyecto: number) => {
  const response = await api.get(`/evaluacion/proyecto/${idProyecto}`);
  return response.data;
};

export const fetchPromedioProyecto = async (idProyecto: number) => {
  const response = await api.get(`/evaluacion/proyecto/${idProyecto}/promedio`);
  return response.data;
};

export const createEvaluacion = async (data: any) => {
  const response = await api.post('/evaluacion', data);
  return response.data;
};

export const updateEvaluacion = async (id: number, data: any) => {
  const response = await api.patch(`/evaluacion/${id}`, data);
  return response.data;
};

export const deleteEvaluacion = async (id: number) => {
  const response = await api.delete(`/evaluacion/${id}`);
  return response.data;
};

export default api;
