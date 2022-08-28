/**
 * @class
 * @classdesc Manage theme switching
 */
export default class ThemeSwitcher {

  #currentTheme;

  /**
   *
   * @param {string} switcherSelector - html selector for input (checkbox) switcher
   */
  constructor(switcherSelector) {
    this.switcherRef = document.querySelector(switcherSelector);
    this.switcherRef.addEventListener('change', this.toggleTheme.bind(this));
    if (localStorage.getItem('theme') === 'theme-dark') {
      this.setTheme('theme-dark');
      this.switcherRef.checked = false;
    } else {
      this.setTheme('theme-light');
      this.switcherRef.checked = true;
    }
  }

  /**
   * Switch to theme by name
   * @param {strint} themeName - Name of theme to switch to
   */
  setTheme(themeName) {
    this.#currentTheme = themeName;
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
  }

  /**
   * Toggle theme between 'theme-light' and 'theme-dark'
   */
  toggleTheme() {
    if (localStorage.getItem('theme') === 'theme-dark') {
      this.setTheme('theme-light');
    } else {
      this.setTheme('theme-dark');
    }
  }

  get theme() {
    return this.#currentTheme;
  }

  set theme(themename) {
    this.setTheme(themename);
  }
}
