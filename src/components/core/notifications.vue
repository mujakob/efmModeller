<template>
  <v-container id="notificationsCentre">
    <!-- ERRORS -->
    <message
      v-for="m of getAllMessages"
      :key="m.id"
      :message="m"
      />

    <!-- clear all button -->
    <v-btn 
      v-if="getAllMessages.length"
      x-small
      @click="clearAllErrors()">
      clear all errors
    </v-btn>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import message from './message.vue';
export default {
  components: { message },
  name: "notifications",
  data() {
    return {
      goodNewsDismissQueue: [],
    };
  },
  computed: {
    ...mapGetters(["getAllMessages"]),
  },
  methods: {
    clearAllErrors() {
      this.$store.commit("clearMessages", null);
    },

  },
};
</script>

<style scoped>
#notificationsCentre {
  position: fixed;
  display: flex;
  align-content: flex-end;
  align-items: flex-end;
  flex-direction: column;
  z-index: 100;
  bottom: 20px;
  right: 20px;
  width: 400px;
}

.msgbox {
  width: 400px;
}
</style>
