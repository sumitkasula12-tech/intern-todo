import api from './api';

const getStats = () => api.get('/admin/stats').then((res) => res.data.data);

export default { getStats };
