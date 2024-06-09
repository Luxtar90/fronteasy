import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://todo-app-backend-xi-pearl.vercel.app',
    headers: {
        'Content-Type': 'application/json'
    }
});

export default instance;
