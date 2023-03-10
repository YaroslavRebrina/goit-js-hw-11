export const API_KEY = '34289096-f43b39d982cc213ccf995e824';
export const URL = 'https://pixabay.com/api/';

export const urlSearchParams = new URLSearchParams({
  key: API_KEY,
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
});
