import { apiRequest } from './api.js';

export async function createInvitation(projectId, role) {
    return apiRequest(`/project/${projectId}/invitations`, {
        method: 'POST',
        body: { role },
    });
}

export async function getInvitations(projectId) {
    return apiRequest(`/project/${projectId}/invitations`);
}

export async function revokeInvitation(projectId, inviteId) {
    return apiRequest(`/project/${projectId}/invitations/${inviteId}`, {
        method: 'DELETE',
    });
}

export async function acceptInvitation(token) {
    return apiRequest(`/invitations/${encodeURIComponent(token)}/accept`, {
        method: 'POST',
    });
}
