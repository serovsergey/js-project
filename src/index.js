// import './js/theme-switcher';
import ThemeSwitcher from "./js/theme-switcher";
import MovieApi from "./js/api/movieApi";
import homeCardsHbs from './templates/home-cards.hbs';

const ts = new ThemeSwitcher('#slider');
const TRENDING_PAGE_KEY = 'trending_current_page';
const SEARCH_PAGE_KEY = 'search_current_page';
const SEARCH_QUERY_KEY = 'search_query';

const mApi = new MovieApi();

const refs = {
  cardsUl: document.querySelector(".gallery__list"),
  pagination: document.querySelector(".gallery__pagination"),
}
// const testListRef = document.querySelector("#test_list");
const testFormRef = document.querySelector("#test_form");
// const pagRef = document.querySelector("#pag");
// testFormRef.addEventListener('submit', async evt => {
//   evt.preventDefault();
//   // console.dir(evt.target);
//   const searchQuery = evt.target.elements.search.value;
//   const data = await mApi.fetchNextSearch(searchQuery);
//   sessionStorage.setItem(SEARCH_QUERY_KEY, searchQuery);
//   renderSearch(data);
//   console.log('start search', data);
// })

async function start() {
  const searchQuery = sessionStorage.getItem(SEARCH_QUERY_KEY);
  if (searchQuery) {
    testFormRef.elements.search.value = searchQuery;
    const searchPage = sessionStorage.getItem(SEARCH_PAGE_KEY);
    const data = await mApi.fetchNextSearch(searchQuery, searchPage || 1);
    renderSearch(data);
    // console.log('search', data)
  }
  else {
    const trendingPage = sessionStorage.getItem(TRENDING_PAGE_KEY);
    // console.log(trendingPage)
    const data = await mApi.fetchNextTrending(trendingPage || 1);
    renderTrending(data, await mApi.getCachedGenres());
    // console.log('trending', data)
  }
}

start();

function makePagination(data) {
  let pagination = '';
  const page = data.data.page;
  const totalPages = data.data.total_pages;

  pagination += `<li ${page === 1 ? 'class="inactive"' : `data-page="${page - 1}"`}>⏪</li>`;
  if (page > 1) {

    pagination += `<li data-page="${1}" ${page === 1 ? 'current' : ''}>1</li>`;
  }
  if (page > 4)
    pagination += `<span >...</span>`;

  if (page > 3)
    pagination += `<li data-page="${page - 2}">${page - 2}</li>`;
  if (page > 2)
    pagination += `<li data-page="${page - 1}">${page - 1}</li>`;

  pagination += `<li data-page="${page}" style= "font-weight: 900">${page}</li>`;

  if (totalPages - 1 > page)
    pagination += `<li data-page="${page + 1}">${page + 1}</li>`;
  if (totalPages - 2 > page)
    pagination += `<li data-page="${page + 2}">${page + 2}</li>`;
  if (totalPages - 3 > page)
    pagination += `<li>...</li>`;
  if (totalPages > page) {
    pagination += `<li data-page="${totalPages}">${totalPages}</li>`;
  }
  pagination += `<li ${page === totalPages ? 'class="inactive"' : `data-page="${page + 1}"`}>⏩</li>`;
  return pagination;
}

function renderTrending(data, genresList) {
  const res = data.data.results.map(el => {
    const genres = el.genre_ids.map(genreId => genresList.find(el => el.id === genreId).name);
    if (genres.length > 2)
      genres.splice(2, genres.length - 2, 'Other');
    return {
      ...el,
      poster_path: 'https://image.tmdb.org/t/p/w400/' + el.poster_path,
      title_: el.title,
      year: new Date(el.release_date).getFullYear(),
      genres: genres.join(', ')
    }
  });
  const markup = homeCardsHbs(res);
  refs.cardsUl.innerHTML = markup;
  refs.pagination.innerHTML = makePagination(data);
}

function renderSearch(data) {

  const markup = data.data.results.reduce((acc, el) => acc + `
  <li>${el.title}</li>
  `, '');
  testListRef.innerHTML = markup;
  refs.pagination.innerHTML = makePagination(data);
}

refs.pagination.addEventListener('click', async evt => {
  const page = evt.target.dataset.page;
  let data;
  if (page) {
    if (sessionStorage.getItem(SEARCH_QUERY_KEY)) {
      data = await mApi.fetchNextSearch('', page);
      sessionStorage.setItem(SEARCH_PAGE_KEY, data.data.page)
      renderTrending(data);
    }
    else {
      data = await mApi.fetchNextTrending(page);
      sessionStorage.setItem(TRENDING_PAGE_KEY, data.data.page)
      renderTrending(data, await mApi.getCachedGenres());
    }
  }
})
