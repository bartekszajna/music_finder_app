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
    this.listOfItems;
    this.container = document.querySelector('.container');

    this.container.addEventListener('click', this.renderModal.bind(this));
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
      if (a.popularity < b.popularity) return 1;
      if (a.type === 'Artist') return -1;
      if (b.type === 'Artist') return 1;
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
      imageElement.src = item.image;
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

    arrayOfPromises.forEach((promise) => {
      let item = document.createElement('div');
      item.className = 'item';

      let itemImage = promise.value.imageElement;
      itemImage.classList = 'item_image';

      let itemData = document.createElement('div');
      itemData.className = 'item_data';

      let itemTitle = document.createElement('p');
      itemTitle.className = 'item_title';
      itemTitle.innerText = `${promise.value.item.type}`;

      let itemSubtitle = document.createElement('p');
      itemSubtitle.className = 'item_subtitle';
      itemSubtitle.innerText = `${promise.value.item.name}`;

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
    console.log(e, this);
    document
      .querySelector('.modal_container')
      .classList.add('modal_container--visible');

    //document.classList.add('modal--opened');
    document.body.classList.add('modal--opened');
    if (!e.target.dataset.item) {
      return;
    } else {
      let object = JSON.parse(e.target.dataset.item);
      switch (object.type) {
        case 'Album': {
          this.renderAlbumModal(object);
          break;
        }
        case 'Artist': {
          this.renderArtistModal(object);
          break;
        }
        case 'Song': {
          this.renderSongModal(object);
          break;
        }
      }
    }
  }

  renderAlbumModal(object) {
    console.log(object.type);
  }

  renderArtistModal(object) {
    console.log(object.type);
  }

  renderSongModal(object) {
    console.log(object.type);
  }
}
