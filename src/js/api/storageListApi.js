export default class StorageListApi {
  constructor(key, perPage = 20) {
    this.key = key;
    this.perPage = perPage;
  }

  fetchNext(page = -1) {
    if (~page)
      this.page = page;
    else
      this.page += 1;
    const stored = localStorage.getItem(this.key);
    let data = null;
    try {
      data = JSON.parse(stored);
    }
    catch { }
    if (!data) return null;
  }
}