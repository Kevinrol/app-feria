import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Ejemplo de interceptor
api.interceptors.request.use((config) => {
  // Puedes agregar el token de autenticación aquí si existe
  return config;
});

export const fetchProjects = async () => {
  try {
    const response = await api.get('/projects');
    return response.data;
  } catch (error) {
    console.error("Error fetching projects", error);
    return []; // Para la maqueta, podemos retornar un array vacío y manejar mock data en UI
  }
};

export default api;
