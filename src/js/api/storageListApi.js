import MovieApi from "./movieApi";

/**
 * Fetching Api for local stored lists (with update from remote Api and caching feature)
 * @class StorageListApi
 */
export default class StorageListApi {
  static DATA_TTL = 1000 * 60 * 60 * 24 * 30;

  /**
   * @constructor
   * @param {string} key LocalStorage key to store list
   * @param {number} perPage - count of movies per page
   */
  constructor(key, perPage = 20) {
    this.key = key;
    this.perPage = perPage;
  }

  /**
   * Add movie data entry to stored list
   * @param {object} value movie data object
   * @returns {number} length of list after adding
   */
  addToList(value) {
    if (this.inList(value.id)) return false;
    let list = this.getList();
    if (!list) list = [];
    const length = list.push(value);
    try { //in case of storage overflow
      localStorage.setItem(this.key, JSON.stringify(list));
    }
    catch (e) { console.error(e.message); }
    return length;
  }

  /**
   * Return page count of stored list
   * @returns {number} count of pages
   */
  getTotalPages() {
    const list = this.getList();
    if (!list) return 0;
    return Math.ceil(list.length / this.perPage);
  }

  /**
   * Removes movie data entry from list
   * @param {number} id - movie id
   * @returns {boolean} false if opeartion fails
   */
  removeFromList(id) {
    const list = this.getList();
    if (list) {
      const idx = list.findIndex(el => el.id === Number(id));
      if (!~idx) {
        console.error("Item not found in list, but it must be there!");
        return false;
      }
      list.splice(idx, 1);
      if (list.length)
        localStorage.setItem(this.key, JSON.stringify(list));
      else
        localStorage.removeItem(this.key);
      return true;
    }
    return false;
  }
  /**
   * Updates movie data entry in list
   * @param {obj} newData - new object
   * @returns {boolean} false if opeartion fails
   */
  updateItem(newData) {
    const list = this.getList();
    if (list) {
      const idx = list.findIndex(el => el.id === Number(newData.id));
      if (!~idx) {
        console.error("Item not found in list, but it must be there!");
        return false;
      }
      list.splice(idx, 1, newData);
      localStorage.setItem(this.key, JSON.stringify(list));
      return true;
    }
    return false;
  }

  /**
   * Checks if data for movie with specified id present in stored list
   * @param {number} id
   * @returns {boolean}
   */
  inList(id) {
    const list = this.getList();
    if (list) {
      return list.some(el => el.id === Number(id));
    }
    return false;
  }

  /**
   * Returns movie data from stored list by id
   * @param {number} id - identifier of movie
   * @returns {object} object with movie data
   */
  getItemById(id) {
    const list = this.getList();
    if (list) {
      return list.find(el => el.id === Number(id));
    }
    return null;
  }

  /**
   * Returns strored in LocalStorage movie list
   * @returns {array} Array of movies
   */
  getList() {
    const stored = localStorage.getItem(this.key);
    let list = null;
    try {
      list = JSON.parse(stored);
    }
    catch (e) { console.error(e.message) }
    return list;
  }
  /**
   * Checks stored in LocalStorage portion of movie data for relevance for specified page,
   * and updates outdated items in LocalStorage
   * @param {number} from - page number to update
   * @returns {Promise} Promise (nothing)
   */
  async updateOutdatedItems(from) {
    const mApi = new MovieApi();
    const list = this.getList();
    if (!list || list.length === 0) return null;
    const itemsToUpdate = list.slice(from, from + this.perPage)
      .filter(el => !el.timestamp || el.timestamp + StorageListApi.DATA_TTL < Date.now())
      .map(async el => { return await mApi.fetchMovieDetails(el.id) });
    const updatedItems = await Promise.all(itemsToUpdate);
    updatedItems.forEach(el => this.updateItem(el));
  }

  /**
   * Retrieves movies data from LocalStorage. Controls TTL of data (if movie data is outdated, fetches
   * new one only for outdated on page)
   * @param {number} page number of page to fetch, if not passed fetches next page
   * @returns {Promise} Promise for object with movies data
   */
  async fetchNext(page = -1) {
    const list = this.getList();
    if (!list || list.length === 0) return null;
    const totalPages = Math.ceil(list.length / this.perPage);

    if (~page && page <= totalPages) {
      this.page = page;
    }
    else {
      if (this.page < totalPages)
        this.page += 1;
      else this.page = totalPages;
    }
    const from = (this.page - 1) * this.perPage;
    await this.updateOutdatedItems(from);
    return { page: Number(this.page), total_pages: totalPages, results: list.slice(from, from + this.perPage) };
  }
}