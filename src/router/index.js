import Vue from 'vue';
import VueRouter from 'vue-router';
import { sync } from 'vuex-router-sync';

import Outlet from '../views/Outlet.vue';
import ViewOutlet from '../views/ViewOutlet.vue';
import Search from '../views/Search.vue';
import Login from '../views/Login.vue';
import store from '../store/index.js';

// import store from '../store/index.js';

Vue.use(VueRouter);

/**
 * The handleSessionError method, handle any case of error regarding session management
 * And proceed to the dispatch of the logout event
 * @param {String} error The error message
 * @param {Function} next The next middleware function
 */
function handleSessionError(error, next) {
  console.info('[info] session expired !');
  // store.dispatch('logout');
  // return next({ path: '/login' });
}

let refreshTokenInterval;
/**
 * The refreshToken method handle the refresh token dispatch
 */
async function refreshToken() {
  if (Date.now() / 1000 > store.getters.expires_in) {
    clearInterval(refreshTokenInterval);
    throw new Error('Session expired');
  }
  console.info('[info] refreshing the token');
  const data = await store.dispatch('refreshToken');
  if (data === false) throw new Error('Session expired');
  return data;
}

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    component: Outlet,
    children: [
      {
        path: '/',
        component: ViewOutlet,
        children: [
          { path: '/', redirect: '/search' },
          {
            path: '/search',
            name: 'Search',
            component: Search,
            meta: {
              actions: false
            }
          },
          {
            path: '/favorites',
            name: 'Favorites',
            component: () => import(/* webpackChunkName: "Favorites" */ '../views/Favorites.vue'),
            meta: {
              actions: false
            }
          },
          {
            path: '/view/concept/:id',
            name: 'ViewConcept',
            component: () => import(/* webpackChunkName: "ViewItem" */ '../views/ViewConcept.vue'),
            meta: {
              type: 'concept'
            }
          }
        ]
      }
      // {
      //   path: '/',
      //   name: 'Home',
      //   component: Home,
      //   meta: {
      //     title: 'title.home'
      //   }
      // }
    ]
  }
];

/**
 * @see https://stackoverflow.com/questions/58634914/getting-navigation-duplicated-error-while-the-route-is-being-replaced-on-vue-rou
 */
const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch((err) => err);
};

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

const unsync = sync(store, router);

/**
 * Check if the current route has query params and append them to the new route
 * @see https://stackoverflow.com/questions/45091380/vue-router-keep-query-parameter-and-use-same-view-for-children
 * @param {VueRouterRoute} route The current route object
 */
function hasQueryParams(route) {
  return !!Object.keys(route.query).length;
}

router.beforeEach(async (to, from, next) => {
  if (from.name !== to.name || from.query.tab !== to.query.tab) {
    store.commit('showSpinner');
  }

  // Clear the refresh interval each time the user access a new page
  clearInterval(refreshTokenInterval);

  const token = window.localStorage.getItem('token');

  // If there is no token in session and auth is required,
  // we redirect to login page
  const authorized = [ 'Login' ];
  if (!token) return authorized.includes(to.name) ? next() : next({ name: 'Login' });

  try {
    if (Date.now() > store.getters.expires_in) throw new Error('Session expired');

    // Syncing data
    // await idbSyncData();
    refreshTokenInterval = setInterval(async () => {
      // Syncing data
      // await idbSyncData();
    }, 1 * window.config.synchroInterval);
  } catch (error) {
    console.log(error);
    return handleSessionError(error, next);
  }

  return next();
});

export default router;
