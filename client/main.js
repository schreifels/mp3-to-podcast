'use strict';

(function() {
  const PODCAST_BASE_URL = 'https://fiqajjljwd.execute-api.us-west-2.amazonaws.com/prod';

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
    this.handleExampleClick = this.handleExampleClick.bind(this);
    this.handleCopyClick = this.handleCopyClick.bind(this);
    this.hideCopySuccess = this.hideCopySuccess.bind(this);
  }

  Mp3ToPodcast.prototype = {
    onDomLoaded() {
      this.instructionsEl = document.getElementsByClassName('instructions')[0];
      this.exampleLinkEl = document.getElementsByClassName('instructions-exampleLink')[0];
      this.mp3UrlInputEl = document.getElementsByClassName('instructions-mp3UrlInput')[0];
      this.titleInputEl = document.getElementsByClassName('instructions-titleInput')[0];
      this.podcastUrlTextareaEl = document.getElementsByClassName('instructions-podcastUrlTextarea')[0];
      this.podcastUrlCopyButtonEl = document.getElementsByClassName('instructions-podcastUrlCopyButton')[0];
      this.podcastUrlCopySuccessEl = document.getElementsByClassName('instructions-podcastUrlCopySuccess')[0];

      const throttledHandleChange = throttle(this.handleChange, 100);
      this.mp3UrlInputEl.addEventListener('input', throttledHandleChange);
      this.titleInputEl.addEventListener('input', throttledHandleChange);

      this.exampleLinkEl.addEventListener('click', this.handleExampleClick);
      this.podcastUrlCopyButtonEl.addEventListener('click', this.handleCopyClick);

      this.handleChange();
    },

    handleChange() {
      this.hideCopySuccess();

      if (this.mp3UrlInputEl.value || this.titleInputEl.value) {
        this.instructionsEl.classList.remove('instructions-hideHideable');
      } else {
        this.instructionsEl.classList.add('instructions-hideHideable');
        this.mp3UrlInputEl.focus();
      }

      // Putting mp3Url after title ensures that when the URL is pasted into iOS
      // Messages, the app links the full URL, even if title has special chars.
      const podcastUrl = PODCAST_BASE_URL +
                          '?title=' + encodeURIComponent(this.titleInputEl.value) +
                          '&mp3Url=' + encodeURIComponent(this.mp3UrlInputEl.value);
      this.podcastUrlTextareaEl.value = podcastUrl;
    },

    handleExampleClick() {
      this.mp3UrlInputEl.value = 'http://pd.npr.org/anon.npr-mp3/npr/atc/2011/07/20110726_atc_06.mp3';
      this.titleInputEl.value = 'When Patents Attack!';
      this.handleChange();
      this.podcastUrlTextareaEl.select();
    },

    handleCopyClick() {
      this.podcastUrlTextareaEl.select();
      document.execCommand('copy');

      this.hideCopySuccess();
      this.podcastUrlCopySuccessEl.classList.add('instructions-podcastUrlCopySuccess-shown');
      this.hideCopySuccessTimeout = setTimeout(this.hideCopySuccess, 5000);
    },

    hideCopySuccess() {
      if (this.hideCopySuccessTimeout) {
        clearTimeout(this.hideCopySuccessTimeout);
        delete this.hideCopySuccessTimeout;
      }

      this.podcastUrlCopySuccessEl.classList.remove('instructions-podcastUrlCopySuccess-shown');
    }
  };

  const mp3ToPodcast = new Mp3ToPodcast();
  document.addEventListener('DOMContentLoaded', mp3ToPodcast.onDomLoaded);
})();
