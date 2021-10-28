<template>
  <v-app class="pt-50">
    <notifications />
    <nav-bar />

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import NavBar from "@/components/core/NavBar.vue";
import Notifications from "./components/core/notifications.vue";

export default {
  name: "app",
  components: {
    NavBar,
    Notifications,
  },
};
</script>

<style></style>
