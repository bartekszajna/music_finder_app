import AlbumItem from './AlbumItem';
import ArtistItem from './ArtistItem';
import TrackItem from './TrackItem';
import App from './App';
//import DefaultImage from '../assets/default_image.svg';

export default class UIController {
  constructor() {
    this.intersectionObserverObject;
    this.searchController;
    this.suggestionsListElement;
    this.audioContainerElement = document.querySelector('.audio_container');
    this.audioElement = document.querySelector('.audio');
    this.listOfItems;
    this.container = document.querySelector('.container');
    this.modalContainer = document.querySelector('.modal_container');
    this.modalImageElement = document.querySelector('.modal_image');
    this.modalDataElement = document.querySelector('.modal_data');
    this.modalBackButtonElement = document.querySelector('.back_button');

    this.container.addEventListener('click', this.renderModal.bind(this));
    this.modalBackButtonElement.addEventListener(
      'click',
      this.closeModal.bind(this)
    );
  }

  closeModal() {
    this.audioContainerElement.classList.remove('audio_container--visible');
    this.modalContainer.classList.remove('modal_container--visible');
    this.modalDataElement.classList.remove('modal_data--explicit');
    this.modalDataElement.innerHTML = '';
    this.audioElement.src = 'null';
    document.body.classList.remove('modal--opened');
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
      this.container.insertAdjacentHTML(
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

      this.container.append(item);
    });

    if (fetchedDataOffset === 0) {
      this.container.insertAdjacentHTML(
        'afterBegin',
        `<p class="amount_header">${totalItemsAmount} total results</p>`
      );
    }

    this.container.classList.add('container--visible');

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
    } else {
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

      this.modalDataElement.insertAdjacentHTML('afterBegin', fragment);
      this.modalContainer.classList.add('modal_container--visible');
      document.body.classList.add('modal--opened');
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
        <a class="data_link" href="${object['Spotify page']}">Link</a>
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
        <p class="data_content">${object.Popularity}</p>
      </div>
      <div class="data_entry">
        <p class="data_title">Spotify page</p>
        <a class="data_link" href="${object['Spotify page']}">Link</a>
      </div>
    `;
    return fragment;
  }

  renderSongModal(object) {
    this.modalImageElement.src = object.Image;
    if (object['Audio link']) {
      this.audioElement.src = object['Audio link'];
      this.audioContainerElement.classList.add('audio_container--visible');
    }

    if (object.Explicit) {
      this.modalDataElement.classList.add('modal_data--explicit');
    }

    let fragment = `
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
        : Math.round((object.Duration / 1000) % 60)
    }</p>
      </div>
      <div class="data_entry">
        <p class="data_title">Popularity</p>
        <p class="data_content">${object.Popularity}</p>
      </div>
      <div class="data_entry">
        <p class="data_title">Song number</p>
        <p class="data_content">${object['Song number']}</p>
      </div>
      <div class="data_entry">
        <p class="data_title">Spotify page</p>
        <a class="data_link" href="${object['Spotify page']}">Link</a>
      </div>
    `;
    return fragment;
  }
}
