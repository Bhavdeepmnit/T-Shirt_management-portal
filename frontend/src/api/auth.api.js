import api from './axios';

export const adminLogin = (credentials) => api.post('/auth/admin/login', credentials);
export const refreshToken = (token) => api.post('/auth/refresh', { refreshToken: token });
export const logout = () => api.post('/auth/logout');
export const getMe = () => api.get('/auth/me');
