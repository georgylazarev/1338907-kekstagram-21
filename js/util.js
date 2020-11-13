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
        document.removeEventListener(`keydown`, onMessageCloseByEsc);
      };
      showedMessage.addEventListener(`click`, function () {
        closeMessage();
      });
      const onMessageCloseByEsc = function (evt) {
        evt.preventDefault();
        if (evt.key === `Escape`) {
          closeMessage();
        }
      };
      document.addEventListener(`keydown`, onMessageCloseByEsc);
    },
    shuffle(elements) {
      let currentIndex = elements.length;
      let temporaryValue;
      let randomIndex;

      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = elements[currentIndex];
        elements[currentIndex] = elements[randomIndex];
        elements[randomIndex] = temporaryValue;
      }
      return elements;
    },
    maxCheck(maxValue, stepValue) {
      let result;
      if (maxValue >= stepValue) {
        result = stepValue;
      } else {
        result = maxValue;
      }
      return result;
    }
  };
})();
