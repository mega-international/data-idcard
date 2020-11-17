import { openDB } from 'idb/with-async-ittr.js';
import store from '@/store/index.js';
import { createRequest, idbItemPassThrough } from '../../api/api.js';

export async function createDB(name, version, callback) {
  try {
    const dbPromise = await openDB(name, version, {
      upgrade(dbPromise, oldVersion, newVersion, transaction) {
        callback(dbPromise, oldVersion, newVersion, transaction);
      },
    });
    return dbPromise;
  } catch (error) {
    console.warn('IDB version regression!');
    console.error(error);
    return false;
  }
}

/**
 * CreateObjectStore
 * @param {IDB proxy} dbPromise The reference to idb
 * @param {IDB transaction} transaction Idb transaction
 * @param {String} name Name of the objecet store
 * @param {Object} params Db prams
 */
async function createObjectStore(dbPromise, transaction, name, params) {
  if (!await dbPromise.objectStoreNames.contains(name)) {
    return dbPromise.createObjectStore(name, params);
  }
  return transaction.objectStore(name);
}

/**
 * CreateIndex
 * @param {Idb ObjectStore} store ObjectStore reference
 * @param {String} name ObjectStore name
 * @param {String} path Path to access primary key
 * @param {Object} params Optional params
 */
function createIndex(store, name, path, params) {
  if (!store.indexNames.contains(name)) {
    store.createIndex(name, path, params);
  }
}

/**
 *
 */
export async function getDB() {
  return createDB('Data ID Card', 5, async (dbPromise, oldVersion, newVersion, transaction) => {
    const termStore = await createObjectStore(dbPromise, transaction, 'term', {
      keyPath: 'id',
    });
    createIndex(termStore, 'id', 'id');
    createIndex(termStore, 'name', 'name');
    createIndex(termStore, 'dateViewed', 'dateViewed');
    createIndex(termStore, 'favorite', 'favorite');

    const conceptStore = await createObjectStore(dbPromise, transaction, 'concept', {
      keyPath: 'id',
    });
    createIndex(conceptStore, 'id', 'id');
    createIndex(conceptStore, 'name', 'name');
    createIndex(conceptStore, 'dateViewed', 'dateViewed');
    createIndex(conceptStore, 'favorite', 'favorite');
  });
}

export async function isLocalChange(id, externalId, table) {
  let data = await idbItemPassThrough({ id }, table, false);
  // If no data for this ID, search for external ID
  if (!data && externalId) data = await idbItemPassThrough({ externalId }, table, false, 'externalId');
  return (data && data.synced === 'false') || (data && data.toDelete === 'true') || (data && data.uploaded === 'false');
}

/**
 *
 * @param {*} param0
 */
export function query({
  query = null, async = false, headers = {}, auth = false, timeout = true
}) {
  const request = createRequest(auth, timeout);
  const waitTimeout = window.config && window.config.ASYNC_timeout ? window.config.ASYNC_timeout : false;
  return request.post(`/hopexgraphQL/api${async ? '/async' : ''}/DATA`, query !== null ? {
    query: query
      .replace(/#.*\n/g, '')
      .replace(/[\s|,]*\n+[\s|,]*/g, ' ')
      .replace(/:\s/g, ':')
      .replace(/,\s/g, ',')
      .replace(/\)\s\{/g, '){')
      .replace(/\}\s/g, '}')
      .replace(/\{\s/g, '{')
      .replace(/\s\}/g, '}')
      .replace(/\s\{/g, '{')
      .replace(/\)\s/g, ')')
      .replace(/\(\s/g, '(')
      .replace(/\s\)/g, ')')
      .replace(/\s\(/g, '(')
      .replace(/=\s/g, '=')
      .replace(/\s=/g, '=')
      .replace(/@\s/g, '@')
      .replace(/\s@/g, '@')
      .replace(/\s\$/g, '$')
      .replace(/\s\./g, '.')
  } : null, {
    headers: {
      Authorization: `Bearer ${store.getters.getToken}`,
      ...(async && waitTimeout ? { 'x-hopex-wait': waitTimeout } : {}),
      ...headers
    }
  });
}
