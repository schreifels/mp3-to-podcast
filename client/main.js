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
    this.handleCopyClick = this.handleCopyClick.bind(this);
  }

  Mp3ToPodcast.prototype = {
    onDomLoaded: function() {
      this.mp3UrlInputEl = document.getElementsByClassName('instructions-mp3UrlInput')[0];
      this.titleInputEl = document.getElementsByClassName('instructions-titleInput')[0];
      this.podcastUrlTextareaEl = document.getElementsByClassName('instructions-podcastUrlTextarea')[0];
      this.podcastUrlCopyButtonEl = document.getElementsByClassName('instructions-podcastUrlCopyButton')[0];

      const throttledHandleChange = throttle(this.handleChange, 100);
      this.mp3UrlInputEl.addEventListener('input', throttledHandleChange);
      this.titleInputEl.addEventListener('input', throttledHandleChange);
      this.podcastUrlCopyButtonEl.addEventListener('click', this.handleCopyClick);

      this.handleChange();
    },

    handleChange: function(e) {
      if (this.mp3UrlInputEl.value || this.titleInputEl.value) {
        // TODO
      } else {
        // TODO
        this.mp3UrlInputEl.focus();
      }

      // Putting mp3Url after title ensures that when the URL is pasted into iOS
      // Messages, the app links the full URL, even if title has special chars.
      const podcastUrl = PODCAST_BASE_URL +
                          '?title=' + encodeURIComponent(this.titleInputEl.value) +
                          '&mp3Url=' + encodeURIComponent(this.mp3UrlInputEl.value);
      this.podcastUrlTextareaEl.value = podcastUrl;
    },

    handleCopyClick: function(e) {
      this.podcastUrlTextareaEl.select();
      document.execCommand('copy');
    }
  };

  const mp3ToPodcast = new Mp3ToPodcast();
  document.addEventListener('DOMContentLoaded', mp3ToPodcast.onDomLoaded);
})();
