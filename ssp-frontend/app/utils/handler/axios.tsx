import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const AxiosInstance = axios.create({
    baseURL: baseUrl,
    timeout: 60000,
    headers: {
        accept: "application/json",
    },
});

export default AxiosInstance;