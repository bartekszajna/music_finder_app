export default class FavoritesController {
  constructor() {
    this.favoritesButtonElement = document.querySelector('.button--user');
    this.modalLikeButton = document.querySelector('.modal_checkbox');
    this.popupElement = document.querySelector('.popup');

    this.favoritesNumberElement = this.favoritesButtonElement.querySelector(
      '.button_quantity'
    );
    this.itemsContainer = document.querySelector('.items_container');
    this.modalElement = document.querySelector('.modal');

    this.itemsContainer.addEventListener(
      'click',
      this.favoritesButtonHandler.bind(this)
    );

    this.modalLikeButton.addEventListener(
      'click',
      this.favoritesButtonHandler.bind(this)
    );

    this.modalLikeButton.addEventListener('keydown', this.detectEnterKey);
    this.itemsContainer.addEventListener('keydown', this.detectEnterKey);

    this.updateFavoritesQuantity();
  }

  detectEnterKey(e) {
    if (!e.target.id === 'modal_checkbox' && !e.target.id === 'item_checkbox') {
      return;
    }
    if (e.code === 'Enter') {
      console.log('XD');
      e.target.click();
    }
  }

  favoritesButtonHandler(e) {
    const itemId = e.target.dataset.itemId;
    const itemData = e.target.dataset.itemContent;

    if (!itemId) {
      return;
    }

    if (e.target === this.modalLikeButton) {
      let itemCounterpart = this.itemsContainer.querySelector(
        `[data-item-id="${itemId}"]`
      );
      itemCounterpart.checked = !itemCounterpart.checked;
    }

    this.updateStorageList(itemId, itemData);
    this.updateFavoritesQuantity();
  }

  updateStorageList(itemId, itemData) {
    const alreadyLiked = localStorage.getItem(itemId);

    if (alreadyLiked) {
      localStorage.removeItem(itemId);
      this.showPopup(true);
    } else {
      localStorage.setItem(itemId, itemData);
      this.showPopup(false);
    }
  }

  showPopup(wasItDeleted) {
    this.popupElement.classList.remove('popup--visible');
    //animation reflow
    this.popupElement.offsetWidth;

    if (wasItDeleted) {
      this.popupElement.innerText = 'Removed from favorites';
    } else {
      this.popupElement.innerText = 'Added to favorites';
    }

    this.popupElement.classList.add('popup--visible');
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
