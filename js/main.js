'use strict';

const onError = function (message) {
  console.error(message);
};

const onSuccess = function (data) {
  let listOfPhotos = document.querySelector(`.pictures`);
  data.forEach((item, i) => {
    listOfPhotos.appendChild(window.onLoadData.displayPicture(item, i));
  });
  window.allPhotos = {
    data
  };
  // Вешаем на все превью обработчик событий
  const allThumbnails = document.querySelectorAll(`.picture`);
  allThumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener(`click`, function (evt) {
      evt.preventDefault();
      window.preview.showBigPhoto(thumbnail);
    });
  });
};

window.load(`https://21.javascript.pages.academy/kekstagram/data`, onSuccess, onError);
