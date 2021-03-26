import AlbumItem from './AlbumItem';
import ArtistItem from './ArtistItem';
import TrackItem from './TrackItem';
//import DefaultImage from '../assets/default_image.svg';

export default class UIController {
  constructor() {
    this.listOfItems;
    this.container = document.querySelector('.container');
  }
  prepareItems(data) {
    const listOfItems = [];

    for (const group of Object.keys(data)) {
      data[group].items.forEach((item) => {
        let obj;
        switch (group) {
          case 'albums': {
            obj = new AlbumItem(
              item.type,
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
              item.type,
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
              item.type,
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
        listOfItems.push(obj);
      });
    }
    this.listOfItems = listOfItems;
    console.log(this.listOfItems);
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

  async renderList() {
    let arrayOfPromises = await this.loadAllImages();
    //console.log(arrayOfPromises);
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
      itemButtonLike.innerHTML = '<span hidden>Add to favourites</span>';

      itemData.append(itemTitle);
      itemData.append(itemSubtitle);

      itemButtons.append(itemButtonInfo);
      itemButtons.append(itemButtonLike);

      itemData.append(itemButtons);

      this.container.append(item);

      item.append(itemImage);
      item.append(itemData);

      this.container.append(item);
    });
    this.container.classList.add('container--visible');
    this.container.addEventListener('click', this.renderModal.bind(this));
  }

  renderModal(e) {
    console.log(this);
    if (!e.target.dataset.item) {
      return;
    } else {
      let object = JSON.parse(e.target.dataset.item);
      switch (object.type) {
        case 'album': {
          this.renderAlbumModal(object);
          break;
        }
        case 'artist': {
          this.renderArtistModal(object);
          break;
        }
        case 'track': {
          this.renderTrackModal(object);
          break;
        }
      }
    }
  }

  renderAlbumModal(object) {
    console.log(object.artists);
  }
}
