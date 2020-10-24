'use strict';

(function () {
  window.util = {
    randomGenerator(length) {
      return Math.floor(Math.random() * Math.floor(length));
    },
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
    }
  };
})();
