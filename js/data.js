'use strict';

(function () {
  const picturesTemplate = document.querySelector(`#picture`);
  const imgFilters = document.querySelector(`.img-filters`);

  window.onLoadData = {
    displayPicture(item, i) {
      let singlePictureTemplate = picturesTemplate.content.querySelector(`.picture`);
      let picture = singlePictureTemplate.cloneNode(true);
      const img = picture.querySelector(`.picture__img`);
      const commentsCount = picture.querySelector(`.picture__comments`);
      const likesCount = picture.querySelector(`.picture__likes`);
      img.src = item.url;
      commentsCount.textContent = item.comments.length;
      likesCount.textContent = item.likes;
      picture.setAttribute(`data-indexnumber`, i);
      picture.setAttribute(`tabindex`, 0);
      imgFilters.classList.remove(`img-filters--inactive`);
      return picture;
    }
  };
})();
