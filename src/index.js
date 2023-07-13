'use strict';
import { GalleryAPI } from './js/search-api';
import Notiflix from 'notiflix';

const searchFormEl = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

const galleryInstance = new GalleryAPI();

btnLoadMore.style.display = 'none';

// console.log(galleryInstance.fetchImages());

function onSearchFormSubmit(evt) {
  evt.preventDefault();
  // console.log(evt.target.firstElementChild.value);
  const searchQuery = evt.currentTarget.elements['searchQuery'].value.trim();
  galleryInstance.q = searchQuery;
  galleryInstance.page = 1;

  galleryInstance
    .fetchImages()
    .then(data => {
      // console.log(data.data.hits);
      if (!data.data.hits === {}) {
        console.log('Images not found!');
        throw new Error();
      }
      galleryList.innerHTML = createGalleryCards(data.data.hits);
      btnLoadMore.style.display = 'flex';
    })
    .catch(onFetchError());
}

function onBtnLoadMoreClick() {
  galleryInstance.page += 1;
  galleryInstance.fetchImages().then(data => {
    if (galleryInstance.page === data.total_pages) {
      btnLoadMore.style.display = 'none';
    }
    galleryList.insertAdjacentHTML(
      'beforeend',
      createGalleryCards(data.data.hits)
    );
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

function createGalleryCards(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>`
    )
    .join('');
}
searchFormEl.addEventListener('submit', onSearchFormSubmit);

btnLoadMore.addEventListener('click', onBtnLoadMoreClick);
