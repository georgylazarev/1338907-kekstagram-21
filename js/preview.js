'use strict';

(function () {
  const body = document.querySelector(`body`);
  const bigPicture = document.querySelector(`.big-picture`);
  const bigPictureImg = bigPicture.querySelector(`.big-picture__img`).querySelector(`img`);
  const commentsCount = bigPicture.querySelector(`.comments-count`);
  const likesCount = bigPicture.querySelector(`.likes-count`);
  const closeButton = bigPicture.querySelector(`.big-picture__cancel`);
  const socialCaption = bigPicture.querySelector(`.social__caption`);
  const commentsList = bigPicture.querySelector(`.social__comments`);
  const commentTemplate = document.querySelector(`#comments`).content;

  // Объявляем функцию закрытия большой картинки
  const onCloseBigPicture = function () {
    body.classList.remove(`modal-open`);
    bigPicture.classList.add(`hidden`);
    commentsList.innerHTML = ``;
    closeButton.removeEventListener(`click`, onCloseBigPicture);
    document.removeEventListener(`keydown`, onCloseBigPictureByEsc);
  };
  // Закрытие по нажатию Esc
  const onCloseBigPictureByEsc = function (evt) {
    evt.preventDefault();
    if (evt.key === `Escape`) {
      onCloseBigPicture();
    }
  };

  const commentsLoad = function (comments) {
    comments.forEach((comment) => {
      let currentComment = commentTemplate.cloneNode(true);
      let currentCommentImg = currentComment.querySelector(`.social__picture`);
      let currentCommentText = currentComment.querySelector(`.social__text`);
      currentCommentImg.src = comment.avatar;
      currentCommentImg.alt = comment.name;
      currentCommentText.textContent = comment.message;
      commentsList.appendChild(currentComment);
    });
  };

  window.preview = {
  // Объявление функции показа большой картинки
    showBigPhoto(thumbnail, data) {
      // Находим в массиве данные об этой фотографии
      const indexNumber = thumbnail.dataset.indexnumber;
      const currentPhotoAllInfo = data[indexNumber];
      // Подставляем в src большой фотографии адрес
      bigPictureImg.src = currentPhotoAllInfo.url;
      // Подставляем количество лайков
      likesCount.textContent = currentPhotoAllInfo.likes;
      socialCaption.textContent = currentPhotoAllInfo.description;
      // Подставляем количество комментариев
      commentsList.innerHTML = ``;
      commentsCount.textContent = currentPhotoAllInfo.comments.length;
      commentsLoad(currentPhotoAllInfo.comments);
      // Добавляем обработчики событий на закрытие
      closeButton.addEventListener(`click`, onCloseBigPicture);
      document.addEventListener(`keydown`, onCloseBigPictureByEsc);
      // Блокируем прокрутку фона
      body.classList.add(`modal-open`);
      // Показываем большую картинку
      bigPicture.classList.remove(`hidden`);
    }
  };
})();
