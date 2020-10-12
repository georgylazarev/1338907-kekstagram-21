'use strict';

const COMMENTS_LIST = [
  `Всё отлично!`,
  `В целом всё неплохо. Но не всё.`,
  `Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.`,
  `Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.`,
  `Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.`,
  `Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!`];
const AUTHOR_NAMES = [
  `Алёна`,
  `Борис`,
  `Вероника`,
  `Геннадий`,
  `Диана`,
  `Евгений`,
  `Жылдыз`,
  `Захар`,
  `Ирина`,
  `Кирилл`];
const COMMENTS_MIN = 1;
const COMMENTS_MAX = 4;
const LIKES_MIN = 15;
const LIKES_MAX = 200;
const PHOTOS_COUNT = 25;

let listOfPhotos = document.querySelector(`.pictures`);
const picturesTemplate = document.querySelector(`#picture`).content;
const commentsTemplate = document.querySelector(`#comments`).content;
const commentsList = document.querySelector(`.social__comments`);
const body = document.querySelector(`body`);
const bigPicture = document.querySelector(`.big-picture`);

const randomGenerator = function (length) {
  return Math.floor(Math.random() * Math.floor(length));
};

// Создаём одно фото
const getPhoto = function (urlNumber) {
  // Генерируем количество лайков
  const likesCount = LIKES_MIN + randomGenerator(LIKES_MAX);

  // Выбираем случайного автора
  const authorNumber = randomGenerator(AUTHOR_NAMES.length);
  const author = AUTHOR_NAMES[authorNumber];

  const commentsCount = randomGenerator(COMMENTS_MAX);
  let comments = [];
  let lastCommentNUmber = 0;

  // Собираем блок комментариев
  for (let i = 0; i <= commentsCount; i++) {
    let commentNumber = COMMENTS_MIN + randomGenerator(COMMENTS_LIST.length);

    // Защита от повторяющихся комментариев
    if (commentNumber === lastCommentNUmber) {
      i--;
    } else {
      comments.push(COMMENTS_LIST[commentNumber]);
      lastCommentNUmber = commentNumber;
    }
  }

  let singlePhoto = {
    url: `photos/` + urlNumber + `.jpg`,
    description: author,
    likes: likesCount,
    comments};

  return singlePhoto;
};

// Генерируем все фото по ТЗ
const getAllPhotos = function (photosCount) {
  let photos = [];
  for (let i = 1; i <= photosCount; i++) {
    photos.push(getPhoto(i));
  }
  return photos;
};

// Создание по шаблону одной фотографии
const displayPicture = function (currentPhoto) {
  const pictureTemplate = picturesTemplate.querySelector(`.picture`);
  let picture = pictureTemplate.cloneNode(true);

  const img = picture.querySelector(`.picture__img`);
  img.src = currentPhoto.url;

  const comments = picture.querySelector(`.picture__comments`);
  comments.textContent = currentPhoto.comments;

  const likes = picture.querySelector(`.picture__likes`);
  likes.textContent = currentPhoto.likes;

  return picture;
};

// Вывод всех фото на сайт
const allPhotos = getAllPhotos(PHOTOS_COUNT);
allPhotos.forEach((photo) => {
  listOfPhotos.appendChild(displayPicture(photo));
});

// Находим все миниатюры
const allThumbnails = listOfPhotos.querySelectorAll(`.picture`);

// Объявление функции показа большой картинки
const showBigPhoto = function () {
  // Блокируем прокрутку фона
  body.classList.add(`modal-open`);
  // Подставляем в src большой фотографии адрес из массива
  const bigPictureImg = bigPicture.querySelector(`.big-picture__img`).querySelector(`img`);
  bigPictureImg.src = allPhotos[0].url;
  // Меянем количество лайков
  const bigPictureLikesCount = bigPicture.querySelector(`.likes-count`);
  bigPictureLikesCount.textContent = allPhotos[0].likes;
  // Меняем количество комментариев
  const bigPictureCommentsCount = bigPicture.querySelector(`.comments-count`);
  bigPictureCommentsCount.textContent = allPhotos[0].comments.length;
  // Добавляем описание фото
  const bigPictureDescription = bigPicture.querySelector(`.social__caption`);
  bigPictureDescription.textContent = allPhotos[0].description;
  // Прячем количество комментариев
  const socialCommentCount = bigPicture.querySelector(`.social__comment-count`);
  socialCommentCount.classList.add(`hidden`);
  // Прячем блок добавления комментариев
  const commentLoader = bigPicture.querySelector(`.comments-loader`);
  commentLoader.classList.add(`hidden`);
  // Выводим комментарии
  allPhotos[0].comments.forEach((comment) => {
    const commentTemplate = commentsTemplate.querySelector(`.social__comment`);
    const singleComment = commentTemplate.cloneNode(true);
    const avatar = singleComment.querySelector(`img`);
    const commentText = singleComment.querySelector(`.social__text`);

    avatar.src = `img/avatar-4.svg`;
    avatar.alt = allPhotos[0].description;
    commentText.textContent = comment;

    commentsList.appendChild(singleComment);
  });
  // Показываем фото пользователю
  bigPicture.classList.remove(`hidden`);
};

// Вешаем обработчик событий на каждую миниатюру
for (let thumbNail of allThumbnails) {
  thumbNail.addEventListener(`click`, showBigPhoto);
}

// Загрузка фото
const MAX_LEVEL = 100;
let fileUploader = document.querySelector(`#upload-file`);
const overlayForm = document.querySelector(`.img-upload__overlay`);
const closeButton = overlayForm.querySelector(`.img-upload__cancel`);
const effectsList = overlayForm.querySelectorAll(`.effects__radio`);
const uploadPreview = overlayForm.querySelector(`.img-upload__preview`).querySelector(`img`);
const effectLevelSlider = overlayForm.querySelector(`.img-upload__effect-level`);
const effectLevelLine = effectLevelSlider.querySelector(`.effect-level__line`);
const effectLevelPin = effectLevelSlider.querySelector(`.effect-level__pin`);
const effectLevelDepth = effectLevelSlider.querySelector(`.effect-level__depth`);
let effectValue = ``;

// Функция закрытия попапа
const closePopup = function () {
  fileUploader.value = ``;
  uploadPreview.removeAttribute(`class`);
  effectsList[0].checked = true;
  document.removeEventListener(`keydown`, onPopupEscPress);
  effectLevelPin.removeEventListener(`mousedown`, onPinMove);
  overlayForm.classList.add(`hidden`);
  body.classList.remove(`modal-open`);
};

// Закрытие попапа по нажатию Esc
const onPopupEscPress = function (evt) {
  if (evt.key === `Escape`) {
    evt.preventDefault();
    closePopup();
  }
};

// Применение эффекта
const onUseEffect = function (effect, level) {
  if (effect === `chrome`) {
    uploadPreview.style.filter = `grayscale(` + level / 100 + `)`;
  } else if (effect === `sepia`) {
    uploadPreview.style.filter = `sepia(` + level / 100 + `)`;
  } else if (effect === `marvin`) {
    uploadPreview.style.filter = `invert(` + level + `%)`;
  } else if (effect === `phobos`) {
    uploadPreview.style.filter = `blur(` + level / 100 * 3 + `px)`;
  } else if (effect === `heat`) {
    let brightnessLevel = 1 + (level / 100 * 2);
    uploadPreview.style.filter = `brightness(` + brightnessLevel + `)`;
  }
};

// Перемещение пина эффектов
const onPinMove = function (evt) {
  evt.preventDefault();

  let startPosition = {
    x: evt.clientX
  };

  const onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    let shift = {
      x: startPosition.x - moveEvt.clientX
    };

    startPosition = {
      x: moveEvt.clientX
    };

    let newPosition = effectLevelPin.offsetLeft - shift.x;

    // Ограничение на минимальное и максимальное значение
    if (newPosition < 0) {
      effectLevelPin.style.left = `0`;
    } else if (newPosition > effectLevelLine.offsetWidth) {
      effectLevelPin.style.left = effectLevelLine.offsetWidth + `px`;
    } else {
      effectLevelPin.style.left = newPosition + `px`;
    }

    // Заполненная часть полосы перемещения следует за пином
    effectLevelDepth.style.width = effectLevelPin.style.left;
  };

  const onMouseUp = function (upEvt) {
    upEvt.preventDefault();

    document.removeEventListener(`mousemove`, onMouseMove);
    document.removeEventListener(`mouseup`, onMouseUp);

    // Вычисляем относительное положение ползунка в процентах до сотых
    let currentLevel = (effectLevelPin.offsetLeft * 100 / effectLevelLine.offsetWidth).toFixed(2);
    // Вызываем функцию применения эффекта
    onUseEffect(effectValue, currentLevel);
  };

  document.addEventListener(`mousemove`, onMouseMove);
  document.addEventListener(`mouseup`, onMouseUp);
};

// Изменение фильтра
const onChangeEffect = function (effect) {
  effectValue = effect.value;
  if (effectValue === `none`) {
    uploadPreview.removeAttribute(`class`);
    uploadPreview.removeAttribute(`style`);
    effectLevelSlider.classList.add(`hidden`);
  } else {
    effectLevelSlider.classList.remove(`hidden`);
    uploadPreview.removeAttribute(`class`);
    uploadPreview.classList.add(`effects__preview--` + effectValue);
    onUseEffect(effectValue, MAX_LEVEL);
    effectLevelPin.style.left = effectLevelLine.offsetWidth + `px`;
    effectLevelDepth.style.width = effectLevelPin.style.left;
    effectLevelPin.addEventListener(`mousedown`, onPinMove);
  }
};

// Открытие попапа
fileUploader.onchange = function () {
  overlayForm.classList.remove(`hidden`);
  body.classList.add(`modal-open`);
  // Скрытие слайдера эффектов
  effectLevelSlider.classList.add(`hidden`);
  // Обработчик событий на закрытие
  closeButton.addEventListener(`click`, closePopup);
  document.addEventListener(`keydown`, onPopupEscPress);
  // Обработчик событий на выбор фильтра
  effectsList.forEach((effect) => {
    effect.addEventListener(`change`, function () {
      onChangeEffect(effect);
    });
  });
};
