import api from './api';

let token = null;

const setToken = (authToken) => {
  token = authToken;
  if (authToken) {
    api.defaults.headers.common.Authorization = `Bearer ${authToken}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

const clearToken = () => setToken(null);

const register = (payload) => api.post('/auth/register', payload).then((res) => res.data.data);
const login = (payload) => api.post('/auth/login', payload).then((res) => res.data.data);

export default { register, login, setToken, clearToken };
