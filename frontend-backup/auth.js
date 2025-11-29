import api from './api';

export const authService = {
    async register(userData) {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    async login(credentials) {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        return response.data;
    },

    logout() {
        localStorage.removeItem('token');
        window.location.href = '/login';
    },

    async getProfile() {
        const response = await api.get('/auth/profile');
        return response.data;
    },
};
