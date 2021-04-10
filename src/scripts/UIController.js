import AlbumItem from './AlbumItem';
import ArtistItem from './ArtistItem';
import TrackItem from './TrackItem';
import App from './App';
import AudioController from './AudioController';

export default class UIController {
  constructor() {
    this.intersectionObserverObject;
    this.searchController;
    this.audioController;
    this.suggestionsListElement;
    this.listOfItems;
    this.audioElement;
    this.modalAudioButtonElement;
    this.modalLinkElement;
    this.clickedInfoButton;
    this.firstFocusableModalElement;
    this.lastFocusableModalElement;
    this.audioContainerElement = document.querySelector('.audio_container');
    this.itemsContainer = document.querySelector('.items_container');
    this.modalContainer = document.querySelector('.modal_container');
    this.modalElement = document.querySelector('.modal');
    this.modalImageElement = document.querySelector('.modal_image');
    this.modalDataElement = document.querySelector('.modal_data');
    this.modalBackButtonElement = document.querySelector('.back_button');
    this.modalLikeButtonElement = document.querySelector('.like_button');

    this.itemsContainer.addEventListener('click', this.renderModal.bind(this));

    this.modalBackButtonElement.addEventListener(
      'click',
      this.closeModal.bind(this)
    );
  }

  closeModal() {
    console.log('XD');
    //this.audioContainerElement.classList.remove('audio_container--visible');
    this.modalContainer.classList.remove('modal_container--visible');
    this.modalDataElement.classList.remove('modal_data--explicit');
    this.modalDataElement.innerHTML = '';
    //this.audioElement.src = 'null';
    this.audioController.remove();
    document.body.classList.remove('modal--opened');

    const scrollY = document.body.style.top;
    document.body.style.position = '';
    document.body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
    document.body.style.paddingRight = '20px';

    document.querySelector('.modal_overflow').style.marginRight = '';

    //document.documentElement.classList.remove('modal--opened');
    //document.html.classList.remove('modal--opened');

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

    this.clickedInfoButton.focus();
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
              //item.type,
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
              //item.type,
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
              //item.type,
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
        // here we switch the position of albums and artists so the latter come first
        // default order would be to albums go first
        // if (obj.type === 'Artist') {
        //   listOfItems.unshift(obj);
        // } else {
        //   listOfItems.push(obj);
        // }

        listOfItems.push(obj);
      });
    }
    listOfItems.sort((a, b) => {
      if (a.Popularity < b.Popularity) return 1;
      if (a.Type === 'Artist') return -1;
      if (b.Type === 'Artist') return 1;
    });
    this.listOfItems = listOfItems;
    console.log(this.listOfItems);
    return totalItemsAmount;
  }

  async loadAllImages() {
    let arrayOfPromises = [];
    this.listOfItems.forEach((item) => {
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

  async renderItemsList(totalItemsAmount, fetchedDataOffset) {
    if (totalItemsAmount === 0) {
      this.itemsContainer.insertAdjacentHTML(
        'beforeEnd',
        `<p class="amount_header">No results available</p>`
      );
      return;
    }

    if (!this.listOfItems.length) {
      if (this.intersectionObserverObject instanceof IntersectionObserver) {
        this.intersectionObserverObject.disconnect();
      }
      return;
    }

    let arrayOfPromises = await this.loadAllImages();
    console.log(arrayOfPromises);

    arrayOfPromises.forEach((promise) => {
      let item = document.createElement('div');
      item.className = 'item';

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

      let itemButtonInfo = document.createElement('button');
      itemButtonInfo.className = 'item_button--info';
      itemButtonInfo.innerText = 'More info';
      itemButtonInfo.dataset.item = JSON.stringify(promise.value.item);

      let itemButtonLike = document.createElement('button');
      itemButtonLike.className = 'item_button--like';
      itemButtonLike.innerHTML =
        '<span class="sr-only">Add to favourites</span>';

      itemData.append(itemTitle);
      itemData.append(itemSubtitle);

      itemButtons.append(itemButtonInfo);
      itemButtons.append(itemButtonLike);

      itemData.append(itemButtons);

      item.append(itemImage);
      item.append(itemData);

      this.itemsContainer.append(item);
    });

    if (fetchedDataOffset === 0) {
      this.itemsContainer.insertAdjacentHTML(
        'afterBegin',
        `<p class="amount_header">${totalItemsAmount} total results</p>`
      );
    }
    const spinner = document.querySelector('.spinner');
    spinner.classList.remove('spinner--visible');

    this.itemsContainer.classList.add('visible');
    // they are created every time the renderItemsList is evoked and accumulate unnecessary
    // which causes more data loading if we scroll through old items back and forth
    // so we need to disconnect the old observers
    if (this.intersectionObserverObject instanceof IntersectionObserver) {
      this.intersectionObserverObject.disconnect();
    }

    // we hold reference to this object so we can disconnect it above in next calls
    this.intersectionObserverObject = App.addBodyScrollListener(
      this.searchController
    );

    this.suggestionsListElement.innerHTML = '';
    //this.searchController.inputSearchElement.blur();
    //this.container.addEventListener('click', this.renderModal.bind(this));
  }

  renderModal(e) {
    if (!e.target.dataset.item) {
      return;
    }

    this.clickedInfoButton = e.target;
    let object = JSON.parse(e.target.dataset.item);
    let type = object.Type;
    console.log(object);
    delete object.Id;
    delete object.Type;
    delete object.Name;
    let fragment;
    switch (type) {
      case 'Album': {
        fragment = this.renderAlbumModal(object);
        break;
      }
      case 'Artist': {
        fragment = this.renderArtistModal(object);
        break;
      }
      case 'Song': {
        fragment = this.renderSongModal(object);
        break;
      }
    }

    document.body.style.paddingRight = `${
      window.innerWidth - document.documentElement.clientWidth + 20
    }px`;
    document.querySelector('.modal_overflow').style.marginRight = `${
      window.innerWidth - document.documentElement.clientWidth
    }px`;

    this.modalDataElement.insertAdjacentHTML('afterBegin', fragment);

    console.log(this);

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

    this.modalContainer.classList.add('modal_container--visible');
    //document.body.classList.add('modal--opened');
    //document.documentElement.classList.add('modal--opened');

    let scrolledBy = window.scrollY;
    document.body.style.top = `-${scrolledBy}px`;
    document.body.style.position = 'fixed';
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
