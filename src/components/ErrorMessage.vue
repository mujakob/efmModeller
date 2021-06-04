<template>
  <v-alert prominent type="error" dismissible @input="deleteError">
    <h2>Sorry, an error has occured:</h2>
    <h5 v-if="msg.component">registered by {{ msg.component }}</h5>
    <p>{{ msg.msg }}</p>
  </v-alert>
</template>

<script>
export default {
  name: "errorMessage",
  data() {
    return {};
  },
  props: {
    msg: {
      required: true,
    },
    index: {
      default: false,
    },
  },
  methods: {
    deleteError(v) {
      console.log(v);
      console.log("deleting error " + String(this.index));
      this.$store.commit({
        type: "removeError",
        index: this.index,
      });
    },
  },
};
</script>

<style>
.error {
  border: 2px solid red;
}

.error h2 {
  font-size: 20px;
  color: red;
}
</style>
