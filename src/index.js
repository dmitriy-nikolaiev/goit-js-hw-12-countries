import debounce from 'lodash/debounce';
import { error, defaults, defaultStack } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css'; // default styles
import '@pnotify/core/dist/BrightTheme.css'; // default theme

import './css/styles.css';
import './css/loader.css';

import countriesService from './js/countries.service';
import countriesTemplate from './templates/countries-list.hbs';
import countryTemplate from './templates/country.hbs';

// defaults.delay = 4000;
// defaults.animateSpeed = 'fast';
// defaults.sticker = false;
// defaults.immediateTransition = true;

const containerRef = document.querySelector('.container');

const displayMessage = text => {
  error({
    text,
    delay: 5000,
    animateSpeed: 'fast',
    sticker: false,
  });
};

const renderDetails = country =>
  (containerRef.innerHTML = countryTemplate(country));

const renderList = countries => {
  // console.log(countries, '---s');
  containerRef.innerHTML = countriesTemplate(countries);
};

const getCountries = name => {
  // console.log(name);
  containerRef.innerHTML = '';
  defaultStack.close(true);

  countriesService
    .countriesRequest(name)
    .then(res => {
      if (res.length === 1) {
        renderDetails(res[0]);
      } else if (res.length > 10) {
        displayMessage(
          'Too many matches found. Please enter a more specific query!',
        );
        // error({
        //   text: 'Too many matches found. Please enter a more specific query!',
        // });
      } else {
        renderList(res);
      }
    })
    .catch(resError => {
      console.log(resError, '---resError');
      // const { status, message, statusText } = resError;
      // const errorMsg = message || statusText || status || 'Unknown error!';
      const { status } = resError;
      const errorMsg =
        status === 404 ? 'Not found' : resError || 'Unknown error!';
      // console.log(status, '---status');
      // console.log(message, '---message');
      // console.log(statusText, '---statusText');
      displayMessage(`An error has occurred.\n Status: ${errorMsg}.`);

      // error({
      //   // text: 'No results were found for this request! ',
      //   text: `An error has occurred.\n Error text: ${errorMsg}.`,
      // });
    });
  // .finally(() => console.log('finished!'));
};

const handleInput = event => {
  const { target } = event;
  // containerRef.innerHTML = '';
  // defaultStack.close(true);
  // console.log(target.value);
  if (target.value) {
    getCountries(target.value);
  }
};

const inputRef = document.querySelector('#searchInput');
inputRef.addEventListener('input', debounce(handleInput, 500));
