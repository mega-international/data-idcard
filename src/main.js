import Vue from 'vue';

// Date filter
import { createDateFilter } from 'vue-date-fns';
import locale from 'date-fns/locale/en';
// Touch event
import Vue2TouchEvents from 'vue2-touch-events';
// DOM purify
import VueDOMPurifyHTML from 'vue-dompurify-html';

import * as Sentry from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';

import App from './App.vue';
import router from './router/index.js';
import store from './store/index.js';
import './registerServiceWorker.js';

// Import styles
import './assets/styles/main.css';
import './assets/styles/tailwind.css';
// Check connectivity
import checkConnectivityfrom from './assets/js/connectivity.js';

import i18n from './i18n/plugin.js';

import 'vue-nprogress';

import LitIcon from './components/icon/lit-icon.vue';
import LitIconset from './components/icon/lit-iconset.vue';

if (process.env.VUE_APP_SENTRY) {
  Sentry.init({
    dsn: process.env.VUE_APP_SENTRY,
    integrations: [ new VueIntegration({ Vue, attachProps: true, logErrors: true }) ],
    environment: process.env.NODE_ENV === 'production' ? 'production' : 'development'
  });
}

Vue.use(Vue2TouchEvents, {
  disableClick: true,
  touchHoldTolerance: 6000
});

Vue.use(VueDOMPurifyHTML, {
  namedConfigurations: {
    clean: {
      FORBID_ATTR: [ 'style' ],
      FORBID_TAGS: [ 'style', 'font' ]
    }
  }
});

if (window.config.connectivity) {
  checkConnectivityfrom({
    url: window.config.connectivity.url,
    timeToCount: window.config.connectivity.timeToCount,
    threshold: window.config.connectivity.threshold,
    interval: window.config.connectivity.interval,
  });
} else {
  console.error('[error] No connectivity check config!');
}

// Add filters
Vue.filter('dateShort', createDateFilter('DD MMM YYYY', { locale }));

Vue.component('lit-icon', LitIcon);
Vue.component('lit-iconset', LitIconset);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App)
}).$mount('#app');
