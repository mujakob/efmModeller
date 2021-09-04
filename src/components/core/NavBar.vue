<template>
  <v-app-bar app>
    <!-- <error-message v-for="(e, index) in errors" :key="index" :error="e" /> -->

    <v-app-bar-title class="mx-5"> SEDlab </v-app-bar-title>

    <v-btn :to="{ name: 'Home' }"> Home </v-btn>

    <!-- User menug and login -->
    <span class="ml-auto">
      <v-menu offset-y v-if="loggedIn">
        <template v-slot:activator="{ on, attrs }">
          <v-avatar color="primary" size="56" v-bind="attrs" v-on="on">
            <v-img v-if="getUser.image" :src="required(userImg)" />
            <v-icon v-else> mdi-account-circle </v-icon>
          </v-avatar>
        </template>

        <v-list dense nav>
          <v-list-item :to="{ name: 'userAbout' }">
            <v-list-item-icon>
              <v-icon>mdi-account-circle</v-icon>
            </v-list-item-icon>

            {{ getUser.username }}
          </v-list-item>
          <v-list-item :to="{ name: 'userProjects' }">
            My projects
          </v-list-item>
          <v-list-item :to="{ name: 'coreSettings' }"> Settings </v-list-item>
          <v-list-item>
            <v-btn @click="logUserOut"> logout </v-btn>
          </v-list-item>
        </v-list>

        <!-- ADMIN MENU -->
        <v-list-item-group v-if="getUserScope == 'admin'" style="opacity: 1">
          <v-divider />
          <v-list-item class="text-caption"> Admin menu: </v-list-item>
          <v-divider />
          <v-list-item :to="{ name: 'adminAllUsers' }">
            Other users
          </v-list-item>
          <v-list-item :to="{ name: 'adminAllProjects' }">
            All projects
          </v-list-item>
        </v-list-item-group>
      </v-menu>

      <v-btn v-else :to="{ name: 'userAbout' }"> login </v-btn>
    </span>
  </v-app-bar>
</template>

<script>
// import utils from '@utils'
import settings from "@/settings";
import { mapGetters } from "vuex";

export default {
  components: {},
  data() {
    return {
      user: null,
      errors: [],
    };
  },
  methods: {
    logUserOut() {
      this.$store.commit("logout");
    },
    // getUser() {
    //     try {
    //         this.user utils.getCurrentUser()
    //     } catch (e) {
    //         this.errors.push(e)
    //     }
    // }
  },
  computed: {
    ...mapGetters(["getUser", "loggedIn", "getUserScope"]),
    // loggedIn: function() {
    //     return utils.userLoggedIn()
    // },

    userImg: function () {
      if (this.getUser.image) {
        return settings.imageHost + this.getUser.image;
      } else {
        return null;
      }
    },
  },
};
</script>
