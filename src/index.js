import debounce from 'lodash/debounce';

import countriesService from './js/fetchCountries';
import countriesTemplate from './templates/countries-list.hbs';
import countryTemplate from './templates/country.hbs';

import message from './js/message';
import loaderCreator from './js/loader.js';

import './css/styles.css';
import './css/loader.css';

const containerRef = document.querySelector('.container');
const loader = loaderCreator('#loader');

const renderDetails = country =>
  (containerRef.innerHTML = countryTemplate(country));

const renderList = countries =>
  (containerRef.innerHTML = countriesTemplate(countries));

const getCountries = name => {
  containerRef.innerHTML = '';
  message.close();
  loader.show();

  countriesService
    .fetchCountries(name)
    .then(res => {
      if (res.length === 1) {
        renderDetails(res[0]);
      } else if (res.length > 10) {
        message.show(
          'Too many matches found. Please enter a more specific query!',
        );
      } else {
        renderList(res);
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
  // containerRef.innerHTML = '';
  if (target.value) {
    getCountries(target.value);
  }
};

const inputRef = document.querySelector('#searchInput');
inputRef.addEventListener('input', debounce(handleInput, 500));
