import { apiRequest } from './api.js';

export async function getProjects() {
    return apiRequest('/project');
}

export async function getProject(projectId) {
    return apiRequest(`/project/${projectId}`);
}

export async function createProject(projectData) {
    return apiRequest('/project', {
        method: 'POST',
        body: projectData,
    });
}

export async function updateProject(projectId, projectData) {
    return apiRequest(`/project/${projectId}`, {
        method: 'PATCH',
        body: projectData,
    });
}

export async function deleteProject(projectId) {
    return apiRequest(`/project/${projectId}`, {
        method: 'DELETE',
    });
}
