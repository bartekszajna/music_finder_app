import Item from './Item';

export default class TrackItem extends Item {
  constructor(
    type,
    name,
    id,
    external_url,
    image,
    album,
    artists,
    duration_ms,
    explicit,
    popularity,
    preview_url,
    track_number
  ) {
    super(type, id, name, external_url, image);
    this.album = album;
    this.artists = artists.map((artist) => artist.name);
    this.duration_ms = duration_ms;
    this.explicit = explicit;
    this.popularity = popularity;
    this.preview_url = preview_url;
    this.track_number = track_number;
  }
}
