'use strict';

(function () {
  const picturesTemplate = document.querySelector(`#picture`); // Находим шаблон картинки-превью

  window.data = {
    displayPreview(item, i) { // Формируем превью
      let singlePictureTemplate = picturesTemplate.content.querySelector(`.picture`); // Находим код картинки в шаблоне
      let picture = singlePictureTemplate.cloneNode(true); // Клонируем
      const img = picture.querySelector(`.picture__img`); // Находим тег изображения
      const commentsCount = picture.querySelector(`.picture__comments`); // Находим тег количества комментариев
      const likesCount = picture.querySelector(`.picture__likes`); // Находим тег количества лайков
      img.src = item.url; // Присваиваем изображению в превью адрес полученного картинки
      commentsCount.textContent = item.comments.length; // Присваиваем количество комментариев
      likesCount.textContent = item.likes; // Присваиваем количество лайков
      picture.setAttribute(`data-indexnumber`, i); // Добавляем аттрибут для связи превью и элемента массива
      picture.setAttribute(`tabindex`, 0); // Добавляем аттрибут для интерактивности
      return picture; // Возвращаем готовую картинку-превью
    }
  };
})();
