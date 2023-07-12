'use strict';
import { GalleryAPI } from './js/search-api';
import Notiflix from 'notiflix';

const searchFormEl = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

const galleryInstance = new GalleryAPI();

function onSearchFormSubmit(evt) {
  evt.preventDefault();
  // console.log(evt.target.firstElementChild.value);
  const searchQuery = evt.currentTarget.elements['searchQuery'].value.trim();
  galleryInstance.q = searchQuery;
  galleryInstance.page = 1;
  console.log(searchQuery);

  galleryInstance.fetchImages().then(data => {
    // if (!data.results) {
    //   return onFetchError();
    // }
    console.log(data.response);
    // galleryList.innerHTML = createGalleryCards(data.results);
  });
}

function onFetchError(error) {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
    {
      position: 'center-center',
      timeout: 5000,
      width: '400px',
      fontSize: '24px',
    }
  );
}

function onBtnLoadMoreClick() {
  galleryInstance.page += 1;
  galleryInstance.fetchImages().then(data => {
    if (galleryInstance.page === data.total_pages) {
      btnLoadMore.classList.add('is-hidden');
    }
  });
}

searchFormEl.addEventListener('submit', onSearchFormSubmit);

btnLoadMore.addEventListener('click', onBtnLoadMoreClick);
