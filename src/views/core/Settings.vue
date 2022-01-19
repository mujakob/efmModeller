<template>
  <v-sheet class="pa-5">
    <h1>Settings</h1>
    <p>More coming soon...</p>

    <!-- show/hide editor in efm tree -->
    <v-switch
      v-model="toggleEditor"
      label="show edit buttons in EFM tree"
      />

    <!-- change backend URL -->
    <v-text-field
      v-model="changeBackendUrl"
      label="URL for backend API"
      style="width:80%; min-width:200px;"
      outlined
      />
    <v-btn
      @click="saveBackendUrl"
    > save backend URL </v-btn>
    <v-btn
      @click="resetBackendUrl"
    > reset </v-btn>
  
    <v-card>
      <v-card-title> Current Color Scheme </v-card-title>
      <v-chip-group>
        <v-chip :color="currentColorDS"> DS </v-chip>
        <v-chip :color="currentColorFR"> FR </v-chip>
        <v-chip :color="currentColorC"> constraint </v-chip>
      </v-chip-group>
      <v-divider />
      <v-select
       :items="colorOptions"
       :item-text="'color_name'" 
       :item-value="'color_name'"
       v-model="selectedColorPattern"
       />
       <v-btn
        @click="setColorPattern"
        > select </v-btn>
      <v-chip-group>
        <v-chip :color="selectedColorDS"> DS </v-chip>
        <v-chip :color="selectedColorFR"> FR </v-chip>
        <v-chip :color="selectedColorC"> constraint </v-chip>
      </v-chip-group>
    </v-card>
      
    <v-list>
      <v-list-item> version: {{ version }} </v-list-item>
      <v-list-item>
        author: <a :href="'mailto:' + authorEmail">{{ author }}</a>
      </v-list-item>
      <v-list-item>
        github: <a :href="githubLink" target="_blank">{{ githubLink }}</a>
      </v-list-item>
    </v-list>
  </v-sheet>
</template>

<script>
import { mapGetters } from "vuex";
import settings from "@/settings";
export default {
  name: "Settings",

  data: () => ({
    localBackendUrl: null,
    selectedColorPattern: 'blue-yellow',
  }),
  computed: {
    ...mapGetters([
      "showEditor", 
      "backendURL", 
      "colorOptions",
      "efmObjectColor",
      ]),

    toggleEditor: {
      get: function() {
        return this.showEditor
      },
      set: function(value) {
        this.$store.commit("setEditorVisibility", value) 
      }
    },

    changeBackendUrl: {
      get: function() {
        if (this.localBackendUrl) {
          return this.localBackendUrl
        } else {
          return this.backendURL
        }
      },
      set: function(value) {
        this.localBackendUrl = value
      }
    },


    version() {
      return settings.version;
    },
    author() {
      return settings.author;
    },
    authorEmail() {
      return settings.authorEmail;
    },
    githubLink() {
      return settings.githubLink;
    },

    // COLORS
    currentColorDS() {
      return this.efmObjectColor('ds')
    },
    currentColorFR() {
      return this.efmObjectColor('fr')
    },
    currentColorC() {
      return this.efmObjectColor('c')
    },
    
    selectedColorSet(){
      let pattern = this.colorOptions.find(cs => cs.color_name == this.selectedColorPattern)
      return pattern.colors
    },
    selectedColorDS() {
      return this.selectedColorSet['ds']
    },
    selectedColorFR() {
      return this.selectedColorSet['fr']
    },
    selectedColorC() {
      return this.selectedColorSet['c']
    },
  },
  methods: {
    saveBackendUrl() {
      this.$store.commit("setBackendUrl", this.localBackendUrl)
      this.resetBackendUrl()
    },
    resetBackendUrl() {
      this.localBackendUrl = null
    },
    setColorPattern() {
      this.$store.commit('setNewColorPattern', this.selectedColorPattern)
    }
  }
};
</script>
