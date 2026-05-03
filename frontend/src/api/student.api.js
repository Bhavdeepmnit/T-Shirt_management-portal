import api from './axios';

export const submitOrder = (data) => api.post('/student/order', data);
export const getFormStatus = () => api.get('/student/form-status');
export const checkExisting = (identifier) => api.get(`/student/check/${identifier}`);
export const getBranchAdmin = (branch) => api.get(`/student/branch-admin/${branch}`);
