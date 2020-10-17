'use strict';

// Вешаем на все превью обработчик событий
const allThumbnails = document.querySelectorAll(`.picture`);
allThumbnails.forEach((thumbnail) => {
  thumbnail.addEventListener(`click`, function (evt) {
    evt.preventDefault();
    window.preview.showBigPhoto(thumbnail);
  });
});
