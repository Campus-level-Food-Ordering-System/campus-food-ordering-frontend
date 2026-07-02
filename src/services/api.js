import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Necessary to send/receive HttpOnly cookies
});

// Request interceptor to add the access token to the headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh on 401 errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error status is 401 and there is no originalRequest._retry flag,
        // it means the token has expired and we need to refresh it
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/signin')) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh the token using the refresh token stored in the HttpOnly cookie
                const response = await authService.refreshToken();
                const { accessToken } = response.data.data;
                
                // Store the new access token
                localStorage.setItem('accessToken', accessToken);

                // Update the Authorization header in the original request and retry it
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // If the refresh token is expired or invalid, log out the user
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
                sessionStorage.removeItem('user');
                window.location.href = '/signin';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
