export default class SuggestionsList {
  constructor() {
    this.inputSearchElement;
    this.formSearchElement;
    this.suggestionsListElement = document.querySelector('.search_list');

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

  render(listToRender) {
    // clear it out before every re-rendering
    this.suggestionsListElement.innerText = '';

    listToRender.forEach((suggestion) => {
      let li = document.createElement('li');
      li.tabIndex = -1;
      li.className = 'list_item';
      li.innerText = suggestion;
      this.suggestionsListElement.append(li);
    });
  }
}
