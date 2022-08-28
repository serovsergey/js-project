/**
 * @class Base clase for working with modal windows
 */
export default class BaseModal {
  /**
   * @constructor
   * @param {string} markup - modal windwow content html markup
   * @param {object} options - containerClass (string): class for modal window to style
   */
  constructor(markup, options = {}) {
    this.markup = markup;
    if (options.containerClass)
      this.containerClass = options.containerClass;
  }

  /**
   * Click Handler for backdrop (for closing modal)
   * @param {MouseEvent} evt - Event object
   */
  #onBackdropClick(evt) {
    if (evt.target === evt.currentTarget)
      this.close();
  }

  /**
   * keypress on window object (for closing modal)
   * @param {KeyboardEvent} evt - Event object
   */
  #onKeyPress = (evt) => {
    if (evt.key === "Escape")
      this.close();
  }

  /**
   * Shows modal window. Dynamically adds backdrop element at the end of html
   * (before closing body tag). Adds Event Listeners for closing window.
   */
  show() {
    document.body.style.overflow = 'hidden';
    const markup = `
    <div class="backdrop is-hidden">
      <div class="modal-wrapper ${this.containerClass || ''}">
        <button class="modal__btn-close"></button>
        <div class="modal-content modal-contentfoot">
          ${this.markup}
        </div>
      </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', markup);
    const backdropRef = document.querySelector(".backdrop");
    setTimeout(() => {
      backdropRef.classList.remove('is-hidden');
    }, 0);
    const closeBtn = document.querySelector(".modal__btn-close");
    closeBtn.addEventListener('click', this.close.bind(this));
    backdropRef.addEventListener('click', this.#onBackdropClick.bind(this));
    window.addEventListener('keydown', this.#onKeyPress);
  }

  /**
   * Closes modal window. Removes backdrop element from document flow.
   * Removes Event Listeners.
   */
  close() {
    window.removeEventListener('keydown', this.#onKeyPress);
    document.body.style.overflow = 'initial';
    const backdropRefs = document.querySelectorAll(".backdrop");
    backdropRefs.forEach((el) => el.classList.add('is-hidden'));
    setTimeout(() => {
      backdropRefs.forEach((el) => el.remove());
    }, 250);
  }
}