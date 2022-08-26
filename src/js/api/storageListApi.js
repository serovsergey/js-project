export default class StorageListApi {
  constructor(key, perPage = 20) {
    this.key = key;
    this.perPage = perPage;
  }

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

  getTotalPages() {
    const list = this.getList();
    if (!list) return 0;
    return Math.ceil(list.length / this.perPage);
  }

  removeFromList(id) {
    const list = this.getList();
    if (list) {
      const idx = list.findIndex(el => el.id === Number(id));
      if (!~idx) {
        console.error("Something gone wrong, guys!");
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

  inList(id) {
    const list = this.getList();
    if (list) {
      return list.some(el => el.id === Number(id));
    }
    return false;
  }
  getItemById(id) {
    const list = this.getList();
    if (list) {
      return list.find(el => el.id === Number(id));
    }
    return null;
  }
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
   *
   * @param {number} page number of page to fetch, if not passed fetches next page
   * @returns {object} object with stored data
   */
  fetchNext(page = -1) {
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
    // console.log(this.page, from, from + this.perPage);
    // console.log({ page: this.page, total_pages: totalPages, results: list.slice(from, from + this.perPage) })
    return { page: Number(this.page), total_pages: totalPages, results: list.slice(from, from + this.perPage) };
  }
}