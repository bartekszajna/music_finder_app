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
    this.album_type = album_type;
    this.artists = artists.map((artist) => artist.name);
    this.release_date = release_date;
    this.total_tracks = total_tracks;
  }
}
