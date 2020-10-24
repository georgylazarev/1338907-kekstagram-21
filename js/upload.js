'use strict';

(function () {
  window.upload = function (url, formData) {
    const xhr = new XMLHttpRequest();
    xhr.open(`POST`, url);

    xhr.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE) {
        if (this.status === 200) {
          console.log(`success`);
        } else {
          console.log(`error`);
        }
        window.closePopup();
      }
    };

    xhr.send(formData);
  };
})();
