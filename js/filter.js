'use strict';

(function () {
  const MAX_RANDOM_PREVIEW = 11;
  const DEBOUNCE_INTERVAL = 500; // ms

  const filterButtons = document.querySelectorAll(`.img-filters__button`);
  const imgFilters = document.querySelector(`.img-filters`);
  let listOfPhotos = document.querySelector(`.pictures`);
  let lastTimeout;


  const removeClassActive = function () {
    filterButtons.forEach((button) => {
      button.classList.remove(`img-filters__button--active`);
    });
  };

  const erisePhotos = function () {
    let eachPhoto = document.querySelectorAll(`.picture`);
    eachPhoto.forEach((photo) => {
      photo.remove();
    });
  };

  const showPhotos = function (array, max) {
    for (let i = 0; i < max; i++) {
      listOfPhotos.appendChild(window.data.displayPreview(array[i], i));
    }
  };

  const onFilter = function (filter) {
    let cloneArray = [];
    removeClassActive();
    filter.classList.add(`img-filters__button--active`);
    erisePhotos();
    switch (filter.id) {
      case `filter-default`:
        cloneArray = window.allPhotos.data;
        showPhotos(cloneArray, cloneArray.length);
        break;
      case `filter-random`:
        cloneArray = window.allPhotos.data.slice();
        cloneArray = window.util.shuffle(cloneArray);
        showPhotos(cloneArray, MAX_RANDOM_PREVIEW);
        break;
      case `filter-discussed`:
        cloneArray = window.allPhotos.data.slice();
        cloneArray.sort(function (a, b) {
          return b.comments.length - a.comments.length;
        });
        showPhotos(cloneArray, cloneArray.length);
        break;
    }
    window.main.setThumbnailsEvent(cloneArray);
  };

  window.filter = {
    onShowFilter() {
      imgFilters.classList.remove(`img-filters--inactive`);
      filterButtons.forEach((filterButton) => {
        filterButton.addEventListener(`click`, function () {
          if (lastTimeout) {
            window.clearTimeout(lastTimeout);
          }
          lastTimeout = window.setTimeout(function () {
            onFilter(filterButton);
          }, DEBOUNCE_INTERVAL);
        });
      });
    }
  };
})();
