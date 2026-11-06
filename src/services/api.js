export const API_BASE_URL =
    window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://engineering-checklist-api.onrender.com';

let accessToken = null;
let refreshPromise = null;

export class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

export function setTokens(tokens) {
    accessToken = tokens.accessToken;
    sessionStorage.setItem('refreshToken', tokens.refreshToken);
}

export function clearTokens() {
    accessToken = null;
    sessionStorage.removeItem('refreshToken');
}

async function refreshAccessToken() {
    if (refreshPromise) {
        return refreshPromise;
    }

    refreshPromise = (async () => {
        const refreshToken = sessionStorage.getItem('refreshToken');

        if (!refreshToken) {
            clearTokens();
            return false;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
            });

            if (!response.ok) {
                clearTokens();
                return false;
            }

            const data = await response.json();

            setTokens(data);

            return true;
        } catch (error) {
            clearTokens();
            return false;
        }
    })();

    try {
        return await refreshPromise;
    } finally {
        refreshPromise = null;
    }
}

async function parseResponse(response) {
    if (response.status === 204) {
        return null;
    }

    const contentType = response.headers.get('content-type');

    return contentType?.includes('application/json')
        ? await response.json()
        : await response.text();
}

function createApiError(data, status) {
    const message =
        typeof data === 'object' && data !== null
            ? data.message || 'An API error occurred.'
            : data || 'An API error occurred.';

    return new ApiError(message, status);
}

export async function apiRequest(path, options = {}) {
    const { headers = {}, body, ...requestOptions } = options;

    const isAuthEndpoint = [
        '/auth/login',
        '/auth/register',
        '/auth/refresh',
        '/auth/logout',
    ].includes(path);

    // Restore an access token after a page refresh.
    if (!isAuthEndpoint && !accessToken) {
        await refreshAccessToken();
    }

    async function sendRequest() {
        const requestHeaders = { ...headers };

        if (accessToken && !isAuthEndpoint) {
            requestHeaders.Authorization = `Bearer ${accessToken}`;
        }

        const config = {
            ...requestOptions,
            credentials: 'omit',
            headers: requestHeaders,
        };

        if (body !== undefined) {
            if (body instanceof FormData) {
                config.body = body;
            } else {
                config.headers['Content-Type'] = 'application/json';
                config.body = JSON.stringify(body);
            }
        }

        return fetch(`${API_BASE_URL}${path}`, config);
    }

    let response = await sendRequest();

    // If the access token expired, refresh and retry once.
    if (response.status === 401 && !isAuthEndpoint) {
        const refreshed = await refreshAccessToken();

        if (refreshed) {
            response = await sendRequest();
        } else {
            clearTokens();
        }
    }

    const data = await parseResponse(response);

    if (!response.ok) {
        throw createApiError(data, response.status);
    }

    return data;
}

export function getAccessToken() {
    return accessToken;
}
