export default class AudioController {
  constructor() {
    this.audioContainerElement = document.querySelector('.audio_container');
    this.audioElement;
    this.audioButtonElement;
    this.audioPathElement;
    this.pathLength;

    this.audioContainerElement.addEventListener(
      'click',
      this.playingHandler.bind(this)
    );
  }

  playingHandler(e) {
    if (e.target !== this.audioButtonElement) {
      return;
    }

    if (this.audioElement.paused) {
      this.playAudio();
    } else {
      this.audioElement.pause();
      this.audioButtonElement.classList.remove('audio_button--playing');
    }
  }

  async playAudio() {
    try {
      this.audioButtonElement.classList.add('audio_button--playing');
      await this.audioElement.play();
    } catch (error) {
      this.audioButtonElement.classList.remove('audio_button--playing');
    }
  }

  render(object) {
    let fragment = `
      <audio class="audio">
        <source
          class="audio_source"
          src="${object['Audio link']}"
        />
      </audio>
      <button class="audio_button" type="button">
        <span class="sr-only">Play music</span>
      </button>
      <svg
        class="audio_svg"
        width="100"
        height="100"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          class="audio_path"
          cx="50"
          cy="50"
          r="46"
          stroke="#00256C"
          stroke-width="8"
        />
      </svg>
      `;

    this.audioContainerElement.insertAdjacentHTML('afterBegin', fragment);
    this.audioContainerElement.classList.add('audio_container--visible');

    this.audioElement = document.querySelector('.audio');
    this.audioButtonElement = document.querySelector('.audio_button');
    this.audioPathElement = document.querySelector('.audio_path');
    this.pathLength = this.audioPathElement.getTotalLength();

    this.audioPathElement.style.strokeDasharray = this.pathLength;
    this.audioPathElement.style.strokeDashoffset = this.pathLength;

    this.audioElement.addEventListener(
      'timeupdate',
      this.updateAudioPath.bind(this)
    );
  }

  updateAudioPath(e) {
    let currentTime = this.audioElement.currentTime;
    let duration = this.audioElement.duration;
    let pathLength = this.pathLength;
    let progress = pathLength - (currentTime / duration) * pathLength;
    this.audioPathElement.style.strokeDashoffset = progress;
    if (currentTime === duration) {
      this.audioButtonElement.classList.remove('audio_button--playing');
    }
  }

  remove() {
    this.audioContainerElement.classList.remove('audio_container--visible');
    let container = this.audioContainerElement;
    container.innerHTML = '';
  }
}
