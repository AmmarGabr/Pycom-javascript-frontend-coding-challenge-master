export default class Autocomplete {
  constructor(rootEl, options = {}) {
    options = Object.assign({ numOfResults: 10, data: [] }, options);
    Object.assign(this, { rootEl, options });

    this.init();
  }

  onQueryChange(query) {
    // Get data for the dropdown
    let results = this.getResults(query, this.options.data);
    results = results.slice(0, this.options.numOfResults);

    this.updateDropdown(results);
  }

  /**
   * Given an array and a query, return a filtered array based on the query.
   */
  getResults(query, data) {
    if (!query) return [];
    let results;
    //this part is added by Ammar
    if (this.rootEl.id == 'gh-user') {
      data = [];

      //a list that stores the results that came from the API
      let ghUsers = [];
      //Stores the result of the api in the list
      ghUsers.push(this.callWebApi(query));
      //get the needed information from the API..
      ghUsers.forEach(i => {
        data = i.items.map(user => ({
          text: user.login,
          value: user.id
        }));
      })

    }
    //Ammar's part ends here
    // Filter for matching strings
    results = data.filter((item) => {
      return item.text.toLowerCase().includes(query.toLowerCase());
    });

    return results;
  }

  //Next method is added by ammar
  /**
   * Given a query, return api result as a JSON based on the query.
   */
  callWebApi(query) {
    const url = 'https://api.github.com/search/users?q=' + query + 'foo&per_page=' + this.options.numOfResults + '';
    let request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send();
    if (request.status == 200) {
      return JSON.parse(request.response);
    }
  }

  updateDropdown(results) {
    this.listEl.innerHTML = '';
    this.listEl.appendChild(this.createResultsEl(results));

  }

  createResultsEl(results) {
    const fragment = document.createDocumentFragment();
    results.forEach((result) => {
      const el = document.createElement('li');
      Object.assign(el, {
        className: 'result',
        textContent: result.text,
      });

      // Pass the value to the onSelect callback
      el.addEventListener('click', (event) => {
        const { onSelect } = this.options;
        if (typeof onSelect === 'function') onSelect(result.value);
      });

      fragment.appendChild(el);
    });
    return fragment;
  }

  createQueryInputEl() {
    const inputEl = document.createElement('input');
    Object.assign(inputEl, {
      type: 'search',
      name: 'query',
      autocomplete: 'off',
    });

    inputEl.addEventListener('input', event =>
      this.onQueryChange(event.target.value));

    return inputEl;
  }

  init() {
    // Build query input
    this.inputEl = this.createQueryInputEl();
    this.rootEl.appendChild(this.inputEl)

    // Build results dropdown
    this.listEl = document.createElement('ul');
    Object.assign(this.listEl, { className: 'results' });
    this.rootEl.appendChild(this.listEl);
  }

  //Method added by ammar
  /**
    * Should be used as a keydown event.
    * It detects everytime there is a keyboard key clicked and response based on the click.
    */
  onKeyboardClick() {
    let liElementsArray = new Array();

    for (var i = 0; i < this.listEl.length; i++) {
      liElementsArray[i] = this.listEl[i].firstElementChild;
    }

    var focusedElement = document.activeElement,
      index = liElementsArray.indexOf(focusedElement);
    if (index >= 0) {
      //check if the clicked key is up arrown or down arrow
      if (e.keyCode == 40) {
        //check if it is not the last element in the list
        if (focusedElement.parentNode.nextElementSibling) {
          var nextNode = focusedElement.parentNode.nextElementSibling.firstElementChild;
          nextNode.focus();
        } else {
          this.listEl[0].firstElementChild.focus();
        }
      }
      if (e.keyCode == 38) {
        if (focusedElement.parentNode.previousElementSibling) {
          var previousNode = focusedElement.parentNode.previousElementSibling.firstElementChild;
          previousNode.focus();
        } else {
          locales.lastElementChild.firstElementChild.focus();
        }
      }
    }
  }


}
