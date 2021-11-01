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
  name: "HelloWorld",

  data: () => ({
    localBackendUrl: null,
  }),
  computed: {
    ...mapGetters(["showEditor", "backendURL"]),

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
  },
  methods: {
    saveBackendUrl() {
      this.$store.commit("setBackendUrl", this.localBackendUrl)
      this.resetBackendUrl()
    },
    resetBackendUrl() {
      this.localBackendUrl = null
    }
  }
};
</script>
