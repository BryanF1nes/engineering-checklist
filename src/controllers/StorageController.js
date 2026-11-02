import Project from '../modules/Project.js';
import Item from '../modules/Item.js';

export class StorageController {
    static STORAGE_KEY = 'engineering-checklist-projects';
    static ACTIVE_PROJECT_KEY = 'engineering-checklist-active-project';

    saveProjects(projects) {
        try {
            localStorage.setItem(
                StorageController.STORAGE_KEY,
                JSON.stringify(projects)
            );

            return true;
        } catch (error) {
            console.error('Failed to save projects:', error);
            return false;
        }
    }

    loadProjects() {
        try {
            const savedProjects = localStorage.getItem(
                StorageController.STORAGE_KEY
            );

            if (!savedProjects) return [];

            const parsedProjects = JSON.parse(savedProjects);

            if (!Array.isArray(parsedProjects)) {
                throw new Error('Invalid saved project data.');
            }

            return parsedProjects.map(projectData => {
                const project = Object.assign(
                    new Project(projectData.name),
                    projectData
                );

                project.list = Array.isArray(projectData.list)
                    ? projectData.list.map(itemData =>
                        Object.assign(
                            new Item(itemData.name),
                            itemData
                        )
                    )
                    : [];

                return project;
            });

        } catch (error) {
            console.error('Failed to load projects:', error);
            return [];
        }
    }

    saveActiveProject(projectId) {
        try {
            if (projectId) {
                localStorage.setItem(
                    StorageController.ACTIVE_PROJECT_KEY,
                    projectId
                );
            } else {
                localStorage.removeItem(
                    StorageController.ACTIVE_PROJECT_KEY
                );
            }

            return true;
        } catch (error) {
            console.error('Failed to save active project:', error);
            return false;
        }
    }

    loadActiveProjectId() {
        return localStorage.getItem(
            StorageController.ACTIVE_PROJECT_KEY
        );
    }

    clearProjects() {
        localStorage.removeItem(StorageController.STORAGE_KEY);
        localStorage.removeItem(StorageController.ACTIVE_PROJECT_KEY);
    }
}
