import axios from 'axios';
import Notiflix from 'notiflix';

const BASE_URL = `https://pixabay.com/api/`;
const API_KEY = '38162173-e7189c612242127d8d754fc70';

const getImages = () =>
  axios.get(
    `${BASE_URL}?key=${API_KEY}&image_type=photo&q=cat&orientation=horizontal&safesearch=true&q=cat`
  );

getImages()
  .then(response => console.log(response.data))
  .catch(onFetchError);

function onFetchError(error) {
  Notiflix.Notify.failure(
    'Oops! Something went wrong! Try reloading the page or select another cat breed!',
    {
      position: 'center-center',
      timeout: 5000,
      width: '400px',
      fontSize: '24px',
    }
  );
}

export { getImages, onFetchError };
