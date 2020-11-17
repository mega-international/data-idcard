/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
import Vue from 'vue';
import messages from '@/i18n/translation.js';

// Import API
//  Authentication
import {
  login, refreshToken, getUser, getUserInfo, revokeToken, getAvailableLanguage, changeCurrentLangue
} from '@/api/auth.js';
import { getDB } from '@/assets/js/idb.js';
import i18n from '../i18n/plugin.js';

let userInfo = {};
let language = {};
try {
  userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
  language = JSON.parse(window.localStorage.getItem('language'));
} catch (error) {
  userInfo = {};
  language = {};
}

export default {
  state: {
    user: window.localStorage.getItem('user') || '',
    userInfo: userInfo || {},
    language: language || {},
    token: window.localStorage.getItem('token') || '',
    expires_in: window.localStorage.getItem('expires_in') || '',
    expires_at: window.localStorage.getItem('expires_at') || '',
    refresh_token: window.localStorage.getItem('refresh_token') || '',
    token_type: window.localStorage.getItem('token_type') || '',
    favoriteTerms: [],
    favoriteConcepts: [],
    availableLanguage: [],
  },
  getters: {
    getUser: (state) => state.user,
    getUserInfo: (state) => state.userInfo,
    getToken: (state) => state.token,
    getRefreshToken: (state) => state.refresh_token,
    expiresIn: (state) => state.expires_in,
    expiresAt: (state) => state.expires_at,
  },
  mutations: {
    // Authentication
    // eslint-disable-next-line object-curly-newline
    setToken(state, { access_token, expires_in, refresh_token, token_type }) {
      window.localStorage.setItem('token', access_token);
      state.token = access_token;

      // Timestamp at witch the token will expires
      const expiresAt = (expires_in * 1000) + Date.now();
      window.localStorage.setItem('expires_at', expiresAt);
      state.expires_at = expiresAt;

      window.localStorage.setItem('expires_in', expires_in);
      state.expires_in = expires_in;

      window.localStorage.setItem('refresh_token', refresh_token);
      state.refresh_token = refresh_token;

      window.localStorage.setItem('token_type', token_type);
      state.token_type = token_type;
    },
    setUser(state, user) {
      window.localStorage.setItem('user', user);
      state.user = user;
    },
    setUserInfo(state, userInfo) {
      window.localStorage.setItem('userInfo', JSON.stringify(userInfo));
      state.userInfo = userInfo;
    },
    setLanguage(state, lanquage) {
      window.localStorage.setItem('language', JSON.stringify(lanquage));
      state.language = lanquage;
    },
    logout(state, force) {
      if (force) {
        window.localStorage.setItem('user', '');
        state.user = '';

        window.localStorage.setItem('token', '');
        state.token = '';

        window.localStorage.setItem('expires_in', '');
        state.expires_in = '';

        window.localStorage.setItem('expires_at', '');
        state.expires_at = '';

        window.localStorage.setItem('refresh_token', '');
        state.refresh_token = '';
      }
    },
    getFavorites(state, { terms, concepts }) {
      state.favoriteTerms = terms;
      state.favoriteConcepts = concepts;
    },
    setAvailableLanguage(state, languages) {
      state.availableLanguage = languages;
    }
  },
  actions: {
    // Authentication
    async login({ commit, dispatch }, params) {
      const data = await login(params);
      if (data !== false) {
        commit('setToken', data);
        const { userId, ...lanquage } = await getUser();
        if (userId !== false) {
          commit('setUser', userId);
          commit('setLanguage', lanquage);
          const userInfo = await getUserInfo(userId);
          commit('setUserInfo', userInfo);
        }
      }
      return data;
    },
    async logout({ commit, dispatch }, params) {
      const data = await revokeToken();
      commit('logout', params.force);
      // eslint-disable-next-line no-undef
      let text = messages.en.notification.error.expiredSession;
      if (params && params.message) {
        // eslint-disable-next-line no-undef
        text = params.message.split('.').reduce((obj, key) => obj && obj[key], messages.en.notification);
        dispatch('displaySnackbar', {
          text
        });
      }
    },
    async refreshToken({ commit }) {
      const data = await refreshToken();
      // data.access_token is false if no connectivity
      if (data !== false && data.access_token !== false) {
        commit('setToken', data);
      }
      return data;
    },
    async getFavorites({ commit }) {
      const db = await getDB();
      const terms = (await db.getAllFromIndex('term', 'favorite', 'true')).map((term) => term.id);
      const concepts = (await db.getAllFromIndex('concept', 'favorite', 'true')).map((concept) => concept.id);
      commit('getFavorites', { terms, concepts });
    },
    async removeFavorite({ dispatch }, { id, type }) {
      const db = await getDB();
      const data = await db.getFromIndex(type, 'id', id);
      data.favorite = 'false';
      await db.put(type, data);
      dispatch('getFavorites');
      dispatch('displaySnackbar', { text: i18n.t('text.removedFromFavorites') });
    },
    async addFavorite({ dispatch }, { id, type }) {
      const db = await getDB();
      const data = await db.getFromIndex(type, 'id', id);
      data.favorite = 'true';
      await db.put(type, data);
      dispatch('getFavorites');
      dispatch('displaySnackbar', { text: i18n.t('text.addedToFavorites') });
    },
    async getAvailableLanguage({ commit }) {
      const data = await getAvailableLanguage();
      if (data !== false) {
        commit('setAvailableLanguage', data);
      }
      return data;
    },
    async changeCurrentLangue({ commit }, id) {
      const data = await changeCurrentLangue(id);
      if (data !== false) {
        const { userId, ...lanquage } = await getUser();
        if (userId !== false) {
          commit('setLanguage', lanquage);
        }
      }
      return data;
    }
  }
};
