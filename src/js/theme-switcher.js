export default class ThemeSwitcher {

  #currentTheme;

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

  setTheme(themeName) {
    this.#currentTheme = themeName;
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
  }

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

// function setTheme(themeName) {
//   localStorage.setItem('theme', themeName);
//   document.documentElement.className = themeName;
// }

// function toggleTheme() {
//   if (localStorage.getItem('theme') === 'theme-dark') {
//     setTheme('theme-light');
//   } else {
//     setTheme('theme-dark');
//   }
// }

// // (function () {
// const sliderRef = document.getElementById('slider');
// sliderRef.addEventListener('change', toggleTheme);
// if (localStorage.getItem('theme') === 'theme-dark') {
//   setTheme('theme-dark');
//   sliderRef.checked = false;
// } else {
//   setTheme('theme-light');
//   sliderRef.checked = true;
// }
// // })();

