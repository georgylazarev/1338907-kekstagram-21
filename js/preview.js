'use strict';

(function () {
  const COMMENTS_START_INDEX = 0;
  const COMMENTS_INDEX_STEP = 5;

  const body = document.querySelector(`body`);
  const bigPicture = document.querySelector(`.big-picture`);
  const bigPictureImg = bigPicture.querySelector(`.big-picture__img`).querySelector(`img`);
  const commentsCount = bigPicture.querySelector(`.comments-count`);
  const likesCount = bigPicture.querySelector(`.likes-count`);
  const closeButton = bigPicture.querySelector(`.big-picture__cancel`);
  const socialCaption = bigPicture.querySelector(`.social__caption`);
  const commentsList = bigPicture.querySelector(`.social__comments`);
  const commentsLoader = bigPicture.querySelector(`.comments-loader`);
  const commentTemplate = document.querySelector(`#comments`).content;


  const onCloseBigPicture = function () { // Объявляем функцию закрытия большой картинки
    body.classList.remove(`modal-open`);
    bigPicture.classList.add(`hidden`);
    commentsList.innerHTML = null;
    closeButton.removeEventListener(`click`, onCloseBigPicture);
    document.removeEventListener(`keydown`, onCloseBigPictureByEsc);
  };

  const onCloseBigPictureByEsc = function (evt) { // Закрытие по нажатию Esc
    evt.preventDefault();
    if (evt.key === `Escape`) {
      onCloseBigPicture();
    }
  };

  const onCommentsLoad = function (comments, startCommentIndex) { // Формируем блок комментариев и выводим
    let leftComments = comments.length - startCommentIndex; // Считаем, сколько ещё комментариев в массиве
    let maxComments = window.util.maxCheck(leftComments, COMMENTS_INDEX_STEP); // Проверяем, сколько комментариев мы можем вывести сейчас
    let endCommentIndex = startCommentIndex + maxComments; // Вычисляем индекс последнего комментария в пачке

    for (let i = startCommentIndex; i < endCommentIndex; i++) { // Формируем каждый комментарий
      let currentComment = commentTemplate.cloneNode(true);
      let currentCommentImg = currentComment.querySelector(`.social__picture`);
      let currentCommentText = currentComment.querySelector(`.social__text`);
      currentCommentImg.src = comments[i].avatar;
      currentCommentImg.alt = comments[i].name;
      currentCommentText.textContent = comments[i].message;
      commentsList.appendChild(currentComment); // Выводим комментарий на страницу
    }

    return endCommentIndex; // Возвращаем последний индекс для последующего вызова
  };

  const commentsLoad = function (comments) { // Добавление комментариев
    const socialCommentCount = bigPicture.querySelector(`.social__comment-count`); // Находим блок показа количества комментариев
    let currentCommentIndex = onCommentsLoad(comments, COMMENTS_START_INDEX); // Первичный вызов комментариев
    socialCommentCount.textContent = currentCommentIndex + ` из ` + comments.length + ` комментариев`; // Обновляем количество комментариев

    commentsLoader.addEventListener(`click`, function () { // Показываем комментарии по кнопке
      currentCommentIndex = onCommentsLoad(comments, currentCommentIndex);
      socialCommentCount.textContent = currentCommentIndex + ` из ` + comments.length + ` комментариев`;
    });
  };

  window.preview = { // Объявление функции показа большой картинки
    showBigPhoto(thumbnail, data) {
      const indexNumber = thumbnail.dataset.indexnumber; // Находим в массиве данные об этой фотографии
      const currentPhotoAllInfo = data[indexNumber];
      bigPictureImg.src = currentPhotoAllInfo.url; // Подставляем в src большой фотографии адрес
      likesCount.textContent = currentPhotoAllInfo.likes; // Подставляем количество лайков
      socialCaption.textContent = currentPhotoAllInfo.description;
      commentsList.innerHTML = null;
      commentsCount.textContent = currentPhotoAllInfo.comments.length; // Подставляем количество комментариев
      commentsLoad(currentPhotoAllInfo.comments);
      closeButton.addEventListener(`click`, onCloseBigPicture); // Добавляем обработчики событий на закрытие
      document.addEventListener(`keydown`, onCloseBigPictureByEsc);
      body.classList.add(`modal-open`); // Блокируем прокрутку фона
      bigPicture.classList.remove(`hidden`); // Показываем большую картинку
    }
  };
})();
