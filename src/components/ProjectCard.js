export class ProjectCard {

    static render(project, activeProject) {

        const active = project.id === activeProject?.id;

        const completed = project.status === 'COMPLETED';

        return `
            <div
                class="project-card ${active ? 'active' : ''}"
                data-id="${project.id}"
            >

                <div class="project-card-icon">
                    ${completed ? '✓' : '▤'}
                </div>

                <div class="project-card-info">
                    <p class="project-name">
                        ${project.name}
                    </p>

                    <span class="project-status">
                        ${project.status}
                    </span>
                </div>

            </div>
        `;
    }
}
