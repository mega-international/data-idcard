import axios from 'axios';
import { getDB } from '@/assets/js/idb.js';

import config from '../configLoader.js';

import store from '../store/index.js';
import router from '../router/index.js';

// Import error message files
import messages from '../i18n/translation.js';


const messageSet = new Set();
const pastMessages = new Set();

if (!config) throw new Error('[Mega][error] Cannot load config file');
window.config = config;

/**
 * Create a new request object
 */
export function createRequest(auth = false, timeout = true) {
  if (window.config.ROOT_API) {
    return axios.create({
      baseURL: window.config.ROOT_API,
      timeout: timeout ? window.config.API_timeout : 0,
      headers: {
        'Content-Type': 'application/json',
        // Cond add props to object using spread operator
        ...(
          auth !== true ? {
            'X-Hopex-Context': JSON.stringify({
              EnvironmentId: window.config.environmentId,
              RepositoryId: window.config.repositoryId,
              ProfileId: window.config.profileId
            })
          } : {}
        )
      },
      withCredentials: true
    });
  }
  return false;
}

/**
 * Handle HTTP request error, using custom error name
 * returned by the API
 * @param {Object} error Object error return by the API
 */
export function handleError(error, acceptOffline = true) {
  // Wait for him for this part
  console.error(error);
  console.dir(error);

  const errData = error && error.response ? error.response.data : { error: null };
  switch (errData.error) {
    case 'invalid_grant':
      messageSet.add(messages.en.notification.error.invalidCredential);
      break;
    case null:
      if (acceptOffline) return true;
      messageSet.add(messages.en.notification.error.loginNoNetwork);
      break;
    default:
      break;
  }

  // Loop thru message set and display a message
  // If that message is not currently or has not already been displayed a second ago
  messageSet.forEach((message) => {
    if (!pastMessages.has(message)) {
      store.dispatch('displaySnackbar', { text: message, mode: 'error' });
      pastMessages.add(message);
      setTimeout(() => {
        // Remove the message from the massage bags
        messageSet.delete(message);
        pastMessages.delete(message);
      }, 1000);
    }
  });
  return false;
}

/**
 * Check if the response contain and error
 * Or if it's an async response
 * @param {*} result Axios request response
 */
export function ensureSuccess(result) {
  // Check either is there is a valid response or an async response containing a task ID and a session ID
  if ((result && (result.data && typeof result.data.data === 'object' && !result.data.data.error)) || (result && Object.prototype.hasOwnProperty.call(result, 'async'))) {
    return result;
  }
  return Promise.reject(result);
}

/**
 *
 * @param {*} error
 */
export async function handleOfflineFallback(error) {
  console.log('[network error]', error);
  if (error.response && error.response.status) {
    switch (error.response.status) {
      case 504:
        store.dispatch('displaySnackbar', { text: messages.en.notification.error.APIOut, mode: 'error' });
        return true;
      case 401:
        if ('PasswordCredential' in window && window.localStorage.getItem('token')) {
          const cred = await navigator.credentials.get({ password: true });
          if (cred) {
            console.log('[info] Credential management API, auto login ...');
            store.dispatch('login', {
              username: cred.id,
              password: cred.password
            });
          } else {
            store.dispatch('logout', { force: true });
            router.push({ path: '/login' });
          }
        }
        return true;
      default:
        return true;
    }
  } else if (error.code === 'ECONNABORTED') {
    store.dispatch('displaySnackbar', { text: messages.en.notification.error.APIOut, mode: 'error' });
    return 'ECONNABORTED';
  }
  if (error.message === 'Network Error') return true;
  return handleError(error);
}

/**
 * This method, perform a passthrough from the network response of multiple elements
 * @param {Array} data The data to be saved in idb
 * @param {String} key The key name to save the data in idb
 * @param {Boolean} set If we should only perform read on idb
 */
export async function idbListPassThrough(data, key, set = true) {
  const db = await getDB();
  // Save content into IDb
  if (set) await db.put(key, data, key);
  // Read the content from IDb
  return db.get(key, key);
}

/**
 * This method, perform a passthrough from the network response of single elements
 * @param {Array} data The data to be saved in idb
 * @param {String} key The key name to save the data in idb
 * @param {Boolean} set If we should only perform read on idb
 */
export async function idbItemPassThrough(data, key, set = true, index = 'id') {
  const db = await getDB();
  // Save content into IDb
  const idx = index || 'id';
  try {
    if (set) {
      const localData = await db.getFromIndex(key, idx, data[idx]);
      const newData = { ...localData, ...data };
      await db.put(key, newData);
    }
    // Read the content from IDb
    if (process.env.NODE_ENV !== 'production') {
      // console.log(key, idx, data[idx])
    }
  } catch (err) {
    if (set) await db.put(key, data);
  }
  return db.getFromIndex(key, idx, data[idx]);
}

/**
 * This method is looking for viewed items in a specified store
 * @param {String} storeName The store name to search in idb
 */
export async function getViewedItems(storeName) {
  const db = await getDB();
  const results = await db.getAllFromIndex(storeName, 'dateViewed');

  return results.reverse().slice(0, 10);
}

export async function idbDeleteItem(key, id, idx = 'id') {
  const db = await getDB();
  const tx = db.transaction(key, 'readwrite');
  const index = tx.store.index(idx);

  for await (const cursor of index.iterate()) {
    const item = { ...cursor.value };
    if (item[idx] === id) {
      cursor.delete();
    }
  }
  await db.delete(key, id);
}

/**
 * The idbSyncData is an asynchronous method that call each syncing method and wait for each to be resolved before passing to the next one
 * It define and global state flag to prevent triggering two synchronization at the same time
 */
export async function idbSyncData() {
  // const isPending = store.getters.getPendingSync;
  // if (!isPending && store.getters.isOnline) {
  // store.commit('setPendingSync', true);
  // await synPendingJobs();
  // syncActivity();
  // syncFinding();
  // syncRecommendation();
  // syncAttachment();
  // syncAttachmentFile();
  // store.commit('setPendingSync', false);
  // }
}

if (process.env.NODE_ENV !== 'production') {
  window.idbSyncData = idbSyncData;
}

export function checkAsyncTask(task) {
  return task && task.task && task.sessiontoken;
}
