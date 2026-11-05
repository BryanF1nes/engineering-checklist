import { ItemView } from './ItemView.js';

export class ProjectView {

    constructor(container, appController) {
        this.container = container;
        this.appController = appController;

        // Keep track of the currently selected checklist filter
        this.activeFilter = 'ALL';
    }

    render(project) {

        if (!project) {
            this.renderEmpty();
            return;
        }

        const items = project.items || [];

        const completed = items.filter(
            item => item.status === 'COMPLETED'
        ).length;

        const pending = items.length - completed;
        const total = items.length;

        const progress = total
            ? Math.round((completed / total) * 100)
            : 0;

        const stageLabels = {
            TEN: '10%',
            THIRTY: '30%',
            SIXTY: '60%',
            NINETY: '90%',
            BID: 'Bid',
            CONSTRUCTION: 'Construction',
        };

        const statusLabels = {
            ONGOING: 'On-Going',
            COMPLETED: 'Completed',
        };

        const stage = stageLabels[project.stage] || project.stage;
        const status = statusLabels[project.status] || project.status;

        const members = [
            {
                user: project.owner,
                role: 'OWNER',
            },
            ...(project.members || []).filter(
                member => member.user.id !== project.owner.id
            ),
        ];


        // Determine which items should be displayed
        const filteredItems = items.filter(item => {
            if (this.activeFilter === 'ONGOING') {
                return item.status === 'ONGOING';
            }

            if (this.activeFilter === 'COMPLETED') {
                return item.status === 'COMPLETED';
            }

            return true;
        });

        this.container.innerHTML = `

            <div class="project-header">

                <div>
                    <p class="section-label">PROJECT OVERVIEW</p>

                    <h3>${this.escapeHTML(project.name)}</h3>

                    <p class="project-description">
                        Created ${new Date(project.createdAt).toLocaleDateString()}
                    </p>
                </div>

                <div class="project-actions-container">
                    <div class="project-members" id="projectMembers" role="button" tabindex="0" aria-label="Manage project members">
                        ${members.map(member => `
                            <div
                                class="member-avatar"
                                style="background-color: ${this.getAvatarColor(member.user.id)}"
                                title="${this.escapeHTML(member.user.name)} (${member.role})"
                            >
                                ${this.escapeHTML(member.user.name.charAt(0).toUpperCase())}
                            </div>
                        `).join('')}
                        ${members.length > 4 ? `
                            <div class="member-avatar member-overflow">
                                +${members.length - 4}
                            </div>
                        ` : ''}
                    </div>

                    <div class="project-actions">
                        <button
                            id="editProject"
                            class="icon-button"
                            type="button"
                            aria-label="Edit project"
                            title="Edit project"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path d="M12 20h9"/>
                                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"/>
                            </svg>
                        </button>

                        <button
                            id="shareProject"
                            class="icon-button"
                            type="button"
                            aria-label="Share project"
                            title="Share project"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <circle cx="18" cy="5" r="3"/>
                                <circle cx="6" cy="12" r="3"/>
                                <circle cx="18" cy="19" r="3"/>
                                <path d="m8.7 10.7 6.6-3.4"/>
                                <path d="m8.7 13.3 6.6 3.4"/>
                            </svg>
                        </button>

                        <button
                            id="deleteProject"
                            class="icon-button danger"
                            type="button"
                            aria-label="Delete project"
                            title="Delete project"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path d="M3 6h18"/>
                                <path d="M8 6V4h8v2"/>
                                <path d="m19 6-1 14H6L5 6"/>
                                <path d="M10 11v5"/>
                                <path d="M14 11v5"/>
                            </svg>
                        </button>


                        <button id="addItem">
                            + Add Task
                        </button>

                    </div>

                </div>

            </div>

            <div class="project-details">

                <div class="detail-card">
                    <span class="detail-label">STATUS</span>
                    <h6>${this.escapeHTML(status)}</h6>
                </div>

                <div class="detail-card">
                    <span class="detail-label">PROJECT STAGE</span>
                    <h6>${this.escapeHTML(stage)}</h6>
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

                <div class="checklist-filters">

                    <button
                        type="button"
                        class="filter-button ${this.activeFilter === 'ALL' ? 'active' : ''}"
                        data-filter="ALL"
                    >
                        All
                        <span>${total}</span>
                    </button>

                    <button
                        type="button"
                        class="filter-button ${this.activeFilter === 'ONGOING' ? 'active' : ''}"
                        data-filter="ONGOING"
                    >
                        On going
                        <span>${pending}</span>
                    </button>

                    <button
                        type="button"
                        class="filter-button ${this.activeFilter === 'COMPLETED' ? 'active' : ''}"
                        data-filter="COMPLETED"
                    >
                        Completed
                        <span>${completed}</span>
                    </button>

                </div>

                <div class="checklist">

                    ${filteredItems.length
                ? filteredItems.map(item =>
                    ItemView.render(item)
                ).join('')
                : `
                                <div class="filter-empty-state">
                                    <p>
                                        ${total === 0
                    ? 'No tasks have been added yet.'
                    : `No ${this.activeFilter.toLowerCase()} tasks.`
                }
                                    </p>
                                </div>
                            `
            }

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

    bindEvents(project) {
        this.container.querySelector('#projectMembers')
            .addEventListener('click', () => {
                this.appController.manageMembers(project);
            });

        this.container.querySelector('#addItem')
            .addEventListener('click', () => {
                this.appController.createItem();
            });

        this.container.querySelector('#editProject')
            .addEventListener('click', () => {
                this.appController.editProject();
            });

        this.container.querySelector('#shareProject')
            .addEventListener('click', () => {
                this.appController.shareProject(project.id);
            });

        this.container.querySelector('#deleteProject')
            .addEventListener('click', () => {
                this.appController.deleteProject(project.id);
            });

        // Checklist filter buttons
        this.container.querySelectorAll('.filter-button')
            .forEach(button => {
                button.addEventListener('click', () => {
                    this.activeFilter = button.dataset.filter;
                    this.render(project);
                });
            });

        // Checklist item actions
        this.container.querySelectorAll('.checklist-item')
            .forEach(element => {

                const id = element.dataset.id;

                element.querySelector('.item-checkbox')
                    .addEventListener('click', () => {
                        this.appController.toggleItem(id);
                    });

                element.querySelector('.item-edit')
                    .addEventListener('click', () => {
                        this.appController.editItem(id);
                    });

                element.querySelector('.item-delete')
                    .addEventListener('click', () => {
                        this.appController.deleteItem(id);
                    });

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
}
