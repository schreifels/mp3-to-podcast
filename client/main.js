(function() {
  const PODCAST_BASE_URL = 'https://tn79ww2uth.execute-api.us-east-1.amazonaws.com/prod/';

  function Mp3ToPodcast() {
    this.onDomLoaded = this.onDomLoaded.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  Mp3ToPodcast.prototype = {
    onDomLoaded: function() {
      this.mp3UrlInputEl  = document.getElementsByClassName('mp3-url-input')[0];
      this.mp3TitleInputEl = document.getElementsByClassName('mp3-title-input')[0];

      this.mp3UrlInputEl.addEventListener('input', this.handleInput);
      this.mp3TitleInputEl.addEventListener('input', this.handleInput);
    },

    handleInput: function(e) {
      // Putting mp3Url after title ensures that when the URL is pasted into iOS
      // Messages, the app links the full URL, even if title has special chars.
      const url = PODCAST_BASE_URL +
                '?title=' + encodeURIComponent(this.mp3TitleInputEl.value) +
                '&mp3Url=' + encodeURIComponent(this.mp3UrlInputEl.value);
      console.log(url);
    }
  };

  const mp3ToPodcast = new Mp3ToPodcast();
  document.addEventListener('DOMContentLoaded', mp3ToPodcast.onDomLoaded);
})();
