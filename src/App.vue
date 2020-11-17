<template>
  <section id="app">
    <router-view></router-view>
    <ho-spinner></ho-spinner>
  </section>
</template>

<script>
import HoSpinner from './components/layout/loader/ho-spinner.vue';

export default {
  components: {
    HoSpinner
  },
};
</script>
