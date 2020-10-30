'use strict';

(function () {
  const filterButtons = document.querySelectorAll(`.img-filters__button`);
  const imgFilters = document.querySelector(`.img-filters`);
  let listOfPhotos = document.querySelector(`.pictures`);
  let cloneArray = [];

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

  const onFilter = function (filter) {
    removeClassActive();
    filter.classList.add(`img-filters__button--active`);
    erisePhotos();

    switch (filter.id) {
      case `filter-default`:
        cloneArray = window.allPhotos.data;
        cloneArray.forEach((item, i) => {
          listOfPhotos.appendChild(window.onLoadData.displayPicture(item, i));
        });
        break;
      case `filter-random`:
        cloneArray = window.allPhotos.data.slice();
        cloneArray = window.util.shuffle(cloneArray);
        for (let i = 0; i <= 10; i++) {
          listOfPhotos.appendChild(window.onLoadData.displayPicture(cloneArray[i], i));
        }
        break;
      case `filter-discussed`:
        cloneArray = window.allPhotos.data.slice();
        cloneArray.sort(function (a, b) {
          return b.comments.length - a.comments.length;
        });
        cloneArray.forEach((item, i) => {
          listOfPhotos.appendChild(window.onLoadData.displayPicture(item, i));
        });
        break;
    }
  };

  window.filter = {
    onShowFilter() {
      imgFilters.classList.remove(`img-filters--inactive`);
      filterButtons.forEach((filterButton) => {
        filterButton.addEventListener(`click`, function () {
          onFilter(filterButton);
          window.main.setThumbnailsEvent(cloneArray);
        });
      });
    }
  };
})();
