(function() {
  const PODCAST_BASE_URL = 'https://tn79ww2uth.execute-api.us-east-1.amazonaws.com/prod/';

  function throttle(callback, milliseconds) {
    let timeoutSet = false;

    return () => {
      if (!timeoutSet) {
        setTimeout(() => {
          timeoutSet = false;
          callback();
        }, milliseconds);

        timeoutSet = true;
      }
    }
  }

  function Mp3ToPodcast() {
    this.onDomLoaded = this.onDomLoaded.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  Mp3ToPodcast.prototype = {
    onDomLoaded: function() {
      this.urlInputEl = document.getElementsByClassName('main-url-input')[0];
      this.titleInputEl = document.getElementsByClassName('main-title-input')[0];
      this.copyLabelColonEl = document.getElementsByClassName('main-copy-label-colon')[0];

      const throttledHandleChange = throttle(this.handleChange, 100);
      this.urlInputEl.addEventListener('input', throttledHandleChange);
      this.titleInputEl.addEventListener('input', throttledHandleChange);
    },

    handleChange: function(e) {
      if (this.urlInputEl.value || this.titleInputEl.value) {
        this.titleInputEl.parentElement.classList.remove('hidden');
        this.copyLabelColonEl.classList.remove('hidden');
      } else {
        this.titleInputEl.parentElement.classList.add('hidden');
        this.copyLabelColonEl.classList.add('hidden');
      }

      // Putting mp3Url after title ensures that when the URL is pasted into iOS
      // Messages, the app links the full URL, even if title has special chars.
      const url = PODCAST_BASE_URL +
                '?title=' + encodeURIComponent(this.titleInputEl.value) +
                '&mp3Url=' + encodeURIComponent(this.urlInputEl.value);
      console.log(url);
    }
  };

  const mp3ToPodcast = new Mp3ToPodcast();
  document.addEventListener('DOMContentLoaded', mp3ToPodcast.onDomLoaded);
})();
