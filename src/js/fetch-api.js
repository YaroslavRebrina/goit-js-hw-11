import { URL } from './galery-server';
import { urlSearchParams } from './galery-server';
import axios from 'axios';
import Notiflix from 'notiflix';
import { pagination } from './galery-client';
import { loadMoreButton } from './galery-client';
import { makeMurkup } from './galery-client';

export async function fetchImgs(searchRequest) {
  if (searchRequest === '') {
    loadMoreButton.classList.add('invisible');
    return;
  }

  const response = await axios(
    `${URL}?${urlSearchParams}&q=${searchRequest}&page=${pagination.page}&per_page=${pagination.per_page}`
  );

  if (response.data.total === 0) {
    throw new Error(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }

  pagination.total = response.data.totalHits;

  if (response.data.hits.length < 40 || response.data.hits === []) {
    loadMoreButton.classList.add('invisible');
  } else {
    loadMoreButton.classList.remove('invisible');
  }

  return makeMurkup(response.data.hits);
}
