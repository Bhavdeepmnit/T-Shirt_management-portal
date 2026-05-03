import api from './axios';

export const getDashboard = () => api.get('/superadmin/dashboard');
export const createAdmin = (data) => api.post('/superadmin/admin', data);
export const getAdmins = () => api.get('/superadmin/admins');
export const updateAdmin = (id, data) => api.put(`/superadmin/admin/${id}`, data);
export const deleteAdmin = (id) => api.delete(`/superadmin/admin/${id}`);
export const getAllStudents = (params) => api.get('/superadmin/students', { params });
export const updateStudent = (id, data) => api.put(`/superadmin/student/${id}`, data);
export const deleteStudent = (id) => api.delete(`/superadmin/student/${id}`);
export const getFormSettings = () => api.get('/superadmin/form/settings');
export const updateFormSettings = (data) => api.put('/superadmin/form/settings', data);
export const lockForm = (data) => api.post('/superadmin/form/lock', data);
