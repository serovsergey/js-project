import throttle from "lodash.throttle";

import ThemeSwitcher from "./js/theme-switcher";
import MovieApi from "./js/api/movieApi";
import makePagination from "./js/pagination";
import makeCardsMarkup from "./js/makeCardsMarkup";

const TRENDING_PAGE_KEY = 'trending_current_page';
const SEARCH_PAGE_KEY = 'search_current_page';
const SEARCH_QUERY_KEY = 'search_query';
const THROTTLE_DELAY = 250;

const ts = new ThemeSwitcher('#slider');
const mApi = new MovieApi();

document.querySelectorAll(".modal").forEach(el => el.style.display = 'none');

const refs = {
  cardsUl: document.querySelector(".gallery__list"),
  pagination: document.querySelector(".gallery__pagination"),
  header: document.querySelector("header"),
  footer: document.querySelector("footer"),
  main: document.querySelector("main"),
  searchForm: document.querySelector(".hero-home__form"),
  loader: document.querySelector(".loader"),
}

const clearFailMessage = throttle(() => {
  const ref = document.querySelector(".search-fail");
  if (ref) {
    ref.remove();
    refs.searchForm.removeEventListener('input', clearFailMessage);
  }
}, THROTTLE_DELAY);

refs.cardsUl.addEventListener('click', evt => {
  evt.preventDefault();
  const card = evt.target.closest('LI');
  if (!card)
    return;

  console.log(mApi.getCachedMovieById(card.dataset.id));
})

refs.searchForm.addEventListener('submit', async evt => {
  evt.preventDefault();
  const oldFailRef = document.querySelector(".search-fail");
  if (oldFailRef)
    oldFailRef.remove();
  const searchQuery = evt.target.elements.searchQuery.value.trim().toLowerCase();
  if (!searchQuery) return;
  evt.target.elements.searchQuery.value = searchQuery;
  // refs.cardsUl.innerHTML = '';
  refs.loader.classList.remove('is-hidden');
  let data;
  try {
    data = await mApi.fetchNextSearch(searchQuery);
    sessionStorage.setItem(SEARCH_PAGE_KEY, 1)
  }
  catch (e) {
    console.error(e.message);
    return;
  } finally {
    refs.loader.classList.add('is-hidden');
  }

  if (!data.data.results.length) {
    const failRef = document.createElement('DIV');
    failRef.textContent = "Search result not successful. Enter the correct movie name and try again.";
    failRef.classList.add('search-fail');
    evt.target.appendChild(failRef);
    refs.searchForm.addEventListener('input', clearFailMessage);
    return;
  }
  sessionStorage.setItem(SEARCH_QUERY_KEY, searchQuery);
  renderCards(data, await mApi.getCachedGenres());
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

function renderCards(data, genresList) {
  refs.cardsUl.innerHTML = makeCardsMarkup(data, genresList);
  refs.pagination.innerHTML = makePagination(data);
}

async function gotoPage(page) {
  let data;
  const oldFailRef = document.querySelector(".search-fail");
  if (oldFailRef)
    oldFailRef.remove();
  const q = sessionStorage.getItem(SEARCH_QUERY_KEY);
  if (q) {
    refs.searchForm.elements.searchQuery.value = q;
    // refs.cardsUl.innerHTML = '';
    refs.loader.classList.remove('is-hidden');
    try {
      data = await mApi.fetchNextSearch('', page);
      // console.log(data)
      sessionStorage.setItem(SEARCH_PAGE_KEY, data.data.page)
      renderCards(data, await mApi.getCachedGenres());
      // renderSearch(data, await mApi.getCachedGenres());
    }
    catch (e) {
      console.log(e.message)
    } finally {
      refs.loader.classList.add('is-hidden');
    }
  }
  else {
    // refs.cardsUl.innerHTML = '';
    refs.searchForm.elements.searchQuery.value = '';

    refs.loader.classList.remove('is-hidden');
    try {
      data = await mApi.fetchNextTrending(page);
      sessionStorage.setItem(TRENDING_PAGE_KEY, data.data.page)
      // renderTrending(data, await mApi.getCachedGenres());
      renderCards(data, await mApi.getCachedGenres());
    }
    catch (e) {
      console.log(e.message)
    } finally {
      refs.loader.classList.add('is-hidden');
    }
  }
}

(async () => {
  const genres = await mApi.getCachedGenres();
  const searchQuery = sessionStorage.getItem(SEARCH_QUERY_KEY);
  if (searchQuery) {
    refs.searchForm.elements.searchQuery.value = searchQuery;
    const searchPage = sessionStorage.getItem(SEARCH_PAGE_KEY);
    // refs.cardsUl.innerHTML = '';
    refs.loader.classList.remove('is-hidden');
    let data;
    try {
      console.log(searchQuery, searchPage)
      data = await mApi.fetchNextSearch(searchQuery, searchPage || 1);
    }
    catch (e) {
      console.error(e.message)
    } finally {
      refs.loader.classList.add('is-hidden');
    }
    renderCards(data, genres);
  }
  else {
    const trendingPage = sessionStorage.getItem(TRENDING_PAGE_KEY);
    // refs.cardsUl.innerHTML = '';
    refs.loader.classList.remove('is-hidden');
    let data;
    try {
      data = await mApi.fetchNextTrending(trendingPage || 1);
      // console.log(data)
    }
    catch (e) {
      console.error(e.message)
    } finally {
      refs.loader.classList.add('is-hidden');
    }
    if (!data.data.results.length) {
      refs.cardsUl.innerHTML = '<li>There is no trending movies.</li>';
      return;
    }
    renderCards(data, genres);
  }
})();