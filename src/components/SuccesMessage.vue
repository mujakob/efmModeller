<template>
    <v-snackbar
      v-model="success"
      :timeout="5000"
    >
      Text "{{textBlock.title}}" erfolgreich geändert.

      <template v-slot:action="{ attrs }">
        <v-btn
          color="green"
          text
          v-bind="attrs"
          @click="success = false"
        >
          Schließen
        </v-btn>
      </template>
    </v-snackbar>
</template>

<script>
export default {
    data() {
        return {
            success: true,
        }        
    },
    props: {
        message: {default: "success!"}
    }
}
</script>      
        