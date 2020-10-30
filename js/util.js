'use strict';

(function () {
  window.util = {
    onShowMessage(type) {
      const main = document.querySelector(`main`);
      const messageTemplate = document.querySelector(`#` + type).content;
      const newMessage = messageTemplate.cloneNode(true);
      main.appendChild(newMessage);
      const showedMessage = document.querySelector(`.` + type);
      const closeMessage = function () {
        main.removeChild(showedMessage);
        document.removeEventListener(`keydown`, closeMessageByEsc);
      };
      showedMessage.addEventListener(`click`, function () {
        closeMessage();
      });
      const closeMessageByEsc = function (evt) {
        evt.preventDefault();
        if (evt.key === `Escape`) {
          closeMessage();
        }
      };
      document.addEventListener(`keydown`, closeMessageByEsc);
    },
    shuffle(array) {
      let currentIndex = array.length;
      let temporaryValue;
      let randomIndex;

      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
    }
  };
})();
