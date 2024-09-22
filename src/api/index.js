// src/api/index.js
import api from './axios';
import axios from 'axios';


// User Auth API Calls
export const registerUser = async (username, email, password) => {
    const response = await api.post('/users/', { username, email, password });
    return response.data;
};

export const loginUser = async (data) => {
    const response = await api.post('/auth/token/', data);
    // Set the JWT token in local storage
    localStorage.setItem('token', response.data.access);
    localStorage.setItem('refreshToken', response.data.refresh);
    return response.data;
};

export const logoutUser = async () => {
    // Get the jwt token and send it to the logout endpoint
    const refresh_token = localStorage.getItem('refreshToken');
    if (refresh_token) {
        const response = await api.post('/auth/logout/', {
            'refresh_token': refresh_token
        });
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        return response.data;
    }
};

export const getUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
        const response = await api.get('/users/me');
        return response.data;
    }
    return null;
};


// OTPs
export const generateOTP = async (email) => {
    const response = await api.post('/generate-otp/', { email });
    if (response.status === 200) {
        return (true, response.data);
    }
    return (false, response.data);
};

export const verifyOTP = async (email, otp) => {
    const response = await api.post('/verify-otp/', { email, otp });
    if (response.status === 200) {
        return (true, response.data);
    }
    return (false, response.data);
};


// Order calls
export const createOrder = async (data) => {
    const response = await api.post('/orders/', data);
    return response.data;
}

export const getOrders = async () => {
    const response = await api.get('/orders');
    return response.data;
}

export const getOrder = async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
}

export const updateOrder = async (id, data) => {
    const response = await api.patch(`/orders/${id}/`, data);
    return response.data;
}


// Order reviews
export const createOrderReview = async (data) => {
    const response = await api.post('/reviews/', data);
    return response.data;
}

export const getReviews = async () => {
    try {
        const response = await api.get('/reviews/?status=approved');
        if (response.data.length == 0) {
            return [{
                id: 1,
                review: "GCTS is simply the best. Helped me navigate my studies at a particularly difficult time.",
                created_at: "2024-08-01",
            }];
        }
        return response.data;
    } catch (error) {
        return [{
            id: 1,
            review: "GCTS is simply the best. Helped me navigate my studies at a particularly difficult time.",
            created_at: "2024-08-01",
        }];
    }
}


// Order comments
export const createOrderComment = async (data) => {
    const response = await api.post('/comments/', data);
    return response.data;
}

export const getOrderComments = async (order_id) => {
    const response = await api.get(`/comments/?order=${order_id}`);
    return response.data;
}

// Inquiries
export const createInquiry = async (data) => {
    const response = await api.post('/inquiries/', data);
    return response.data;
}

export const getInquiries = async () => {
    const response = await api.get('/inquiries/');
    return response.data;
}

// Papers
export const getPapers = async () => {
    const response = await api.get('/papers/');
    return response.data;
}

export const getPaper = async (id) => {
    const response = await api.get(`/papers/${id}`);
    return response.data;
}


// UserPapers
export const getUserPapers = async () => {
    const response = await api.get('/users/get_user_papers/');
    return response.data;
}
