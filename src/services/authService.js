import { apiRequest } from './api.js';

export async function register(name, email, password) {
    return apiRequest('/auth/register', {
        method: 'POST',
        body: {
            name,
            email,
            password,
        },
    });
}

export async function login(email, password) {
    return apiRequest('/auth/login', {
        method: 'POST',
        body: {
            email,
            password,
        },
    });
}

export async function getCurrentUser() {
    return apiRequest('/auth/me');
}

export async function logout() {
    return apiRequest('/auth/logout', {
        method: 'POST',
    });
}

