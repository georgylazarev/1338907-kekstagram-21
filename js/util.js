'use strict';

(function () {
  window.util = {
    randomGenerator(length) {
      return Math.floor(Math.random() * Math.floor(length));
    }
  };
})();
