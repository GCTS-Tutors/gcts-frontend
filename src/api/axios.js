// src/api/axios.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
// Axios instance to be reused throughout the app
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to include JWT token in requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor to refresh the JWT token if it expires
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Check if the error status is 401 and the request is not already retried
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');

                // If no refresh token is found, reject the request
                if (!refreshToken) {
                    return Promise.reject(error);
                }

                const response = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
                    refresh: refreshToken,
                });

                localStorage.setItem('token', response.data.access);
                localStorage.setItem('refreshToken', response.data.refresh);

                // Update the Authorization header for the original request
                originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;

                // Update the refresh token in the request data if it exists
                if (originalRequest.data) {
                    const requestData = JSON.parse(originalRequest.data);
                    if (requestData.refresh) {
                        requestData.refresh = response.data.refresh;
                        originalRequest.data = JSON.stringify(requestData);
                    }
                }

                return api(originalRequest);
            } catch (refreshError) {
                // If the refresh token request also results in a 401, handle the error
                if (refreshError.response && refreshError.response.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    // Optionally, redirect to login page
                    window.location.href = '/login';
                }

                return Promise.reject(refreshError);
            }
        }

        // In case of other errors, reject the error as is
        return Promise.reject(error);
    }
);

export default api;
