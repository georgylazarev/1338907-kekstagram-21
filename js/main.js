'use strict';

(function () {
  const onError = function (message) {
    const errorBlock = document.createElement(`div`);
    const errorContent = document.createTextNode(message);
    errorBlock.setAttribute(`style`, `position: absolute; width: 100%; top: 10px; color: red; background: white; text-align: center; padding: 10px 0;`);
    errorBlock.appendChild(errorContent);
    const currentDiv = document.querySelector(`main`);
    document.body.insertBefore(errorBlock, currentDiv);
  };

  const onSuccess = function (data) {
    let listOfPhotos = document.querySelector(`.pictures`);
    data.forEach((item, i) => {
      listOfPhotos.appendChild(window.data.displayPreview(item, i));
    });
    window.filter.onShowFilter();
    window.allPhotos = {
      data
    };
    window.main.setThumbnailsEvent(window.allPhotos.data);
  };

  window.load(`https://21.javascript.pages.academy/kekstagram/data`, onSuccess, onError);

  window.main = {
    loadSuccess() {
      window.util.onShowMessage(`success`);
    },
    loadError() {
      window.util.onShowMessage(`error`);
    },
    setThumbnailsEvent(data) { // Вешаем на все превью обработчик событий
      const allThumbnails = document.querySelectorAll(`.picture`);
      allThumbnails.forEach((thumbnail) => {
        thumbnail.addEventListener(`click`, function (evt) {
          evt.preventDefault();
          const indexNumber = thumbnail.dataset.indexnumber; // Находим в массиве данные об этой фотографии
          const currentPhotoAllInfo = data[indexNumber];
          window.preview.showBigPhoto(currentPhotoAllInfo);
        });
      });
    }
  };
})();
