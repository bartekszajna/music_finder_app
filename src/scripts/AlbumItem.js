import Item from './Item';

export default class AlbumItem extends Item {
  constructor(
    type,
    name,
    id,
    external_url,
    image,
    album_type,
    artists,
    release_date,
    total_tracks
  ) {
    super(type, id, name, external_url, image);
    this['Album type'] = album_type;
    this.Artists = artists.map((artist) => artist.name);
    this['Release date'] = release_date;
    this['Total tracks'] = total_tracks;
  }
}
