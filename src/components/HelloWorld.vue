<template>
  <v-container>
    <v-row class="text-center">
      <v-col
      cols="12"
      >
        <h1 class="display-2 font-weight-bold mb-3">
          Welcome to the SED lab frontend boilerplate!
        </h1>

        <h2>version {{version}}</h2>

        <p class="subheading font-weight-regular">
          This is a template developed by {{author}} to help you quickly develop a frontend for the SEDlab API.
        </p>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        cols="4"  
      >
        <v-card
          class="mx-5"
        >
          <v-card-title>
            Support
          </v-card-title>
          <v-card-text>
          </v-card-text>
          <v-card-actions>
            <v-btn>
              Contact
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'HelloWorld',

    data: () => ({
      author: 'Jakob R. Müller',
      authorEmail: 'jakobramonmueller@gmail.com',
      version: '0.1'
    })
  }
</script>
