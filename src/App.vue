<template>
  <v-app class="pt-50">
    <nav-bar />

    <v-main>
      <error-message
        v-for="(e, index) in getAllErrors"
        :key="index"
        :msg="e"
        :index="index"
      />

      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import NavBar from "@/components/core/NavBar.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import { mapGetters } from "vuex";

export default {
  name: "app",
  components: {
    NavBar,
    ErrorMessage,
  },
  computed: {
    ...mapGetters(["getAllErrors",]),
  },
  mounted() {
  }
};
</script>

<style>

</style>
