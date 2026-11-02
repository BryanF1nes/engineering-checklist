
export class ThemeController {

    constructor(button) {
        this.button = button;

        this.theme = localStorage.getItem('theme') ||
            (document.body.classList.contains('light') ? 'light' : 'dark');
    }

    init() {
        this.applyTheme();

        this.button.addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';

        this.applyTheme();
    }

    applyTheme() {
        document.body.classList.toggle(
            'light',
            this.theme === 'light'
        );

        this.button.textContent =
            this.theme === 'light' ? '☾' : '☀';

        this.button.setAttribute(
            'aria-label',
            `Switch to ${this.theme === 'light' ? 'dark' : 'light'} mode`
        );

        this.button.title =
            `Switch to ${this.theme === 'light' ? 'dark' : 'light'} mode`;

        localStorage.setItem('theme', this.theme);
    }
}

