import debounce from 'lodash/debounce';
import { error, defaults } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css'; // default styles
import '@pnotify/core/dist/BrightTheme.css'; // default theme

import './css/styles.css';
import countriesService from './js/countries.service';
import countriesTemplate from './templates/countries-list.hbs';
import countryTemplate from './templates/country.hbs';

// const messageSettings = {
//   delay: 3000,
//   labels: { close: 'Close' },
// };
defaults.delay = 4000;

const containerRef = document.querySelector('.container');

const renderDetails = country =>
  (containerRef.innerHTML = countryTemplate(country));

const renderList = countries => {
  // console.log(countries, '---s');
  containerRef.innerHTML = countriesTemplate(countries);
};

const getCountries = name => {
  // console.log(name);
  containerRef.innerHTML = '';

  countriesService
    .countriesRequest(name)
    .then(res => {
      if (res.length === 1) {
        renderDetails(res[0]);
      } else if (res.length > 10) {
        error({
          text: 'Too many matches found. Please enter a more specific query!',
        });
      } else {
        renderList(res);
      }
    })
    .catch(resError => {
      const { message, statusText } = resError;
      const errorMsg = message || statusText || 'Unknown error!';
      // console.log(message, '---message');
      // console.log(statusText, '---statusText');
      error({
        // text: 'No results were found for this request! ',
        text: `An error has occurred.\n Error text: ${errorMsg}.`,
      });
    });
  // .finally(() => console.log('finished!'));
};

const handleInput = event => {
  const { target } = event;
  if (target) {
    getCountries(target.value);
  }
};

const inputRef = document.querySelector('#searchInput');
inputRef.addEventListener('input', debounce(handleInput, 500));
