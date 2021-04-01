import DefaultImage from '../assets/default_image.svg';

export default class Item {
  constructor(type, id, name, external_url, image) {
    this.type = type;
    this.name = name;
    this.id = id;
    this.external_url = external_url;
    //this.image = image.length ? image[1].url : false;
    this.image = image.length ? image[1].url : DefaultImage;
  }
}
