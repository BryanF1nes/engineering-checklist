import { ItemView } from './ItemView.js';

export class ProjectView {

    constructor(container, appController) {
        this.container = container;
        this.appController = appController;
    }

    render(project) {

        if (!project) {
            this.renderEmpty();
            return;
        }

        const completed = project.list.filter(
            item => item.status === 'COMPLETED'
        ).length;

        const total = project.list.length;

        const progress = total
            ? Math.round((completed / total) * 100)
            : 0;

        this.container.innerHTML = `

            <div class="project-header">

                <div>
                    <p class="section-label">PROJECT OVERVIEW</p>

                    <h3>${project.name}</h3>

                    <p class="project-description">
                        Created ${new Date(project.createdAt).toLocaleDateString()}
                    </p>
                </div>

                <div class="project-actions">
                    <button id="addItem">
                        + Add Task
                    </button>
                </div>

            </div>

            <div class="project-details">

                <div class="detail-card">
                    <span class="detail-label">STATUS</span>
                    <h6>${project.status}</h6>
                </div>

                <div class="detail-card">
                    <span class="detail-label">PROJECT STAGE</span>
                    <h6>${project.stage}%</h6>
                </div>

                <div class="detail-card">
                    <span class="detail-label">TASKS COMPLETED</span>
                    <h6>${completed} / ${total}</h6>
                </div>

            </div>

            <div class="progress-section">

                <div class="progress-header">
                    <p>Project Progress</p>
                    <span>${progress}%</span>
                </div>

                <div class="progress-track">
                    <div
                        class="progress-fill"
                        style="width: ${progress}%"
                    ></div>
                </div>

            </div>

            <div class="checklist-section">

                <div class="checklist-header">
                    <h5>Project Checklist</h5>
                    <span>${total} Tasks</span>
                </div>

                <div class="checklist">

                    ${project.list.map(item =>
            ItemView.render(item)
        ).join('')}

                </div>

            </div>
        `;

        this.bindEvents(project);
    }

    renderEmpty() {

        this.container.innerHTML = `
            <div class="empty-state">

                <h4>Welcome to your workspace</h4>

                <p>
                    Select a project from the sidebar
                    or create a new project to get started.
                </p>

            </div>
        `;
    }

    bindEvents(project) {

        this.container.querySelector('#addItem')
            .addEventListener('click', () => {
                this.appController.createItem();
            });

        this.container.querySelectorAll('.checklist-item')
            .forEach(element => {

                element.querySelector('.item-checkbox')
                    .addEventListener('click', () => {

                        this.appController.toggleItem(
                            element.dataset.id
                        );

                    });

            });
    }
}
