export class ItemView {

    static render(item) {

        const completed = item.status === 'COMPLETED';
        const status = item.status === 'COMPLETED'
            ? 'Completed'
            : 'On going';

        const createdAt = new Date(item.createdAt).toLocaleDateString();

        const title = String(item.title)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');

        return `

            <div
                class="checklist-item ${completed ? 'completed' : ''}"
                data-id="${item.id}"
            >

                <button
                    type="button"
                    class="item-checkbox"
                    aria-label="${completed ? 'Mark incomplete' : 'Mark complete'}"
                >
                    ${completed ? '✓' : ''}
                </button>

                <div class="item-content">

                    <p class="item-name">
                        ${title}
                    </p>

                    <span class="item-date">
                        Created ${createdAt}
                    </span>

                </div>

                <div class="item-status">
                    ${status}
                </div>

                <div class="item-actions">

                    <button
                        id="editItem"
                        class="icon-button item-edit"
                        type="button"
                        aria-label="Edit task"
                        title="Edit task"
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
                        class="icon-button danger item-delete"
                        type="button"
                        aria-label="Delete task"
                        title="Delete task"
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

                </div>

            </div>

        `;
    }
}
