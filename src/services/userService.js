import api from './api';

const userService = {
    getProfile: () => api.get('/user/profile'),
    getVendors: () => api.get('/user/vendors'),
    getVendorMenu: (vendorId) => api.get(`/user/vendors/${vendorId}/menu`),
    createOrder: (data) => api.post('/user/orders', data),
    createPayment: (data) => api.post('/user/payments/create', data),
    verifyPayment: (data) => api.post('/user/payments/verify', data),
    getOrders: (params) => api.get('/user/orders', { params }),
    getOrderDetails: (orderId) => api.get(`/user/orders/${orderId}`),
    getQrCode: (orderId) => api.get(`/user/orders/${orderId}/qr`),
    cancelOrder: (orderId) => api.post(`/user/orders/${orderId}/cancel`),
};

export default userService;
