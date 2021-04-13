export default class FavoritesController {
  constructor() {
    this.favoritesButtonElement = document.querySelector('.button--user');
    this.modalLikeButton = document.querySelector('.like_checkbox--modal');

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

    this.updateFavoritesQuantity();
  }

  // compareWithStorageList(listOfItems) {
  //   listOfItems.forEach((item) => {
  //     localStorage.getItem(item.Id)
  //       ? (item.Liked = true)
  //       : (item.Liked = false);
  //   });

  //   return listOfItems;
  // }

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

      console.log(itemCounterpart);
    } else {
      console.log('modal');
    }
    this.updateStorageList(itemId, itemData);
    //this.updateItemData();
    this.updateFavoritesQuantity();
  }

  updateStorageList(itemId, itemData) {
    const alreadyLiked = localStorage.getItem(itemId);

    if (alreadyLiked) {
      console.log('Deleted from the list');
      localStorage.removeItem(itemId);
    } else {
      console.log('Added to the list');
      localStorage.setItem(itemId, itemData);
    }
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
