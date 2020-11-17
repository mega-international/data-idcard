<template>
  <router-link
    :to="{ path: `/view/concept/${concept.id}` }"
    class="block bg-white mt-4 first:mt-0 px-4 py-3">
    <h1
      v-dompurify-html:clean="isSearch && concept.matches.name ? concept.matches.name : concept.name"
      class="font-bold text-light-grey-500 text-lg"></h1>
    <p
      v-dompurify-html:clean="concept.definitionText"
      class="mt-2 raw-text"></p>
  </router-link>
</template>

<script>
export default {
  name: 'item-card',
  props: {
    tab: String,
    concept: Object
  },
  computed: {
    isSearch() {
      return this.$route.name === 'Search' && this.concept.matches;
    }
  }
};
</script>

<style scoped>
.raw-text,
.raw-text * {
  @apply text-xs text-light-grey-400 !important;
}
</style>
