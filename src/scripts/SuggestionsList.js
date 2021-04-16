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
    let nextSibling = e.target.nextElementSibling;
    let previousSibling = e.target.previousElementSibling;
    let searchBox = this.inputSearchElement;

    if (e.code === 'ArrowDown' && nextSibling) {
      nextSibling.focus();
      searchBox.setAttribute('aria-activedescendant', nextSibling.id);
    }
    if (e.code === 'ArrowDown' && !nextSibling) {
      searchBox.focus();
      searchBox.setAttribute('aria-activedescendant', '');
    }
    if (e.code === 'ArrowUp' && previousSibling) {
      previousSibling.focus();
      searchBox.setAttribute('aria-activedescendant', previousSibling.id);
    }
    if (e.code === 'ArrowUp' && !previousSibling) {
      searchBox.focus();
      searchBox.setAttribute('aria-activedescendant', '');
    }
  }

  render(listToRender) {
    // clear it out before every re-rendering
    this.suggestionsListElement.innerText = '';
    this.formSearchElement.setAttribute('aria-expanded', 'true');

    listToRender.forEach((suggestion, index) => {
      let li = document.createElement('li');
      li.tabIndex = -1;
      li.setAttribute('role', 'option');
      li.id = `option${index}`;
      li.className = 'list_item';
      li.innerText = suggestion;
      this.suggestionsListElement.append(li);
    });
  }
}
