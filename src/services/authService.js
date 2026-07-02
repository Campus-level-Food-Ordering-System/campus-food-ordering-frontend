import api from './api';

const authService = {
    signup: (data) => api.post('/auth/signup', data),
    signin: (data) => api.post('/auth/signin', data),
    verifyEmail: (data) => api.post('/auth/verify-email', data),
    resendVerificationCode: (data) => api.post('/auth/resend-verification-code', data),
    forgotPassword: (data) => api.post('/auth/forgot-password', data),
    resetPassword: (data) => api.post('/auth/reset-password', data),
    logout: () => api.post('/auth/logout'),
    refreshToken: () => api.post('/auth/refresh'),
    getProfile: () => api.get('/auth/me'),
};

export default authService;
