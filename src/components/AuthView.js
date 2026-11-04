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
        this.container.innerHTML = `
            <div class="auth-card">
                <h2>Create Account</h2>
                <p>Register to start managing your projects.</p>

                <form id="registerForm">
                    <div class="form-group">
                        <label for="registerUsername">Username</label>
                        <input
                            type="text"
                            id="registerUsername"
                            name="username"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label for="registerEmail">Email</label>
                        <input
                            type="email"
                            id="registerEmail"
                            name="email"
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
                            required
                        >
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

                this.appController.register(
                    formData.get('username'),
                    formData.get('email'),
                    formData.get('password')
                );
            });

        this.container.querySelector('#showLogin')
            .addEventListener('click', () => {
                this.renderLogin();
            });
    }
}

