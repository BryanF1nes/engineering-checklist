import { ProjectCard } from './ProjectCard.js';

export class Sidebar {

    constructor(container, appController) {
        this.container = container;
        this.appController = appController;
    }

    render(projects, activeProject, user) {

        this.container.innerHTML = `
            <div class="sidebar-header">
                <div>
                    <p class="section-label">WORKSPACE</p>
                    <h6>My Projects</h6>
                </div>

                <button id="addProject" class="small-button">
                    +
                </button>
            </div>

            <div class="project-list">
                ${projects.map(project =>
            ProjectCard.render(project, activeProject)
        ).join('')}
            </div>
            <div class="sidebar-account">
                <div class="account-profile">
                    <div class="account-avatar">
                        ${user.username.charAt(0)}
                    </div>

                    <div class="account-details">
                        <span class="account-username">
                            ${user.username}
                        </span>

                        <span class="account-email">
                            ${user.email}
                        </span>
                    </div>
                </div>

                <button id="logoutButton" class="logout-button" type="button">
                    <span>↪</span>
                    Sign Out
                </button>
            </div>
            <div
                class="sidebar-resizer"
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize sidebar"
                tabindex="0"
            ></div>
        `;

        this.storageKey = `sidebar-width-${user.id ?? user.username}`;

        const savedWidth = localStorage.getItem(this.storageKey);

        if (savedWidth) {
            this.container.parentElement.style.setProperty(
                '--sidebar-width',
                `${savedWidth}px`
            );
        }

        this.bindEvents();
    }

    bindEvents() {
        this.container.querySelector('#addProject')
            .addEventListener('click', () => {
                this.appController.createProject();
            });

        this.container.querySelectorAll('.project-card')
            .forEach(card => {

                card.addEventListener('click', () => {
                    this.appController.selectProject(Number(card.dataset.id));
                });

            });

        this.container.querySelector('#logoutButton')
            .addEventListener('click', () => {
                this.appController.logout();
            });

        this.bindResizer();
    }

    bindResizer() {
        const resizer = this.container.querySelector('.sidebar-resizer');
        const appContainer = this.container.parentElement;

        let isResizing = false;

        resizer.addEventListener('pointerdown', event => {
            isResizing = true;

            resizer.setPointerCapture(event.pointerId);

            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        });

        resizer.addEventListener('pointermove', event => {
            if (!isResizing) return;

            const bounds = appContainer.getBoundingClientRect();

            const minWidth = 200;
            const maxWidth = 450;

            const width = Math.min(
                maxWidth,
                Math.max(minWidth, event.clientX - bounds.left)
            );

            appContainer.style.setProperty('--sidebar-width', `${width}px`);
        });

        const stopResizing = () => {
            if (!isResizing) return;

            isResizing = false;

            const width = appContainer.style.getPropertyValue('--sidebar-width');

            localStorage.setItem(this.storageKey, parseInt(width, 10));

            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };

        resizer.addEventListener('pointerup', stopResizing);
        resizer.addEventListener('pointercancel', stopResizing);
    }
}
