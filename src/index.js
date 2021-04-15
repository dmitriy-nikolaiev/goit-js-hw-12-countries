import debounce from 'lodash/debounce';
import { error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css'; // default styles
import '@pnotify/core/dist/BrightTheme.css'; // default theme

import './css/styles.css';
import countriesService from './js/countries.service';
import countriesTemplate from './templates/countries-list.hbs';
import countryTemplate from './templates/country.hbs';

const containerRef = document.querySelector('.container');

// const noticeMessages = {
//   tooMany: error({
//     text: 'Too many matches found. Please enter a more specific query!',
//   }),
//   notFound: error({
//     text: 'No results were found for this request!',
//   }),
// };

const renderDetails = country => {
  // console.log(country, '---y');
  containerRef.innerHTML = countryTemplate(country);
};

const renderList = countries => {
  // console.log(countries, '---s');
  containerRef.innerHTML = countriesTemplate(countries);
};

const getCountries = name => {
  // console.log(name);
  containerRef.innerHTML = '';

  countriesService
    .countriesRequest(name)
    // .then(res => (res.length === 1 ? renderDetails(res[0]) : renderList(res)))
    .then(res => {
      if (res.length === 1) {
        renderDetails(res[0]);
      } else if (res.length > 10) {
        const errorMsg = error({
          text: 'Too many matches found. Please enter a more specific query!',
        });
      } else {
        renderList(res);
      }
    })
    .catch(resError => {
      // console.log(resError, '---error');
      const errorMsg = error({
        // text: 'No results were found for this request! ',
        text: `An error occurred as a result of executing the request.\n Status text: ${resError.statusText}.`,
      });
      // apartmentsListRef.innerHTML = 'There was an error';
    });
  // .finally(() => console.log('finished!'));
};

const handleInput = event => {
  if (event.target.value) {
    getCountries(event.target.value);
  }
};

const inputRef = document.querySelector('#searchInput');
inputRef.addEventListener('input', debounce(handleInput, 500));
