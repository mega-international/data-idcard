/* eslint-disable no-restricted-syntax */
<template>
  <li :id="`alpha-${letter}`" :ref="`alpha-${letter}`" class="relative block bg-white shadow-lg rounded-lg">
    <header :ref="`header-${letter}`" :data-letter="`${letter}`" class="alpha-head sticky bg-white px-2 pt-4 pb-1 rounded-t-lg">
      <h1 class="text-magenta font-bold text-2xl">{{ letter | uppercase }}</h1>
    </header>
    <main>
      <slot></slot>
    </main>
  </li>
</template>

<script>
export default {
  name: 'AlpahCard',
  filters: {
    uppercase(value) {
      if (!value) return '';
      const string = value.toString();
      return string.toUpperCase();
    }
  },
  props: {
    letter: String
  },
  mounted() {
    const header = this.$refs[`header-${this.letter}`];
  },
};
</script>

<style scoped>
.alpha-head {
  top: -2px;
}
</style>
