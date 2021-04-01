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
    searchController.renderItemsList = uiController.renderItemsList.bind(
      uiController
    );
    searchController.uiController = uiController;

    suggestionsList.formSearchElement = searchController.formSearchElement;
    suggestionsList.inputSearchElement = searchController.inputSearchElement;

    searchController.suggestionsListElement =
      suggestionsList.suggestionsListElement;
    searchController.renderSuggestionsList = suggestionsList.render.bind(
      suggestionsList
    );

    uiController.searchController = searchController;
    uiController.suggestionsListElement =
      suggestionsList.suggestionsListElement;

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

  static addBodyScrollListener(searchController) {
    let options = {
      root: null,
      rootMargin: '100px',
    };

    function fireOnScroll(entry) {
      if (entry[0].isIntersecting) {
        let event = new Event('submit', { cancelable: true });
        event.loadOnScroll = true;
        searchController.formSearchElement.dispatchEvent(event);
        console.log('XD');
      }
    }

    let observer = new IntersectionObserver(fireOnScroll, options);
    let target = document.body.querySelector('.container').lastElementChild;
    observer.observe(target);
    return observer;
  }
}
