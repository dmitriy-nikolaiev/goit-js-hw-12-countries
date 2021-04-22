import debounce from 'lodash/debounce';

import countriesService from './js/fetchCountries';
import listTemplate from './templates/countries-list.hbs';
import countryTemplate from './templates/country.hbs';

import message from './js/message';
import loaderCreator from './js/loader.js';

import './css/styles.css';
import './css/loader.css';

import mapSVG from './images/world.svg';

const containerRef = document.querySelector('.container');
const inputRef = document.querySelector('#searchInput');
const loader = loaderCreator('#loader');

const mapContainer = document.querySelector('.map-wrapper');
mapContainer.insertAdjacentHTML('afterbegin', mapSVG);
const mapRef = document.querySelector('.map-wrapper svg');
mapRef.classList.add('map');

let selectedElements = [];

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
    renderCountry(data);
  }
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
  selectedElements.forEach(element => {
    element.style.fill = '';
  });
  selectedElements = [];

  if (target.value.trim()) {
    getCountries(target.value.trimStart());
  }
};

inputRef.addEventListener('input', debounce(handleInput, 500));

const renderCountry = countryData => {
  selectedElements = mapRef.getElementsByClassName(countryData.name);
  if (selectedElements.length === 0) {
    const elemById = mapRef.getElementById(countryData.alpha2Code);
    if (elemById) {
      selectedElements = [elemById];
      // const elemPos = elemById.getBoundingClientRect();
      // console.log(elemPos, '---elemPos');
    }
  }

  selectedElements.forEach(element => {
    element.style.fill = '#8050c2';
  });
};
