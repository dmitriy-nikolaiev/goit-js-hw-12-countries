import debounce from 'lodash/debounce';

import countriesService from './js/fetchCountries';
import listTemplate from './templates/countries-list.hbs';
import countryTemplate from './templates/country.hbs';

import message from './js/message';
import loaderCreator from './js/loader.js';

import './css/styles.css';
import './css/loader.css';

const containerRef = document.querySelector('.container');
const inputRef = document.querySelector('#searchInput');
const loader = loaderCreator('#loader');

const render = data => {
  if (Array.isArray(data)) {
    containerRef.innerHTML = listTemplate(data);

    const listItemRef = document.querySelector('.countries-list');

    listItemRef.addEventListener('click', event => {
      // if (event.target === listItemRef) {
      if (event.target.classList.contains('countries-list-item')) {
        render(data.find(item => item.name === event.target.textContent));
        inputRef.value = '';
      }
    });
  } else if (data) {
    containerRef.innerHTML = countryTemplate(data);
  }
  //
  // containerRef.innerHTML = Array.isArray(data)
  //   ? listTemplate(data)
  //   : countryTemplate(data);
};
const getCountries = name => {
  // containerRef.innerHTML = '';
  message.close();
  loader.show();

  countriesService
    .fetchCountries(name)
    .then(res => {
      if (res.length === 1) {
        render(res[0]);
      } else if (res.length > 10) {
        message.show(
          'Too many matches found. Please enter a more specific query!',
        );
      } else {
        render(res);
      }
    })
    .catch(error => {
      const { status } = error;
      const errorMsg = status === 404 ? 'Not found' : error || 'Unknown error!';
      message.show(`An error has occurred.\n Status: ${errorMsg}.`);
    })
    .finally(() => loader.hide());
};

const handleInput = event => {
  const { target } = event;
  containerRef.innerHTML = '';
  if (target.value) {
    getCountries(target.value);
  }
};

inputRef.addEventListener('input', debounce(handleInput, 500));
