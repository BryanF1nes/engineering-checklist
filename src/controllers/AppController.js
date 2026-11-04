import { Sidebar } from '../components/Sidebar.js';
import { ProjectView } from '../components/ProjectView.js';
import { ModalController } from '../components/ModalController.js';
import { AuthView } from '../components/AuthView.js';

import * as projectService from '../services/projectService.js';
import * as itemService from '../services/itemService.js';
import * as authService from '../services/authService.js';

export class AppController {

    constructor() {
        this.user = null;
        this.projects = [];
        this.activeProject = null;

        this.authContainer = document.querySelector('#authContainer');
        this.appContainer = document.querySelector('#appContainer');

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

        this.authView = new AuthView(
            this.authContainer,
            this
        );
    }

    async init() {
        try {
            const response = await authService.getCurrentUser();

            this.user = response.user;

            this.showApplication();

            await this.loadProjects();

        } catch (error) {
            if (error.status === 401) {
                this.showAuthentication();
                return;
            }

            console.error('Failed to initialize application:', error);

            alert('Unable to load the application. Please try again.');
        }
    }

    showAuthentication() {
        this.appContainer.hidden = true;
        this.authContainer.hidden = false;

        this.authView.renderLogin();
    }

    showApplication() {
        this.authContainer.hidden = true;
        this.appContainer.hidden = false;
    }

    async login(email, password) {
        try {
            const response = await authService.login(email, password);

            this.user = response.user;

            this.showApplication();

            await this.loadProjects();

        } catch (error) {
            console.error('Login failed:', error);
            alert(error.message || 'Unable to sign in.');
        }
    }

    async register(username, email, password) {
        try {
            await authService.register(username, email, password);

            // Registration does not automatically create a session,
            // so log the user in after successfully registering.
            await this.login(email, password);

        } catch (error) {
            console.error('Registration failed:', error);
            alert(error.message || 'Unable to create your account.');
        }
    }

    async logout() {
        try {
            await authService.logout();

            this.user = null;
            this.projects = [];
            this.activeProject = null;

            this.showAuthentication();

        } catch (error) {
            console.error('Logout failed:', error);
            alert('Unable to sign out. Please try again.');
        }
    }

    async loadProjects() {
        const response = await projectService.getProjects();

        this.projects = response.projects;

        if (this.projects.length === 0) {
            this.activeProject = null;
            this.render();
            return;
        }

        await this.selectProject(this.projects[0].id);
    }

    async loadProjectDetails(projectId) {
        const response = await projectService.getProject(projectId);

        this.activeProject = response.project;
    }

    render() {
        this.sidebar.render(
            this.projects,
            this.activeProject,
            this.user
        );

        this.projectView.render(this.activeProject);
    }

    // PROJECT OPERATIONS
    async createProject() {
        this.modal.openProject(async ({ name, status, stage }) => {
            name = name.trim();

            if (!name) return;

            try {
                const response = await projectService.createProject({
                    name,
                    status,
                    stage,
                });

                // Add the newly created project to the sidebar.
                this.projects.push(response.project);

                // Load its full details.
                await this.loadProjectDetails(response.project.id);

                this.render();

            } catch (error) {
                console.error('Failed to create project:', error);
                alert(error.message || 'Unable to create project.');
            }
        });
    }

    async editProject() {
        if (!this.activeProject) return;

        this.modal.openProject(async ({ name, status, stage }) => {
            name = name.trim();

            if (!name) return;

            try {
                await projectService.updateProject(
                    this.activeProject.id,
                    {
                        name,
                        status,
                        stage,
                    }
                );

                await this.loadProjectDetails(this.activeProject.id);

                // Update the sidebar's project information.
                const index = this.projects.findIndex(
                    project => project.id === this.activeProject.id
                );

                if (index !== -1) {
                    this.projects[index] = {
                        ...this.projects[index],
                        ...this.activeProject,
                    };
                }

                this.render();

            } catch (error) {
                console.error('Failed to update project:', error);
                alert(error.message || 'Unable to update project.');
            }
        }, this.activeProject);
    }

    async deleteProject(id) {
        const project = this.projects.find(
            project => project.id === Number(id)
        );

        if (!project) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete "${project.name}"? This will also delete all of its checklist items.`
        );

        if (!confirmed) return;

        try {
            await projectService.deleteProject(project.id);

            this.projects = this.projects.filter(
                existingProject => existingProject.id !== project.id
            );

            if (this.activeProject?.id === project.id) {
                this.activeProject = null;

                if (this.projects.length > 0) {
                    await this.selectProject(this.projects[0].id);
                    return;
                }
            }

            this.render();

        } catch (error) {
            console.error('Failed to delete project:', error);
            alert(error.message || 'Unable to delete project.');
        }
    }


    async selectProject(id) {
        try {
            await this.loadProjectDetails(id);
            this.render();

        } catch (error) {
            console.error('Failed to load project:', error);
            alert('Unable to load the selected project.');
        }
    }

    // CHECKLIST ITEM OPERATIONS
    async createItem() {
        if (!this.activeProject) return;

        this.modal.openItem(async ({ name }) => {
            name = name.trim();

            if (!name) return;

            try {
                await itemService.createProjectItem(
                    this.activeProject.id,
                    { name }
                );

                await this.loadProjectDetails(this.activeProject.id);

                this.render();

            } catch (error) {
                console.error('Failed to create checklist item:', error);
                alert(error.message || 'Unable to create checklist item.');
            }
        });
    }

    async editItem(id) {
        if (!this.activeProject) return;

        const item = this.activeProject.items.find(
            item => item.id === Number(id)
        );

        if (!item) return;

        this.modal.openItem(async ({ name }) => {
            name = name.trim();

            if (!name) return;

            try {
                await itemService.updateProjectItem(
                    this.activeProject.id,
                    item.id,
                    { name }
                );

                await this.loadProjectDetails(this.activeProject.id);

                this.render();

            } catch (error) {
                console.error('Failed to update checklist item:', error);
                alert(error.message || 'Unable to update checklist item.');
            }
        }, item);
    }

    async deleteItem(id) {
        if (!this.activeProject) return;

        const item = this.activeProject.items.find(
            item => item.id === Number(id)
        );

        if (!item) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete "${item.name}"?`
        );

        if (!confirmed) return;

        try {
            await itemService.deleteProjectItem(
                this.activeProject.id,
                item.id
            );

            await this.loadProjectDetails(this.activeProject.id);

            this.render();

        } catch (error) {
            console.error('Failed to delete checklist item:', error);
            alert(error.message || 'Unable to delete checklist item.');
        }
    }

    async toggleItem(id) {
        if (!this.activeProject) return;

        const item = this.activeProject.items.find(
            item => item.id === Number(id)
        );

        if (!item) return;

        const newStatus = item.status === 'COMPLETED'
            ? 'PENDING'
            : 'COMPLETED';

        try {
            await itemService.updateProjectItem(
                this.activeProject.id,
                item.id,
                { status: newStatus }
            );

            await this.loadProjectDetails(this.activeProject.id);

            this.render();

        } catch (error) {
            console.error('Failed to update checklist item status:', error);
            alert(error.message || 'Unable to update checklist item.');
        }
    }
}
