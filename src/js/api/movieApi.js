import axios from "axios";
export default class MovieApi {
  static API_KEY = 'd211d18bbdd8eeb23b9914a8b27a6ac5';
  static BASE_URL = 'https://api.themoviedb.org/3';
  static IMAGES_BASE_URL = 'https://image.tmdb.org/t/p/';
  static GENRES_CACHE_KEY = 'genres_cache';

  static GENRES_VALID_TIME = 1000 * 60 * 60 * 24 * 30;
  // https://api.themoviedb.org/3/configuration?api_key=d211d18bbdd8eeb23b9914a8b27a6ac5
  // constructor() {

  // }
  async getProcessedResult(data) {
    const genresList = await this.getCachedGenres();
    return {
      page: data.data.page,
      total_pages: data.data.total_pages,
      results: data.data.results.map(el => {
        const genres = el.genre_ids.map(genreId => genresList.find(el => el.id === genreId).name);
        if (genres.length > 2)
          genres.splice(2, genres.length - 2, 'Other');
        const strGenres = genres.join(', ');
        const info = [];
        if (strGenres)
          info.push(strGenres);
        const releaseDate = el.release_date || el.first_air_date;
        if (releaseDate)
          info.push(new Date(releaseDate).getFullYear());
        const strInfo = info.join(' | ') || 'No info';
        return {
          ...el,
          title: el.title || el.name,
          info: strInfo,
          vote_average: Number(el.vote_average).toFixed(1),
        }
      })
    };
  }

  async fetchNextTrending(page = -1) {
    if (~page)
      this.trendingPage = page;
    else
      this.trendingPage += 1;

    const params = new URLSearchParams({
      api_key: MovieApi.API_KEY,
      page: this.trendingPage,
    }).toString();

    const data = await this.getProcessedResult(await axios.get(`${MovieApi.BASE_URL}/trending/movie/day?${params}`));
    return this.cache = data;
  }

  getCachedMovieById(id) {
    if (!this.cache) {
      console.error('No cache!');
      return;
    }
    return this.cache.results.find(el => el.id === Number(id));
  }

  getCache() {
    return this.cache;
  }

  clearCache() {
    this.cache = null;
  }

  async fetchNextSearch(query = '', page = -1) {
    if (query) {
      this.searchPage = 1;
    }
    else
      this.searchPage += 1;
    if (~page)
      this.searchPage = page;

    const params = new URLSearchParams({
      api_key: MovieApi.API_KEY,
      page: this.searchPage,
      query: query || this.query,
    }).toString();
    const data = await this.getProcessedResult(await axios.get(`${MovieApi.BASE_URL}/search/movie?${params}`));
    console.log(data)
    if (query && data.results.length) {
      this.query = query;
    }
    return this.cache = data;
  }

  async fetchMovieDetails(movie_id) {
    const params = new URLSearchParams({
      api_key: MovieApi.API_KEY,
    }).toString();
    return axios.get(`${MovieApi.BASE_URL}/movie/${movie_id}?${params}`);
  }

  async getCachedGenres(forceUpdate = false) {
    let genres_cache = localStorage.getItem(MovieApi.GENRES_CACHE_KEY);
    try {
      genres_cache = JSON.parse(genres_cache);
    }
    catch
    { genres_cache = null }
    if (forceUpdate || !genres_cache || !genres_cache.expires || genres_cache.expires < Date.now()) {
      // console.log('reload')
      const params = new URLSearchParams({
        api_key: MovieApi.API_KEY,
      }).toString();
      genres_cache = (await axios.get(`${MovieApi.BASE_URL}/genre/movie/list?${params}`)).data.genres;
      genres_cache = { genres: genres_cache, expires: Date.now() + MovieApi.GENRES_VALID_TIME };
      localStorage.setItem(MovieApi.GENRES_CACHE_KEY, JSON.stringify(genres_cache));
    }
    return genres_cache.genres;
  }
}