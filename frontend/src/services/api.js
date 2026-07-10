import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export const auth = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  me: () => API.get('/auth/me'),
};

export const documents = {
  upload: (formData) => API.post('/documents/upload', formData),
  analyze: (id, content) => API.post(`/documents/analyze/${id}`, content),
  list: () => API.get('/documents/'),
  get: (id) => API.get(`/documents/${id}`),
  delete: (id) => API.delete(`/documents/${id}`),
};

export const consultations = {
  create: (data) => API.post('/consultations/', data),
  list: () => API.get('/consultations/'),
  get: (id) => API.get(`/consultations/${id}`),
  updateStatus: (id, status) => API.patch(`/consultations/${id}/status?status=${status}`),
};

export const cases = {
  create: (data) => API.post('/cases/', data),
  list: () => API.get('/cases/'),
  get: (id) => API.get(`/cases/${id}`),
};

export const payments = {
  create: (data) => API.post('/payments/', data),
  list: () => API.get('/payments/'),
};

export const ai = {
  generateContract: (prompt) => API.post('/ai/generate-contract', { prompt }),
  chat: (query) => API.post('/ai/chat', { query }),
  research: (query) => API.post('/ai/research', { query }),
};

export const admin = {
  dashboard: () => API.get('/admin/dashboard'),
  users: () => API.get('/admin/users'),
};

export default API;
