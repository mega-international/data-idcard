<template>
  <section class="view-outlet flex flex-col h-full text-light-grey-500 overflow-hidden">
    <header class="sticky top-0 w-full h-12 flex justify-between items-center px-4 bg-dark-blue text-white shadow-md z-50">
      <button v-if="$route.meta.actions !== false" class="text-green focus:outline-none" @click="goBack">
        <lit-icon icon="arrow-back" iconset="view"></lit-icon>
      </button>
      <span v-else class="w-10"></span>
      <span class="font-bold text-xl text-center">{{ viewOutleTitle }}</span>
      <button v-if="$route.meta.actions !== false" class="text-white focus:outline-none" @click="toggleFavorite">
        <lit-icon :icon="isFavorite ? 'star' : 'star-border'" iconset="view"></lit-icon>
      </button>
      <span v-else class="w-10"></span>
    </header>
    <router-view class="h-full overflow-y-auto"></router-view>
    <lit-iconset iconset="view">
      <svg><defs>
        <g id="arrow-back">
          <svg
            xmlns="http://www.w3.org/2000/svg" width="24" height="24"
            fill="none" stroke="currentColor" stroke-width="3"
            stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"></path></svg>
        </g>
        <g id="star-border"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"></path></g>
        <g id="star"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></g>
        <g id="user">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12 11a3 3 0 100-6 3 3 0 000 6zm0 2a5 5 0 100-10 5 5 0 000 10z"></path>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M21 20.3v.7h-2c0-2.2-.9-4.1-2.2-5.5-1.4-1.3-3-2-4.8-2-1.7 0-3.4.7-4.8 2A7.7 7.7 0 005 21H3v-.8a9 9 0 0118 0z"></path>
        </g>
      </defs></svg>
    </lit-iconset>
  </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'ViewOutlet',
  computed: {
    ...mapState({ viewOutleTitle: (state) => state.viewOutleTitle }),
    ...mapState({ terms: (state) => state.auth.favoriteTerms }),
    ...mapState({ concepts: (state) => state.auth.favoriteConcepts }),
    isFavorite() {
      const { id } = this.$route.params;
      const favs = [
        ...this.terms,
        ...this.concepts
      ];
      return favs.includes(id);
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    toggleFavorite() {
      const { id } = this.$route.params;
      const { type } = this.$route.meta;
      if (this.isFavorite) {
        this.$store.dispatch('removeFavorite', { id, type });
      } else {
        this.$store.dispatch('addFavorite', { id, type });
      }
    }
  }
};
</script>
<style>
.row {
  @apply mt-4 text-sm;
}
.row label {
  @apply text-base text-light-grey-500 font-bold break-normal whitespace-no-wrap;
}
.row p {
  @apply text-left mt-1 font-semibold text-light-grey-400;
}

.info .title {
  @apply text-light-grey-500;
}
.tabs {
  border-bottom: solid 1px;
  border-color: #c6cbd0;
  @apply overflow-x-auto whitespace-no-wrap z-10;
}
.tabs .tab {
  min-height: 3rem;
  @apply flex justify-center items-center border-b-2 border-white font-semibold text-xs px-2 text-light-grey-400 whitespace-no-wrap;
}
.tabs .tab.active {
  @apply border-green text-light-grey-500;
}
summary {
  list-style-type: none;
  @apply sticky top-0 bg-white h-12 rounded-t-lg px-4 py-2 outline-none border-b-2 border-gray-500 font-bold text-lg cursor-pointer z-10;
}
summary::after {
  box-sizing: border-box;
  content: '';
  border-width: 0.25em 0.25em 0 0;
  border-radius: 3px;
  transform: rotate(45deg);
  vertical-align: top;
  height: 14px;
  width: 14px;
  @apply block absolute top-3 right-5 border-dark-blue border-solid transition-transform duration-75 ease-in-out;
}
details[open] summary::after {
transform: rotate(135deg);
}
summary::marker {
  display: none;
}
summary::-webkit-details-marker {
  display: none;
}
details header {
  @apply sticky top-12 bg-white;
}
.no-data {
  @apply mt-2 text-xs text-light-grey-500;
}
</style>
