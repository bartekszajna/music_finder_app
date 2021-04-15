import AlbumItem from './AlbumItem';
import ArtistItem from './ArtistItem';
import TrackItem from './TrackItem';
import App from './App';

export default class UIController {
  constructor() {
    this.intersectionObserverObject;
    this.searchController;
    this.audioController;
    this.suggestionsListElement;
    //this.listOfItems;
    this.audioElement;
    this.modalAudioButtonElement;
    this.modalLinkElement;
    this.clickedInfoButton;
    this.firstFocusableModalElement;
    this.lastFocusableModalElement;
    this.showLoader;
    this.hideLoader;
    this.audioContainerElement = document.querySelector('.audio_container');
    this.itemsContainer = document.querySelector('.items_container');
    this.modalContainer = document.querySelector('.modal_container');
    this.modalElement = document.querySelector('.modal');
    this.modalImageElement = document.querySelector('.modal_image');
    this.modalDataElement = document.querySelector('.modal_data');
    this.modalBackButtonElement = document.querySelector('.back_button');
    this.modalLikeButtonElement = document.querySelector('.modal_checkbox');

    this.itemsContainer.addEventListener('click', this.renderModal.bind(this));

    this.modalBackButtonElement.addEventListener(
      'click',
      this.closeModal.bind(this)
    );
  }

  showItemsContainer() {
    this.itemsContainer.classList.add('items_container--visible');
  }

  hideItemsContainer() {
    this.itemsContainer.classList.remove('items_container--visible');
  }

  clearItemsContainer() {
    this.itemsContainer.innerHTML = '';
  }

  closeModal(e) {
    this.modalContainer.classList.remove('modal_container--visible');
    this.modalDataElement.classList.remove('modal_data--explicit');
    this.modalDataElement.innerHTML = '';
    this.modalLikeButtonElement.checked = false;
    this.audioController.remove();

    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
    document.body.style.paddingRight = '20px';

    document.querySelector('.modal_overflow').style.marginRight = '';

    this.modalContainer.removeEventListener(
      'click',
      this.detectClickOutsideModal
    );

    this.modalContainer.removeEventListener(
      'keydown',
      this.detectEscapeKeydown
    );

    this.firstFocusableModalElement.removeEventListener(
      'keydown',
      this.firstModalElHandler
    );

    this.lastFocusableModalElement.removeEventListener(
      'keydown',
      this.lastModalElHandler
    );

    if (e.target.dataset.remove === 'true') {
      this.removeItemAnimation(e.target.dataset.itemId);
      e.target.dataset.remove = 'false';
    }

    this.clickedInfoButton.focus();
    this.clickedInfoButton.setAttribute('aria-expanded', 'false');
  }

  prepareItems(data) {
    const listOfItems = [];
    let totalItemsAmount = 0;

    for (const group of Object.keys(data)) {
      totalItemsAmount += data[group].total;

      data[group].items.forEach((item) => {
        let obj;
        switch (group) {
          case 'albums': {
            obj = new AlbumItem(
              'Album',
              item.name,
              item.id,
              item.external_urls.spotify,
              item.images,
              item.album_type,
              item.artists,
              item.release_date,
              item.total_tracks
            );
            break;
          }
          case 'artists': {
            obj = new ArtistItem(
              'Artist',
              item.name,
              item.id,
              item.external_urls.spotify,
              item.images,
              item.followers,
              item.genres,
              item.popularity
            );
            break;
          }
          case 'tracks': {
            obj = new TrackItem(
              'Song',
              item.name,
              item.id,
              item.external_urls.spotify,
              item.album.images,
              item.album,
              item.artists,
              item.duration_ms,
              item.explicit,
              item.popularity,
              item.preview_url,
              item.track_number
            );
            break;
          }
        }
        //console.log(JSON.stringify(obj));
        listOfItems.push(obj);
      });
    }

    listOfItems.sort((a, b) => {
      if (a.Popularity < b.Popularity) return 1;
      if (a.Type === 'Artist') return -1;
      if (b.Type === 'Artist') return 1;
    });

    return [listOfItems, totalItemsAmount];
  }

  async loadAllImages(listOfItems) {
    let arrayOfPromises = [];
    listOfItems.forEach((item) => {
      arrayOfPromises.push(this.loadImage(item));
    });

    return await Promise.allSettled(arrayOfPromises).then((res) => res);
  }

  async loadImage(item) {
    return new Promise((resolve, reject) => {
      let imageElement = new Image();
      imageElement.addEventListener(
        'load',
        () => {
          resolve({ item, imageElement });
        },
        { once: true }
      );
      imageElement.addEventListener(
        'error',
        () => {
          reject(item, imageElement);
        },
        { once: true }
      );
      imageElement.src = item.Image;
    });
  }

  async renderItemsList(
    listOfItems,
    totalItemsAmount,
    fetchedDataOffset,
    isItFromStorage
  ) {
    if (totalItemsAmount === 0) {
      const message = isItFromStorage
        ? "You haven't liked any music yet"
        : 'No results available';

      this.itemsContainer.insertAdjacentHTML(
        'beforeEnd',
        `<p class="amount_header">${message}</p>`
      );

      this.hideLoader();

      this.showItemsContainer();

      return;
    }

    if (!listOfItems.length) {
      if (this.intersectionObserverObject instanceof IntersectionObserver) {
        this.intersectionObserverObject.disconnect();
      }

      this.hideLoader();
      return;
    }

    let arrayOfPromises = await this.loadAllImages(listOfItems);

    arrayOfPromises.forEach((promise) => {
      let item = document.createElement('div');
      item.className = 'item';
      item.dataset.itemId = promise.value.item.Id;

      let itemImage = promise.value.imageElement;
      itemImage.classList = 'item_image';

      let itemData = document.createElement('div');
      itemData.className = 'item_data';

      let itemTitle = document.createElement('p');
      itemTitle.className = 'item_title';
      itemTitle.innerText = `${promise.value.item.Type}`;

      let itemSubtitle = document.createElement('p');
      itemSubtitle.className = 'item_subtitle';
      itemSubtitle.innerText = `${promise.value.item.Name}`;

      let itemButtons = document.createElement('div');
      itemButtons.className = 'item_buttons';

      let itemInfoButton = document.createElement('button');
      itemInfoButton.className = 'info_button';
      itemInfoButton.innerText = 'More info';
      itemInfoButton.setAttribute('aria-label', 'open modal');
      itemInfoButton.setAttribute('aria-expanded', 'false');
      itemInfoButton.dataset.item = JSON.stringify(promise.value.item);
      itemInfoButton.dataset.storage = isItFromStorage;

      let checkBoxContainer = document.createElement('div');
      checkBoxContainer.className = 'checkbox_container--item';

      let checkboxLabel = document.createElement('label');
      checkboxLabel.setAttribute('for', `${promise.value.item.Id}`);
      checkboxLabel.className = 'sr-only';
      checkboxLabel.innerText = 'Add this item to favorites list';

      let checkboxInput = document.createElement('input');
      checkboxInput.setAttribute('type', 'checkbox');
      if (localStorage.getItem(promise.value.item.Id)) {
        checkboxInput.setAttribute('checked', 'checked');
      }
      checkboxInput.setAttribute('id', `${promise.value.item.Id}`);
      //checkboxInput.dataset.itemId = promise.value.item.Id;
      checkboxInput.dataset.storage = isItFromStorage;
      checkboxInput.dataset.item = JSON.stringify(promise.value.item);
      checkboxInput.className = 'item_checkbox';

      itemData.append(itemTitle);
      itemData.append(itemSubtitle);

      checkBoxContainer.append(checkboxLabel);
      checkBoxContainer.append(checkboxInput);

      itemButtons.append(itemInfoButton);
      itemButtons.append(checkBoxContainer);

      itemData.append(itemButtons);

      item.append(itemImage);
      item.append(itemData);

      this.itemsContainer.append(item);
    });

    if (fetchedDataOffset === 0) {
      const message = isItFromStorage
        ? 'Your favorite list of music'
        : `${totalItemsAmount} total results`;

      this.itemsContainer.insertAdjacentHTML(
        'afterBegin',
        `<p class="amount_header">${message}</p>`
      );
    }

    this.hideLoader();

    this.showItemsContainer();
    // they are created every time the renderItemsList is evoked and accumulate unnecessarily
    // which causes more data loading if we scroll through old items back and forth
    // so we need to disconnect the old observers
    if (this.intersectionObserverObject instanceof IntersectionObserver) {
      this.intersectionObserverObject.disconnect();
    }

    // we hold reference to this object so we can disconnect it above in next calls
    if (!isItFromStorage) {
      this.intersectionObserverObject = App.addBodyScrollListener(
        this.searchController
      );
    }

    this.suggestionsListElement.innerHTML = '';
  }

  renderModal(e) {
    if (!e.target.getAttribute('aria-label')) {
      return;
    }
    console.log('modal opens');

    const stringObject = e.target.dataset.item;
    const isItFromStorage = e.target.dataset.storage;

    e.target.setAttribute('aria-expanded', 'true');
    this.clickedInfoButton = e.target;
    let objectToRender = JSON.parse(stringObject);
    let type = objectToRender.Type;

    delete objectToRender.Type;
    delete objectToRender.Name;
    let fragment;

    switch (type) {
      case 'Album': {
        fragment = this.renderAlbumModal(objectToRender);
        break;
      }
      case 'Artist': {
        fragment = this.renderArtistModal(objectToRender);
        break;
      }
      case 'Song': {
        fragment = this.renderSongModal(objectToRender);
        break;
      }
    }

    document.body.style.paddingRight = `${
      window.innerWidth - document.documentElement.clientWidth + 20
    }px`;
    document.querySelector('.modal_overflow').style.marginRight = `${
      window.innerWidth - document.documentElement.clientWidth
    }px`;

    this.modalLikeButtonElement.setAttribute('id', objectToRender.Id);
    this.modalLikeButtonElement.dataset.item = stringObject;
    this.modalLikeButtonElement.dataset.storage = isItFromStorage;
    this.modalBackButtonElement.dataset.itemId = objectToRender.Id;

    if (localStorage.getItem(objectToRender.Id)) {
      this.modalLikeButtonElement.checked = true;
    }

    this.modalDataElement.insertAdjacentHTML('afterBegin', fragment);

    this.audioElement = document.querySelector('.audio');
    this.modalAudioButtonElement = document.querySelector('.audio_button');
    this.modalLinkElement = document.querySelector('.data_link');

    this.firstFocusableModalElement = this.audioContainerElement
      .firstElementChild
      ? this.modalAudioButtonElement
      : this.modalLinkElement;

    this.lastFocusableModalElement = this.modalLikeButtonElement;

    this.firstFocusableModalElement.focus();

    this.firstFocusableModalElement.addEventListener(
      'keydown',
      this.firstModalElHandler.bind(this)
    );

    this.lastFocusableModalElement.addEventListener(
      'keydown',
      this.lastModalElHandler.bind(this)
    );

    this.modalContainer.addEventListener(
      'mousedown',
      this.detectClickOutsideModal
    );

    this.modalContainer.addEventListener('keydown', this.detectEscapeKeydown);

    this.modalContainer.addEventListener(
      'transitionend',
      this.focusOnFirstElement.bind(this),
      { once: true }
    );

    this.modalContainer.classList.add('modal_container--visible');

    let scrolledBy = window.scrollY;
    document.body.style.top = `-${scrolledBy}px`;
    document.body.style.position = 'fixed';
  }

  focusOnFirstElement() {
    this.firstFocusableModalElement.focus();
  }

  firstModalElHandler(e) {
    if (e.shiftKey && e.code === 'Tab') {
      e.preventDefault();
      this.lastFocusableModalElement.focus();
    }
  }

  lastModalElHandler(e) {
    if (e.code === 'Tab' && !e.shiftKey) {
      e.preventDefault();
      this.firstFocusableModalElement.focus();
    }
  }

  detectClickOutsideModal(e) {
    const mouseDownTarget = e.target;

    let mouseUpTarget;
    this.addEventListener(
      'mouseup',
      (e) => {
        mouseUpTarget = e.target;
        if (
          mouseDownTarget !== mouseUpTarget ||
          (mouseDownTarget !== this &&
            mouseDownTarget !== this.firstElementChild)
        ) {
          return;
        }
        this.querySelector('.back_button').click();
      },
      { once: true }
    );
  }

  detectEscapeKeydown(e) {
    if (e.code === 'Escape') {
      this.querySelector('.back_button').click();
    }
  }

  renderAlbumModal(object) {
    this.modalImageElement.src = object.Image;

    let fragment = `
      <div class="data_entry">
        <p class="data_title">Artists</p>
        <p class="data_content">${object.Artists.join(', ')}</p>
      </div>
      <div class="data_entry">
        <p class="data_title">Album type</p>
        <p class="data_content">${object['Album type']}</p>
      </div>
      <div class="data_entry">
        <p class="data_title">Release date</p>
        <p class="data_content">${object['Release date']}</p>
      </div>
      <div class="data_entry">
        <p class="data_title">Total tracks</p>
        <p class="data_content">${object['Total tracks']}</p>
      </div>
      <div class="data_entry">
        <p class="data_title">Spotify page</p>
        <p class="data_content">
          <a class="data_link" href="${
            object['Spotify page']
          }" target="_blank" rel="noreferrer noopener">Link</a>
        </p>
      </div>
    `;
    return fragment;
  }

  renderArtistModal(object) {
    this.modalImageElement.src = object.Image;

    let fragment = `
      <div class="data_entry">
        <p class="data_title">Genres</p>
        <p class="data_content">${object.Genres.join(', ')}</p>
      </div>
      <div class="data_entry">
        <p class="data_title">Followers</p>
        <p class="data_content">${object.Followers.total}</p>
      </div>
      <div class="data_entry">
        <p class="data_title">Popularity</p>
        <div class="data_content data_content--background">
          <span class="sr-only">${object.Popularity}</span>
          <div class="data_content--foreground" style="clip-path: inset(0 ${
            100 - object.Popularity
          }% 0 0);"></div>
        </div>
      </div>
      <div class="data_entry">
        <p class="data_title">Spotify page</p>
        <p class="data_content">
          <a class="data_link" href="${
            object['Spotify page']
          }" target="_blank" rel="noreferrer noopener">Link</a>
        </p>
      </div>
    `;
    return fragment;
  }

  renderSongModal(object) {
    this.modalImageElement.src = object.Image;
    let fragment;

    if (object['Audio link']) {
      this.audioController.render(object);
    }

    if (object.Explicit) {
      this.modalDataElement.classList.add('modal_data--explicit');
    }

    fragment = `
      <div class="data_entry">
        <p class="data_title">Artists</p>
        <p class="data_content">${object.Artists.join(', ')}</p>
      </div>
      <div class="data_entry">
        <p class="data_title">Album</p>
        <p class="data_content">${object.Album.name}</p>
      </div>
      <div class="data_entry">
        <p class="data_title">Duration</p>
        <p class="data_content">${Math.floor(object.Duration / 60000)}:${
      Math.round((object.Duration / 1000) % 60) < 10
        ? '0' + Math.round((object.Duration / 1000) % 60)
        : Math.floor((object.Duration / 1000) % 60)
    }</p>
      </div>
      <div class="data_entry">
        <p class="data_title">Popularity</p>
        <div class="data_content data_content--background">
          <span class="sr-only">${object.Popularity}</span>
          <div class="data_content--foreground" style="clip-path: inset(0 ${
            100 - object.Popularity
          }% 0 0);"></div>
        </div>
      </div>
      <div class="data_entry">
        <p class="data_title">Song number</p>
        <p class="data_content">${object['Song number']}</p>
      </div>
      <div class="data_entry">
        <p class="data_title">Spotify page</p>
        <p class="data_content">
          <a class="data_link" href="${
            object['Spotify page']
          }" target="_blank" rel="noreferrer noopener">Link</a>
        </p>
      </div>
    `;
    return fragment;
  }
}
