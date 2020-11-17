<template>
  <section v-if="!loading['default'].loading" class="ViewItem pb-2">
    <!-- Overview -->
    <section class="info mt-4 mx-4 bg-white rounded-lg shadow-lg px-4 py-2">
      <div v-if="displayName" class="row"><label>{{ $t('text.name') }}</label><p>{{ concept.name }}</p></div>
      <div v-if="displayComment" class="row"><label>{{ $t('text.definition') }}</label><p v-dompurify-html:clean="concept.definitionText"></p></div>
      <div v-if="displaySynonyms" class="row"><label>{{ $t('text.synonyms') }}</label>
        <p>
          {{ concept.term_Synonym.map((synonym) => synonym.name).join(', ') }}
        </p>
      </div>
      <div v-if="displayBusinessDictionary" class="row">
        <label>{{ $t('text.businessDictionary') }}</label>
        <p>
          {{ concept.businessDictionary_OwnerBusinessDictionary.map((businessDictionary) => businessDictionary.name).join(', ') }}
        </p>
      </div>
      <div v-if="displayId" class="row"><label>{{ 'ID' }}</label><p>{{ concept.id }}</p></div>
    </section>

    <!-- Scope -->
   <details class="info mt-4 mx-4 bg-white rounded-lg shadow-lg">
      <summary>{{ $t('text.scope') }}</summary>
      <section class="mt-2 px-4">
        <header class="tabs">
          <nav>
            <div class="inline-block">
              <button
                class="tab focus:outline-none"
                :class="scopeTab.scope === 0 ? 'active' : ''"
                @click="setScopeTab(0, 'scope')">{{ $t('text.dataDomain') }}</button>
            </div>
            <div class="inline-block">
              <button
                class="tab focus:outline-none"
                :class="scopeTab.scope === 1 ? 'active' : ''"
                @click="setScopeTab(1, 'scope')">{{ $t('text.listRealizedDate') }}</button>
            </div>
          </nav>
        </header>
        <main class="divide-y-2 divide-gray-400 pb-2">
          <div v-if="scopeTab.scope === 0">
            <div v-for="business in concept.businessInformationArea_OwnerBusinessArea_MemorizedBusinessInformation_MemorizationOfMemorizedBusinessInformation" :key="business.id" class="mt-4 pt-2">
              <h1 class="title font-semibold">{{ business.name }}</h1>
              <p v-dompurify-html:clean="business.comment" class="mt-2 text-xs text-light-grey-500"></p>
            </div>
            <p v-if="!concept.businessInformationArea_OwnerBusinessArea_MemorizedBusinessInformation_MemorizationOfMemorizedBusinessInformation || !concept.businessInformationArea_OwnerBusinessArea_MemorizedBusinessInformation_MemorizationOfMemorizedBusinessInformation.length" class="no-data">{{ $t('text.noInfoToDisplay', { name: $t('text.dataDomain') }) }}</p>
          </div>
          <div v-if="scopeTab.scope === 1">
            <div v-for="realized in concept.class_BusinessInformationRealizer_RealizationOfBusinessInformation_BusinessInformationRealization" :key="realized.id" class="mt-4 pt-2">
              <h1 class="title font-semibold">{{ realized.name }}</h1>
              <p v-dompurify-html:clean="realized.comment" class="mt-2 text-xs text-light-grey-500"></p>
            </div>
            <p v-if="!concept.class_BusinessInformationRealizer_RealizationOfBusinessInformation_BusinessInformationRealization || !concept.class_BusinessInformationRealizer_RealizationOfBusinessInformation_BusinessInformationRealization.length" class="no-data">{{ $t('text.noInfoToDisplay', { name: $t('text.listRealizedDate') }) }}</p>
          </div>
        </main>
      </section>
    </details>

    <!-- Responsabilities -->
    <details class="info mt-4 mx-4 bg-white rounded-lg shadow-lg">
      <summary>{{ $t('text.responsibilities') }}</summary>
      <section class="mt-2 px-4">
        <header class="tabs">
          <nav>
            <div class="inline-block">
              <button
                class="tab focus:outline-none"
                :class="scopeTab.responsibilities === 0 ? 'active' : ''"
                @click="setScopeTab(0, 'responsibilities')">{{ $t('text.dataDesigner') }}</button>
            </div>
          </nav>
        </header>
        <main class="divide-y-2 divide-gray-400 pb-2">
          <div v-if="scopeTab.responsibilities === 0">
            <div v-for="dataDesigner in concept.dataDesigner_PersonSystem" :key="dataDesigner.id" class="mt-4 pt-2">
              <!-- FIXME: add email -->
              <span class="title font-semibold flex items-center">
                <lit-icon class="text-green" icon="user" iconset="view"></lit-icon>
                <div>
                  <div>{{ dataDesigner.name }}</div>
                  <div class="text-xs font-normal">{{ dataDesigner.email }}</div>
                </div>
              </span>
            </div>
            <p v-if="!concept.dataDesigner_PersonSystem || !concept.dataDesigner_PersonSystem.length" class="no-data">{{ $t('text.noInfoToDisplay', { name: $t('text.dataDesigner') }) }}</p>
          </div>
        </main>
      </section>
    </details>

    <!-- Usage -->
    <details class="info mt-4 mx-4 bg-white rounded-lg shadow-lg">
      <summary>{{ $t('text.usage') }}</summary>
      <section class="mt-2 px-4">
        <header class="tabs">
          <button
            class="tab focus:outline-none"
            :class="scopeTab.usage === 0 ? 'active' : ''"
            @click="setScopeTab(0, 'usage')">{{ $t('text.applicationDataStore') }}</button>
        </header>
        <main class="pb-2">
          <div v-if="scopeTab.usage === 0">
            <div v-for="app in appDataStore" :key="app.id" class="mt-4 pt-2">
              <h1 class="title font-semibold">{{ app.name }}</h1>
              <p v-dompurify-html:clean="app.comment" class="mt-2 text-xs text-light-grey-500"></p>
            </div>
          </div>
          <p v-if="!appDataStore || !appDataStore.length" class="no-data">{{ $t('text.noInfoToDisplay', { name: $t('text.applicationDataStore') }) }}</p>
        </main>
      </section>
    </details>
  </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ViewItem',
  components: {
  },
  data() {
    return {
      mounted: false,
      scopeTab: {
        scope: 0,
        responsibilities: 0,
        usage: 0
      },
    };
  },
  computed: {
    ...mapState({
      loading: (state) => state.spinner,
      concept: (state) => state.data.concept,
      classes: (state) => state.data.classes,
      displayEmptyFields: 'displayEmptyFields',
    }),
    displayId() {
      return this.concept.id || (this.displayEmptyFields && !this.concept.id);
    },
    displayName() {
      return this.concept.name || (this.displayEmptyFields && !this.concept.name);
    },
    displayComment() {
      return this.concept.definitionText || (this.displayEmptyFields && !this.concept.definitionText);
    },
    displaySynonyms() {
      return (this.concept.term_Synonym && this.concept.term_Synonym.length) || (this.displayEmptyFields && !(this.concept.term_Synonym && this.concept.term_Synonym.length));
    },
    displayBusinessDictionary() {
      return (this.concept.businessDictionary_OwnerBusinessDictionary && this.concept.businessDictionary_OwnerBusinessDictionary.length) || (this.displayEmptyFields && !(this.concept.businessDictionary_OwnerBusinessDictionary && this.concept.businessDictionary_OwnerBusinessDictionary.length));
    },
    appDataStore() {
      // Create an object to deduplication entries
      const apps = {};
      if (this.concept && this.concept.class_BusinessInformationRealizer_RealizationOfBusinessInformation_BusinessInformationRealization) {
        this.concept.class_BusinessInformationRealizer_RealizationOfBusinessInformation_BusinessInformationRealization.forEach((element) => {
          element.applicationDataArea.forEach((appDataArea) => {
            appDataArea.application.forEach((appLocal) => {
              apps[appLocal.id] = {
                id: `${element.id}_${appLocal.id}`,
                name: appLocal.name,
                comment: appLocal.comment
              };
            });
          });
        });
      }
      return Object.keys(apps).map((idx) => apps[idx]);
    }
  },
  async mounted() {
    const data = await this.$store.dispatch('getConcept', {
      id: this.$route.params.id
    });

    if (data === 'ECONNABORTED') {
      this.$store.commit('showSpinner');
      const interval = setInterval(async () => {
        const data = await this.$store.dispatch('asyncGetConcept');
        if (data !== 'ECONNABORTED' && data !== false) {
          this.$store.commit('hideSpinner');
          this.$store.commit('setViewOutleTitle', this.concept.name);
          clearInterval(interval);
        }
      }, 3000);
      return false;
    }

    this.$store.commit('setViewOutleTitle', this.concept.name);
    return this.$store.commit('hideSpinner');
  },
  async activated() {
    if (this.mounted) {
      const data = await this.$store.dispatch('getConcept', {
        id: this.$route.params.id
      });

      if (data === 'ECONNABORTED') {
        this.$store.commit('showSpinner');
        const interval = setInterval(async () => {
          const data = await this.$store.dispatch('asyncGetConcept');
          if (data !== 'ECONNABORTED' && data !== false) {
            this.$store.commit('hideSpinner');
            this.$store.commit('setViewOutleTitle', this.concept.name);
            clearInterval(interval);
          }
        }, 3000);
        return false;
      }

      this.$store.commit('setViewOutleTitle', this.concept.name);
      this.$store.commit('hideSpinner');
    }
    return this.mounted = true;
  },
  methods: {
    setScopeTab(value, key) {
      this.scopeTab[key] = value;
    }
  }
};
</script>

<style scoped>
</style>
