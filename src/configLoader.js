function handleResponse() {
  try {
    console.log('[Mega] Loading config file');
    const req = new XMLHttpRequest();
    req.open('GET', `${process.env.BASE_URL}config/config.json`, false);
    req.send(null);
    try {
      const json = JSON.parse(req.response);
      window.config = json;
      registerLocalStorage();
      window.localStorage.setItem('config', json);
      return json;
    } catch (error) {
      console.log(error);
      if (process.env !== 'production') console.log(error);
      return false;
    }
  } catch (error) {
    console.log('[Mega] Trying to load from local storage');
    if (!window.localStorage.getItem('config')) return false;
    const config = window.localStorage.getItem('config');
    return JSON.parse(config);
  }
}

function registerLocalStorage() {
  /* eslint-disable no-underscore-dangle */
  /**
   * @see https://gist.github.com/danott/942522/7c80e9213c6d20af1a4692851d3fdf182d783103
   */
  Storage.prototype._setItem = Storage.prototype.setItem;
  Storage.prototype.setItem = function setItem(key, value) {
    this._setItem(`${window.config.app_prefix ? `${window.config.app_prefix}_${key}` : key}`, JSON.stringify(value));
  };

  Storage.prototype._getItem = Storage.prototype.getItem;
  Storage.prototype.getItem = function getItem(key) {
    try {
      return JSON.parse(this._getItem(`${window.config.app_prefix ? `${window.config.app_prefix}_${key}` : key}`));
    } catch (e) {
      return this._getItem(key);
    }
  };
}

export default handleResponse();
