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
