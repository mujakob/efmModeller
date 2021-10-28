<template>
  <div
    style="max-width:30%; float:left; height:100%;"
  >
     <v-tooltip bottom >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          x-small
          @click="showConceptPane = !showConceptPane"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon v-if="showConceptPane"> mdi-chevron-left </v-icon>
          <v-icon v-else> mdi-chevron-right </v-icon>
        </v-btn>
      </template>
      <span v-if="showConceptPane">Hide concept pane</span>
      <span v-else>Show concept pane</span>
    </v-tooltip>
      
    <v-card 
      class="fill-height pa-3"
      elevation="4"
      v-if="showConceptPane"
      fill-height
    >
      <v-btn v-on:click="reloadConcepts" class="mb-3">
        <v-icon> mdi-lightbulb-group-outline </v-icon>
        reload concepts
      </v-btn>
      <v-btn v-on:click="loadConcept(null)" class="mb-3">
        <v-icon> mdi-book-sync </v-icon>
        reload project tree
      </v-btn>

      <v-expansion-panels v-if="allConcepts">
        <v-expansion-panel v-for="concept in allConcepts" :key="concept.id">
          <v-expansion-panel-header>
            {{ concept.name }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <p class="text-caption">Concept ID: {{ concept.id }}</p>
            <v-row>
              <v-col class="shrink">
                <v-btn small disabled>edit</v-btn>
              </v-col>
              <v-col class="shrink">
                <v-btn small @click="loadConcept(concept.id)">
                  load
                </v-btn>
              </v-col>
            </v-row>
            {{ concept.description }}
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      showConceptPane: false,
    };
  },
  computed: {
    ...mapGetters('efm', ['getEFMobjectsByType']),
    allConcepts() {
      return this.getEFMobjectsByType('concepts')
    }

  },
  methods: {
    async reloadConcepts() {
      this.$store.dispatch('efm/getConcepts')
    },
    loadConcept(id){
      console.log(id)
      this.$store.commit("efm/selectConcept", id)
    }
  },
  mounted() {}
};
</script>
