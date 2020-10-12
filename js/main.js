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
const MIN_BRIGHTNESS_LEVEL = 1;
const MAX_BRIGHTNESS_COEFFICIENT = 2;
const MAX_BLUR_COEFFICIENT = 3;
const MAX_SCALE = 100;
const MIN_SCALE = 25;
const SCALE_STEP = 25;

let fileUploader = document.querySelector(`#upload-file`);
const uploadForm = document.querySelector(`.img-upload__form`);
const overlayForm = document.querySelector(`.img-upload__overlay`);
const closeButton = overlayForm.querySelector(`.img-upload__cancel`);
const effectsList = overlayForm.querySelectorAll(`.effects__radio`);
const uploadPreview = overlayForm.querySelector(`.img-upload__preview`).querySelector(`img`);
const effectLevelSlider = overlayForm.querySelector(`.img-upload__effect-level`);
const effectLevelLine = effectLevelSlider.querySelector(`.effect-level__line`);
const effectLevelPin = effectLevelSlider.querySelector(`.effect-level__pin`);
const effectLevelDepth = effectLevelSlider.querySelector(`.effect-level__depth`);
let effectLevelValue = effectLevelSlider.querySelector(`.effect-level__value`);
let hashtagInput = overlayForm.querySelector(`.text__hashtags`);

let effectValue = ``;

const scaleControlSmaller = overlayForm.querySelector(`.scale__control--smaller`);
const scaleControlBigger = overlayForm.querySelector(`.scale__control--bigger`);
let scaleControlValue = overlayForm.querySelector(`.scale__control--value`);

// Функция закрытия попапа
const closePopup = function () {
  fileUploader.value = ``;
  uploadPreview.removeAttribute(`class`);
  effectsList[0].checked = true;
  document.removeEventListener(`keydown`, onPopupEscPress);
  effectLevelPin.removeEventListener(`mousedown`, onPinMove);
  scaleControlSmaller.removeEventListener(`click`, onScaleButtonSmallerPress);
  scaleControlBigger.removeEventListener(`click`, onScaleButtonBiggerPress);
  overlayForm.classList.add(`hidden`);
  body.classList.remove(`modal-open`);
  uploadPreview.removeAttribute(`class`);
  uploadPreview.removeAttribute(`style`);
};

// Закрытие попапа по нажатию Esc
const onPopupEscPress = function (evt) {
  if (evt.key === `Escape`) {
    if (!hashtagInput.matches(`:focus`)) {
      evt.preventDefault();
      closePopup();
    } else {
      evt.preventDefault();
    }
  }
};

const changeScale = function (direction) {
  let currentValue = scaleControlValue.value.substring(0, scaleControlValue.value.length - 1);
  let newValue = currentValue;
  if (direction === `bigger` && newValue < MAX_SCALE) {
    newValue = parseInt(currentValue, 10) + SCALE_STEP;
  } else if (direction === `smaller` && newValue > MIN_SCALE) {
    newValue = parseInt(currentValue, 10) - SCALE_STEP;
  }
  scaleControlValue.value = newValue + `%`;
  uploadPreview.style.transform = `scale(` + newValue / 100 + `)`;
};

const onScaleButtonSmallerPress = function () {
  changeScale(`smaller`);
};

const onScaleButtonBiggerPress = function () {
  changeScale(`bigger`);
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
    uploadPreview.style.filter = `blur(` + level / 100 * MAX_BLUR_COEFFICIENT + `px)`;
  } else if (effect === `heat`) {
    let brightnessLevel = MIN_BRIGHTNESS_LEVEL + (level / 100 * MAX_BRIGHTNESS_COEFFICIENT);
    uploadPreview.style.filter = `brightness(` + brightnessLevel + `)`;
  }
  effectLevelValue.value = level;
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

    // Вычисляем относительное положение ползунка в процентах
    let currentLevel = (effectLevelPin.offsetLeft * 100 / effectLevelLine.offsetWidth).toFixed(0);
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
    uploadPreview.style.filter = `none`;
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
  scaleControlValue.value = MAX_SCALE + `%`;
  scaleControlSmaller.addEventListener(`click`, onScaleButtonSmallerPress);
  scaleControlBigger.addEventListener(`click`, onScaleButtonBiggerPress);
};

// Проверка хэштегов на валидность
const onErrorCheck = function () {
  // Перегоняем полученное значение в массив и сортируем
  let hastagArray = hashtagInput.value.split(` `).sort();
  // Задаем регулярное выражение для проверки тега
  const re = /^#[\w]{1,19}$/;
  // Обнуляем счётчик ошибок
  let errorsCount = 0;
  // Объявляем переменную для сравнения тегов
  let tagLeft = ``;

  // Если поле ввода пустое
  if (!hashtagInput.value) {
    // Сбрасываем отображение ошибок
    // Таки образом теги становятся не обязательными
    hashtagInput.style.boxShadow = `none`;
    hashtagInput.setCustomValidity(``);
  } else {
    // Иначе начинаем проверки
    // Если в поле более 5 хэштегов
    if (hastagArray.length > 5) {
      // Выводим соответствующую ошибку
      hashtagInput.setCustomValidity(`Может быть не более 5 хэштегов`);
      errorsCount += 1;
    } else {
      // Иначе, проверяем каждый тег
      hastagArray.forEach((hashTag) => {
        // Переводим в нижний кейс, чтобы не играл роли регистр
        hashTag = hashTag.toLowerCase();
        // Если тег не соответствует регулярке
        if (!re.test(hashTag)) {
          // Выводим ошибку
          hashtagInput.setCustomValidity(`Хештег должен соответсвовать критериям`);
          errorsCount += 1;
        // Иначе, если тег совпадает с предыдущим
        } else if (hashTag === tagLeft) {
          // Выводим соответствующую ошибку
          hashtagInput.setCustomValidity(`У вас есть повторяющиеся хэштеги`);
          errorsCount += 1;
          tagLeft = hashTag;
        } else {
          // Если ошибок нет, отменяем выделение поля красным
          hashtagInput.style.boxShadow = `none`;
          tagLeft = hashTag;
        }
      });
    }

    // Проверяем, есть ли хоть одна ошибка в тегах
    if (errorsCount) {
      // Если да, подсвечиваем поле красным
      hashtagInput.style.boxShadow = `0 0 15px red`;
    } else {
      // Иначе, убираем подсветку и сообщение
      hashtagInput.style.boxShadow = `none`;
      hashtagInput.setCustomValidity(``);
    }
    hashtagInput.reportValidity();
  }
  return errorsCount;
};

// Проверяем теги на валидность в процессе набора
hashtagInput.addEventListener(`input`, function () {
  onErrorCheck();
});

// Проверяем теги на валидность перед отправкой формы
uploadForm.addEventListener(`submit`, function () {
  onErrorCheck();
});
