import axios from "axios";
export default class MoviewApi {
  static API_KEY = 'd211d18bbdd8eeb23b9914a8b27a6ac5';
  static BASE_URL = 'https://api.themoviedb.org/3';
  static GENRES_CACHE_KEY = 'genres_cache';
  // static TRENDING_PAGE_KEY = 'trending_current_page';
  // static SEARCH_PAGE_KEY = 'search_current_page';
  // static SEARCH_QUERY_KEY = 'search_query';
  static GENRES_VALID_TIME = 1000 * 60 * 60 * 24 * 30;

  constructor() {

  }

  async fetchNextTrending(page = -1) {
    if (~page)
      this.trendingPage = page;
    else
      this.trendingPage += 1;

    const params = new URLSearchParams({
      api_key: MoviewApi.API_KEY,
      page: this.trendingPage,
    }).toString();
    return axios.get(`${MoviewApi.BASE_URL}/trending/movie/week?${params}`);
  }

  async fetchNextSearch(query = '', page = -1) {
    if (query) {
      this.query = query;
      this.searchPage = 1;
    }
    else
      this.searchPage += 1;
    if (~page)
      this.searchPage = page;

    const params = new URLSearchParams({
      api_key: MoviewApi.API_KEY,
      page: this.searchPage,
      query: this.query,
    }).toString();
    return axios.get(`${MoviewApi.BASE_URL}/search/movie?${params}`);
  }

  async fetchMovieDetails(movie_id) {
    const params = new URLSearchParams({
      api_key: MoviewApi.API_KEY,
    }).toString();
    return axios.get(`${MoviewApi.BASE_URL}/movie/${movie_id}?${params}`);
  }

  async getCachedGenres(forceUpdate = false) {
    let genres_cache = localStorage.getItem(MoviewApi.GENRES_CACHE_KEY);
    try {
      genres_cache = JSON.parse(genres_cache);
    }
    catch
    { genres_cache = null }
    if (forceUpdate || !genres_cache || !genres_cache.expires || genres_cache.expires < Date.now()) {
      // console.log('reload')
      const params = new URLSearchParams({
        api_key: MoviewApi.API_KEY,
      }).toString();
      genres_cache = (await axios.get(`${MoviewApi.BASE_URL}/genre/movie/list?${params}`)).data.genres;
      genres_cache = { genres: genres_cache, expires: Date.now() + MoviewApi.GENRES_VALID_TIME };
      localStorage.setItem(MoviewApi.GENRES_CACHE_KEY, JSON.stringify(genres_cache));
    }
    return genres_cache.genres;
  }
}