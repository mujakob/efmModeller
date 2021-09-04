<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <p class="text-h1">Welcome to the SED lab frontend boilerplate!</p>

        <h2>version {{ version }}</h2>

        <p class="subheading font-weight-regular">
          This is a template to help you quickly develop a frontend for the
          SEDlab API.
        </p>
      </v-col>
    </v-row>

    <!-- APPS -->
    <v-container v-if="allApps.length">
      <p class="text-h2">Installed apps & projects</p>
      <v-row>
        <v-col class="cols-12 cols-md-4" v-for="app in allApps" :key="app.id">
          <v-card>
            <v-card-title>
              {{ app.name }}
            </v-card-title>
            <v-card-subtitle>
              {{ app.id }}
            </v-card-subtitle>
            <v-card-text>
              {{ app.description }}
            </v-card-text>

            <v-card-text>
              <p class="text-caption">Projects:</p>
              <v-list v-if="app.projects.length">
                <v-list-item
                  v-for="p in app.projects"
                  :key="p.id"
                  :to="{ name: 'project', params: { treeID: p.id } }"
                >
                  {{ p.name }}
                </v-list-item>
              </v-list>
              <p v-else>No projects in this app!</p>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="createNewProject(app.id)"> New Project </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- DOCS  -->
    <p class="text-h2">Documentation</p>
    <v-row>
      <v-col class="cols-12 cols-md-4">
        <v-card class="mx-5">
          <v-card-title> Support </v-card-title>
          <v-card-text>
            The code-base is currently maintained by {{ author }}. The code can
            be downloaded from GitHub (link below). At times, the author may
            respond to queries about implementation...
          </v-card-text>
          <v-card-actions>
            <v-btn :href="githubLink"> Github </v-btn>
            <v-btn :href="'mailto:' + authorEmail"> Email author </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col class="cols-12 cols-md-4">
        <v-card class="mx-2">
          <v-card-title> Code basis </v-card-title>
          <v-card-text>
            The template is build in VueJS. For styling purposes, it uses
            Vuetify. To enable a consistend data management throughout different
            components, it also uses vuex. Please find the respective resources
            below:
          </v-card-text>
          <v-card-actions>
            <v-btn href="https://vuejs.org/"> Vue </v-btn>
            <v-btn href="https://vuetifyjs.com/en/"> vuetify </v-btn>
            <v-btn href="https://vuex.vuejs.org/"> vuex </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col class="cols-12 cols-md-4">
        <v-card class="mx-2">
          <v-card-title> how to start </v-card-title>
          <v-card-text>
            Probably first set up the API to the backend as well as your image
            hosting in the <code>settings.js</code> file. The template provides
            a login structure and a <code>loggedIn</code> function through the
            Vuex store. Furthermore can the current user be read through the
            Vuex store. This is best achieved through:
            <code>...mapGetters(['getUser', 'loggedIn'])</code>

            For everything else, there should be sample code throughout this
            template!
          </v-card-text>
          <v-card-actions> good luck! </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import settings from "@/settings";
export default {
  name: "HelloWorld",

  data: () => ({}),
  computed: {
    ...mapGetters(["allApps"]),

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
