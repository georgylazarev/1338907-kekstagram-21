'use strict';

(function () {
  // const COMMENTS_START_INDEX = 0;
  const COMMENTS_INDEX_STEP = 5;

  const body = document.querySelector(`body`);
  const bigPicture = document.querySelector(`.big-picture`);
  const bigPictureImg = bigPicture.querySelector(`.big-picture__img`).querySelector(`img`);
  const commentsCount = bigPicture.querySelector(`.comments-count`);
  const likesCount = bigPicture.querySelector(`.likes-count`);
  const closeButton = bigPicture.querySelector(`.big-picture__cancel`);
  const socialCaption = bigPicture.querySelector(`.social__caption`);
  const commentsList = bigPicture.querySelector(`.social__comments`);
  const socialCommentCount = bigPicture.querySelector(`.social__comment-count`); // Находим блок показа количества комментариев
  const commentTemplate = document.querySelector(`#comments`).content;
  const commentsLoader = bigPicture.querySelector(`.comments-loader`);
  let currentCommentIndex = 0;
  let allData;


  const onCloseBigPicture = function () { // Объявляем функцию закрытия большой картинки
    body.classList.remove(`modal-open`);
    bigPicture.classList.add(`hidden`);
    commentsList.innerHTML = null;
    closeButton.removeEventListener(`click`, onCloseBigPicture);
    document.removeEventListener(`keydown`, onCloseBigPictureByEsc);
    commentsLoader.removeEventListener(`click`, onMoreCommentsButton);
    currentCommentIndex = 0;
    commentsLoader.classList.remove(`hidden`);
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

    if (endCommentIndex === comments.length) {
      commentsLoader.classList.add(`hidden`);
    }
    return endCommentIndex; // Возвращаем последний индекс для последующего вызова
  };

  const commentsLoad = function (comments) { // Добавление комментариев
    currentCommentIndex = onCommentsLoad(comments, currentCommentIndex); // Первичный вызов комментариев
    socialCommentCount.textContent = currentCommentIndex + ` из ` + comments.length + ` комментариев`; // Обновляем количество комментариев
  };

  const onMoreCommentsButton = function () {
    commentsLoad(allData.comments);
  };

  window.preview = { // Объявление функции показа большой картинки
    showBigPhoto(data) {
      allData = data;
      bigPictureImg.src = allData.url; // Подставляем в src большой фотографии адрес
      likesCount.textContent = allData.likes; // Подставляем количество лайков
      socialCaption.textContent = allData.description;
      commentsList.innerHTML = null;
      commentsCount.textContent = allData.comments.length; // Подставляем количество комментариев
      commentsLoad(allData.comments);
      closeButton.addEventListener(`click`, onCloseBigPicture); // Добавляем обработчики событий на закрытие
      document.addEventListener(`keydown`, onCloseBigPictureByEsc);
      commentsLoader.addEventListener(`click`, onMoreCommentsButton);
      body.classList.add(`modal-open`); // Блокируем прокрутку фона
      bigPicture.classList.remove(`hidden`); // Показываем большую картинку
    }
  };
})();
