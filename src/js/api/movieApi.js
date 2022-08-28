import axios from "axios";

const NO_INFO = 'No info';
export default class MovieApi {
  static API_KEY = 'd211d18bbdd8eeb23b9914a8b27a6ac5';
  static BASE_URL = 'https://api.themoviedb.org/3';
  static IMAGES_BASE_URL = 'https://image.tmdb.org/t/p/';
  static GENRES_CACHE_KEY = 'genres_cache';
  static GENRES_TTL = 1000 * 60 * 60 * 24 * 30;
  // https://api.themoviedb.org/3/configuration?api_key=d211d18bbdd8eeb23b9914a8b27a6ac5
  // constructor() {

  // adult: false
  // backdrop_path: "/jILeJ60zPpIjjJHGSmIeY4eO30t.jpg"
  // full_path: "https://image.tmdb.org/t/p/w400/xUuHj3CgmZQ9P2cMaqQs4J0d4Zc.jpg"
  // genre_ids: (2)[28, 18]
  // genres: "Action, Drama"
  // id: 744
  // info: "Action, Drama | 1986"
  // media_type: "movie"
  // original_language: "en"
  // original_title: "Top Gun"
  // overview: "For Lieutenant Pete 'Maverick' Mitchell and his friend and co-pilot Nick 'Goose' Bradshaw, being accepted into an elite training school for fighter pilots is a dream come true. But a tragedy, as well as personal demons, will threaten Pete's dreams of becoming an ace pilot."
  // popularity: 335.613
  // poster_path: "/xUuHj3CgmZQ9P2cMaqQs4J0d4Zc.jpg"
  // release_date: "1986-05-16"
  // title: "Top Gun"
  // video: false
  // vote_average: "7.0"
  // vote_count: 6282

  getProcessedItem(movieItem, genresList) {
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
      // ...el,
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

  async getProcessedResult(data) {
    const genresList = await this.getCachedGenres();
    return {
      page: data.data.page,
      total_pages: data.data.total_pages,
      results: data.data.results.map(el => this.getProcessedItem(el, genresList)),
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

  async fetchMovieDetails(movie_id) {
    const params = new URLSearchParams({
      api_key: MovieApi.API_KEY,
    }).toString();
    const data = await axios.get(`${MovieApi.BASE_URL}/movie/${movie_id}?${params}`);
    return this.getProcessedItem(data.data);
    return this.getProcessedItem({ ...data.data, id_: movie_id/* , genre_ids: data.data.genres.map(el => el.id) } */ });
  }

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