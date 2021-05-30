<template>
  <v-app class="pt-50">
    <nav-bar />

    <v-main>
      <error-message v-for="(e, index) in getAllErrors" :key="index" :msg="e" :index="index" />

      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import NavBar from '@/components/core/NavBar.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import { mapGetters } from 'vuex';

export default {
  name: 'app',
  components: {
    NavBar,
    ErrorMessage,
  },
  computed: {
      ...mapGetters([
        'getAllErrors',
      ])
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
