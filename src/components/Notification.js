export class Notification {
    constructor(container) {
        if (!container) {
            throw new Error('Notification container not found.');
        }

        this.container = container;
    }

    show(message, type = 'info', duration = 4000) {
        const notification = document.createElement('div');

        notification.className = `notification notification-${type}`;

        const text = document.createElement('span');
        text.className = 'notification-message';
        text.textContent = message;

        const closeButton = document.createElement('button');
        closeButton.className = 'notification-close';
        closeButton.type = 'button';
        closeButton.setAttribute('aria-label', 'Dismiss notification');
        closeButton.textContent = '×';

        closeButton.addEventListener('click', () => {
            notification.remove();
        });

        notification.append(text, closeButton);
        this.container.appendChild(notification);

        if (duration > 0) {
            setTimeout(() => {
                notification.remove();
            }, duration);
        }
    }

    success(message, duration) {
        this.show(message, 'success', duration);
    }

    error(message, duration) {
        this.show(message, 'error', duration);
    }

    warning(message, duration) {
        this.show(message, 'warning', duration);
    }

    info(message, duration) {
        this.show(message, 'info', duration);
    }
}

