<template>
  <v-app-bar app>
    <!-- <error-message v-for="(e, index) in errors" :key="index" :error="e" /> -->

    <v-app-bar-title class="mx-5"> SEDlab </v-app-bar-title>

    <!-- <v-btn @click="newError">error</v-btn> -->

    <!-- View etc menu -->
    <span class="mr-auto">
      <v-menu offset-y >
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on"> Menu </v-btn>
        </template>
        <v-list dense nav>
          <v-list-item :to="{ name: 'Home' }"> Projects </v-list-item>
          <v-list-item :to="{ name: 'coreSettings' }"> Settings </v-list-item>
        </v-list>
      </v-menu>
    </span>

    <span class="mr-auto">
      <view-menu />
    </span>

    <!-- User menu and login -->
    <span class="ml-auto">
      <v-menu offset-y v-if="loggedIn">
        <template v-slot:activator="{ on, attrs }">
          <v-avatar color="primary" size="56" v-bind="attrs" v-on="on">
            <v-icon> mdi-account-circle </v-icon>
          </v-avatar>
        </template>

        <v-list dense nav>
          <v-list-item :to="{ name: 'userAbout' }">
            <v-list-item-icon>
              <v-icon>mdi-account-circle</v-icon>
            </v-list-item-icon>

            {{ user.username }}
          </v-list-item>
          <v-list-item :to="{ name: 'userProjects' }">
            My projects
          </v-list-item>
          <v-list-item>
            <v-btn @click="logUserOut"> logout </v-btn>
          </v-list-item>
        </v-list>

        <!-- ADMIN MENU -->
        <!-- <v-list-item-group v-if="getUserScope == 'admin'" style="opacity: 1">
          <v-divider />
          <v-list-item class="text-caption"> Admin menu: </v-list-item>
          <v-divider />
          <v-list-item :to="{ name: 'adminAllUsers' }">
            Other users
          </v-list-item>
          <v-list-item :to="{ name: 'adminAllProjects' }">
            All projects
          </v-list-item>
        </v-list-item-group> -->
      </v-menu>

      <v-btn v-else :to="{ name: 'userProjects' }"> login </v-btn>
    </span>
  </v-app-bar>
</template>

<script>
// import utils from '@utils'
import { mapGetters } from "vuex";
import ViewMenu from '../viewMenu.vue';

export default {
  name: 'navbar',
  components: {
    ViewMenu,
  },
  data() {
    return {
      user: null,
      errors: [],
    };
  },
  methods: {
    logUserOut() {
      this.$store.commit("logout");
      this.$router.push({name: 'login'})
    },
    // getUser() {
    //     try {
    //         this.user utils.getCurrentUser()
    //     } catch (e) {
    //         this.errors.push(e)
    //     }
    // }
    newError() {
      this.$store.commit("registerError", "test error ");
      this.$store.commit("goodNews", "test good news");
    },
  },
  computed: {
    ...mapGetters(["getUser", "loggedIn", "getUserScope", "getAppMenu"]),
    // loggedIn: function() {
    //     return utils.userLoggedIn()
    // },
  },
  mounted() {
    this.user = this.$store.dispatch("fetchUserMe");
  },
};
</script>

<style>
.v-app-bar {
  z-index: 102 !important;
}
</style>
