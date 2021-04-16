import '../styles/style.scss';
import App from './App';
document.fonts.ready.then(() => {
  document.body.animate([{ opacity: 0 }, { opacity: 1 }], {
    easing: 'ease-out',
    duration: 500,
    fill: 'forwards',
  });
  App.start();
});
