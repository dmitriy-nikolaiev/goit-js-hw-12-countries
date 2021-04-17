const BASE_URL = 'https://restcountries.eu';

export default {
  fetchCountries(name = '') {
    return fetch(`${BASE_URL}/rest/v2/name/${name}`).then(res => {
      if (!res.ok) {
        throw res;
      }

      return res.json();
    });
    // .catch(error => {
    //   console.log(error, '---error');
    //   throw error;
    // });
  },
};
