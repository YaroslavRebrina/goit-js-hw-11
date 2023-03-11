import Notiflix from 'notiflix';
import { fetchImgs } from './fetch-api';

// { webformatURL, tags, likes, views, comments, downloads }
const form = document.querySelector('#search-form');
const galery = document.querySelector('.gallery');
export const loadMoreButton = document.querySelector('.load-more');

export const pagination = {
  page: 1,
  per_page: 40,
  total: null,
};

let searchRequest = null;
loadMoreButton.classList.add('invisible');

form.addEventListener('submit', onSubmit);
loadMoreButton.addEventListener('click', OnLoadMore);

async function onSubmit(event) {
  galery.innerHTML = '';
  pagination.page = 1;
  event.preventDefault();
  searchRequest = event.currentTarget.searchQuery.value.trim();
  try {
    await fetchImgs(searchRequest);
  } catch (error) {
    Notiflix.Notify.failure(error.message);
  }
}

export function makeMurkup(response) {
  const murkup = response
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
  <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags} title="${tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span>${downloads}</span>
    </p>
  </div>
</div>`;
      }
    )
    .join('');

  galery.insertAdjacentHTML('beforeend', murkup);
}

async function OnLoadMore() {
  loadMoreButton.disabled = true;

  if (pagination.page + 1 > pagination.total / pagination.per_page) {
    loadMoreButton.disabled = false;
    return Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  }

  pagination.page += 1;
  try {
    await fetchImgs(searchRequest);
  } catch (error) {
    Notiflix.Notify.failure(error.message);
  }
  loadMoreButton.disabled = false;
}
