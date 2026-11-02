import "./styles.css";

import { AppController } from './controllers/AppController.js';
import { ThemeController } from './components/ThemeController.js';

const app = new AppController();
app.init();

const themeController = new ThemeController(
    document.querySelector('#themeToggle')
);

themeController.init();
