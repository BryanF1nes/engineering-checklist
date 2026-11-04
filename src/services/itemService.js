import { apiRequest } from './api.js';

export async function getProjectItems(projectId) {
    return apiRequest(`/project/${projectId}/items`);
}

export async function getProjectItem(projectId, itemId) {
    return apiRequest(`/project/${projectId}/items/${itemId}`);
}

export async function createProjectItem(projectId, itemData) {
    return apiRequest(`/project/${projectId}/items`, {
        method: 'POST',
        body: itemData,
    });
}

export async function updateProjectItem(projectId, itemId, itemData) {
    return apiRequest(`/project/${projectId}/items/${itemId}`, {
        method: 'PATCH',
        body: itemData,
    });
}

export async function deleteProjectItem(projectId, itemId) {
    return apiRequest(`/project/${projectId}/items/${itemId}`, {
        method: 'DELETE',
    });
}
