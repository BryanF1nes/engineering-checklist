import Project from '../modules/Project.js';

import { Sidebar } from '../components/Sidebar.js';
import { ProjectView } from '../components/ProjectView.js';
import { ModalController } from '../components/ModalController.js';

import { StorageController } from './StorageController.js';

export class AppController {

    constructor() {
        this.projects = [];
        this.activeProject = null;

        this.storage = new StorageController();

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
        this.projects = this.storage.loadProjects();

        const activeProjectId = this.storage.loadActiveProjectId();

        this.activeProject = this.projects.find(
            project => project.id === activeProjectId
        ) || this.projects[0] || null;

        this.storage.saveActiveProject(this.activeProject?.id);

        this.render();
    }

    render() {
        this.sidebar.render(
            this.projects,
            this.activeProject
        );

        this.projectView.render(this.activeProject);
    }

    save() {
        const projectsSaved = this.storage.saveProjects(
            this.projects
        );

        const activeProjectSaved = this.storage.saveActiveProject(
            this.activeProject?.id
        );

        return projectsSaved && activeProjectSaved;
    }

    // PROJECT OPERATIONS

    createProject() {
        this.modal.openProject(({ name, status, stage }) => {
            name = name.trim();

            if (!name) return;

            const project = new Project(name);

            project.updateStatus(status);
            project.updateStage(this.normalizeStage(stage));

            this.projects.push(project);
            this.activeProject = project;

            this.save();
            this.render();
        });
    }

    editProject() {
        if (!this.activeProject) return;

        this.modal.openProject(({ name, status, stage }) => {
            name = name.trim();

            if (!name) return;

            this.activeProject.renameProject(name);
            this.activeProject.updateStatus(status);
            this.activeProject.updateStage(this.normalizeStage(stage));

            this.save();
            this.render();

        }, this.activeProject);
    }

    deleteProject(id) {
        const project = this.projects.find(
            project => project.id === id
        );

        if (!project) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete "${project.name}"? This will also delete all of its checklist items.`
        );

        if (!confirmed) return;

        this.projects = this.projects.filter(
            project => project.id !== id
        );

        if (this.activeProject?.id === id) {
            this.activeProject = this.projects[0] || null;
        }

        this.save();
        this.render();
    }

    selectProject(id) {
        this.activeProject = this.projects.find(
            project => project.id === id
        ) || null;

        this.save();
        this.render();
    }

    // CHECKLIST ITEM OPERATIONS

    createItem() {
        if (!this.activeProject) return;

        this.modal.openItem(({ name }) => {
            name = name.trim();

            if (!name) return;

            this.activeProject.createItem(name);

            this.save();
            this.render();
        });
    }

    editItem(id) {
        if (!this.activeProject) return;

        const item = this.activeProject.list.find(
            item => item.id === id
        );

        if (!item) return;

        this.modal.openItem(({ name }) => {
            name = name.trim();

            if (!name) return;

            item.updateName(name);

            this.save();
            this.render();

        }, item);
    }

    deleteItem(id) {
        if (!this.activeProject) return;

        const item = this.activeProject.list.find(
            item => item.id === id
        );

        if (!item) return;

        const confirmed = window.confirm(
            `Are you sure you want to delete "${item.name}"?`
        );

        if (!confirmed) return;

        this.activeProject.deleteItem(id);

        this.save();
        this.render();
    }

    toggleItem(id) {
        if (!this.activeProject) return;

        const item = this.activeProject.list.find(
            item => item.id === id
        );

        if (!item) return;

        item.updateStatus();

        this.save();
        this.render();
    }

    // HELPERS

    normalizeStage(stage) {
        return typeof stage === 'string' && !isNaN(stage)
            ? Number(stage)
            : stage;
    }
}
