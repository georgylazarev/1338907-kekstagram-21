'use strict';

(function () {
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

  const picturesTemplate = document.querySelector(`#picture`).content;
  let listOfPhotos = document.querySelector(`.pictures`);

  // Создаём одно фото
  const getPhoto = function (urlNumber) {
    let comments = [];
    let lastCommentNUmber = 0;
    // Генерируем количество лайков
    const likesCount = LIKES_MIN + window.util.randomGenerator(LIKES_MAX);
    // Выбираем случайного автора
    const authorNumber = window.util.randomGenerator(AUTHOR_NAMES.length);
    const author = AUTHOR_NAMES[authorNumber];
    // Определяем количество комментариев
    const commentsCount = window.util.randomGenerator(COMMENTS_MAX);
    // Собираем блок комментариев
    for (let i = 0; i <= commentsCount; i++) {
      let commentNumber = COMMENTS_MIN + window.util.randomGenerator(COMMENTS_LIST.length);
      // Защита от повторяющихся комментариев
      if (commentNumber === lastCommentNUmber) {
        i--;
      } else {
        comments.push(COMMENTS_LIST[commentNumber]);
        lastCommentNUmber = commentNumber;
      }
    }
    // Собираем объект фото
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
})();
