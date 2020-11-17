<template>
  <section class="Outlet relative h-screen min-h-full overflow-auto pb-16">
    <!-- Offline notice -->
    <div v-show="!online" class="offline dialogue w-full text-center bg-gray-800 text-white px-2 py-1">{{ $t('text.offline') }}</div>
    <main class="Outlet main block relative h-full overflow-hidden">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </main>
    <!-- Drawer -->
    <!-- Off-canvas menu background overlay -->
    <transition
      enter-class="opacity-0"
      enter-active-class="ease-out transition-medium"
      enter-to-class="opacity-100"
      leave-class="opacity-100"
      leave-active-class="ease-out transition-medium"
      leave-to-class="opacity-0"
      appear>
      <div
        v-show="isOpen"
        v-touch:swipeTolerance="100"
        v-touch:swipe="swipeHandler"
        class="z-10 fixed inset-0 transition-opacity">
        <div class="absolute inset-0 bg-black opacity-50" tabindex="-1" @click="close"></div>
      </div>
    </transition>
    <aside
      v-touch:swipeTolerance="100"
      v-touch:swipe="swipeHandler"
      class="fixed w-64 h-screen z-40 top-0 right-0"
      :class="isOpen ? 'open' : ''">
      <!-- Off-canvas menu -->
        <div class="flex flex-col z-10 h-screen max-w-xs w-full bg-white transition-transform overflow-y-auto">
          <div class="relative z-10 bg-white h-12">
            <div class="absolute top-0 right-0 p-4">
              <button
                ref="closeButton"
                type="button"
                class="text-gray-600 focus:outline-none focus:text-gray-900"
                aria-label="Close"
                @click="close">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.2929 19.7071C18.6834 20.0976 19.3166 20.0976 19.7071 19.7071C20.0976 19.3166 20.0976 18.6834 19.7071 18.2929L13.4142 12L19.7071 5.70711C20.0976 5.31658 20.0976 4.68342 19.7071 4.29289C19.3166 3.90237 18.6834 3.90237 18.2929 4.29289L12 10.5858L5.70711 4.29289C5.31658 3.90237 4.68342 3.90237 4.29289 4.29289C3.90237 4.68342 3.90237 5.31658 4.29289 5.70711L10.5858 12L4.29289 18.2929C3.90237 18.6834 3.90237 19.3166 4.29289 19.7071C4.68342 20.0976 5.31658 20.0976 5.70711 19.7071L12 13.4142L18.2929 19.7071Z" />
                </svg>
              </button>
            </div>
          </div>
          <div class="mt-6 pb-2 flex border-b-2 px-4 w-full">
            <div class="uppercase bg-dark-blue text-white font-bold text-xl flex justify-center items-center w-12 min-w-12 h-12 rounded-full">{{ avatar }}</div>
            <div class="info ml-3 w-9/12">
              <span class="block text-lg text-dark-blue font-semibold">{{ user.name }}</span>
              <span class="block text-xs text-dark-blue">{{ user.email }}</span>
              <span class="mt-3 block truncate text-dark-blue text-xs">{{ $t('text.version') }} : v{{ version.semver }}</span>
              <span class="block truncate text-dark-blue text-xs">{{ $t('text.build') }} : {{ version.build }}</span>
            </div>
          </div>
          <div class="relative bg-white flex-1">
            <transition name="slide">
              <div v-if="!displayLanguages" class="flex flex-col items-start h-full pt-4 pb-4">
                <!-- Language -->
                <div class="w-full px-6 flex items-center justify-between">
                  <span class="font-semibold text-gray-600 hover:text-gray-700">{{ $t('text.langage') }}</span>
                  <button
                    class="w-full h-10 flex justify-end items-center"
                    @click="changeLanguage">
                    <span class="font-semibold text-gray-600 hover:text-gray-700">{{ currentLanguage.languageName }}</span>
                    <lit-icon v-if="availableLanguage.length" class="text-gray-600" icon="arraow-right" iconset="outlet"></lit-icon>
                  </button>
                </div>

                <!-- Empty field -->
                <div class="mt-4 w-full px-6">
                  <label for="toogleA" class="flex items-center cursor-pointer">
                    <div class="relative">
                      <input
                        id="toogleA" type="checkbox" class="hidden"
                        :value="displayEmptyFields"
                        @change="updateDisplay">
                      <div class="toggle__line w-10 h-4 bg-gray-400 rounded-full shadow-inner"></div>
                      <div class="toggle__dot absolute w-6 h-6 bg-white rounded-full shadow inset-y-0 left-0"></div>
                    </div>
                    <div class="font-semibold text-gray-600 hover:text-gray-700 px-2">
                      {{ $t('text.emptyFields') }}
                    </div>
                  </label>
                </div>

                <!-- Logout -->
                <button
                  class="mt-4 px-4 flex items-center w-full text-left cursor-pointer font-semibold text-gray-600 hover:text-gray-700 focus:outline-none"
                  @click="signOut">
                  <lit-icon class="ml-0 align-middle" icon="exit-to-app" iconset="outlet"></lit-icon>{{ $t('text.signOut') }}</button>
                <span class="flex-1"></span>
                <div class="flex items-center text-xs truncate w-full border-t-2 pt-2 px-4 ">
                  <lit-icon :icon="online ? 'wb-cloudy' : 'cloud-off'" iconset="outlet"></lit-icon>
                  <span class="ml-2 font-medium text-base">{{ online ? $t('text.online') : $t('text.offline') }}</span>
                </div>
              </div>
              <!-- Select language -->
              <div v-else class="flex flex-col items-start h-full pt-4 pb-4 px-4">
                <button
                  v-for="language in availableLanguage"
                  :key="`language-${language.languageId}`"
                  class="h-10 first:mt-0 mt-2 w-full font-semibold text-gray-600 hover:text-green focus:outline-none"
                  :class="currentLanguage.languageId === language.languageId ? 'font-bold text-green' : ''"
                  @click="setCurrentLanguage(language.languageCode)">
                  {{ language.languageName }}
                </button>
              </div>
            </transition>
          </div>
        </div>
    </aside>
    <footer class="fixed bottom-0 bg-dark-blue w-full text-center shadow-md z-50">
      <div class="flex text-light-grey-400 h-16">
        <router-link :to="{ name: 'Favorites' }" class="tab w-1/3 py-2">
          <lit-icon icon="star-border" iconset="outlet"></lit-icon>
          <span>{{ $t('text.favorites') }}</span>
        </router-link>
        <router-link :to="{ name: 'Search' }" class="tab w-1/3">
          <lit-icon icon="search" iconset="outlet"></lit-icon>
          <span>{{ $t('text.search') }}</span>
        </router-link>
        <!-- Act as a menu burger -->
        <button
          ref="openButton" class="tab w-1/3 focus:outline-none" tabindex="0"
          @click="open">
          <lit-icon icon="user" iconset="outlet"></lit-icon>
          <span>{{ $t('text.information') }}</span>
        </button>
      </div>
    </footer>

    <lit-iconset iconset="outlet">
      <svg><defs>
        <g id="search"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></g>
        <g id="star-border"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"></path></g>
        <g id="user">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12 11a3 3 0 100-6 3 3 0 000 6zm0 2a5 5 0 100-10 5 5 0 000 10z"></path>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M21 20.3v.7h-2c0-2.2-.9-4.1-2.2-5.5-1.4-1.3-3-2-4.8-2-1.7 0-3.4.7-4.8 2A7.7 7.7 0 005 21H3v-.8a9 9 0 0118 0z"></path>
        </g>
        <g id="arrow-back"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></g>
        <g id="arraow-right">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M8.3 5.3a1 1 0 011.4 0l6 6c.4.4.4 1 0 1.4l-6 6a1 1 0 01-1.4-1.4l5.3-5.3-5.3-5.3a1 1 0 010-1.4z" />
        </g>
        <g id="menu">
          <defs>
            <path id="a" d="M-.5 0h24v24h-24z" />
          </defs>
          <clipPath id="b">
            <use xlink:href="#a" overflow="visible" />
          </clipPath>
          <g clip-path="url(#b)">
            <path d="M2.5 18h12v-2h-12v2zm0-12v2h18V6h-18zm0 7h18v-2h-18v2z" fill="#FAFAFA" />
            <path d="M-.5 0h24v24h-24V0z" fill="none" />
          </g>
        </g>
        <g id="format-list-bulleted"><path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12.17c-.74 0-1.33.6-1.33 1.33s.6 1.33 1.33 1.33 1.33-.6 1.33-1.33-.59-1.33-1.33-1.33zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"></path></g>
        <g id="exit-to-app"><path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"></path></g>
        <g id="info-outline"><path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z"></path></g>
        <g id="cloud-off"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4c-1.48 0-2.85.43-4.01 1.17l1.46 1.46C10.21 6.23 11.08 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3 0 1.13-.64 2.11-1.56 2.62l1.45 1.45C23.16 18.16 24 16.68 24 15c0-2.64-2.05-4.78-4.65-4.96zM3 5.27l2.75 2.74C2.56 8.15 0 10.77 0 14c0 3.31 2.69 6 6 6h11.73l2 2L21 20.73 4.27 4 3 5.27zM7.73 10l8 8H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h1.73z"></path></g>
        <g id="wb-cloudy"><path d="M19.36 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.64-4.96z"></path></g>
      </defs></svg>
    </lit-iconset>
  </section>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Outlet',
  data() {
    return {
      displayLanguages: false,
      user: {}
    };
  },
  computed: {
    ...mapState({
      outletTitle: 'outletTitle',
      outletSubTitle: 'outletSubTitle',
      currentLanguage: (state) => state.auth.language,
      availableLanguage: (state) => state.auth.availableLanguage,
      isOpen: 'drawerOpened',
      displayEmptyFields: 'displayEmptyFields',
      online: (state) => state.connectivity.online,
      version: 'version'
    }),
    avatar() {
      if (this.user.name) {
        const matches = this.user.name.match(/\b(\w)/g);
        const acronym = matches.join('');
        return acronym;
      }
      return '';
    }
  },
  watch: {
    isOpen: {
      immediate: true,
      handler(isOpen) {
        if (isOpen) {
          document.body.style.setProperty('overflow', 'hidden');
        } else {
          document.body.style.removeProperty('overflow');
        }
      }
    }
  },
  mounted() {
    this.$store.dispatch('getVersion');
    this.$store.dispatch('getAvailableLanguage');
    this.user = this.$store.getters.getUserInfo;
    this.$store.dispatch('getFavorites');
  },
  methods: {
    open() {
      this.$store.commit('openDrawer');
      this.$nextTick(() => {
        this.$refs.closeButton.focus();
      });
    },
    close() {
      this.$store.commit('closeDrawer');
      this.$nextTick(() => {
        this.$refs.openButton.focus();
      });
    },
    swipeHandler(direction) {
      if (direction === 'left') return this.open();
      return this.close();
    },
    goBack() {
      this.$router.go(-1);
    },
    signOut() {
      document.body.style.removeProperty('overflow');
      this.$store.dispatch('logout', { message: 'message.logout', force: true });
      this.$store.dispatch('closeDrawer');
      this.$router.push({ path: '/login' });
    },
    updateDisplay(e) {
      this.$store.commit('setDisplayEmptyFields');
    },
    changeLanguage() {
      if (!this.availableLanguage.length) return;
      this.displayLanguages = true;
    },
    async setCurrentLanguage(id) {
      const data = await this.$store.dispatch('changeCurrentLangue', id);
      if (data !== false) {
        this.$store.dispatch('displaySnackbar', {
          text: this.$t('text.langueChanged', {
            language: this.currentLanguage.languageName
          })
        });
        this.displayLanguages = false;
      }
    }
  }
};
</script>
<style scoped>
aside {
  transform: translateX(100%);
  transition: transform 0.3s ease;
  will-change: transform;
}
aside::after {
  position: fixed;
  top: 0;
  bottom: 0;
  left: -0px;
  visibility: visible;
  width: 20px;
  content: '';
}

aside.open {
  transform: translateX(0);
  transition: transform 0.3s ease;
  will-change: transform;
}
.title {
  line-height: 2.8;
}
.tab {
  @apply flex flex-col justify-center items-center;
}
.toggle__dot {
  top: -.25rem;
  left: -.25rem;
  transition: all 0.3s ease-in-out;
}
input:checked ~ .toggle__dot {
  transform: translateX(100%);
  @apply bg-green;
}
</style>
