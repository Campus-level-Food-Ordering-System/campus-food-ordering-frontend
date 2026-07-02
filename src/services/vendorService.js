import api from './api';

const vendorService = {
    getProfile: () => api.get('/vendor/profile'),
    getMenu: () => api.get('/vendor/menu'),
    addMenuItem: (data) => api.post('/vendor/menu', data),
    updateMenuItem: (itemId, data) => api.put(`/vendor/menu/${itemId}`, data),
    toggleAvailability: (itemId, data) => api.patch(`/vendor/menu/${itemId}/availability`, data),
    getOrders: (params) => api.get('/vendor/orders', { params }),
    updateOrderStatus: (orderId, data) => api.patch(`/vendor/orders/${orderId}/status`, data),
    scanQr: (data) => api.post('/vendor/orders/scan-qr', data),
    getAnalytics: () => api.get('/vendor/analytics'),
};

export default vendorService;
