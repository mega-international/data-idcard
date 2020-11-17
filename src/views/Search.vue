<template>
  <section id="search-container" class="Search absolute inset-y-0 pt-12 overflow-visible flex flex-col w-full">
    <header class="pt-4 px-4">
      <!-- Search input -->
      <form class="flex justify-between items-center" @submit.prevent="handleSearch(true)">
        <label class="form-control block relative flex-1">
          <button class="icon absolute left-0 top-0 bottom-0 ml-1 flex items-center justify-center z-10" @click="handleSearch(true)">
            <lit-icon class="text-green" icon="search" iconset="outlet"></lit-icon>
          </button>
          <ho-input v-model="searchInput" :placeholder="$t('text.search')" @input="handleSearch()"></ho-input>
        </label>
        <button
          v-show="search.length" class="focus:outline-none" type="button"
          @click="resetSearch"><lit-icon icon="close" iconset="search"></lit-icon></button>
      </form>
    </header>
    <main id="scroll-ctn" class="mt-4 relative h-full overflow-y-scroll">
      <!-- Keep alive allow us to conserve dynamic rendered view, so we change page, the view component is not destroyed -->
      <keep-alive>
        <!-- Application tab -->
        <transition-group name="slide" mode="out-in" class="block relative h-full">
          <div key="applications" class="w-full h-full">
            <!-- Search results -->
            <tab-content
              v-if="displaySearchOrRecentlyViewedConcepts"
              tab="applications"
              :data="termsResults"
              class="tab">
            </tab-content>
            <!-- Recently viewed -->
            <section
              v-else
              class="last-viewed-concepts">
              <header class="mt-4 px-4"><h1 class="font-bold">{{ $t('text.lastViewedConcepts') }}</h1></header>
              <main class="pt-4 px-4">
                <item-card
                  v-for="concept in lastViewedConcepts"
                  :key="`concept-${concept.id}`"
                  class="shadow-lg rounded-lg"
                  :concept="concept"
                  ></item-card>
              </main>
            </section>
          </div>
        </transition-group>
      </keep-alive>
      <ho-spinner class-name="absolute inset-0 z-50" name="search"></ho-spinner>
    </main>
    <lit-iconset iconset="search">
      <svg><defs>
        <g id="close"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></g>
      </defs></svg>
    </lit-iconset>
  </section>
</template>

<script>
import { mapState } from 'vuex';
import HoSpinner from '@/components/layout/loader/ho-spinner.vue';
import HoInput from '../components/form/input/text/ho-input.vue';
import TabContent from '../components/layout/tabs/tab-content.vue';
import ItemCard from '../components/layout/cards/item-card.vue';
import stickyHeaderMixin from '../mixin/stickyHeader.js';
import fuseMixin from '../mixin/fuse.js';

export default {
  name: 'Search',
  components: {
    HoInput,
    TabContent,
    HoSpinner,
    ItemCard
  },
  mixins: [ stickyHeaderMixin, fuseMixin ],
  data() {
    return {
      isInitResultPopulated: false,
      search: '',
      termSearchResult: [],
    };
  },
  computed: {
    ...mapState({ terms: (state) => state.data.terms }),
    ...mapState({ lastViewedConcepts: (state) => state.data.lastViewedConcepts }),
    termsResults() {
      const tempSearchResult = [ ...(this.termSearchResult || []) ];
      if (!tempSearchResult.length) {
        this.$store.commit('hideSpinner', 'search');
        return [];
      }

      const searchNav = [];
      const results = Object.values(
        tempSearchResult.reduce((acc, term) => {
          const accumulateur = acc;
          // If there is no concepts attached to a term, we don't display it
          if (!term.concept_IdentifiedDictionaryType.length) return accumulateur;
          const firstLetter = term.name[0].toLocaleUpperCase();
          if (!accumulateur[firstLetter]) {
            searchNav.push(firstLetter);
            accumulateur[firstLetter] = { letter: firstLetter, items: [ term ] };
          } else {
            accumulateur[firstLetter].items.push(term);
          }
          return accumulateur;
        }, {})
      );

      this.$store.commit('setSearchNav', searchNav);
      this.$store.commit('hideSpinner', 'search');
      return results;
    },
    displaySearchOrRecentlyViewedConcepts() {
      return this.isInitResultPopulated || !this.lastViewedConcepts.length;
    },
    searchInput: {
      set(value) {
        if (this.search !== value) {
          this.search = value;
        }
      },
      get() {
        return this.$store.state.route.query.q;
      }
    }
  },
  watch: {
    isInitResultPopulated() {
      if (this.isInitResultPopulated && this.search.length > 2) {
        this.handleSearch();
      }
    },
    search() {
      if (this.search.length <= 2) {
        this.isInitResultPopulated = false;
      }
    }
  },
  async mounted() {
    document.addEventListener('sticky-change', (e) => {
      const [ header, stuck ] = [ e.detail.target, e.detail.stuck ];
      header.classList.toggle('shadow-lg', stuck);
      const event = new CustomEvent('change-section', { detail: { header, stuck } });
      document.dispatchEvent(event);
    });

    this.$store.commit('setViewOutleTitle', this.$t('text.search'));
    // Move all the init behaviour to a separate method so we can call it on tab change
    await this.initView();
  },
  activated() {
    this.searchInput = this.$store.state.route.query.q || '';
    this.$store.commit('hideSpinner');
  },
  methods: {
    async initView() {
      const lastViewed = await this.$store.dispatch('getLastViewedConcepts');
      // Launch empty search
      if (this.searchInput || !this.lastViewedConcepts.length) {
        this.$store.commit('showSpinner', 'search');
        const data = await this.$store.dispatch('getTerms', {
          criteria: this.searchInput || ''
        });
        if (data === 'ECONNABORTED') {
          this.$store.commit('showSpinner', 'search');
          this.asyncSearchTerms();
          return false;
        }
        if (data) {
          this.isInitResultPopulated = true;
          this.termSearchResult = data;
        }
        const container = document.querySelector('#scroll-ctn');
        this.$nextTick(() => {
          this.observeStickyHeaderChanges(container);
        });
      }
      return this.$store.commit('hideSpinner');
    },
    resetSearch() {
      this.search = '';
      this.$router.replace({ query: { ...this.$route.query, ...(this.search ? { q: this.search } : { q: undefined }) } });
      this.searchInput = '';
      // this.handleSearch();
      this.termSearchResult = [];
      this.$store.commit('hideSpinner');
    },
    async handleSearch(forceSearch = false) {
      if (this.search === '') {
        return this.resetSearch();
      }
      // Sync url with the search input, so we can get back to the previous search when the user return back
      // NOTE: Pentential performence issue do to Vue dev tools :/
      //       To offthread, the update of the URL, use setTimeout
      setTimeout(() => {
        this.$router.replace({ query: { ...this.$route.query, ...(this.search ? { q: this.search } : { q: undefined }) } });
      }, 200);

      // Display the search sub spinner while waiting the result of the Graphql query
      this.$store.commit('showSpinner', 'search');

      // We make a pre request when the use type 3 charaters
      // So we can get a pre filtered resultset
      if (this.search.length === 3 || forceSearch) {
        const data = await this.$store.dispatch('getTerms', {
          criteria: this.search
        });

        if (data === 'ECONNABORTED') {
          this.asyncSearchTerms();
          return false;
        }

        // We save this first resultset in an array that will be filtered
        // by Fuse.js
        this.termSearchResult = this.terms;

        // As the use tape in the in search input, it'll trigger this method
        // We need to figure out if we already have a resultset to search in or not
        this.isInitResultPopulated = true;
        if (data === false) {
          // FIXME: Display error toast
          console.log('[mega] An error happen !');
        }
      } else if (this.isInitResultPopulated && this.search.length >= 3) {
        this.$store.commit('showSpinner', 'search');

        // Pass the current resultset type to fuse in order to perfome a fuzzy search
        const searchInstance = this.initTermSearch.bind(this)(this.terms);

        /**
         * Use advenced search option to match perfect pattern
         * @see https://github.com/krisk/Fuse/issues/428
         * @see https://fusejs.io/examples.html#extended-search
         */
        const fusyResult = searchInstance.search(`'${this.search}`);

        // highlight result matches
        fusyResult.forEach(this.highlighter);

        this.termSearchResult = fusyResult.map((res) => res.item);
      } else if (this.search === '') {
        this.$store.commit('hideSpinner');
      }
      return true;
    },

    highlighter(result) {
      result.matches.forEach((item) => {
        const text = result.item[item.key];
        const matches = [].concat(item.indices);
        let pair = matches.shift();

        const results = [];
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < text.length; i++) {
          const char = text.charAt(i);
          if (pair && i === pair[0]) {
            results.push('<b class="highlighted">');
          }
          results.push(char);
          if (pair && i === pair[1]) {
            results.push('</b>');
            pair = matches.shift();
          }
        }

        result.item.concept_IdentifiedDictionaryType.forEach((element) => {
          // eslint-disable-next-line no-param-reassign
          element.matches = {} || element.matches;
          // eslint-disable-next-line no-param-reassign
          element.matches[item.key] = results.join('');
        });
      });
    },
    asyncSearchTerms() {
      const interval = setInterval(async () => {
        const data = await this.$store.dispatch('asyncGetTerms');
        if (data !== 'ECONNABORTED' && data !== false) {
          this.isInitResultPopulated = true;
          this.techSearchResult = data;
          this.$store.commit('hideSpinner');
          clearInterval(interval);
        }
      }, 3000);
    }
  },
};
</script>

<style>
.ho-input input {
  @apply pl-10;
}
</style>
