import { getImages, onFetchError } from './js/search-api';

const inputRequest = document.querySelector('input');
const btnSearch = document.querySelector('button');
console.log(btnSearch);

btnSearch.addEventListener('submit', onBtnSubmit);
inputRequest.addEventListener('input', onRequestInput);

function onBtnSubmit(evt) {
  evt.preventDefault();
}

function onRequestInput(evt) {
  evt.preventDefault();
  const inputText = evt.currentTarget.value;
  console.log(inputText);
}
