import ThemeSwitcher from './js/theme-switcher';
import StorageListApi from './js/api/storageListApi';

const ts = new ThemeSwitcher('#slider');

document.querySelectorAll(".modal").forEach(el => el.style.display = 'none');

const queueList = new StorageListApi('queue');
const watchedList = new StorageListApi('watch');

queueList.addToList('test1');
queueList.addToList('test2');
queueList.addToList('test3');
queueList.addToList('test4');
queueList.addToList('test5');
queueList.addToList('test6');
queueList.addToList('test7');

console.log(queueList.getList());