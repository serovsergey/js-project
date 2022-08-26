export default class BaseModal {
  constructor(markup, options = {}) {
    this.markup = markup;
    if (options.containerClass)
      this.containerClass = options.containerClass;
  }

  #onBackdropClick(evt) {
    // if (evt.target.classList.contains('backdrop'))
    if (evt.target === evt.currentTarget)
      this.close();
  }

  onKeyPress = (evt) => {
    if (evt.key === "Escape")
      this.close();
  }

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
    closeBtn.addEventListener('click', this.close);
    backdropRef.addEventListener('click', this.#onBackdropClick.bind(this));
    window.addEventListener('keydown', this.onKeyPress);
  }

  close() {
    window.removeEventListener('keydown', this.onKeyPress);
    document.body.style.overflow = 'initial';
    const backdropRefs = document.querySelectorAll(".backdrop");
    backdropRefs.forEach((el) => el.classList.add('is-hidden'));
    setTimeout(() => {
      backdropRefs.forEach((el) => el.remove());
    }, 250);
  }
}