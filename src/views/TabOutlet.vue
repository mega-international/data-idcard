<template>
  <section class="TabOutlet h-full overflow-visible">
    <header class="sticky top-0 w-full h-12 flex bg-dark-blue text-white shadow-md z-50">
      <button
        class="w-1/2 flex justify-center items-center focus:outline-none font-bold"
        :class="selectedTab === 'applications' ? 'bg-magenta' : ''"
        @click="handleTab('applications')">Applications</button>
      <button
        class="w-1/2 flex justify-center items-center focus:outline-none font-bold"
        :class="selectedTab === 'technologies' ? 'bg-magenta' : ''"
        @click="handleTab('technologies')">Technologies</button>
    </header>
    <!-- Keep alive allow us to conserve dynamic rendered view, so we change page, the view component is not destroyed -->
    <keep-alive>
      <router-view :tab="selectedTab"></router-view>
    </keep-alive>
  </section>
</template>

<script>
export default {
  name: 'TabOutlet',
  computed: {
    selectedTab() {
      return this.$route.query.tab !== 'technologies' ? 'applications' : 'technologies';
    }
  },
  methods: {
    handleTab(tab) {
      if (this.$route.query.tab === tab) return;
      this.$router.replace({ query: { ...this.$route.query, tab } });
    }
  }
};
</script>

<style scoped>
</style>
