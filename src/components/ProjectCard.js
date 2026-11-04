
export class ProjectCard {

    static render(project, activeProject) {

        const active = project.id === activeProject?.id;

        const statusLabels = {
            ONGOING: 'On-Going',
            COMPLETED: 'Completed',
        };

        const status = statusLabels[project.status] || project.status;

        const name = String(project.name)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');

        return `
            <div
                class="project-card ${active ? 'active' : ''}"
                data-id="${project.id}"
            >
                <div class="project-card-info">
                    <p class="project-name">
                        ${name}
                    </p>
                    <span class="project-status">
                        ${status}
                    </span>
                </div>
            </div>
        `;
    }
}

