import axios from "axios";

const NO_INFO = 'No info';
/**
 * Fetching Api for 'The Movie Database'
 * @class MovieApi
 */
export default class MovieApi {
  static API_KEY = 'd211d18bbdd8eeb23b9914a8b27a6ac5';
  static BASE_URL = 'https://api.themoviedb.org/3';
  static IMAGES_BASE_URL = 'https://image.tmdb.org/t/p/';
  static GENRES_CACHE_KEY = 'genres_cache';
  static GENRES_TTL = 1000 * 60 * 60 * 24 * 30;
  // https://api.themoviedb.org/3/configuration?api_key=d211d18bbdd8eeb23b9914a8b27a6ac5
  // constructor() {}

  /**
   * Transforms properties to appropriate content
   * @param {object} movieItem - object with recieved movie data
   * @param {array} genresList - array with genres (id, name), if not passed, supposed, that 'movieItem' has this data in 'genres'
   * @returns {object} object with apropriate properties
   */
  getProcessedItem(movieItem, genresList = null) {
    let genres;
    let genresFull;
    if (genresList)
      genresFull = movieItem.genre_ids.map(genreId => genresList.find(el => el.id === genreId).name);
    else
      genresFull = movieItem.genres.map(el => el.name);

    genres = [...genresFull];
    if (genresFull.length > 2)
      genres.splice(2, genres.length - 2, 'Other');
    const strGenres = genres.join(', ');
    const info = [];
    if (strGenres)
      info.push(strGenres);
    const releaseDate = movieItem.release_date || movieItem.first_air_date;
    if (releaseDate)
      info.push(new Date(releaseDate).getFullYear());
    const strInfo = info.join(' | ') || NO_INFO;
    return {
      id: movieItem.id,
      poster_path: movieItem.poster_path,
      title: movieItem.title || movieItem.name,
      info: strInfo,
      overview: movieItem.overview || NO_INFO,
      original_title: movieItem.original_title || NO_INFO,
      popularity: Number(movieItem.popularity).toFixed(1) || NO_INFO,
      genres: genresFull.join(', ') || NO_INFO,
      full_path: MovieApi.IMAGES_BASE_URL + 'w400' + movieItem.poster_path,
      vote_average: Number(movieItem.vote_average).toFixed(1),
      vote_count: movieItem.vote_count,
      timestamp: Date.now(),
    }
  }

  /**
   * Processes array of movies to appropriate content (fetches cached genres list)
   * @param {array} data - array with movies data
   * @returns {Promise} Promise for movies array
   */
  async getProcessedResult(data) {
    const genresList = await this.getCachedGenres();
    return {
      page: data.data.page,
      total_pages: data.data.total_pages,
      results: data.data.results.map(el => this.getProcessedItem(el, genresList)),
    };
  }

  /**
   * Fetches trending movies
   * @param {number} page - page number to fetch, if not passed, fetches next page
   * @returns {Promise} Promise for object with movies array
   */
  async fetchNextTrending(page = -1) {
    if (~page)
      this.trendingPage = page;
    else
      this.trendingPage += 1;

    const params = new URLSearchParams({
      api_key: MovieApi.API_KEY,
      page: this.trendingPage,
    }).toString();
    let data;
    try {
      data = await this.getProcessedResult(await axios.get(`${MovieApi.BASE_URL}/trending/movie/day?${params}`));
    }
    catch (e) {
      console.error(e.message);
      return;
    }
    return this.cache = data;
  }

  /**
   * Retrieves movie data object from cache by id
   * @param {number} id - identificator of movie
   * @returns {object} object with movie data
   */
  getCachedMovieById(id) {
    if (!this.cache) {
      console.error('No cache!');
      return;
    }
    return this.cache.results.find(el => el.id === Number(id));
  }

  /**
   * Retrieves cached object with array of movies
   * @returns {object} object
   */
  getCache() {
    return this.cache;
  }

  /**
   * Clears cache with array of movies
   */
  clearCache() {
    this.cache = null;
  }

  /**
   *Fetches search results with array of movies
   * @param {string} query - search string, if not passed assumes previous search string
   * @param {number} page - page number to fetch, if not passed, fetches next page
   * @returns {Promise} Promise for object with array of movies
   */
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
    let data;
    try {
      data = await this.getProcessedResult(await axios.get(`${MovieApi.BASE_URL}/search/movie?${params}`));
    }
    catch (e) {
      console.error(e.message);
      return;
    }
    if (query && data.results.length) {
      this.query = query;
    }
    return this.cache = data;
  }

  /**
   * Fetches movie details by id
   * @param {number} movie_id - identifier of movie to fetch
   * @returns {Promise} Promise for object with movie data
   */
  async fetchMovieDetails(movie_id) {
    const params = new URLSearchParams({
      api_key: MovieApi.API_KEY,
    }).toString();
    let data;
    try {
      data = await axios.get(`${MovieApi.BASE_URL}/movie/${movie_id}?${params}`);
    }
    catch (e) {
      console.error(e.message);
      return;
    }
    return this.getProcessedItem(data.data);
  }

  /**
   * Retrieves Genres list from LocalStorage, controls TTL of data. If data not present in LocalStorage,
   * or data outdated, fetches updated list from API
   * @param {boolean} forceUpdate - if true, forces fetching from API
   * @returns {Promise} Promise for array of genres
   */
  async getCachedGenres(forceUpdate = false) {
    let genres_cache = localStorage.getItem(MovieApi.GENRES_CACHE_KEY);
    try {
      genres_cache = JSON.parse(genres_cache);
    }
    catch
    { genres_cache = null }
    if (forceUpdate || !genres_cache || !genres_cache.timestamp || genres_cache.timestamp + MovieApi.GENRES_TTL < Date.now()) {
      // console.log('reload')
      const params = new URLSearchParams({
        api_key: MovieApi.API_KEY,
      }).toString();
      try {
        genres_cache = (await axios.get(`${MovieApi.BASE_URL}/genre/movie/list?${params}`)).data.genres;
      }
      catch (e) {
        console.error(e.message);
        return;
      }
      genres_cache = { genres: genres_cache, timestamp: Date.now() };
      localStorage.setItem(MovieApi.GENRES_CACHE_KEY, JSON.stringify(genres_cache));
    }
    return genres_cache.genres;
  }
}