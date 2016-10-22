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
    this.toggleTitle = this.toggleTitle.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  Mp3ToPodcast.prototype = {
    onDomLoaded: function() {
      this.urlInputEl = document.getElementsByClassName('main-url-input')[0];
      this.titleInputEl = document.getElementsByClassName('main-title-input')[0];

      const throttledHandleInput = throttle(this.handleInput, 100);
      this.urlInputEl.addEventListener('input', throttledHandleInput);
      this.titleInputEl.addEventListener('input', throttledHandleInput);
    },

    toggleTitle: function(shouldShowTitle) {
      if (shouldShowTitle) {
        this.titleInputEl.parentElement.classList.remove('hidden');
      } else {
        this.titleInputEl.parentElement.classList.add('hidden');
      }
    },

    handleInput: function(e) {
      this.toggleTitle(!!this.urlInputEl.value);

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
