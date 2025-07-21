import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // lub sessionStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      //console.log('Authorization header set:', config.headers['Authorization']);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;