'use strict';

(function() {
  const PODCAST_BASE_URL = 'https://fiqajjljwd.execute-api.us-west-2.amazonaws.com/prod';

  const INSTRUCTIONS_CLASS = 'instructions';
  const INSTRUCTIONS_HIDE_HIDEABLE_CLASS = 'instructions-hideHideable';
  const EXAMPLE_LINK_CLASS = 'instructions-exampleLink';
  const MP3_URL_INPUT_CLASS = 'instructions-mp3UrlInput';
  const TITLE_INPUT_CLASS = 'instructions-titleInput';
  const PODCAST_URL_TEXTAREA_CLASS = 'instructions-podcastUrlTextarea';
  const PODCAST_URL_COPY_BUTTON_CLASS = 'instructions-podcastUrlCopyButton';
  const PODCAST_URL_COPY_SUCCESS_CLASS = 'instructions-podcastUrlCopySuccess';
  const PODCAST_URL_COPY_SUCCESS_SHOWN_CLASS = 'instructions-podcastUrlCopySuccess-shown';

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
      this.instructionsEl = document.getElementsByClassName(INSTRUCTIONS_CLASS)[0];
      this.exampleLinkEl = document.getElementsByClassName(EXAMPLE_LINK_CLASS)[0];
      this.mp3UrlInputEl = document.getElementsByClassName(MP3_URL_INPUT_CLASS)[0];
      this.titleInputEl = document.getElementsByClassName(TITLE_INPUT_CLASS)[0];
      this.podcastUrlTextareaEl = document.getElementsByClassName(PODCAST_URL_TEXTAREA_CLASS)[0];
      this.podcastUrlCopyButtonEl = document.getElementsByClassName(PODCAST_URL_COPY_BUTTON_CLASS)[0];
      this.podcastUrlCopySuccessEl = document.getElementsByClassName(PODCAST_URL_COPY_SUCCESS_CLASS)[0];

      const throttledHandleChange = throttle(this.handleChange, 100);
      this.mp3UrlInputEl.addEventListener('input', throttledHandleChange);
      this.titleInputEl.addEventListener('input', throttledHandleChange);

      this.exampleLinkEl.addEventListener('click', this.handleExampleClick);
      this.podcastUrlCopyButtonEl.addEventListener('click', this.handleCopyClick);

      this.handleChange(true);
    },

    handleChange(skipEventTracking) {
      if (!skipEventTracking && !this.gaInputEventSent) {
        ga('send', 'event', 'MP3_URL', 'INPUT');
        this.gaInputEventSent = true;
      }

      this.hideCopySuccess();

      if (this.mp3UrlInputEl.value || this.titleInputEl.value) {
        this.instructionsEl.classList.remove(INSTRUCTIONS_HIDE_HIDEABLE_CLASS);
      } else {
        this.instructionsEl.classList.add(INSTRUCTIONS_HIDE_HIDEABLE_CLASS);
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
      ga('send', 'event', 'MP3_EXAMPLE', 'CLICK');

      this.mp3UrlInputEl.value = 'http://pd.npr.org/anon.npr-mp3/npr/atc/2011/07/20110726_atc_06.mp3';
      this.titleInputEl.value = 'When Patents Attack!';
      this.handleChange(true);
      this.podcastUrlTextareaEl.select();
    },

    handleCopyClick() {
      ga('send', 'event', 'PODCAST_URL_COPY', 'CLICK');

      this.podcastUrlTextareaEl.select();
      document.execCommand('copy');

      this.hideCopySuccess();
      this.podcastUrlCopySuccessEl.classList.add(PODCAST_URL_COPY_SUCCESS_SHOWN_CLASS);
      this.hideCopySuccessTimeout = setTimeout(this.hideCopySuccess, 5000);
    },

    hideCopySuccess() {
      if (this.hideCopySuccessTimeout) {
        clearTimeout(this.hideCopySuccessTimeout);
        delete this.hideCopySuccessTimeout;
      }

      this.podcastUrlCopySuccessEl.classList.remove(PODCAST_URL_COPY_SUCCESS_SHOWN_CLASS);
    }
  };

  const mp3ToPodcast = new Mp3ToPodcast();
  document.addEventListener('DOMContentLoaded', mp3ToPodcast.onDomLoaded);
})();
