<template>
  <v-container class="text-center" height="500" justify="center">
    <v-form>
      <h1>Login</h1>
      <!-- <error-message v-if="message" :error="message" />
      <error-message v-if="error" :error="error" /> -->
      <v-text-field
        v-model="username"
        width="200"
        outlined
        label="Name"
        @keyup.enter="login"
      />

      <v-text-field
        v-model="password"
        width="200"
        outlined
        label="password"
        @click:append="show1 = !show1"
        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
        :type="show1 ? 'text' : 'password'"
        @keyup.enter="login"
      />

      <v-btn @click="login">Login </v-btn>
    </v-form>
  </v-container>
</template>

<script>
// import {myLoginRoutine} from "@/components/auth.js"
// import utils from "@/utils";
// import errorMessage from "@/components/ErrorMessage.vue";

export default {
  name: "login",
  components: {},
  data() {
    return {
      password: null,
      username: null,
      error: null,
      show1: false,
      success: false,
    };
  },
  props: {
    forwardURL: { type: String, default: "" },
  },
  computed: {},
  methods: {
    async login() {
      this.$store.commit("clearMessages", this.$options.name);
      // let response = await utils.loginToBackend(this.username, this.password);
      if (!this.username) {
        this.$store.commit("registerError", {
          message: "Please enter a username first",
          component: this.$options.name,
        });
        return false;
      }

      if (!this.password) {
        this.$store.commit("registerError", {
          message: "Please enter a password first",
          component: this.$options.name,
        });
        return false;
      }

      let user = {
        username: this.username,
        password: this.password,
      };
      const success = await this.$store.dispatch("login", user);
      if (success && this.forwardURL) {
        console.log("forwarding to: " + this.forwardURL);
        this.$router.push(this.forwardURL);
      } else if (success) { 
        this.$router.push({ name: "userProjects" });
      }
    },
  },
};
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: 70px 0;
}
</style>
