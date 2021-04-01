import '../styles/style.scss';
import App from './App';
console.log(document.querySelector('.back_button'));
document.querySelector('.back_button').addEventListener('click', (e) => {
  console.log('click');
  document
    .querySelector('.modal_container')
    .classList.remove('modal_container--visible');
  document.body.classList.remove('modal--opened');
});
App.start();
