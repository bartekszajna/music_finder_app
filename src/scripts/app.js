import SuggestionsList from './SuggestionsList';
import SearchController from './SearchController';
import UIController from './UIController';

export default class App {
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
    const uiController = new UIController();
    const suggestionsList = new SuggestionsList();
    const searchController = new SearchController();

    searchController.prepareItems = uiController.prepareItems.bind(
      uiController
    );
    searchController.renderList = uiController.renderList.bind(uiController);

    suggestionsList.formSearchElement = searchController.formSearchElement;
    suggestionsList.inputSearchElement = searchController.inputSearchElement;

    searchController.suggestionsListElement =
      suggestionsList.suggestionsListElement;
    searchController.renderListFunction = suggestionsList.render.bind(
      suggestionsList
    );

    this.addBodyClickListener(searchController);
    this.preventWindowArrowScroll();
  }

  static addBodyClickListener(searchController) {
    function blurHandler(e) {
      if (
        e.target !== document.querySelector('.container') &&
        !e.target.contains(document.querySelector('.header')) &&
        e.target !== document.querySelector('.header_logo')
      ) {
        return;
      } else {
        console.log('works');
        searchController.formSearchElement.dispatchEvent(
          new Event('submit', { cancelable: true })
        );
      }
    }
    document.body.addEventListener('click', blurHandler);
  }

  static preventWindowArrowScroll() {
    function disableArrowScroll(e) {
      if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
        e.preventDefault();
      }
    }
    window.addEventListener('keydown', disableArrowScroll);
  }
}
