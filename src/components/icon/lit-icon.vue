<template>
  <span class="lit-icon"><i></i></span>
</template>

<script>
export default {
  name: 'lit-icon',
  props: {
    size: {
      type: String,
      default: '24'
    },
    icon: {
      type: String
    },
    iconset: {
      type: String,
      default: 'iconset'
    }
  },
  watch: {
    size(size) {
      this.$el.querySelector('i').style.height = size;
      this.$el.querySelector('i').style.width = size;
    },
    icon() {
      const iconset = document.body.querySelector(`#iconset-${this.iconset}`);
      const icon = iconset.querySelector(`#${this.icon}`);

      if (!icon) return;
      this.$el.querySelector('i').innerHTML = '';
      // eslint-disable-next-line no-underscore-dangle
      this._cloneIcon(icon);
    }
  },
  mounted() {
    if (!this.icon) return false;
    const iconset = document.body.querySelector(`#iconset-${this.iconset}`);
    if (!iconset) return console.error('[lit-icon] Iconset not found in the document');

    const icon = iconset.querySelector(`#${this.icon}`);
    if (!icon) return console.error('[lit-icon] Icon not found in the document');

    this.$el.querySelector('i').innerHTML = '';
    // eslint-disable-next-line no-underscore-dangle
    return this._cloneIcon(icon);
  },
  methods: {
    // eslint-disable-next-line no-underscore-dangle
    _cloneIcon(icon) {
      const content = icon.cloneNode(true);
      /**
       * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS
       */
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      // Add iron-icon class in order to add control over color
      svg.classList.add('iron-icon');
      icon.classList.add('iron-icon');
      const viewBox = content.getAttribute('viewBox') || `0 0 ${this.size} ${this.size}`;
      const cssText = 'pointer-events: none; display: block; width: 100%; height: 100%;';
      svg.setAttribute('viewBox', viewBox);
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      svg.setAttribute('focusable', 'false');
      svg.style.cssText = cssText;
      const clonedIcon = icon.cloneNode(true);
      svg.appendChild(clonedIcon);
      const i = this.$el.querySelector('i');

      i.style.height = this.size;
      i.style.width = this.size;

      i.appendChild(svg);
    }
  }
};
</script>

<style scoped>
  .lit-icon {
    display: inline-block;
    width: 24px;
    height: 24px;
    margin: 0 5px;
    box-sizing: content-box;
    vertical-align: sub;
  }
  i {
    display: flex;
    justify-content: center;
    align-items: center;
    font-style: normal;
    height: 100%;
    width: 100%;
    min-width: 100%;
  }
</style>
