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
    this.Album = album;
    this.Artists = artists.map((artist) => artist.name);
    this.Duration = duration_ms;
    this.Explicit = explicit;
    this.Popularity = popularity;
    this['Audio link'] = preview_url;
    this['Song number'] = track_number;
  }
}
