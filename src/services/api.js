export const API_BASE_URL =
    window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://engineering-checklist-api.onrender.com';

export class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

export async function apiRequest(path, options = {}) {
    const { headers = {}, body, ...requestOptions } = options;

    const config = {
        ...requestOptions,
        credentials: 'include',
        headers: {
            ...headers,
        },
    };

    if (body !== undefined) {
        if (body instanceof FormData) {
            config.body = body;
        } else {
            config.headers['Content-Type'] = 'application/json';
            config.body = JSON.stringify(body);
        }
    }

    const response = await fetch(`${API_BASE_URL}${path}`, config);

    if (response.status === 204) {
        return null;
    }

    const contentType = response.headers.get('content-type');

    const data = contentType?.includes('application/json')
        ? await response.json()
        : await response.text();

    if (!response.ok) {
        const message =
            typeof data === 'object' && data !== null
                ? data.message || 'An API error occurred.'
                : data || 'An API error occurred.';

        throw new ApiError(message, response.status);
    }

    return data;
}

