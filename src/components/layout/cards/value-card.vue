<template>
  <div
    class="value-card flex flex-col justify-center text-center px-4 py-2 rounded-lg"
    :class="color">
    <h1 class="text-lg font-bold text-white">{{ value }}</h1>
    <h2 class="text-white text-sm">{{ title }}</h2>
  </div>
</template>

<script>
export default {
  name: 'value-card',
  props: {
    title: String,
    value: String
  },
  computed: {
    color() {
      switch (this.value) {
        case 'Good':
          return 'bg-light-green';
        case 'Medium':
          return 'bg-yellow';
        case 'Low':
          return 'bg-yellow';
        case 'Poor':
          return 'bg-red';
        default:
          return 'bg-gray-900';
      }
    }
  }
};
</script>

<style scoped>
.value-card {
  min-height: 4rem;
}
</style>
