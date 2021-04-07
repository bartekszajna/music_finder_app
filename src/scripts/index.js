import '../styles/style.scss';
import App from './App';

App.start();
//const audio = document.querySelector('.audio');

// document.querySelector('.audio_button').addEventListener('click', function (e) {
//   console.log(this);
//   this.classList.toggle('audio_button--playing');
//   if (audio.paused) {
//     audio.play();
//   } else audio.pause();
// });
let mediaQueryObject = window.matchMedia('(min-width: 1200px)');

if (mediaQueryObject.matches) {
  document
    .querySelector('.search_input')
    .setAttribute('placeholder', 'Search for album, artist or song...');
  document
    .querySelectorAll('.button_text')
    .forEach((button) => button.classList.remove('sr-only'));
} else {
  document
    .querySelector('.search_input')
    .setAttribute('placeholder', 'Album, artist or song...');
  document
    .querySelectorAll('.button_text')
    .forEach((button) => button.classList.add('sr-only'));
}

mediaQueryObject.addEventListener('change', function (e) {
  if (e.matches) {
    document
      .querySelector('.search_input')
      .setAttribute('placeholder', 'Search for album, artist or song...');
    document
      .querySelectorAll('.button_text')
      .forEach((button) => button.classList.remove('sr-only'));
  } else {
    document
      .querySelector('.search_input')
      .setAttribute('placeholder', 'Album, artist or song...');
    document
      .querySelectorAll('.button_text')
      .forEach((button) => button.classList.add('sr-only'));
  }
});

// function resizeVhUnit() {
//   // initial setting, for page load
//   let vh = window.innerHeight * 0.01;
//   document.documentElement.style.setProperty('--vh', `${vh}px`);

//   window.addEventListener('resize', () => {
//     let vh = window.innerHeight * 0.01;
//     document.documentElement.style.setProperty('--vh', `${vh}px`);
//   });
// }
