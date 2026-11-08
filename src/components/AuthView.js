export class AuthView {
    constructor(container, appController) {
        this.container = container;
        this.appController = appController;
    }

    renderLogin() {
        this.container.innerHTML = `
            <div class="auth-card">
                <h2>Welcome Back</h2>
                <p>Sign in to access your projects.</p>

                <form id="loginForm">
                    <div class="form-group">
                        <label for="loginEmail">Email</label>
                        <input
                            type="email"
                            id="loginEmail"
                            name="email"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label for="loginPassword">Password</label>
                        <input
                            type="password"
                            id="loginPassword"
                            name="password"
                            required
                        >
                    </div>

                    <button type="submit" class="primary-button">
                        Sign In
                    </button>
                </form>

                <p class="auth-switch">
                    Don't have an account?
                    <button type="button" id="showRegister">
                        Register
                    </button>
                </p>
            </div>
        `;

        this.bindLoginEvents();
    }

    renderRegister() {
        const avatarColors = [
            '#4A80C5',
            '#8967B3',
            '#579B78',
            '#D58A4A',
            '#C76D83',
            '#429C9A',
            '#6976C5',
            '#D87562',
        ];

        this.container.innerHTML = `
        <div class="auth-card">
            <h2>Create Account</h2>
            <p>Register to start managing your projects.</p>

            <form id="registerForm">
                <div class="form-group">
                    <label for="registerFirstName">First Name</label>
                    <input
                        type="text"
                        id="registerFirstName"
                        name="firstName"
                        autocomplete="given-name"
                        required
                    >
                </div>

                <div class="form-group">
                    <label for="registerLastName">Last Name</label>
                    <input
                        type="text"
                        id="registerLastName"
                        name="lastName"
                        autocomplete="family-name"
                    >
                </div>

                <div class="form-group">
                    <label for="registerEmail">Email</label>
                    <input
                        type="email"
                        id="registerEmail"
                        name="email"
                        autocomplete="email"
                        required
                    >
                </div>

                <div class="form-group">
                    <label for="registerPassword">Password</label>
                    <input
                        type="password"
                        id="registerPassword"
                        name="password"
                        minlength="8"
                        autocomplete="new-password"
                        required
                    >
                </div>

                <div class="form-group">
                    <label for="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        minlength="8"
                        autocomplete="new-password"
                        required
                    >
                </div>

                <div class="form-group">
                    <label>Avatar Color</label>

                    <div class="avatar-color-picker">
                        ${avatarColors.map((color, index) => `
                            <label class="avatar-color-option">
                                <input
                                    type="radio"
                                    name="avatarColor"
                                    value="${color}"
                                    ${index === 0 ? 'checked' : ''}
                                    required
                                >
                                <span
                                    class="avatar-color-swatch"
                                    style="--avatar-color: ${color}"
                                ></span>
                            </label>
                        `).join('')}
                    </div>
                </div>

                <button type="submit" class="primary-button">
                    Create Account
                </button>
            </form>

            <p class="auth-switch">
                Already have an account?
                <button type="button" id="showLogin">
                    Sign In
                </button>
            </p>
        </div>
    `;

        this.bindRegisterEvents();
    }

    bindLoginEvents() {
        this.container.querySelector('#loginForm')
            .addEventListener('submit', (event) => {
                event.preventDefault();

                const formData = new FormData(event.currentTarget);

                this.appController.login(
                    formData.get('email'),
                    formData.get('password')
                );
            });

        this.container.querySelector('#showRegister')
            .addEventListener('click', () => {
                this.renderRegister();
            });
    }

    bindRegisterEvents() {
        this.container.querySelector('#registerForm')
            .addEventListener('submit', (event) => {
                event.preventDefault();

                const formData = new FormData(event.currentTarget);

                const password = formData.get('password');
                const confirmPassword = formData.get('confirmPassword');

                if (password !== confirmPassword) {
                    this.appController.notification.error(
                        'Passwords do not match.'
                    );
                    return;
                }

                this.appController.register(
                    formData.get('firstName'),
                    formData.get('lastName'),
                    formData.get('email'),
                    password,
                    formData.get('avatarColor')
                );
            });

        this.container.querySelector('#showLogin')
            .addEventListener('click', () => {
                this.renderLogin();
            });
    }
}
