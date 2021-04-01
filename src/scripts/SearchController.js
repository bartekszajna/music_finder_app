import UIController from './UIController';
import App from './App';
const spinner = document.querySelector('.spinner');
const container = document.querySelector('.container');
export default class SearchController {
  constructor() {
    this.fetchedDataOffset = 0;
    this.previousInputValue = '';
    this.suggestionsListElement;
    this.formSearchElement = document.querySelector('.header_search');
    this.inputSearchElement = document.querySelector('.search_input');
    this.fetchAddress = 'https://warm-temple-70787.herokuapp.com/search?q=';

    this.inputSearchElement.addEventListener(
      'input',
      App.throttledFunction(this.suggestionsHandler.bind(this), 400)
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
    console.log(this.fetchedDataOffset);
    e.preventDefault();
    let inputValue = e.target[0].value.trim();
    // to make sure we do not make unnecessary repeated API calls
    // for the exact same data

    // e.loadOnScroll to denote if this event comes from dynamic loading on scroll
    // we attach this property to event just before dispatching it
    // so its basically the way to transfer data and to inform submissionHandler
    // what exact submission type was made
    // without that we wouldn't be able to get through below if statements because
    // in fact, our input value didn't change
    if (this.previousInputValue.trim() !== inputValue) {
      this.fetchedDataOffset = 0;
    }

    if (
      !e.loadOnScroll &&
      (this.previousInputValue.trim() === inputValue || !inputValue)
    ) {
      return;
    }

    if (this.fetchedDataOffset === 0) {
      document.querySelector('.container').innerHTML = '';
    }
    console.log('fetching');
    this.previousInputValue = inputValue;

    this.suggestionsListElement.innerText = '';

    // here comes the whole logic behind fetching all the tiles
    spinner.style.display = 'block';
    const data = await this.fetchData(inputValue, this.fetchedDataOffset);
    // here can come data actually being an error JSON, like 404 or 429
    // so remember to implement fallback for this situation
    console.log(data);
    const totalItemsAmount = this.prepareItems(data);

    this.renderItemsList(totalItemsAmount, this.fetchedDataOffset);

    this.fetchedDataOffset += 3;
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

    const data = await this.fetchData(inputValue, 0);

    const list = this.prepareSuggestionsData(data);

    this.renderSuggestionsList(list);
  }

  async fetchData(value, offset) {
    let queryString = `${this.fetchAddress}${encodeURIComponent(value)}`;

    if (offset !== 0) {
      queryString += `&offset=${offset}`;
    }

    const response = await fetch(queryString);
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
