import api from './api';

const adminService = {
    getDashboard: () => api.get('/admin/dashboard'),
    getVendors: () => api.get('/admin/vendors'),
    toggleVendorStatus: (vendorId, data) => api.patch(`/admin/vendors/${vendorId}/status`, data),
    getOrders: (params) => api.get('/admin/orders', { params }),
    getOrderDetails: (orderId) => api.get(`/admin/orders/${orderId}`),
    getPayments: () => api.get('/admin/payments'),
    emergencyCancelOrder: (orderId, data) => api.patch(`/admin/orders/${orderId}/cancel`, data),
    getUsers: () => api.get('/auth/users'), // auth controller endpoint for users
};

export default adminService;
