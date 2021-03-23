import Item from './Item';

export default class ArtistItem extends Item {
  constructor(
    type,
    name,
    id,
    external_url,
    image,
    followers,
    genres,
    popularity
  ) {
    super(type, id, name, external_url, image);
    this.followers = followers;
    this.genres = genres;
    this.popularity = popularity;
  }
}
