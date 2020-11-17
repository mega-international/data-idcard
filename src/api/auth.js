import { createRequest, handleError, ensureSuccess } from './api.js';
import store from '../store/index.js';
import { query } from '../assets/js/idb.js';

const request = createRequest(true);

export function login({ username, password }) {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  formData.append('grant_type', 'password');
  formData.append('scope', 'hopex openid read write offline_access');
  formData.append('client_id', window.config.client_id);
  formData.append('client_secret', window.config.client_secret);
  formData.append('environmentId', window.config.environmentId);

  return request.post('/UAS/connect/token', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
    .then(async ({ data }) => {
      if ('PasswordCredential' in window) {
        // eslint-disable-next-line no-undef
        const cred = new PasswordCredential({
          id: username,
          password,
        });
        await navigator.credentials.store(cred);
      }
      return data;
    })
    .catch((error) => handleError(error, false));
}

export function refreshToken() {
  const formData = new URLSearchParams();

  if (!store.getters.getRefreshToken) return false;

  formData.append('grant_type', 'refresh_token');
  formData.append('refresh_token', store.getters.getRefreshToken);
  formData.append('client_id', window.config.client_id);
  formData.append('client_secret', window.config.client_secret);

  return request.post('/UAS/connect/token', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
    .then(({ data }) => data)
    .catch((error) => {
      // Do not throw error on offline case
      if (error.message === 'Network Error') {
        return {
          access_token: false,
          expires_in: false,
          refresh_token: false,
          token_type: false
        };
      }
      return handleError(error);
    });
}

export function getUser() {
  return query({
    timeout: false,
    query: `query currentUserLanguage {
      _currentContext {
        userId
        languageId
        languageCode:language
        languageName
      }
    }`
  })
    .then(ensureSuccess)
    // eslint-disable-next-line no-underscore-dangle
    .then(({ data }) => data.data._currentContext)
    .catch(handleError);
}

export function getUserInfo(userId) {
  return query({
    timeout: false,
    query: `query user {
      personSystem(filter:{id:"${userId}"}) {
        id
        email
        name
      }
    }`
  })
    .then(ensureSuccess)
    .then(({ data }) => data.data.personSystem[0])
    .catch(handleError);
}

export function revokeToken() {
  if (!store.getters.getToken) return false;

  const formData = new URLSearchParams();
  formData.append('client_id', window.config.client_id);
  formData.append('client_secret', window.config.client_secret);
  formData.append('token', store.getters.getToken);
  formData.append('token_type_hint', 'access_token');

  return request.post('/UAS/connect/revocation', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }).then(({ data }) => data)
    .catch((error) => {
      // Do not throw error on offline case
      if (error.message === 'Network Error') {
        return {
          access_token: false,
          expires_in: false,
          refresh_token: false,
          token_type: false
        };
      }
      return handleError(error);
    });
}

export function getAvailableLanguage() {
  return query({
    timeout: false,
    query: `query allAvailableLanguages {
      language(orderBy:[ name_ASC ] filter:{
        language_GeneralLanguage_some: { id:"I9o3by0knG00"}
      }) {
        languageId:id
        languageCode
        languageName:name
      }
    }`
  })
    .then(ensureSuccess)
    // eslint-disable-next-line no-underscore-dangle
    .then(({ data }) => data.data.language)
    .catch(handleError);
}

export function changeCurrentLangue(id) {
  return query({
    timeout: false,
    query: `mutation {
      _updateCurrentContext(currentContext:{
        language: ${id}
      }) {
        language
      }
    }`
  })
    .then(ensureSuccess)
    // eslint-disable-next-line no-underscore-dangle
    .then(({ data }) => data.data.language)
    .catch(handleError);
}
