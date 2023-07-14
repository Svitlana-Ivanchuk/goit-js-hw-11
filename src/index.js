'use strict';
import { GalleryAPI } from './js/search-api';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchFormEl = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

const galleryInstance = new GalleryAPI();

btnLoadMore.style.display = 'none';

const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  animationSlide: false,
});

// console.log(galleryInstance.fetchImages());

async function onSearchFormSubmit(evt) {
  evt.preventDefault();
  galleryList.innerHTML = '';
  // console.log(evt.target.firstElementChild.value);
  const searchQuery = evt.currentTarget.elements['searchQuery'].value.trim();
  galleryInstance.q = searchQuery;
  galleryInstance.page = 1;

  galleryInstance
    .fetchImages()
    .then(data => {
      const arrayImages = data.data.hits;
      const totalImages = data.data.total;
      if (!arrayImages.length) {
        btnLoadMore.style.display = 'none';
        throw new Error();
      }
      onFetchSuccess(totalImages);
      galleryList.innerHTML = createGalleryCards(arrayImages);
      btnLoadMore.style.display = 'block';
    })
    .catch(onFetchError);
}

function onBtnLoadMoreClick() {
  galleryInstance.page += 1;
  lightbox.refresh();
  galleryInstance.fetchImages().then(data => {
    if (data.data.total === data.data.totalHits) {
      btnLoadMore.style.display = 'none';
      onFetchInfo();
    }
    galleryList.insertAdjacentHTML(
      'beforeend',
      createGalleryCards(data.data.hits)
    );
  });
}

function onFetchError(error) {
  Notiflix.Report.failure(
    'Sorry',
    'There are no images matching your search query. Please try again.',
    'Okay',
    {
      position: 'center-center',
      width: '400px',
      titleFontSize: '30px',
      messageFontSize: '20px',
      messagePosition: 'center',
    }
  );
}

function onFetchSuccess(totalImages) {
  Notiflix.Report.success(
    'Hooray!',
    `'We found ${totalImages} images.'`,
    'Okay',
    {
      position: 'center-center',
      timeout: 5000,
      width: '400px',
      titleFontSize: '30px',
      messageFontSize: '20px',
    }
  );
}

function onFetchInfo() {
  Notiflix.Report.info(
    'We are sorry',
    'but you have reached the end of search results.',
    'Okay',
    {
      position: 'center-center',
      timeout: 5000,
      width: '400px',
      titleFontSize: '30px',
      messageFontSize: '20px',
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
  <a class="gallery__link" href="${largeImageURL}">
    <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" />
      </a>
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
