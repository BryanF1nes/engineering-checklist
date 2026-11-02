import { ProjectCard } from './ProjectCard.js';

export class Sidebar {

    constructor(container, appController) {
        this.container = container;
        this.appController = appController;
    }

    render(projects, activeProject) {

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
        `;

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
                    this.appController.selectProject(card.dataset.id);
                });

            });
    }
}
