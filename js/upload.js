'use strict';

(function () {
  window.upload = function (url, formData) {
    const xhr = new XMLHttpRequest();
    xhr.open(`POST`, url);

    xhr.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE) {
        if (this.status === 200) {
          window.main.loadSuccess();
        } else {
          window.main.loadError();
        }
        window.form.closePopup();
      }
    };

    xhr.send(formData);
  };
})();
