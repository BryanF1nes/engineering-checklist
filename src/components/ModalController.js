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
                        value="${this.escapeHTML(project?.code || '')}"
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
                        value="${this.escapeHTML(item?.name || '')}"
                        placeholder="Enter task name..."
                        required
                        maxlength="150"
                        autofocus
                    >
                </div>
            `,

            submitLabel: isEditing ? 'Save Changes' : 'Create Task',
            onSubmit
        });
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
