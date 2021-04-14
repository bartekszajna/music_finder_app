import SuggestionsList from './SuggestionsList';
import SearchController from './SearchController';
import UIController from './UIController';
import AudioController from './AudioController';
import ModeController from './ModeController';
import FavoritesController from './FavoritesController';

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
    const audioController = new AudioController();
    const modeController = new ModeController();
    const favoritesController = new FavoritesController();

    searchController.prepareItems = uiController.prepareItems.bind(
      uiController
    );
    searchController.renderItemsList = uiController.renderItemsList.bind(
      uiController
    );
    searchController.uiController = uiController;

    suggestionsList.formSearchElement = searchController.formSearchElement;
    suggestionsList.inputSearchElement = searchController.inputSearchElement;

    searchController.itemsContainer = uiController.itemsContainer;
    searchController.suggestionsListElement =
      suggestionsList.suggestionsListElement;
    searchController.renderSuggestionsList = suggestionsList.render.bind(
      suggestionsList
    );

    searchController.hideItemsContainer = uiController.hideItemsContainer.bind(
      uiController
    );

    searchController.clearItemsContainer = uiController.clearItemsContainer.bind(
      uiController
    );

    uiController.searchController = searchController;
    uiController.suggestionsListElement =
      suggestionsList.suggestionsListElement;

    uiController.audioController = audioController;
    uiController.showLoader = searchController.showLoader.bind(
      searchController
    );
    uiController.hideLoader = searchController.hideLoader.bind(
      searchController
    );

    favoritesController.hideItemsContainer = uiController.hideItemsContainer.bind(
      uiController
    );
    favoritesController.clearItemsContainer = uiController.clearItemsContainer.bind(
      uiController
    );
    favoritesController.showItemsContainer = uiController.showItemsContainer.bind(
      uiController
    );
    favoritesController.renderItemsList = uiController.renderItemsList.bind(
      uiController
    );

    this.displayWidthHandler();
    this.addBodyClickListener(searchController);
    this.preventWindowArrowScroll();
  }

  static addBodyClickListener(searchController) {
    function blurHandler(e) {
      if (
        e.target !== document.querySelector('.items_container') &&
        !e.target.contains(document.querySelector('.header')) &&
        e.target !== document.querySelector('.header_logo')
      ) {
        return;
      } else {
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
      }
    }

    let observer = new IntersectionObserver(fireOnScroll, options);
    let target = document.body.querySelector('.items_container')
      .lastElementChild;
    observer.observe(target);
    return observer;
  }

  static displayWidthHandler() {
    const mediaQueryObject = window.matchMedia('(min-width: 1200px)');

    const searchInput = document.querySelector('.search_input');
    const headerButtons = document.querySelectorAll('.button_text');

    if (mediaQueryObject.matches) {
      searchInput.setAttribute(
        'placeholder',
        'Search for album, artist or song...'
      );
      headerButtons.forEach((button) => button.classList.remove('sr-only'));
    } else {
      searchInput.setAttribute('placeholder', 'Album, artist or song...');
      headerButtons.forEach((button) => button.classList.add('sr-only'));
    }

    mediaQueryObject.addEventListener('change', function (e) {
      if (e.matches) {
        searchInput.setAttribute(
          'placeholder',
          'Search for album, artist or song...'
        );
        headerButtons.forEach((button) => button.classList.remove('sr-only'));
      } else {
        searchInput.setAttribute('placeholder', 'Album, artist or song...');
        headerButtons.forEach((button) => button.classList.add('sr-only'));
      }
    });
  }
}
