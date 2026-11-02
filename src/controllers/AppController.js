import Project from '../modules/Project.js';

import { Sidebar } from '../components/Sidebar.js';
import { ProjectView } from '../components/ProjectView.js';
import { ModalController } from '../components/ModalController.js';

export class AppController {

    constructor() {

        this.projects = [];
        this.activeProject = null;

        this.modal = new ModalController(
            document.querySelector('#modalContainer')
        );

        this.sidebar = new Sidebar(
            document.querySelector('#sidebar'),
            this
        );

        this.projectView = new ProjectView(
            document.querySelector('#mainContent'),
            this
        );

    }

    init() {

        this.render();

    }

    render() {

        this.sidebar.render(
            this.projects,
            this.activeProject
        );

        this.projectView.render(this.activeProject);

    }

    createProject() {

        this.modal.openProject(({ name, status, stage }) => {

            const project = new Project(name.trim());

            project.updateStatus(status);

            project.updateStage(
                typeof stage === 'string' && !isNaN(stage)
                    ? Number(stage)
                    : stage
            );

            this.projects.push(project);
            this.activeProject = project;

            this.render();

        });

    }

    selectProject(id) {

        this.activeProject = this.projects.find(
            project => project.id === id
        );

        this.render();

    }

    createItem() {

        if (!this.activeProject) return;

        this.modal.openItem(({ name }) => {

            this.activeProject.createItem(name.trim());

            this.render();

        });

    }

    toggleItem(id) {

        const item = this.activeProject.list.find(
            item => item.id === id
        );

        if (!item) return;

        item.updateStatus();

        this.render();

    }
}
