export default class ModeController {
  constructor() {
    this.currentMode;
    this.modeButtonElement = document.querySelector('.button--mode');
    this.modeTextElement = this.modeButtonElement.querySelector('.button_text');

    this.modeButtonElement.addEventListener(
      'click',
      this.modeButtonHandler.bind(this)
    );
  }

  modeButtonHandler() {
    this.currentMode = document.documentElement.className;

    if (this.currentMode === 'dark_mode') {
      document.documentElement.className = 'light_mode';
      this.modeTextElement.innerText = 'Dark mode';
      localStorage.setItem('mode', 'light_mode');
    } else {
      document.documentElement.className = 'dark_mode';
      this.modeTextElement.innerText = 'Light mode';
      localStorage.setItem('mode', 'dark_mode');
    }
  }

  systemModeHandler() {
    const matchesDarkMode = window.matchMedia('(prefers-color-scheme: dark)')
      .matches;
    if (matchesDarkMode) {
      this.modeTextElement.innerText = 'Light mode';
      document.documentElement.className = 'dark_mode';
    } else {
      this.modeTextElement.innerText = 'Dark mode';
      document.documentElement.className = 'light_mode';
    }
  }

  storageModeHandler() {
    const storedMode = localStorage.getItem('mode');
    if (storedMode) {
      document.documentElement.className = `${storedMode}`;
      storedMode === 'light_mode'
        ? (this.modeTextElement.innerText = 'Dark mode')
        : (this.modeTextElement.innerText = 'Light mode');
    }
  }
}
