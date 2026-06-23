import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject({
        message: 'Backend unavailable. Please make sure the API server is running.',
        isOffline: true,
      });
    }

    return Promise.reject(error);
  }
);

export default api;
