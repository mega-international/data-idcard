<template>
  <section class="ho-level-radio">
    <input
      :id="id"
      class="hidden"
      type="radio"
      :name="name"
      :value="nativeValue"
      :checked="checked"
      :disabled="disabled"
      @change="$emit('change')"
      @focus="$emit('focus')"
      @blur="$emit('blur')"
      @input="$emit('input', $event.target.value)">
    <label
tabindex="0"
      class="flex outline-none cursor-pointer justify-center items-center px-1 py-1 block text-center w-full h-full lg:hover:bg-lightgrey"
      :class="getColor"
      :for="id"><slot></slot></label>
  </section>
</template>

<script>
export default {
  name: 'HoLevelRadio',
  props: {
    name: String,
    nativeValue: String,
    checked: {
      type: Boolean,
      default: false
    },
    disabled: Boolean,
  },
  data() {
    return {
      id: null,
      checkedValue: this.nativeValue,
    };
  },
  computed: {
    computedValue() {
      return this.checkedValue;
    },
    getColor() {
      if (!this.checked) return '';
      switch (this.nativeValue.toLowerCase()) {
        case 'verylow':
          return 'verylow';
        case 'low':
          return 'low';
        case 'medium':
          return 'medium';
        case 'high':
          return 'high';
        case 'veryhigh':
          return 'veryhigh';
        default:
          return false;
      }
    }
  },
  watch: {
    value(value) {
      this.checkedValue = value;
    }
  },
  mounted() {
    // eslint-disable-next-line no-underscore-dangle
    this.id = this._uid;
  },
};
</script>

<style scoped>
[type="radio"]:checked ~ label {
  @apply text-white break-words whitespace-pre-wrap;
}
.verylow { background-color: rgb(106, 194, 142) !important; }
.low { background-color: rgb(166, 217,196) !important; }
.medium { background-color: rgb(244,215,102) !important; }
.high { background-color: rgb(247,151,78) !important; }
.veryhigh { background-color: rgb( 230,70,59) !important; }
</style>
