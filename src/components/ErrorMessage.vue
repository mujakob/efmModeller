<template>
    <v-alert
        prominent
        type="error"
        dismissible
      >
        <h2> Sorry, an error has occured: </h2>
        <p> {{error}} </p>
    </v-alert>
</template>

<script>
export default {
    name: 'errorMessage',
    data() {
        return {
        }
    },
    props: {
        error: {
            required: true,
        }
    }
}
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