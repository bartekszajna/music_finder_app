export default class Item {
  constructor(type, id, name, external_url, image) {
    this.type = type;
    this.name = name;
    this.id = id;
    this.external_url = external_url;
    //this.image = image.length ? image[1].url : false;
    this.image = image.length
      ? image[1].url
      : 'https://icons-for-free.com/iconfiles/png/128/music+note+sound+icon-1320183235697157602.png';
  }
}
