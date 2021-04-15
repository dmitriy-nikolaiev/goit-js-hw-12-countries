const BASE_URL = 'https://restcountries.eu';

export default {
  countriesRequest(name = '') {
    return fetch(`${BASE_URL}/rest/v2/name/${name}`).then(res => {
      if (!res.ok) {
        throw res;
      }

      return res.json();
    });
  },
};
