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
    this.Followers = followers;
    this.Genres = genres;
    this.Popularity = popularity;
  }
}
