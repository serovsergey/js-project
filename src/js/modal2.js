export default class Modal {
  constructor(markup, options) {
    this.markup = markup;
    if (options.containerClass)
      this.containerClass = options.containerClass;
    console.log(this.containerClass)
  }

  #onBackdropClick(evt) {
    // if (evt.target.classList.contains('backdrop'))
    if (evt.target === evt.currentTarget)
      this.close();
  }

  show() {
    document.body.style.overflow = 'hidden';
    const markup = `
    <div class="backdrop is-hidden">
      <div class="modal-wrapper ${this.containerClass || ''}">
        <button class="modal__btn-close"></button>
        <div class="modal-content">
          ${this.markup}
        </div>
      </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', markup);
    const backdropRef = document.querySelector(".backdrop");
    // setTimeout(() => {
    backdropRef.classList.remove('is-hidden');
    // }, 0);
    const closeBtn = document.querySelector(".modal__btn-close");
    closeBtn.addEventListener('click', this.close);
    backdropRef.addEventListener('click', this.#onBackdropClick.bind(this));
  }

  close() {
    document.body.style.overflow = 'initial';
    const backdropRef = document.querySelector(".backdrop");
    backdropRef.classList.add('is-hidden');
    setTimeout(() => {
      backdropRef.remove();
    }, 500);
  }
}