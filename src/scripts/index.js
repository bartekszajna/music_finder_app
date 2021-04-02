import '../styles/style.scss';
import App from './App';

App.start();
const audio = document.querySelector('.audio');

document.querySelector('.audio_button').addEventListener('click', function (e) {
  console.log(this);
  this.classList.toggle('audio_button--playing');
  if (audio.paused) {
    audio.play();
  } else audio.pause();
});
