import BaseModal from "./BaseModal";
import movieDetailsHbs from '../../templates/movie-details.hbs';
import StorageListApi from "../api/storageListApi";

/**
 * @class Class for representing movie details. Extends from BaseModal.
 */
export default class MovieModal extends BaseModal {
  /**
   * @constructor
   * @param {object} movieData - object with movie data
   * @param {object} options window options
   * @param {function} options.onClose - calls after cloing window
   * @param {function} options.onChange - calls when list manipulation buttons clicked
   */
  constructor(movieData, options = {}) {
    super(movieDetailsHbs(movieData), { containerClass: 'movie-info' });
    this.movieData = movieData;
    this.onClose = options.onClose;
    this.onChange = options.onChange;
    this.watchedList = new StorageListApi('watched');
    this.queueList = new StorageListApi('queue');
  }

  /**
   * Show window. Adds Event Listeners to list buttons
   */
  show() {
    super.show();
    this.watchedBtn = document.querySelector('.backdrop [data-action="watched"]');
    this.queueBtn = document.querySelector('.backdrop [data-action="queue"]');
    this.updateButtonsState();
    this.watchedBtn.addEventListener('click', this.#onWatchedClick.bind(this));
    this.queueBtn.addEventListener('click', this.#onQueueClick.bind(this));
  }

  /**
   * Closes window
   */
  close() {
    super.close();
    if ((typeof this.onClose) === 'function')
      this.onClose();
  }

  /**
   * Sets state for Watched button
   * @param {boolean} inList - button state. If true - movie present in watched list, so enable removing
   */
  #setBtnWatchedState(inList) {
    if (inList)
      this.watchedBtn.textContent = 'REMOVE FROM WATCHED';
    else
      this.watchedBtn.textContent = 'ADD TO WATCHED';
  }

  /**
 * Sets state for Queue button
 * @param {boolean} inList - button state. If true - movie present in queue list, so enable removing
 */
  #setBtnQueueState(inList) {
    if (inList)
      this.queueBtn.textContent = 'REMOVE FROM QUEUE';
    else
      this.queueBtn.textContent = 'ADD TO QUEUE';
  }

  /**
   * Updates buttons state
   */
  updateButtonsState() {
    this.#setBtnWatchedState(this.watchedList.inList(this.movieData.id));
    this.#setBtnQueueState(this.queueList.inList(this.movieData.id));
  }

  /**
   * Click event handler for watched button
   * @param {MouseEvent} evt
   */
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

  /**
 * Click event handler for queue button
 * @param {MouseEvent} evt
 */
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