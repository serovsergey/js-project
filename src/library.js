import ThemeSwitcher from './js/theme-switcher';
import StorageListApi from './js/api/storageListApi';
import MovieApi from "./js/api/movieApi";
import makePagination from "./js/pagination";
import cardsHbs from './templates/cards.hbs';

const LIBRARY_MODE_KEY = 'library_mode';
const WATCHED_PAGE_KEY = 'watched_page';
const QUEUE_PAGE_KEY = 'queue_page';
const WATCHED = 'watched';
const QUEUE = 'queue';

const ts = new ThemeSwitcher('#slider');

document.querySelectorAll(".modal").forEach(el => el.style.display = 'none');

const queueList = new StorageListApi('queue');
const watchedList = new StorageListApi('watch');

const refs = {
  watchedBtn: document.querySelector('[data-action="watched"]'),
  queueBtn: document.querySelector('[data-action="queue"]'),
  cardsUl: document.querySelector(".gallery__list"),
  pagination: document.querySelector(".gallery__pagination"),
}

refs.watchedBtn.closest('UL').addEventListener('click', evt => {
  const el = evt.target;
  const action = el.dataset.action;
  if (action)
    updateBtnsState(action);
});

refs.cardsUl.addEventListener('click', evt => {
  evt.preventDefault();
  const card = evt.target.closest('LI');
  if (!card)
    return;
  if (queueList.inList(card.dataset.id))
    queueList.removeFromList(card.dataset.id);
  gotoPage(queueList.page);
})

refs.pagination.addEventListener('click', async evt => {
  if (evt.target.classList.contains('gallery__pag-button--current')) {
    if (evt.target.dataset.pages === "1") return;
    const formMarkup = `<form style=""><input type="number" name="page" max="${evt.target.dataset.pages}" min="1" value="${evt.target.textContent}" style="width:100%; height:100%"></form>`;
    evt.target.innerHTML = formMarkup;
    const form = evt.target.querySelector("form");
    form.elements.page.focus();
    form.addEventListener('submit', async e => {
      e.preventDefault();
      gotoPage(e.target.elements.page.value);
      evt.target.textContent = evt.target.dataset.curpage;
    }, { once: true })
    form.elements.page.addEventListener('blur', e => {
      form.remove();
      evt.target.textContent = evt.target.dataset.curpage;
    }, { once: true })
    return;
  }
  const page = evt.target.dataset.page;
  if (page) {
    gotoPage(page);
  }
});

let gMode = sessionStorage.getItem(LIBRARY_MODE_KEY);
if (!gMode) gMode = WATCHED;
updateBtnsState(gMode);

function updateBtnsState(mode) {
  gMode = mode;
  sessionStorage.setItem(LIBRARY_MODE_KEY, mode);
  let page;
  switch (mode) {
    case (WATCHED):
      refs.watchedBtn.classList.add('is-active');
      refs.queueBtn.classList.remove('is-active');
      page = sessionStorage.getItem(WATCHED_PAGE_KEY) || 1;
      break;
    case (QUEUE):
      refs.watchedBtn.classList.remove('is-active');
      refs.queueBtn.classList.add('is-active');
      page = sessionStorage.getItem(QUEUE_PAGE_KEY) || 1;
      break;
    default: return;
  }
  gotoPage(page);
}

function renderCards(data) {
  refs.cardsUl.innerHTML = data
    ? cardsHbs({ results: data.results, base_path: MovieApi.IMAGES_BASE_URL, showRating: 1 })
    : `<li class="gallery__no-entries">There are no entries in the ${gMode} list yet</li>`; //makeCardsMarkup(data);
  refs.pagination.innerHTML = data ? makePagination(data) : '';
}

function gotoPage(page) {
  let data;
  switch (gMode) {
    case WATCHED:
      data = watchedList.fetchNext(page);
      if (data)
        sessionStorage.setItem(WATCHED_PAGE_KEY, data.page);
      break;
    case QUEUE:
      data = queueList.fetchNext(page);
      if (data)
        sessionStorage.setItem(QUEUE_PAGE_KEY, data.page);
      break;
    default: return;
  }
  renderCards(data);
}