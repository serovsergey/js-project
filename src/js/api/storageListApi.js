export default class StorageListApi {
  constructor(key, perPage = 20) {
    this.key = key;
    this.perPage = perPage;
  }

  addToList(value) {
    console.log(value)
    const list = this.getList();
    if (list) {
      const length = list.push(value);
      localStorage.setItem(this.key, JSON.stringify(list));
      return length;
    }
  }

  removeFromList(id) {
    const list = this.getList();
    if (list) {
      const idx = list.findIndex(el => el.id === Number(id));
      if (!~idx) {
        console.error("Something gone wrong, guys!");
        return false;
      }
      list.splice(idx);
      localStorage.setItem(this.key, JSON.stringify(list));
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

  getList() {
    const stored = localStorage.getItem(this.key);
    let list = null;
    try {
      list = JSON.parse(stored);
    }
    catch (e) { console.error(e.message) }
    return list;
  }

  fetchNext(page = -1) {
    const list = this.getList();
    if (!list) return null;
    if (~page)
      this.page = page;
    else
      this.page += 1;
    const from = (page - 1) * this.perPage;
    return list.slice(from, from + this.perPage);
  }
}