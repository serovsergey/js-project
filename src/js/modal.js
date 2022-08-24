import { API_KEY } from './api/movieApi';
const axios = require('axios').default;

const refs = {
  galleryLink: document.querySelectorAll('gallery-home'),
  btnModal: document.querySelector('modal__btn-close'),
  modal: document.querySelector('modal'),
  galleryHome: document.querySelector('gallery-home'),
};

refs.galleryLink[0].addEventListener('click', function () {});
refs.btnModal.addEventListener('click', closeModalGallery);
refs.modal.addEventListener('click', onClickModal);

function openModal() {
  refs.modal.classList.remove('modal--hidden');
  document.body.style.overflow = 'hidden';
  window.addEventListener('keydown', onEscKeyPress);
}
function closeModal() {
  refs.modal.classList.add('modal--hidden');
  document.body.style.overflow = '';
  window.removeEventListener('keydown', onEscKeyPress);
}

function onClickModal(event) {
  if (event.currentTarget === event.target) {
    closeModal();
    closeModalGallery();
  }
}

function closeModalGallery() {
  refs.modal.add('modal--hidden');
  document.body.style.overflow = '';
}

function onEscKeyPress(event) {
  if (event.code === 'Escape') {
    closeModal();
    closeModalGallery();
  }
}

