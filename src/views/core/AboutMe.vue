<template>
  <v-card class="about">
    <v-card-title>{{getUser.username}}</v-card-title>
    
    <p>email: {{getUser.email}}</p>
    <p>full name: {{getUser.fullName}}</p>
    <p>scope: {{getUser.scopes}}</p>
    <p>status: 
      <span v-if="getUser.disabled">disabled</span>
      <span v-else>active</span>
    </p>


    <v-card-actions>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            
            v-bind="attrs"
            v-on="on"
          >
            Change password
          </v-btn>
        </template>
        <span>Feature not yet implemented in backend</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            
            v-bind="attrs"
            v-on="on"
          >
            Edit details
          </v-btn>
        </template>
        <span>Feature not yet implemented in backend</span>
      </v-tooltip>

    </v-card-actions>
  </v-card>

</template>

<script>
import {mapGetters} from 'vuex'
export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'getUser',
    ]),
  },
}
</script>