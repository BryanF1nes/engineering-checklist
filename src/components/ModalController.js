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

    open({ title, description, fields, submitLabel, onSubmit }) {

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

        modal.querySelector('input')?.focus();
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
