import {
  createRequest, handleError, ensureSuccess, handleOfflineFallback, idbItemPassThrough
} from './api.js';
import store from '../store/index.js';
import { query, getDB, isLocalChange } from '../assets/js/idb.js';

export async function getTerms(criteria) {
  if (store.getters.isOnline && navigator.onLine) {
    return query({
      async: true,
      query: `query {
        term (orderBy: [ name_ASC ], filter: {name_starts_with:"${criteria}"}) {
          id
          name
          language {
            id
            name
          }
          concept_IdentifiedDictionaryType{
            id
            name
            definitionText(format:RAW)
          }
        }
      }`
    })
      .then(async (response) => {
        if (response.status === 206) {
          return {
            async: true,
            task: response.headers['x-hopex-task'] ? response.headers['x-hopex-task'] : false,
            sessiontoken: response.headers['x-hopex-sessiontoken'] ? response.headers['x-hopex-sessiontoken'] : false,
          };
        }
        return response;
      })
      .then(ensureSuccess)
      .then(async (result) => {
        if (result.async) {
          localStorage.setItem('lastQuery', JSON.stringify({
            sessiontoken: result.sessiontoken,
            task: result.task
          }));
          return 'ECONNABORTED';
        }
        const { data } = result;
        // Terms
        const terms = data.data.term;
        for (const term of terms) {
          idbItemPassThrough(term, 'term');
        }
        return terms;
      })
      .catch(async (error) => {
        const err = await handleOfflineFallback(error);
        if (err === 'ECONNABORTED') {
          return 'ECONNABORTED';
        }
        if (err) {
          const idb = await getDB();
          return idb.getAllFromIndex('term', 'id');
        }
        return Promise.reject(error);
      })
      .catch(handleError);
  }
  const idb = await getDB();
  return idb.getAllFromIndex('term', 'id');
}

export async function getConcept(id) {
  if (store.getters.isOnline && navigator.onLine) {
    return query({
      query: `query {
        concept (filter:{id:"${id}"} ) {
          id
          name
          definitionText(format:RAW)
          dataDesigner_PersonSystem {
            id
            name
            email
          }
          businessDictionary_OwnerBusinessDictionary {
            id
            name
            comment
          }
          term_Synonym {
            id
            name
          }
          businessInformationArea_OwnerBusinessArea_MemorizedBusinessInformation_MemorizationOfMemorizedBusinessInformation {
            id
            name
            comment
          }
          class_BusinessInformationRealizer_RealizationOfBusinessInformation_BusinessInformationRealization { 
            id
            name
            comment
            applicationDataArea {
              id
              name
              comment
              application {
                id
                name
                comment
              }
            }
          }
        }
      }`
    })
      .then(ensureSuccess)
      .then(async ({ data }) => {
      // Application
        const concept = data.data.concept[0];
        concept.dateViewed = new Date();
        idbItemPassThrough(concept, 'concept');
        return concept;
      })
      .catch(async (error) => {
        if (await handleOfflineFallback(error)) {
          const idb = await getDB();
          return idb.getFromIndex('concept', 'id', id);
        }
        return Promise.reject(error);
      })
      .catch(handleError);
  }
  const idb = await getDB();
  return idb.getFromIndex('concept', 'id', id);
}

export async function getClasses(idList) {
  if (store.getters.isOnline && navigator.onLine) {
    return query({
      query: `query {
        class (filter: {id_in:[${idList}]})
        {
          id
          name 
          applicationDataArea_LogicalDataStoreStructure_LogicalDataAreaComponent_LogicalDataStoreComponent
          {
            id
            name
            comment
            
            applicationLocalDataStore_ApplicationDataStore{
              id
              name
              comment
            }
          }
        }
      }`
    })
      .then(ensureSuccess)
      .then(async ({ data }) => {
        const businessInfos = data.data.class;
        // FIXME : link this to a concept
        // for (const businessInfo of businessInfos) {
        //   idbItemPassThrough(businessInfo, 'concept');
        // }
        return businessInfos;
      })
      .catch(async (error) => {
        if (await handleOfflineFallback(error)) {
          const idb = await getDB();
          return idb.getAllFromIndex('concept', 'id');
        }
        return Promise.reject(error);
      })
      .catch(handleError);
  }
  const idb = await getDB();
  return idb.getAllFromIndex('concept', 'id');
}

export async function asyncGetTerms({ task, sessiontoken }) {
  if (store.getters.isOnline && navigator.onLine) {
    return query({
      async: true,
      headers: {
        'x-hopex-task': task,
        'x-hopex-sessiontoken': sessiontoken
      },
    })
      .then(async (response) => {
        if (response.status === 206) {
          return {
            async: true,
            task: response.headers['x-hopex-task'] ? response.headers['x-hopex-task'] : false,
            sessiontoken: response.headers['x-hopex-sessiontoken'] ? response.headers['x-hopex-sessiontoken'] : false,
          };
        }
        return response;
      })
      .then(ensureSuccess)
      .then(async (result) => {
        if (result.async) {
          localStorage.setItem('lastQuery', JSON.stringify({
            sessiontoken: result.sessiontoken,
            task: result.task
          }));
          return 'ECONNABORTED';
        }
        const { data } = result;
        // Terms
        const terms = data.data.term;
        for (const term of terms) {
          idbItemPassThrough(term, 'term');
        }
        return terms;
      })
      .catch(async (error) => {
        const err = await handleOfflineFallback(error);
        if (err === 'ECONNABORTED') {
          return 'ECONNABORTED';
        }
        if (err) {
          const idb = await getDB();
          return idb.getAllFromIndex('term', 'id');
        }
        return Promise.reject(error);
      })
      .catch(handleError);
  }
  const idb = await getDB();
  return idb.getAllFromIndex('term', 'id');
}

export async function asyncGetConcept({ id, task, sessiontoken }) {
  if (store.getters.isOnline && navigator.onLine) {
    return query({
      async: true,
      headers: {
        'x-hopex-task': task,
        'x-hopex-sessiontoken': sessiontoken
      },
    })
      .then(async (response) => {
        if (response.status === 206) {
          return {
            async: true,
            task: response.headers['x-hopex-task'] ? response.headers['x-hopex-task'] : false,
            sessiontoken: response.headers['x-hopex-sessiontoken'] ? response.headers['x-hopex-sessiontoken'] : false,
          };
        }
        return response;
      })
      .then(ensureSuccess)
      .then(async (result) => {
        if (result.async) {
          localStorage.setItem('lastQuery', JSON.stringify({
            sessiontoken: result.sessiontoken,
            task: result.task
          }));
          return 'ECONNABORTED';
        }
        const { data } = result;
        // Terms
        const concept = data.data.concept[0];
        concept.dateViewed = new Date();
        idbItemPassThrough(concept, 'concept');
        return concept;
      })
      .catch(async (error) => {
        if (await handleOfflineFallback(error)) {
          const idb = await getDB();
          return idb.getFromIndex('concept', 'id', id);
        }
        return Promise.reject(error);
      })
      .catch(handleError);
  }
  const idb = await getDB();
  return idb.getFromIndex('concept', 'id', id);
}
