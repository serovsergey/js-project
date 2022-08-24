import { API_KEY } from './api/movieApi';
const axios = require('axios').default;
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  // galleryLink: document.querySelectorAll('.gallery__link'),
  btnModal: document.querySelector('.modal__btn-close'),
  modal: document.querySelector('.modal2'),
  galleryHome: document.querySelector('.gallery-home'),
  loader: document.querySelector('.loader'),
};

// refs.galleryLink.addEventListener[0]('click', function () {});
refs.btnModal.addEventListener('click', closeModalGallery);
refs.modal.addEventListener('click', onClickModal);

function openModal() {
  refs.modal.classList.remove('is-hidden');
  document.body.style.overflow = 'hidden';
  window.addEventListener('keydown', onEscKeyPress);
}
function closeModal() {
  refs.modal.classList.add('is-hidden');
  document.body.style.overflow = '';
  window.removeEventListener('keydown', onEscKeyPress);
}

function onClickModal(event) {
  if (event.currentTarget === event.target) {
    // closeModal();
    closeModalGallery();
  }
}

function closeModalGallery() {
  refs.modal.classList.add('is-hidden');
  document.body.style.overflow = 'initial';
}

function onEscKeyPress(event) {
  if (event.code === 'Escape') {
    // closeModal();
    closeModalGallery();
  }
}

function hidePreloader() {
  refs.loader.classList.add('is-hidden');
}
function showPreloader() {
  refs.loader.classList.remove('is-hidden');
}

const movieId = currentTarget.closest('.gallery__item').dataset.id;

function getMovieById(id) {
  return axios.get(`https:// .....`);
}
 


function createObject(obj = {}) {
  const { id, genres, title, name, release_date } = obj;
  const movieId = id;
  const movie = new Movie(obj);

  document
    .querySelector('.modal__button--watched')
    .addEventListener('click', addToWatch);
  document
    .querySelector('.modal__button--queued')
    .addEventListener('click', addToQueue);

  function addToWatch() {
    showPreloader();
    movie.addToWatch();
    document.querySelector('.modal__button--watched').textContent =
      'remove from watched';
    document
      .querySelector('.modal__button--watched')
      .removeEventListener('click', addToWatch);
    document
      .querySelector('.modal__button--watched')
      .addEventListener('click', removeMovieFromWatched);
    Notify.success('Added to watch', {
      timeout: 500,
    });
    setTimeout(() => {
      hidePreloader();
    }, 200);
  }

  function addToQueue() {
    showPreloader();
    movie.addToQueue();
    document.querySelector('.modal__button--queued').textContent =
      'Remove from queue';
    document
      .querySelector('.modal__button--queued')
      .removeEventListener('click', addToQueue);
    document
      .querySelector('.modal__button--queued')
      .addEventListener('click', removeMovieFromQueued);
    Notify.success('Added to queue', {
      timeout: 500,
    });
    setTimeout(() => {
      hidePreloader();
    }, 200);
  }

  function removeMovieFromWatched() {
    showPreloader();
    movie.removeFromStorage(movieId, 'watchedMovies');
    document
      .querySelector('.modal__button--watched')
      .removeEventListener('click', removeMovieFromWatched);
    document
      .querySelector('.modal__button--watched')
      .addEventListener('click', addToWatch);
    document.querySelector('.modal__button--watched').textContent =
      'add to Watched';
    Notify.success('Removed from watched', {
      timeout: 500,
    });
    setTimeout(() => {
      hidePreloader();
    }, 200);
    movie.removeItemFromGallery('gallery__item', movieId);
    if (currentLocation === './library.html') {
      getFromWatched();
    }
  }

  function removeMovieFromQueued() {
    showPreloader();
    movie.removeFromStorage(movieId, 'queuedMovies');

    document
      .querySelector('.modal__button--queued')
      .removeEventListener('click', removeMovieFromQueued);
    document
      .querySelector('.modal__button--queued')
      .addEventListener('click', addToQueue);
    document.querySelector('.modal__button--queued').textContent =
      'add to queue';
    Notify.success('Removed from queued', {
      timeout: 500,
    });
    setTimeout(() => {
      hidePreloader();
    }, 200);
  }

  if (movie.inWatched(movieId)) {
    document.querySelector('.modal__button--watched').textContent =
      'remove from watched';
    document
      .querySelector('.modal__button--watched')
      .removeEventListener('click', addToWatch);
    document
      .querySelector('.modal__button--watched')
      .addEventListener('click', removeMovieFromWatched);
  }

  if (movie.inQueued(movieId)) {
    document.querySelector('.modal__button--queued').textContent =
      'remove from queue';

    document
      .querySelector('.modal__button--queued')
      .removeEventListener('click', addToQueue);
    document
      .querySelector('.modal__button--queued')
      .addEventListener('click', removeMovieFromQueued);
  }
}
class Movie {
  constructor({ id, genres, title, name, release_date } = {}) {
    this.id = id;
    this.genres = genres;
    this.title = title;
    this.name = name;
    this.release_date = release_date;
  }

  addToWatch() {
    let movies = [];
    movies = JSON.parse(localStorage.getItem('watchedMovies')) || [];
    movies.push(this);
    localStorage.setItem('watchedMovies', JSON.stringify(movies.reverse()));
  }

  addToQueue() {
    let movies = [];
    movies = JSON.parse(localStorage.getItem('queuedMovies')) || [];
    movies.push(this);
    localStorage.setItem('queuedMovies', JSON.stringify(movies.reverse()));
  }

  inWatched(movieId) {
    try {
      if (
        JSON.parse(localStorage.getItem('watchedMovies')).find(
          item => item.id === movieId
        )
      ) {
        return true;
      }
    } catch (error) {
      console.log(error);
    }
  }

  inQueued(movieId) {
    try {
      if (
        JSON.parse(localStorage.getItem('queuedMovies')).find(
          item => item.id === movieId
        )
      ) {
        return true;
      }
    } catch (error) {
      console.log(error);
    }
  }

  removeFromStorage(movieId, storageName) {
    let movies = JSON.parse(localStorage.getItem(storageName));
    let i = movies.findIndex(movie => movie.id === movieId);
    if (i !== -1) {
      movies.splice(i, 1);
      localStorage.setItem(`${storageName}`, JSON.stringify(movies));
    }
  }

  removeItemFromGallery(id) {
    let item = document.querySelector(`li[data-id='${id}']`);
    item.remove();
  }
}
