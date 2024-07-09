import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://todo-app-backend-xi-pearl.vercel.app/',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Agregar el token a todas las peticiones
instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default instance;
