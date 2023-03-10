import { URL } from './galery-server';
import { urlSearchParams } from './galery-server';
import axios from 'axios';
import Notiflix from 'notiflix';

// { webformatURL, tags, likes, views, comments, downloads }
const form = document.querySelector('#search-form');
const galery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

const pagination = {
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
  event.preventDefault();
  searchRequest = event.currentTarget.children.searchQuery.value;

  await fetchImgs(searchRequest);
  loadMoreButton.classList.remove('invisible');
}

function makeMurkup(response) {
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

function paginationOnSearch(response) {
  pagination.total = response.data.totalHits;
}

async function OnLoadMore() {
  loadMoreButton.disabled = true;

  if (pagination.page + 1 > pagination.total / pagination.per_page) {
    Notiflix.Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
  }

  pagination.page += 1;

  await fetchImgs(searchRequest);

  loadMoreButton.disabled = false;
}

async function fetchImgs(searchRequest) {
  //   try {
  const response = await axios(
    `${URL}?${urlSearchParams}&q=${searchRequest}&page=${pagination.page}&per_page=${pagination.per_page}`
  );

  if (response.data.total === 0) {
    throw new Error(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    // }

    paginationOnSearch(response);

    return makeMurkup(response.data.hits);
    //   } catch (error) {
    //     Notiflix.Notify.failure(error.message);
  }
}
