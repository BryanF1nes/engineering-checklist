
import Project from '../modules/Project.js';

export class ModalController {

    constructor(container) {
        this.container = container;
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    openProject(onSubmit) {

        const statuses = Object.values(Project.Status);
        const stages = Object.values(Project.Stage);

        const statusOptions = statuses.map(status => `
            <option value="${status}">
                ${status}
            </option>
        `).join('');

        const stageOptions = stages.map(stage => `
            <option value="${stage}">
                ${typeof stage === 'number' ? `${stage}%` : stage}
            </option>
        `).join('');

        this.open({
            title: 'Create New Project',
            description: 'Enter the details for your new project.',

            fields: `
                <div class="form-group">
                    <label for="projectName">Project Name</label>
                    <input
                        type="text"
                        id="projectName"
                        name="name"
                        placeholder="Enter project name..."
                        required
                        maxlength="100"
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

            submitLabel: 'Create Project',
            onSubmit
        });
    }

    openItem(onSubmit) {

        this.open({
            title: 'Create Checklist Item',
            description: 'Add a new task to your project.',

            fields: `
                <div class="form-group">
                    <label for="itemName">Task Name</label>
                    <input
                        type="text"
                        id="itemName"
                        name="name"
                        placeholder="Enter task name..."
                        required
                        maxlength="150"
                        autofocus
                    >
                </div>
            `,

            submitLabel: 'Create Task',
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

        // Close modal
        const closeButtons = this.container.querySelectorAll(
            '.modal-close, .cancel-button'
        );

        closeButtons.forEach(button => {
            button.addEventListener('click', () => this.close());
        });

        // Close when clicking outside the modal
        overlay.addEventListener('click', event => {
            if (event.target === overlay) {
                this.close();
            }
        });

        // Handle form submission
        form.addEventListener('submit', event => {
            event.preventDefault();

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            this.close();
            onSubmit(data);
        });

        // Close with Escape
        document.addEventListener('keydown', this.onKeyDown);

        // Focus first input
        modal.querySelector('input')?.focus();
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

