'use strict';

(function () {
  const MAX_LEVEL = 100;
  const MIN_BRIGHTNESS_LEVEL = 1;
  const MAX_BRIGHTNESS_COEFFICIENT = 2;
  const MAX_BLUR_COEFFICIENT = 3;
  const MAX_SCALE = 100;
  const MIN_SCALE = 25;
  const SCALE_STEP = 25;
  const MAX_PERCENT_LEVEL = 100;
  const MAX_COMMENT_LETTERS_COUNT = 140;
  const MAX_HASHTAG_COUNT = 5;
  const ALLOWED_FILE_TYPES = [`image/png`, `image/jpeg`, `image/gif`];

  const body = document.querySelector(`body`);
  const fileUploader = document.querySelector(`#upload-file`);
  const uploadForm = document.querySelector(`.img-upload__form`);
  const overlayForm = document.querySelector(`.img-upload__overlay`);
  const closeButton = overlayForm.querySelector(`.img-upload__cancel`);
  const effectsList = overlayForm.querySelectorAll(`.effects__radio`);
  const uploadPreview = overlayForm.querySelector(`.img-upload__preview`).querySelector(`img`);
  const uploadPreviewSmall = overlayForm.querySelectorAll(`.effects__preview`);
  const hashtagInput = overlayForm.querySelector(`.text__hashtags`);
  const commentInput = overlayForm.querySelector(`.text__description`);
  const scaleControlSmaller = overlayForm.querySelector(`.scale__control--smaller`);
  const scaleControlBigger = overlayForm.querySelector(`.scale__control--bigger`);
  const scaleControlValue = overlayForm.querySelector(`.scale__control--value`);
  const effectLevelSlider = overlayForm.querySelector(`.img-upload__effect-level`);
  const effectLevelLine = effectLevelSlider.querySelector(`.effect-level__line`);
  const effectLevelPin = effectLevelSlider.querySelector(`.effect-level__pin`);
  const effectLevelDepth = effectLevelSlider.querySelector(`.effect-level__depth`);
  const effectLevelValue = effectLevelSlider.querySelector(`.effect-level__value`);
  let effectValue = ``;

  // Функция закрытия попапа
  window.form = {
    onPopupClose() {
      fileUploader.value = ``;
      effectsList[0].checked = true;
      uploadPreview.removeAttribute(`class`);
      uploadPreview.removeAttribute(`style`);
      document.removeEventListener(`keydown`, onPopupEscPress);
      effectLevelPin.removeEventListener(`mousedown`, onPinMove);
      scaleControlSmaller.removeEventListener(`click`, onScaleButtonSmallerPress);
      scaleControlBigger.removeEventListener(`click`, onScaleButtonBiggerPress);
      overlayForm.classList.add(`hidden`);
      body.classList.remove(`modal-open`);
      commentInput.value = ``;
      hashtagInput.value = ``;
    }
  };

  // Закрытие попапа по нажатию Esc
  const onPopupEscPress = function (evt) {
    if (evt.key === `Escape`) {
      if (hashtagInput.matches(`:focus`) || commentInput.matches(`:focus`)) {
        evt.preventDefault();
      } else {
        evt.preventDefault();
        window.form.onPopupClose();
      }
    }
  };

  // Функция изменения размера превью
  const changeScale = function (direction) {
    let currentValue = scaleControlValue.value.substring(0, scaleControlValue.value.length - 1);
    let newValue = currentValue;
    if (direction === `bigger` && newValue < MAX_SCALE) {
      newValue = parseInt(currentValue, 10) + SCALE_STEP;
    } else if (direction === `smaller` && newValue > MIN_SCALE) {
      newValue = parseInt(currentValue, 10) - SCALE_STEP;
    }
    scaleControlValue.value = newValue + `%`;
    uploadPreview.style.transform = `scale(` + newValue / MAX_PERCENT_LEVEL + `)`;
  };


  // Применение эффекта
  const onUseEffect = function (effect, level) {
    if (effect === `chrome`) {
      uploadPreview.style.filter = `grayscale(` + level / MAX_PERCENT_LEVEL + `)`;
    } else if (effect === `sepia`) {
      uploadPreview.style.filter = `sepia(` + level / MAX_PERCENT_LEVEL + `)`;
    } else if (effect === `marvin`) {
      uploadPreview.style.filter = `invert(` + level + `%)`;
    } else if (effect === `phobos`) {
      uploadPreview.style.filter = `blur(` + level / MAX_PERCENT_LEVEL * MAX_BLUR_COEFFICIENT + `px)`;
    } else if (effect === `heat`) {
      let brightnessLevel = MIN_BRIGHTNESS_LEVEL + (level / MAX_PERCENT_LEVEL * MAX_BRIGHTNESS_COEFFICIENT);
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

      // Вычисляем относительное положение ползунка в процентах
      let currentLevel = (effectLevelPin.offsetLeft * MAX_PERCENT_LEVEL / effectLevelLine.offsetWidth).toFixed(0);
      // Вызываем функцию применения эффекта
      onUseEffect(effectValue, currentLevel);
    };
    const onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener(`mousemove`, onMouseMove);
      document.removeEventListener(`mouseup`, onMouseUp);
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

  const insertPreview = function () {
    const file = document.querySelector(`#upload-file`).files[0];
    const matches = ALLOWED_FILE_TYPES.some(function (it) {
      return file.type.endsWith(it);
    });

    if (matches) {
      const reader = new FileReader();

      reader.addEventListener(`load`, function () {
        uploadPreview.src = reader.result;
        uploadPreviewSmall.forEach((smallImg) => {
          smallImg.style.background = `url(` + reader.result + `)`;
          smallImg.style.backgroundSize = `contain`;
          smallImg.style.backgroundRepeat = `no-repeat`;
        });
      });

      reader.readAsDataURL(file);
    }
  };

  // Открытие попапа
  fileUploader.onchange = function () {
    insertPreview();
    scaleControlValue.value = MAX_SCALE + `%`;
    overlayForm.classList.remove(`hidden`);
    body.classList.add(`modal-open`);
    // Скрытие слайдера эффектов
    effectLevelSlider.classList.add(`hidden`);
    // Обработчик событий на закрытие
    closeButton.addEventListener(`click`, window.form.onPopupClose);
    document.addEventListener(`keydown`, onPopupEscPress);
    scaleControlSmaller.addEventListener(`click`, onScaleButtonSmallerPress);
    scaleControlBigger.addEventListener(`click`, onScaleButtonBiggerPress);
    // Обработчик событий на выбор фильтра
    effectsList.forEach((effect) => {
      effect.addEventListener(`change`, function () {
        onChangeEffect(effect);
      });
    });
  };

  // Проверка хэштегов на валидность
  const onErrorCheckHashtag = function () {
    // Перегоняем полученное значение в массив и сортируем
    let hastagArray = hashtagInput.value.split(` `).sort();
    hastagArray = hastagArray.filter(function (e) { // Удаляем пустые элементы если в конце строки стоит пробел или несколько пробелов стоят подряд
      return e !== ``;
    });
    // Задаем регулярное выражение для проверки тега
    const re = /^#[\wа-я]{1,19}$/;
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
    } else { // Начинаем проверки
      // Если в поле более 5 хэштегов
      if (hastagArray.length > MAX_HASHTAG_COUNT) {
      // Выводим соответствующую ошибку
        hashtagInput.setCustomValidity(`Может быть не более 5 хэштегов`);
        errorsCount += 1;
      } else {
      // Иначе, проверяем каждый тег
        hastagArray.forEach((hashTag) => {
          // Переводим в нижний кейс, чтобы не играл роли регистр
          hashTag = hashTag.toLowerCase();
          if (!re.test(hashTag) && hashTag !== ``) { // Если тег не соответствует регулярке
          // Выводим ошибку
            hashtagInput.setCustomValidity(`Хештег должен соответсвовать критериям`);
            errorsCount += 1;
            // Иначе, если тег совпадает с предыдущим
          } else if (hashTag === tagLeft && hashTag !== ``) {
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
  };

  const onErrorCheckComment = function () {
    if (commentInput.value.length > MAX_COMMENT_LETTERS_COUNT) {
      commentInput.style.boxShadow = `0 0 15px red`;
      commentInput.setCustomValidity(`Длина комментария не может превышать 140 символов`);
    } else {
      commentInput.style.boxShadow = `none`;
      commentInput.setCustomValidity(``);
    }
    commentInput.reportValidity();
  };

  // Нажатие на кнопку "Меньше"
  const onScaleButtonSmallerPress = function () {
    changeScale(`smaller`);
  };

  // Нажатие на кнопку "Больше"
  const onScaleButtonBiggerPress = function () {
    changeScale(`bigger`);
  };

  // Проверяем теги на валидность в процессе набора
  hashtagInput.addEventListener(`input`, function () {
    onErrorCheckHashtag();
  });

  // Проверяем комментарии на валидность в процессе набора
  commentInput.addEventListener(`input`, function () {
    onErrorCheckComment();
  });

  // Проверяем комментарии и теги на валидность перед отправкой формы
  uploadForm.addEventListener(`submit`, function (evt) {
    evt.preventDefault();
    onErrorCheckHashtag();
    onErrorCheckComment();
    hashtagInput.value = hashtagInput.value.replace(/\s+/g, ` `).trim(); // Убраем лишние пробелы
    let formData = new FormData(uploadForm);
    window.upload(`https://21.javascript.pages.academy/kekstagram`, formData);
  });
})();
