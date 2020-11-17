<template>
  <section class="login sm:container mx-auto px-5 lg:flex lg:px-0">
    <aside class="lg:w-2/5"></aside>
    <section class="mt-24 mb-8 lg:w-3/5 lg:mx-auto lg:flex lg:flex-col lg:justify-center lg:items-center">
      <header class="lg:w-3/4 text-center">
        <h1 class="text-xl lg:text-3xl">{{ $t('text.welcome') }} {{ $t('text.to') }}</h1>
        <div class="w-full mt-5 mx-auto whitespace-no-wrap">
          <img class="inline-block object-contain w-8 lg:w-10 mr-4" src="@/assets/img/app-icon.png" alt="Audit Everywhere logo">
          <h2 class="text-2xl lg:text-4xl inline-block align-middle">{{ $t('text.appName') }}</h2>
        </div>
      </header>
      <main class="lg:w-2/4">
        <form class="mt-12" @submit.prevent="handleSubmit">
          <div class="flex items-center text-green mt-4 border-b-2">
            <lit-icon icon="user" iconset="login"></lit-icon>
            <ma-input
              v-model="username"
              class="flex-grow"
              label="Username"
              type="text"
              name="username"></ma-input>
          </div>
          <div class="flex items-center text-green mt-4 border-b-2">
            <lit-icon icon="lock" iconset="login"></lit-icon>
            <ma-input
              v-model="password"
              class="flex-grow"
              label="Password"
              type="password"
              name="password"
              icon="password"
              iconset="login"
              :password-reveal="true"
              ></ma-input>
          </div>
          <div class="mt-8">
            <ho-button
              class="w-full font-medium rounded-sm flex justify-center"
              :disabled="disableForm">
              <span>{{ $t('text.signIn') }}</span>
              <lit-icon icon="arrow-forward" iconset="login"></lit-icon>
            </ho-button>
          </div>
        </form>
        <ho-spinner name="login" transparent></ho-spinner>
      </main>
    </section>
    <lit-iconset iconset="login">
      <svg><defs>
        <g id="user">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M12 11a3 3 0 100-6 3 3 0 000 6zm0 2a5 5 0 100-10 5 5 0 000 10z"></path>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M21 20.3v.7h-2c0-2.2-.9-4.1-2.2-5.5-1.4-1.3-3-2-4.8-2-1.7 0-3.4.7-4.8 2A7.7 7.7 0 005 21H3v-.8a9 9 0 0118 0z"></path>
        </g>
        <g id="lock"><path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8.9 6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2H8.9V6zM18 20H6V10h12v10z"></path></g>
        <g id="eye"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path></g>
        <g id="eye-close"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"></path></g>
        <g id="arrow-forward"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path></g>
      </defs></svg>
    </lit-iconset>
  </section>
</template>

<script>
import MaInput from '@/components/form/input/text/ma-input.vue';
import HoButton from '@/components/form/button/ho-button.vue';
import messages from '@/i18n/translation.js';
import HoSpinner from '@/components/layout/loader/ho-spinner.vue';

export default {
  name: 'Login',
  components: {
    MaInput,
    HoButton,
    HoSpinner
  },
  data() {
    return {
      disableForm: false,
      username: '',
      password: '',
      errorObject: {
        username: false,
        password: false
      }
    };
  },
  mounted() {
    this.$store.commit('hideSpinner');
  },
  methods: {
    async handleSubmit() {
      if (this.disableForm) return false;
      this.$store.commit('showSpinner', 'login');
      if (!this.username || !this.password) {
        this.$store.commit('hideSpinner');
        return this.$store.dispatch('displaySnackbar', { text: messages.en.notification.error.missingFields });
      }
      this.disableForm = true;
      const result = await this.$store.dispatch('login', {
        username: this.username,
        password: this.password
      });
      if (result === false) {
        this.$store.commit('hideSpinner');
        return this.disableForm = false;
      }
      this.disableForm = true;
      return this.$router.push({ name: 'Search' });
    }
  }
};
</script>

<style scoped>
 .login {
   height: 100vh;
 }

 aside {
   background-image: url('~@/assets/img/image-corp.png');
   background-repeat: no-repeat;
   background-position: 85% 50%;
   background-size: cover;
 }
</style>
