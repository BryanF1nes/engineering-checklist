export class ItemView {

    static render(item) {

        const completed = item.status === 'COMPLETED';

        return `

            <div
                class="checklist-item ${completed ? 'completed' : ''}"
                data-id="${item.id}"
            >

                <button class="item-checkbox">
                    ${completed ? '✓' : ''}
                </button>

                <div class="item-content">

                    <p class="item-name">
                        ${item.name}
                    </p>

                    <span class="item-date">
                        Created ${new Date(item.createdAt).toLocaleDateString()}
                    </span>

                </div>

                <div class="item-status">
                    ${item.status}
                </div>

            </div>

        `;
    }
}
