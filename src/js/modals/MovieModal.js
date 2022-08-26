import BaseModal from "./BaseModal";
import movieDetailsHbs from '../../templates/movie-details.hbs';
import StorageListApi from "../api/storageListApi";

export default class MovieModal extends BaseModal {
  constructor(movieData, options = {}) {
    super(movieDetailsHbs(movieData), { containerClass: 'movie-info' });
    this.movieData = movieData;
    this.onClose = options.onClose;
    this.onChange = options.onChange;
    this.watchedList = new StorageListApi('watched');
    this.queueList = new StorageListApi('queue');
  }

  show() {
    super.show();
    this.watchedBtn = document.querySelector('.backdrop [data-action="watched"]');
    this.queueBtn = document.querySelector('.backdrop [data-action="queue"]');
    this.updateButtonsState();
    this.watchedBtn.addEventListener('click', this.#onWatchedClick.bind(this));
    this.queueBtn.addEventListener('click', this.#onQueueClick.bind(this));
  }

  close() {
    super.close();
    if ((typeof this.onClose) === 'function')
      this.onClose();
  }

  #setBtnWatchedState(inList) {
    if (inList)
      this.watchedBtn.textContent = 'REMOVE FROM WATCHED';
    else
      this.watchedBtn.textContent = 'ADD TO WATCHED';
  }

  #setBtnQueueState(inList) {
    if (inList)
      this.queueBtn.textContent = 'REMOVE FROM QUEUE';
    else
      this.queueBtn.textContent = 'ADD TO QUEUE';
  }

  updateButtonsState() {
    this.#setBtnWatchedState(this.watchedList.inList(this.movieData.id));
    this.#setBtnQueueState(this.queueList.inList(this.movieData.id));
  }

  #onWatchedClick(evt) {
    if (this.watchedList.inList(this.movieData.id)) {
      this.watchedList.removeFromList(this.movieData.id);
      this.#setBtnWatchedState(false);
    }
    else {
      this.watchedList.addToList(this.movieData);
      this.#setBtnWatchedState(true);
    }
    if ((typeof this.onChange) === 'function')
      this.onChange('watched');
  }

  #onQueueClick(evt) {
    if (this.queueList.inList(this.movieData.id)) {
      this.queueList.removeFromList(this.movieData.id);
      this.#setBtnQueueState(false);
    }
    else {
      this.queueList.addToList(this.movieData);
      this.#setBtnQueueState(true);
    }
    if ((typeof this.onChange) === 'function')
      this.onChange('queue');
  }
}