'use strict';

const COMMENTS_TEMPLATE = [
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
    let commentNumber = COMMENTS_MIN + randomGenerator(COMMENTS_TEMPLATE.length);

    // Защита от повторяющихся комментариев
    if (commentNumber === lastCommentNUmber) {
      i--;
    } else {
      comments.push(COMMENTS_TEMPLATE[commentNumber]);
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
const allPhotos = function (photosCount) {
  let photos = [];
  for (let i = 1; i <= photosCount; i++) {
    photos.push(getPhoto(i));
  }
  return photos;
};

allPhotos(PHOTOS_COUNT);
