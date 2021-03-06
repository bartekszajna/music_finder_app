import App from './App';

export default class SearchController {
  constructor() {
    this.prepareItems;
    this.fetchedDataOffset = 0;
    this.previousInputValue = '';
    this.suggestionsListElement;
    this.hideItemsContainer;
    this.clearItemsContainer;
    this.showPopup;
    this.favoritesButtonElement = document.querySelector('.button--user');
    this.formSearchElement = document.querySelector('.header_search');
    this.inputSearchElement = document.querySelector('.search_input');
    this.fetchAddress = '/search?q=';
    this.loaderElement = document.querySelector('.loader');

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

  showLoader() {
    this.loaderElement.classList.add('loader--visible');
  }

  hideLoader() {
    this.loaderElement.classList.remove('loader--visible');
  }

  setPreviousInputValue(value) {
    this.previousInputValue = value;
  }

  async submissionHandler(e) {
    e.preventDefault();
    this.inputSearchElement.blur();

    let inputValue = e.target[0].value.trim();
    // to make sure we do not make unnecessary repeated API calls
    // for the exact same data

    // e.loadOnScroll to denote if this event comes from dynamic loading on scroll
    // we attach this property to event just before dispatching it
    // so its basically the way to transfer data and to inform submissionHandler
    // what exact submission type was made (from input submission or from scrolling down the page)
    // without that we wouldn't be able to get through below if statements because
    // in fact, when we scroll our input value doesn't change and we want to fetch new data anyway
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
      this.hideItemsContainer();
      this.clearItemsContainer();
      window.scrollTo(0, 0);
      this.favoritesButtonElement.setAttribute('aria-expanded', 'false');
    }

    this.previousInputValue = inputValue;

    this.suggestionsListElement.innerText = '';
    this.formSearchElement.setAttribute('aria-expanded', 'false');
    this.inputSearchElement.setAttribute('aria-autocomplete', '');

    this.showLoader();

    try {
      const data = await this.fetchData(inputValue, this.fetchedDataOffset);

      if (data.error) {
        throw new Error(data.error.message);
      }

      const [listOfItems, totalItemsAmount] = this.prepareItems(data);

      this.renderItemsList(
        listOfItems,
        totalItemsAmount,
        this.fetchedDataOffset,
        false
      );

      this.fetchedDataOffset += 3;
    } catch (errorObject) {
      this.hideLoader();
      this.showPopup(
        errorObject.message + '. Please, try refreshing the page.'
      );
    }
  }

  arrowKeysHandler(e) {
    if (!this.suggestionsListElement.firstElementChild) {
      return;
    }
    if (e.code === 'ArrowUp') {
      this.suggestionsListElement.lastElementChild.focus();
      this.inputSearchElement.setAttribute(
        'aria-activedescendant',
        this.suggestionsListElement.lastElementChild.id
      );
    }
    if (e.code === 'ArrowDown') {
      this.suggestionsListElement.firstElementChild.focus();
      this.inputSearchElement.setAttribute(
        'aria-activedescendant',
        this.suggestionsListElement.firstElementChild.id
      );
    }
  }

  async suggestionsHandler() {
    let inputValue = this.inputSearchElement.value;
    if (!inputValue || inputValue.length < 3) {
      this.suggestionsListElement.innerText = '';
      this.formSearchElement.setAttribute('aria-expanded', 'false');
      this.inputSearchElement.setAttribute('aria-autocomplete', '');
      return;
    }
    try {
      const data = await this.fetchData(inputValue, 0);
      if (data.error) {
        throw new Error(data.error.message);
      }
      const list = this.prepareSuggestionsData(data);
      this.renderSuggestionsList(list);
    } catch (errorObject) {
      this.showPopup(
        errorObject.message + '. Please, try refreshing the page.'
      );
    }
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
