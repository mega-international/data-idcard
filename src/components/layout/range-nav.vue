<template>
  <div class="range-nav relative text-center">
    <!-- Range input -->
    <input
      v-model.number="index"
      class=""
      orient="vertical"
      type="range" name="range-nav" step="1"
      min="0" :max="items.length-1"
      @input="displayTooltip">

    <!-- Nav items -->
    <ul class="select-none text-sm font-bold">
      <li v-for="(letter, idx) in items" :key="`letter-${letter}`" class="block rounded-full overflow-hidden w-5 h-5">
        <a
          :ref="`nav-${letter}`"
          class="block"
          :class="idx === index ? 'text-white bg-green' : ''"
          :data-tippy-content="`${letter}`"
          :href="`#${letter}`">{{ letter }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
import tippy, { hideAll } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { mapState } from 'vuex';

export default {
  name: 'RangeNav',
  data() {
    return {
      index: 0,
      tooltips: [],
      navItems: []
    };
  },
  computed: {
    ...mapState({ items: (state) => state.searchNav })
  },
  watch: {
  },
  mounted() {
    this.navItems = this.items.map((item) => this.$refs[`nav-${item}`][0]);
    this.tooltips = this.navItems
      .map((node) => tippy(node, {
        duration: 100,
        trigger: 'mouseenter',
        arrow: true,
        appendTo: 'parent',
        delay: [ 200, 10 ],
        placement: 'left',
        inertia: true,
        onShow(instance) {
          setTimeout(instance.hide, 1500);
        },
      }));

    document.addEventListener('change-section', (e) => {
      const [ header, stuck ] = [ e.detail.header, e.detail.stuck ];
      const { letter } = header.dataset;
      if (header.classList.contains('shadow-lg')) {
        this.index = this.items.indexOf(letter);
      }
    });
  },
  methods: {
    displayTooltip() {
      hideAll({ duration: 10 });
      this.tooltips[this.index].show();

      this.navItems.forEach((link) => {
        if (link.dataset.tippyContent === this.items[this.index]) {
          const target = document.querySelector(`#alpha-${link.dataset.tippyContent}`);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    }
  },
};
</script>

<style scoped>
.range-nav {
  position: relative;
}

/**
 * @see https://stackoverflow.com/questions/15935837/how-to-display-a-range-input-slider-vertically
 */
input[type=range][orient=vertical] {
  writing-mode: bt-lr;
  -webkit-appearance: slider-vertical;
  transform: rotate(180deg);
  margin: 0;
  width: 100%;
  height: auto;
  padding: 0;
  border: none;
  z-index: 10;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: transparent;
  opacity: 0;
  /* visibility: hidden; */
}
</style>
