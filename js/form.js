'use strict';

(function () {
  const MAX_LEVEL = 100;
  const MIN_BRIGHTNESS_LEVEL = 1;
  const MAX_BRIGHTNESS_COEFFICIENT = 2;
  const MAX_BLUR_COEFFICIENT = 3;
  const MAX_SCALE = 100;
  const MIN_SCALE = 25;
  const SCALE_STEP = 25;

  const body = document.querySelector(`body`);
  const fileUploader = document.querySelector(`#upload-file`);
  const uploadForm = document.querySelector(`.img-upload__form`);
  const overlayForm = document.querySelector(`.img-upload__overlay`);
  const closeButton = overlayForm.querySelector(`.img-upload__cancel`);
  const effectsList = overlayForm.querySelectorAll(`.effects__radio`);
  const uploadPreview = overlayForm.querySelector(`.img-upload__preview`).querySelector(`img`);
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
  const closePopup = function () {
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
  };

  // Закрытие попапа по нажатию Esc
  const onPopupEscPress = function (evt) {
    if (evt.key === `Escape`) {
      if (hashtagInput.matches(`:focus`) || commentInput.matches(`:focus`)) {
        evt.preventDefault();
      } else {
        evt.preventDefault();
        closePopup();
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
    uploadPreview.style.transform = `scale(` + newValue / 100 + `)`;
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
    scaleControlValue.value = MAX_SCALE + `%`;
    overlayForm.classList.remove(`hidden`);
    body.classList.add(`modal-open`);
    // Скрытие слайдера эффектов
    effectLevelSlider.classList.add(`hidden`);
    // Обработчик событий на закрытие
    closeButton.addEventListener(`click`, closePopup);
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
  };

  const onErrorCheckComment = function () {
    if (commentInput.value.length > 140) {
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
  uploadForm.addEventListener(`submit`, function () {
    onErrorCheckHashtag();
    onErrorCheckComment();
  });
})();
