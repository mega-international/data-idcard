import Vue from 'vue';
import Vuex from 'vuex';

// Import state modules
//  Connectivity
import connectivity from '@/store/connectivity.js';
//  Authentication
import auth from '@/store/auth.js';
//  Notifications
import notifications from '@/store/notifications.js';
//  Data
import data from '@/store/data.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    drawerOpened: false,
    displayEmptyFields: false,
    viewOutleTitle: '',
    version: JSON.parse(window.localStorage.getItem('version')) || {},
    spinner: { default: { loading: false } },
    searchNav: []
  },
  mutations: {
    getVersion(state, version) {
      window.localStorage.setItem('version', JSON.stringify(version));
      state.version = version;
    },
    openDrawer(state) {
      state.drawerOpened = true;
    },
    closeDrawer(state) {
      state.drawerOpened = false;
    },
    registerSpinner(state, name) {
      Vue.set(state.spinner, name, { loading: false });
    },
    showSpinner(state, name = 'default') {
      Vue.set(state.spinner, name, { loading: true });
    },
    hideSpinner(state, name) {
      if (!name) Object.keys(state.spinner).map((key) => Vue.set(state.spinner, key, { loading: false }));
      else Vue.set(state.spinner, name, { loading: false });
    },
    setViewOutleTitle(state, title) {
      state.viewOutleTitle = title;
    },
    setDisplayEmptyFields(state) {
      state.displayEmptyFields = !state.displayEmptyFields;
    },
    setSearchNav(state, data) {
      state.searchNav = data;
    }
  },
  actions: {
    getVersion({ commit }) {
      console.log('[Mega] Loading version file');
      fetch(`${process.env.BASE_URL}config/version.json`)
        .then((response) => response.json())
        .then((version) => {
          commit('getVersion', version);
        });
    },
  },
  modules: {
    auth,
    notifications,
    connectivity,
    data
  }
});
