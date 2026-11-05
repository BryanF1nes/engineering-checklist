export class ModalController {

    constructor(container) {
        this.container = container;
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    openProject(onSubmit, project = null) {
        const statuses = [
            { value: 'ONGOING', label: 'On-Going' },
            { value: 'COMPLETED', label: 'Completed' },
        ];

        const stages = [
            { value: 'TEN', label: '10%' },
            { value: 'THIRTY', label: '30%' },
            { value: 'SIXTY', label: '60%' },
            { value: 'NINETY', label: '90%' },
            { value: 'BID', label: 'Bid' },
            { value: 'CONSTRUCTION', label: 'Construction' },
        ];

        const statusOptions = statuses.map(status => `
            <option
                value="${status.value}"
                ${project?.status === status.value ? 'selected' : ''}
            >
                ${status.label}
            </option>
        `).join('');

        const stageOptions = stages.map(stage => `
            <option
                value="${stage.value}"
                ${project?.stage === stage.value ? 'selected' : ''}
            >
                ${stage.label}
            </option>
        `).join('');

        const isEditing = Boolean(project);

        this.open({
            title: isEditing ? 'Edit Project' : 'Create New Project',

            description: isEditing
                ? 'Update your project details.'
                : 'Enter the details for your new project.',

            fields: `
                <div class="form-group">
                    <label for="projectName">Project Name</label>

                    <input
                        type="text"
                        id="projectName"
                        name="name"
                        value="${this.escapeHTML(project?.name || '')}"
                        placeholder="Enter project name..."
                        required
                        maxlength="100"
                        autofocus
                    >
                </div>

                <div class="form-group">
                    <label for="projectCode">Project Code</label>

                    <input
                        type="text"
                        id="projectCode"
                        name="code"
                        value="${this.escapeHTML(project?.projectCode || '')}"
                        placeholder="Enter project code..."
                        maxlength="10"
                        autofocus
                    >
                </div>

                <div class="form-group">
                    <label for="projectStatus">Project Status</label>

                    <select id="projectStatus" name="status">
                        ${statusOptions}
                    </select>
                </div>

                <div class="form-group">
                    <label for="projectStage">Project Stage</label>

                    <select id="projectStage" name="stage">
                        ${stageOptions}
                    </select>
                </div>
            `,

            submitLabel: isEditing ? 'Save Changes' : 'Create Project',
            onSubmit
        });
    }

    openItem(onSubmit, item = null) {

        const isEditing = Boolean(item);

        const dueDate = item?.dueDate ? new Date(item.dueDate).toISOString().split('T')[0] : '';

        this.open({
            title: isEditing
                ? 'Edit Checklist Item'
                : 'Create Checklist Item',

            description: isEditing
                ? 'Update the details of this task.'
                : 'Add a new task to your project.',

            fields: `
                <div class="form-group">
                    <label for="itemName">Task Name</label>

                    <input
                        type="text"
                        id="itemName"
                        name="name"
                        value="${this.escapeHTML(item?.title || '')}"
                        placeholder="Enter task name..."
                        required
                        maxlength="150"
                        autofocus
                    >
                </div>

                <div class="form-group">
                    <label for="itemDueDate">Expected Completion</label>

                    <input
                        type="date"
                        id="itemDueDate"
                        name="dueDate"
                        value="${dueDate}"
                    >
                </div>

                <div class="form-group">
                    <label for="itemEstimatedDuration">Estimated Duration (minutes)</label>

                    <input
                        type="number"
                        id="itemEstimatedDuration"
                        name="estimatedDuration"
                        value="${item?.estimatedDuration ?? ''}"
                        placeholder="e.g. 30"
                        min="1"
                    >
                </div>
            `,

            submitLabel: isEditing ? 'Save Changes' : 'Create Task',
            onSubmit
        });
    }

    openInvitation(onSubmit, project) {

        const roles = [
            {
                value: 'CONTRIBUTOR',
                label: 'Contributor',
                description: 'Can view the project and manage checklist items.',
            },
            {
                value: 'VIEWER',
                label: 'Viewer',
                description: 'Can view the project without making changes.',
            },
        ];

        const roleOptions = roles.map(role => `
        <option value="${role.value}">
            ${role.label}
        </option>
    `).join('');

        this.open({
            title: 'Share Project',

            description: `Invite someone to collaborate on ${this.escapeHTML(project.name)}.`,

            fields: `
            <div class="form-group">
                <label for="invitationRole">Access Level</label>

                <select id="invitationRole" name="role">
                    ${roleOptions}
                </select>
            </div>
        `,

            submitLabel: 'Generate Invitation',
            onSubmit
        });
    }

    openMembers(project, currentUserId, isOwner) {
        const members = [
            {
                user: project.owner,
                role: 'OWNER',
            },
            ...(project.members || []).filter(
                member => member.user.id !== project.owner.id
            ),
        ];

        const memberRows = members.map(member => {
            const isCurrentUser = member.user.id === currentUserId;
            const isProjectOwner = member.role === 'OWNER';

            return `
            <div class="member-row">
                <div class="member-info">
                    <div
                        class="member-avatar"
                        style="background-color: ${this.getAvatarColor(member.user.id)}"
                    >
                        ${this.escapeHTML(member.user.name.charAt(0).toUpperCase())}
                    </div>

                    <div class="member-details">
                        <p>${this.escapeHTML(member.user.name)}</p>
                        <span>${isCurrentUser ? 'You' : ''}</span>
                    </div>
                </div>

                <div class="member-controls">
                    ${isProjectOwner
                    ? '<span class="member-role">Owner</span>'
                    : isOwner
                        ? `
                            <button
                                type="button"
                                class="remove-member"
                                data-member-id="${member.user.id}"
                                aria-label="Remove ${this.escapeHTML(member.user.name)}"
                            >
                                Remove
                            </button>

                                <select
                                    class="member-role-select"
                                    data-member-id="${member.user.id}"
                                    aria-label="Role for ${this.escapeHTML(member.user.name)}"
                                >
                                    <option value="CONTRIBUTOR"
                                        ${member.role === 'CONTRIBUTOR' ? 'selected' : ''}
                                    >
                                        Contributor
                                    </option>
                                    <option value="VIEWER"
                                        ${member.role === 'VIEWER' ? 'selected' : ''}
                                    >
                                        Viewer
                                    </option>
                                </select>

                            `
                        : `<span class="member-role">${member.role}</span>`
                }
                </div>
            </div>
        `;
        }).join('');

        this.open({
            title: 'Project Members',
            description: `Manage members of ${this.escapeHTML(project.name)}.`,

            fields: `
            <div class="member-list">
                ${memberRows}
            </div>

            ${!isOwner ? `
                <div class="leave-project">
                    <button
                        type="button"
                        id="leaveProject"
                        class="remove-member"
                    >
                        Leave Project
                    </button>
                </div>
            ` : ''}
        `,

            submitLabel: 'Done',
            onSubmit: () => { },
        });
    }

    getAvatarColor(userId) {
        const colors = [
            '#647ACB',
            '#3D9970',
            '#D17B46',
            '#A16DB5',
            '#C45D75',
            '#368F9B',
            '#B18B3D',
        ];

        return colors[userId % colors.length];
    }

    showInvitation(invitation) {
        const url = this.escapeHTML(invitation.url);

        const expiresAt = new Date(
            invitation.expiresAt
        ).toLocaleDateString();

        this.container.innerHTML = `
        <div class="modal-overlay">
            <div
                class="modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modalTitle"
            >
                <div class="modal-header">
                    <div>
                        <h5 id="modalTitle">Invitation Created</h5>
                        <p>Your invitation is ready to share.</p>
                    </div>

                    <button
                        type="button"
                        class="modal-close"
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>

                <div class="modal-body">
                    <div class="form-group">
                        <label>Invitation Link</label>

                        <div class="invitation-code">
                            <code class="code">${url}</code>

                            <button
                                type="button"
                                id="copyInvitation"
                                class="button"
                            >
                                Copy
                            </button>
                        </div>
                    </div>

                    <p class="invitation-expiration">
                        Expires: ${expiresAt}
                    </p>
                </div>

                <div class="modal-footer">
                    <button
                        type="button"
                        class="cancel-button"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    `;

        this.container.querySelectorAll(
            '.modal-close, .cancel-button'
        ).forEach(button => {
            button.addEventListener('click', () => this.close());
        });

        this.container.querySelector('.modal-overlay')
            .addEventListener('click', event => {
                if (event.target === event.currentTarget) {
                    this.close();
                }
            });

        this.container.querySelector('#copyInvitation')
            .addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(invitation.url);

                    const button = this.container.querySelector('#copyInvitation');
                    button.textContent = 'Copied!';
                } catch (error) {
                    console.error('Failed to copy invitation:', error);
                    alert('Unable to copy invitation link.');
                }
            });

        document.addEventListener('keydown', this.onKeyDown);
    }

    open({ title, description, fields, submitLabel, onSubmit, onOpen }) {

        this.container.innerHTML = `
            <div class="modal-overlay">

                <div
                    class="modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modalTitle"
                >

                    <div class="modal-header">

                        <div>
                            <h5 id="modalTitle">${title}</h5>
                            <p>${description}</p>
                        </div>

                        <button
                            type="button"
                            class="modal-close"
                            aria-label="Close modal"
                        >
                            &times;
                        </button>

                    </div>

                    <form id="modalForm">

                        <div class="modal-body">
                            ${fields}
                        </div>

                        <div class="modal-footer">

                            <button
                                type="button"
                                class="cancel-button"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                class="submit-button"
                            >
                                ${submitLabel}
                            </button>

                        </div>

                    </form>

                </div>

            </div>
        `;

        const overlay = this.container.querySelector('.modal-overlay');
        const modal = this.container.querySelector('.modal');
        const form = this.container.querySelector('#modalForm');

        const closeButtons = this.container.querySelectorAll(
            '.modal-close, .cancel-button'
        );

        closeButtons.forEach(button => {
            button.addEventListener('click', () => this.close());
        });

        overlay.addEventListener('click', event => {
            if (event.target === overlay) {
                this.close();
            }
        });

        form.addEventListener('submit', event => {
            event.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            this.close();
            onSubmit(data);
        });

        document.addEventListener('keydown', this.onKeyDown);
        onOpen?.(modal);

        modal.querySelector('input')?.focus();
    }

    openMembers(project, currentUserId, {
        isOwner,
        getAvatarColor,
        onRoleChange,
        onRemove,
        onLeave,
    }) {
        const members = [
            {
                user: project.owner,
                role: 'OWNER',
            },
            ...(project.members || []).filter(
                member => member.user.id !== project.owner.id
            ),
        ];

        const memberRows = members.map(member => {
            const isProjectOwner = member.role === 'OWNER';
            const isCurrentUser = member.user.id === currentUserId;

            const initial = member.user.name
                .charAt(0)
                .toUpperCase();

            return `
            <div class="member-row">
                <div class="member-info">
                    <div
                        class="member-avatar"
                        style="background-color: ${getAvatarColor(member.user.id)}"
                    >
                        ${this.escapeHTML(initial)}
                    </div>

                    <div class="member-details">
                        <p>${this.escapeHTML(member.user.name)}</p>
                        ${isCurrentUser ? '<span>You</span>' : ''}
                    </div>
                </div>

                <div class="member-controls">
                    ${isProjectOwner
                    ? '<span class="member-role">Owner</span>'
                    : isOwner
                        ? `
                                    <select
                                        class="member-role-select"
                                        data-member-id="${member.user.id}"
                                        aria-label="Change role for ${this.escapeHTML(member.user.name)}"
                                    >
                                        <option
                                            value="CONTRIBUTOR"
                                            ${member.role === 'CONTRIBUTOR' ? 'selected' : ''}
                                        >
                                            Contributor
                                        </option>
                                        <option
                                            value="VIEWER"
                                            ${member.role === 'VIEWER' ? 'selected' : ''}
                                        >
                                            Viewer
                                        </option>
                                    </select>

                                    <button
                                        type="button"
                                        class="remove-member"
                                        data-member-id="${member.user.id}"
                                    >
                                        Remove
                                    </button>
                                `
                        : `<span class="member-role">${this.escapeHTML(member.role)}</span>`
                }
                </div>
            </div>
        `;
        }).join('');

        this.open({
            title: 'Project Members',
            description: 'View and manage the people who have access to this project.',
            fields: `
            <div class="member-list">
                ${memberRows}
            </div>

            ${!isOwner
                    ? `
                        <div class="leave-project">
                            <button
                                type="button"
                                id="leaveProject"
                                class="remove-member"
                            >
                                Leave Project
                            </button>
                        </div>
                    `
                    : ''
                }
        `,
            submitLabel: 'Done',
            onSubmit: () => { },
            onOpen: modal => {
                modal.querySelectorAll('.member-role-select').forEach(select => {
                    select.addEventListener('change', () => {
                        onRoleChange?.(
                            Number(select.dataset.memberId),
                            select.value
                        );
                    });
                });

                modal.querySelectorAll('.remove-member[data-member-id]').forEach(button => {
                    button.addEventListener('click', () => {
                        onRemove?.(Number(button.dataset.memberId));
                    });
                });

                modal.querySelector('#leaveProject')?.addEventListener('click', () => {
                    onLeave?.();
                });
            },
        });
    }

    escapeHTML(value) {
        return String(value)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    onKeyDown(event) {
        if (event.key === 'Escape') {
            this.close();
        }
    }

    close() {
        this.container.innerHTML = '';
        document.removeEventListener('keydown', this.onKeyDown);
    }
}
