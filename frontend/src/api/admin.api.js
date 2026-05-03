import api from './axios';

export const getDashboard = () => api.get('/admin/dashboard');
export const getBranchStudents = (params) => api.get('/admin/students', { params });
export const confirmPayment = (studentId, data) => api.put(`/admin/student/${studentId}/confirm-payment`, data);
export const rejectPayment = (studentId, data) => api.put(`/admin/student/${studentId}/reject-payment`, data);
export const exportStudents = (params) => api.get('/admin/students/export', { params, responseType: 'blob' });
