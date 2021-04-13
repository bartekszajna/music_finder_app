import DefaultImage from '../assets/default_image.svg';

export default class Item {
  constructor(type, id, name, external_url, image) {
    this.Type = type;
    this.Name = name;
    this.Id = id;
    this['Spotify page'] = external_url;
    //this.image = image.length ? image[1].url : false;
    this.Image = image.length ? image[1].url : DefaultImage;
    //this.Liked = false;
  }
}
