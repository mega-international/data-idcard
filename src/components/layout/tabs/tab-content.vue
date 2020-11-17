<template>
  <section class="tab-content w-full">
    <section v-if="!data.length">
      <!--  -->
    </section>
    <section v-else class="flex">
      <section class="tab-ctn px-4 pb-4 flex-1">
        <main class="w-full">
          <ul>
            <alpha-card
              v-for="item in data" :key="`letter-${item.letter}`"
              class="mt-4 first:mt-0"
              :letter="item.letter">
              <div
                v-for="result in item.items" :key="result.id">
                <item-card
                  v-for="concept in result.concept_IdentifiedDictionaryType" :key="concept.id"
                  :tab="tab"
                  :concept="concept">
                </item-card>
              </div>
            </alpha-card>
          </ul>
        </main>
      </section>
      <aside class="asbolute right-0 w-8">
        <div class="sticky top-0 z-40">
          <range-nav></range-nav>
        </div>
      </aside>
    </section>
  </section>
</template>

<script>
import RangeNav from '../range-nav.vue';
import AlphaCard from '../cards/alpah-card.vue';
import itemCard from '../cards/item-card.vue';

export default {
  name: 'TabContent',
  components: {
    RangeNav,
    AlphaCard,
    itemCard
  },
  data() {
    return {
      alphabet: new Array(26).fill(1).map((_, i) => String.fromCharCode(65 + i)),
    };
  },
  props: {
    tab: String,
    title: String,
    data: Array
  }
};
</script>

<style>
/* https://app.contrast-finder.org/result.html?foreground=A2ACBA&background=%23F4D766&ratio=4.5&isBackgroundTested=false&algo=Rgb&lang=en */
.tab-content .highlighted {
  background-color: #F4D766;
  color: #54606F;
  @apply font-bold;
}
</style>
