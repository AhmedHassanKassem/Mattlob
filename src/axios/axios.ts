import { removeCookie } from '../Utils/cookies';
import axios from 'axios';
import { getCookie } from '../Utils/cookies';

export const axiosInst = axios.create({
  baseURL: 'https://api.mattlob.com/',
  withCredentials: true,
});

let alreadyRedirected = false;


axiosInst.interceptors.request.use(
  (config) => {
    const token = getCookie('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
axiosInst.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const currentPath = window.location.pathname;

    if (status === 401 && !alreadyRedirected && !['/login', '/register' , '/verify' , '/forgotPassword' , '/resetPassword' ].includes(currentPath)) {
      alreadyRedirected = true;
      removeCookie('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
