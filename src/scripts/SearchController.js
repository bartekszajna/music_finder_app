import UIController from './UIController';
import App from './App';
const spinner = document.querySelector('.spinner');
const container = document.querySelector('.container');
export default class SearchController {
  constructor() {
    this.previousInputValue = '';
    this.formSearchElement = document.querySelector('.header_search');
    this.inputSearchElement = document.querySelector('.search_input');
    this.fetchAddress = 'https://warm-temple-70787.herokuapp.com/search?q=';

    this.inputSearchElement.addEventListener(
      'input',
      App.throttledFunction(this.suggestionsHandler.bind(this), 500)
    );
    this.inputSearchElement.addEventListener(
      'keydown',
      this.arrowKeysHandler.bind(this)
    );

    this.formSearchElement.addEventListener(
      'submit',
      this.submissionHandler.bind(this)
    );
  }

  async submissionHandler(e) {
    e.preventDefault();
    console.dir(e.target);
    let inputValue = e.target[0].value.trim();

    // to make sure we do not make unnecessary repeated API calls
    // for the exact same data
    if (this.previousInputValue.trim() === inputValue || !inputValue) {
      return;
    }
    document.querySelector('.container').innerHTML = '';
    this.previousInputValue = inputValue;

    this.suggestionsListElement.innerText = '';

    // here comes the whole logic behind fetching all the tiles
    console.log('submited!', inputValue);
    spinner.style.display = 'block';
    const data = await this.fetchData(inputValue);

    const listOfItems = this.prepareItems(data);
    this.renderList();
    spinner.style.display = 'none';
  }

  arrowKeysHandler(e) {
    if (!this.suggestionsListElement.firstElementChild) {
      return;
    }
    if (e.code === 'ArrowUp') {
      //console.log(e);
      this.suggestionsListElement.lastElementChild.focus();
    }
    if (e.code === 'ArrowDown') {
      //console.log(e);
      this.suggestionsListElement.firstElementChild.focus();
    }
  }

  async suggestionsHandler() {
    let inputValue = this.inputSearchElement.value;
    if (!inputValue || inputValue.length < 3) {
      this.suggestionsListElement.innerText = '';
      return;
    }

    const data = await this.fetchData(inputValue);

    const list = this.prepareSuggestionsData(data);

    this.renderListFunction(list);
  }

  async fetchData(value) {
    const response = await fetch(
      `${this.fetchAddress}${encodeURIComponent(value)}`
    );

    const data = await response.json();
    return data;
  }

  prepareSuggestionsData(data) {
    let arrayOfResults = [];

    for (let prop of Object.keys(data)) {
      data[prop].items.forEach((listItem) => {
        arrayOfResults.push(listItem.name);
      });
    }
    // to rule out repeated results -> they look bad in suggestions
    arrayOfResults = new Set(arrayOfResults);
    arrayOfResults = Array.from(arrayOfResults);

    return arrayOfResults;
  }
}
