/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */

import {
  getTerms,
  getConcept,
  getClasses,
  asyncGetTerms,
  asyncGetConcept
} from '@/api/data.js';

import { getDB } from '@/assets/js/idb.js';
import { getViewedItems, checkAsyncTask } from '../api/api.js';

export default {
  state: {
    terms: [],
    concept: {},
    concepts: [],
    classes: [],
    lastViewedConcepts: [],
    favorites: []
  },
  getters: {
  },
  mutations: {
    getTerms(state, terms) {
      state.terms = terms;
    },
    getConcept(state, concept) {
      state.concept = concept;
    },
    getClasses(state, classes) {
      state.classes = classes;
    },
    getLastViewedConcepts(state, lastViewedConcepts) {
      state.lastViewedConcepts = lastViewedConcepts;
    },
    getFavoriteConcepts(state, concepts) {
      state.favorites = concepts;
    }
  },
  actions: {
    async getTerms({ commit }, params) {
      const data = await getTerms(params.criteria);
      if (data !== false) {
        commit('getTerms', data);
      }
      return data;
    },
    async getConcept({ commit }, params) {
      const data = await getConcept(params.id);
      if (data !== false) {
        commit('getConcept', data);
      }
      return data;
    },
    async getClasses({ commit }, params) {
      const data = await getClasses(params.idList);
      if (data !== false) {
        commit('getClasses', data);
      }
      return data;
    },
    async getLastViewedConcepts({ commit }) {
      const data = await getViewedItems('concept');
      commit('getLastViewedConcepts', data);
      return data;
    },
    async getFavoriteConcepts({ commit }) {
      const db = await getDB();
      const data = await db.getAllFromIndex('concept', 'favorite', 'true');
      commit('getFavoriteConcepts', data);
    },
    async asyncGetTerms({ commit }) {
      try {
        const asyncJob = JSON.parse(localStorage.getItem('lastQuery'));
        if (!checkAsyncTask(asyncJob)) return false;
        const data = await asyncGetTerms(asyncJob);
        if (data !== false) {
          commit('getTerms', data);
        }
        return data;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    async asyncGetConcept({ commit }, id) {
      try {
        const asyncJob = JSON.parse(localStorage.getItem('lastQuery'));
        if (!checkAsyncTask(asyncJob)) return false;
        const data = await asyncGetConcept({ ...asyncJob, id });
        if (data !== false) {
          commit('getConcept', data);
        }
        return data;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
  }
};
