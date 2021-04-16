export default class FavoritesController {
  constructor() {
    this.favoritesButtonElement = document.querySelector('.button--user');
    this.modalLikeButton = document.querySelector('.modal_checkbox');
    this.modalBackButton = document.querySelector('.back_button');
    this.popupElement = document.querySelector('.popup');
    this.favoritesNumberElement = this.favoritesButtonElement.querySelector(
      '.button_quantity'
    );
    this.itemsContainer = document.querySelector('.items_container');
    this.modalElement = document.querySelector('.modal');
    this.inputSearchElement;
    this.hideItemsContainer;
    this.clearItemsContainer;
    this.showItemsContainer;
    this.renderItemsList;
    this.showLoader;
    this.hideLoader;

    this.favoritesButtonElement.addEventListener(
      'click',
      this.favoritesButtonHandler.bind(this)
    );

    this.itemsContainer.addEventListener(
      'click',
      this.itemsLikeHandler.bind(this)
    );

    this.modalLikeButton.addEventListener(
      'click',
      this.itemsLikeHandler.bind(this)
    );

    this.modalLikeButton.addEventListener('keydown', this.detectEnterKey);
    this.itemsContainer.addEventListener('keydown', this.detectEnterKey);

    this.updateFavoritesQuantity();
  }

  favoritesButtonHandler(e) {
    if (
      e.target.getAttribute('aria-expanded') === 'true' ||
      e.target.parentElement.getAttribute('aria-expanded') === 'true'
    ) {
      return;
    }

    this.showLoader();
    this.hideItemsContainer();
    this.clearItemsContainer();
    window.scrollTo(0, 0);
    this.setPreviousInputValue('');
    this.inputSearchElement.value = '';
    this.favoritesButtonElement.setAttribute('aria-expanded', 'true');

    let listOfItems = [];
    Object.keys(localStorage).forEach(function (key) {
      if (key === 'mode' || key === 'loglevel:webpack-dev-server') {
        return;
      }
      listOfItems.push(JSON.parse(localStorage.getItem(key)));
    });

    this.renderItemsList(listOfItems, listOfItems.length, 0, true);
  }

  detectEnterKey(e) {
    if (
      e.target.className !== 'modal_checkbox' &&
      e.target.className !== 'item_checkbox'
    ) {
      return;
    }
    if (e.code === 'Enter') {
      e.target.click();
    }
  }

  itemsLikeHandler(e) {
    const itemId = e.target.id;

    if (!itemId) {
      return;
    }

    const itemData = e.target.dataset.item;
    const isItFromStorage = e.target.dataset.storage === 'true';

    let storageLimit = localStorage.getItem('mode') ? 20 : 19;
    if (e.target.checked && localStorage.length > storageLimit) {
      this.showPopup(
        'Max number of stored items exceeded. Please remove some of them to add new ones'
      );
      e.target.checked = false;
      return;
    }

    if (e.target === this.modalLikeButton) {
      let itemCounterpart = this.itemsContainer.querySelector(
        `[id="${itemId}"]`
      );
      itemCounterpart.checked = !itemCounterpart.checked;
      if (e.target.dataset.storage === 'true') {
        this.modalBackButton.dataset.remove = !itemCounterpart.checked;
      }
    }

    if (
      !e.target.checked &&
      isItFromStorage &&
      e.target !== this.modalLikeButton
    ) {
      e.target.disabled = true;
      e.target.setAttribute('aria-disabled', 'true');
      this.removeItemAnimation(itemId);
    }

    this.updateStorageList(itemId, itemData);
    this.updateFavoritesQuantity();
  }

  removeItemAnimation(idToRemove) {
    let elementToRemove = [...this.itemsContainer.children].find(
      (child) => child.dataset.itemId === idToRemove
    );

    const boundingBox = new Map(
      Array.from(this.itemsContainer.children).map((child) => [
        child,
        child.getBoundingClientRect(),
      ])
    );

    let animationObject = elementToRemove.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { easing: 'cubic-bezier(.1,.35,.38,1)', duration: 400 }
    );

    animationObject.finished.then(() => {
      elementToRemove.remove();

      const newBoundingBox = new Map(
        Array.from(this.itemsContainer.children).map((child) => [
          child,
          child.getBoundingClientRect(),
        ])
      );

      newBoundingBox.forEach((rect, child) => {
        let newPosX = rect.x;
        let oldPosX = boundingBox.get(child).x;
        let newPosY = rect.y;
        let oldPosY = boundingBox.get(child).y;
        let translateTransform = `translate(${oldPosX - newPosX}px, ${
          oldPosY - newPosY
        }px)`;

        child.animate(
          [
            { transform: `${translateTransform}` },
            { transform: 'translate(0,0)' },
          ],
          {
            easing: 'cubic-bezier(.1,.35,.38,1)',
            duration: 500,
          }
        );
      });
    });
  }

  updateStorageList(itemId, itemData) {
    const alreadyLiked = localStorage.getItem(itemId);

    if (alreadyLiked) {
      localStorage.removeItem(itemId);
      this.showPopup('Removed from favorites');
    } else {
      localStorage.setItem(itemId, itemData);
      this.showPopup('Added to favorites');
    }
  }

  showPopup(message) {
    //this.popupElement.classList.remove('popup--visible');
    //animation reflow
    //this.popupElement.offsetWidth;

    this.popupElement.innerText = `${message}`;

    //this.popupElement.classList.add('popup--visible');
    this.popupElement.animate(
      [
        { opacity: 0, visibility: 'visible', offset: 0 },
        { opacity: 1, offset: 0.16 },
        { opacity: 1, offset: 0.84 },
        { opacity: 0, visibility: 'hidden', offset: 1 },
      ],
      {
        fill: 'forwards',
        easing: 'ease-in-out',
        duration: 3000,
      }
    );
  }

  updateFavoritesQuantity() {
    let likedItemsAmount;

    if (localStorage.getItem('mode')) {
      likedItemsAmount = localStorage.length - 1;
    } else {
      likedItemsAmount = localStorage.length;
    }
    this.favoritesNumberElement.innerText = likedItemsAmount;
  }
}
