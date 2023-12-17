import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('#search-form');
const input = document.querySelector('input');
const apiKey = '41298177-55aadc3442769e605194a64dc';
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

let page = 1;

loadMore.hidden = true;



function buttonShow(im) {
 loadMore.hidden = false;
    if (im.length === 0) {
      loadMore.hidden = true;

      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
     
    } else if (im.length > 0 && im.length < 40) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      loadMore.hidden = true;
    }

}


const getImg = async currentPage => {
    const searchParams = new URLSearchParams({
      key: apiKey,
      q: input.value,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: currentPage,
      per_page: 40,
    });

    const response = await axios.get(
      `https://pixabay.com/api/?${searchParams}`
    );
  const images = await response.data.hits;
  
  buttonShow(images);

    return images.map(image => ({
      webformatURL: image.webformatURL,
      largeImageURL: image.largeImageURL,
      tags: image.tags,
      likes: image.likes,
      views: image.views,
      comments: image.comments,
      downloads: image.downloads,
    }));
};




const fetchAndRenderImg = async currentPage => {

  const images = await getImg(currentPage)
    .then()
    .catch(error => Notiflix.Notify.failure(error.message));
  
    gallery.innerHTML += images
      .map(
        item => `
        <div class="photo-card">
          <a href="${item.largeImageURL}" data-lightbox="gallery">
            <img src="${item.largeImageURL}" alt="${item.tags}" loading="lazy" />
          </a>
          <div class="info">
            <p class="info-item"><b>Likes:</b> ${item.likes}</p>
            <p class="info-item"><b>Views:</b> ${item.views}</p>
            <p class="info-item"><b>Comments:</b> ${item.comments}</p>
            <p class="info-item"><b>Downloads:</b> ${item.downloads}</p>
          </div>
        </div>
      `
      )
      .join('');

    const lightbox = new SimpleLightbox('.gallery a');
    lightbox.refresh();
};



searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  page = 1;
  gallery.innerHTML = '';
  fetchAndRenderImg(page);
});

loadMore.addEventListener('click', () => {
  page++;
  fetchAndRenderImg(page)
  .then()
  .catch(error => Notiflix.Notify.failure(error.message));
});

window.addEventListener('scroll', () => {
  if (
    window.scrollY + window.innerHeight >
    document.documentElement.scrollHeight
  ) {
    page++;
    fetchAndRenderImg(page)
    .then()
    .catch(error => Notiflix.Notify.failure(error.message));
  }
});