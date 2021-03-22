import '../styles/style.scss';

// searchInput.addEventListener(
//   'input',
//   apiController.fetchSearchSuggestions.bind(apiController),
//   500
// );

class SuggestionsList {
  constructor() {
    this.suggestionsListElement = document.querySelector('ul');

    // this.suggestionsListElement.addEventListener(
    //   'click',
    //   this.setInputValue.bind(this)
    // );

    this.suggestionsListElement.addEventListener(
      'keydown',
      this.listNavigation.bind(this)
    );

    this.suggestionsListElement.addEventListener('focusin', (e) => {
      this.inputSearchElement.value = e.target.innerText;
    });

    this.suggestionsListElement.addEventListener(
      'click',
      this.submitSearchForm.bind(this)
    );
  }

  submitSearchForm() {
    this.formSearchElement.dispatchEvent(
      new Event('submit', { cancelable: true })
    );
  }

  listNavigation(e) {
    if (e.code === 'Enter') {
      this.submitSearchForm();
    }
    let hasNextSibling = e.target.nextElementSibling;
    let hasPreviousSibling = e.target.previousElementSibling;

    if (e.code === 'ArrowDown' && hasNextSibling) {
      e.target.nextElementSibling.focus();
    }
    if (e.code === 'ArrowDown' && !hasNextSibling) {
      this.inputSearchElement.focus();
    }
    if (e.code === 'ArrowUp' && hasPreviousSibling) {
      e.target.previousElementSibling.focus();
    }
    if (e.code === 'ArrowUp' && !hasPreviousSibling) {
      this.inputSearchElement.focus();
    }
  }

  // setInputValue(e) {
  //   if (e.target !== e.currentTarget) {
  //     console.log(e);
  //     this.inputSearchElement.value = e.target.innerText;
  //   }
  // }

  render(listToRender) {
    // clear it out before every re-rendering
    this.suggestionsListElement.innerText = '';

    listToRender.forEach((suggestion, index) => {
      let li = document.createElement('li');
      console.log(suggestion, index);
      li.tabIndex = -1;
      li.className = 'list_item';
      li.innerText = suggestion;
      this.suggestionsListElement.append(li);
    });
  }
}

class SearchController {
  constructor() {
    this.searchValue;
    this.formSearchElement = document.querySelector('form');
    this.inputSearchElement = document.querySelector('input');
    this.fetchAddress = 'https://warm-temple-70787.herokuapp.com/search?q=';

    this.inputSearchElement.addEventListener(
      'input',
      App.throttledFunction(this.suggestionsHandler.bind(this), 500)
    );
    this.inputSearchElement.addEventListener(
      'keydown',
      this.arrowKeysHandler.bind(this)
    );

    this.formSearchElement.addEventListener('submit', (e) => {
      e.preventDefault();
      this.searchValue = e.target.firstElementChild.value;
      //let value = e.target.firstElementChild.value;

      this.suggestionsListElement.innerText = '';
      if (this.searchValue) {
        console.log('submited!', this.searchValue);
      }
    });

    // this.inputSearchElement.addEventListener('blur', (e) => {
    //   let newSearchValue = e.currentTarget.value;

    //   if (e.relatedTarget !== null || newSearchValue === this.searchValue) {
    //     return;
    //   }
    //   console.log(e);
    // });
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
    this.searchValue = this.inputSearchElement.value;
    if (!this.searchValue || this.searchValue.length < 3) {
      this.suggestionsListElement.innerText = '';
      return;
    }

    const data = await this.fetchSearchSuggestions(this.searchValue);

    const list = this.prepareData(data);

    this.renderFunction(list);
  }

  async fetchSearchSuggestions(value) {
    const response = await fetch(
      `${this.fetchAddress}${encodeURIComponent(value)}`
    );

    const data = await response.json();
    return data;
  }

  prepareData(data) {
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

// function throttle(func, delay) {
//   var lastTime = 0;
//   return function (...args) {
//     var now = Date.now();
//     if (now - lastTime >= delay) {
//       func(...args);
//       lastTime = now;
//     }
//   };
// }

class App {
  static throttledFunction(fn, delay) {
    var lastTime = 0;
    return function (...args) {
      var now = Date.now();
      if (now - lastTime >= delay) {
        fn(...args);
        lastTime = now;
      }
    };
  }

  static start() {
    const suggestionsList = new SuggestionsList();
    const searchController = new SearchController();

    suggestionsList.formSearchElement = searchController.formSearchElement;
    suggestionsList.inputSearchElement = searchController.inputSearchElement;

    searchController.suggestionsListElement =
      suggestionsList.suggestionsListElement;

    searchController.renderFunction = suggestionsList.render.bind(
      suggestionsList
    );
    //console.dir(this);
    //this.addBodyClickListener(searchController);
  }

  // static addBodyClickListener(searchController) {
  //   document.body.addEventListener('click', (e) => {
  //     if (!e.target.contains(document.querySelector('nav'))) {
  //       return;
  //     } else {
  //       searchController.formSearchElement.dispatchEvent(
  //         new Event('submit', { cancelable: true })
  //       );
  //       searchController.inputSearchElement.value = '';
  //     }
  //   });
  // }
}

App.start();

//
//
//     .then((data) => {
//       this.suggestionsList.innerText = '';
//       let arrayOfResults = [];

//       for (let prop of Object.keys(data)) {
//         data[prop].items.forEach((listItem) => {
//           arrayOfResults.push(listItem.name);
//         });
//       }
//       // to rule out repeated results -> they look bad in suggestions
//       arrayOfResults = new Set(arrayOfResults);

//       arrayOfResults.forEach((result) => {
//         let li = document.createElement('li');
//         li.innerText = result;
//         this.suggestionsList.append(li);
//       });
//     })
//     .catch((e) => console.log(e));

// function fetchData(inputValue) {
//   fetch(
//     `https://warm-temple-70787.herokuapp.com/search?q=${encodeURIComponent(
//       inputValue
//     )}`
//   )
//     .then((res) => res.json())
//     .then((data) => {
//       // here comes the logic behind preparing
//       // and displaying items (tiles) to the user
//       list.innerText = '';
//       let arrayOfResults = [];

//       for (let prop of Object.keys(data)) {
//         data[prop].items.forEach((listItem) => {
//           arrayOfResults.push(listItem.name);
//         });
//       }
//       // to rule out repeated results -> they look bad in suggestions
//       arrayOfResults = new Set(arrayOfResults);

//       arrayOfResults.forEach((result) => {
//         let li = document.createElement('li');
//         li.innerText = result;
//         list.append(li);
//       });
//     })
//     .catch((e) => console.log('something went wrong'));
// }

// const apiController = new APIController(searchInput, suggestionsList);

// function throttle(func, delay) {
//   var lastTime = 0;
//   return function (...args) {
//     var now = Date.now();
//     if (now - lastTime >= delay) {
//       func(...args);
//       lastTime = now;
//     }
//   };
// }

// suggestionsList.addEventListener('click', (e) => {
//   searchInput.value = e.target.innerText;
//   e.currentTarget.innerHTML = '';
//   console.log('click');
//   //input.dispatchEvent(new Event('change', { bubbles: true }));
// });

// searchInput.addEventListener('change', (e) => {
//   console.log('change');
//   console.log(input.value);
// });
