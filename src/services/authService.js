import { apiRequest, setTokens, clearTokens } from './api.js';

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
    const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: {
            email,
            password,
        },
    });

    setTokens(data);

    return {
        message: data.message,
        user: data.user,
    };
}

export async function getCurrentUser() {
    return apiRequest('/auth/me');
}

export async function logout() {
    const refreshToken = sessionStorage.getItem('refreshToken');

    try {
        return await apiRequest('/auth/logout', {
            method: 'POST',
            body: { refreshToken },
        });
    } finally {
        clearTokens();
    }
}
