import api from './api';

const getProfile = () => api.get('/profile').then((res) => res.data.data);
const updateProfile = (payload) => api.put('/profile', payload).then((res) => res.data.data);
const changePassword = (payload) => api.put('/profile/password', payload).then((res) => res.data.data);

export default { getProfile, updateProfile, changePassword };
