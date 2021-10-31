<template>
  <div>
    <h1>Settings</h1>
    <p>More coming soon...</p>
    <v-switch
      v-model="toggleEditor"
      label="show editor in EFM tree"
      />
      
    <v-list>
      <v-list-item> version: {{ version }} </v-list-item>
      <v-list-item>
        author: <a :href="'mailto:' + authorEmail">{{ author }}</a>
      </v-list-item>
      <v-list-item>
        github: <a :href="githubLink" target="_blank">{{ githubLink }}</a>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import settings from "@/settings";
export default {
  name: "HelloWorld",

  data: () => ({}),
  computed: {
    ...mapGetters(["showEditor"]),

    toggleEditor: {
      get: function() {
        return this.showEditor
      },
      set: function(value) {
        this.$store.commit("setEditorVisibility", value) 
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
};
</script>
