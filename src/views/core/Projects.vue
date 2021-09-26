<template>
  <div class="home">

    <v-row>
      <v-col>
        <span class="text-h3">Your projects</span>
      </v-col>

      <v-spacer />
      
      <v-col>
        <v-tooltip>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              @click="newProject"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>add new project</span>
        </v-tooltip>
      </v-col>
    </v-row>

    <v-expansion-panels>
      <v-expansion-panel v-for="project in projectList" :key="project.id">
        <v-expansion-panel-header>
            {{ project.name }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>

          <!-- project header info -->
          <v-row>
            <v-col class="grow">
              <p class="text-caption">
                Project ID: {{ project.id }};   
                your role: {{ aLvl(project.access_level) }}
          </p>
            </v-col>
            <v-col class="shrink">
              <v-btn>edit</v-btn>
            </v-col>
            <v-col class="shrink">
              <v-btn v-on:click="deleteProject(project.id)">delete</v-btn>
            </v-col>
          </v-row>
          
          <!-- efm trees table  -->
          <v-simple-table >
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">EFM tree name</th>
                  <th class="text-right">tree id</th>
                  <th class="text-left">subproject id</th>
                  <!-- <th class="text-right">
                              edit
                          </th> -->
                </tr>
              </thead>
              <tbody v-if="project.subprojects.length">
                <tr v-for="sp in project.subprojects.filter(sp => sp.tree)" :key="sp.id">
                  <td class="text-left">
                    <router-link
                      :to="{ name: 'project', params: { treeID: sp.tree.id } }"
                    >
                      {{ sp.tree.name }}
                    </router-link>
                  </td>
                  <td class="text-right text-caption">
                    {{ sp.tree.id }}
                  </td>
                  <td class="text-right text-caption">
                    {{ sp.id }}
                  </td>
                </tr>
              </tbody>
              <span v-else> currently no subprojects with EFM-trees </span>
            </template>
          </v-simple-table>

        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

   
  </div>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from "vuex";
import settings from "@/settings";

export default {
  name: "Home",
  components: {},
  computed: {
    ...mapGetters(["projectList"]),
  },
  methods: {
    aLvl(lvl) {
      return settings.accessLevel(lvl);
    },
    newProject() {
      console.log('they want to create a new project...?')
    }
  },
  mounted() {
    this.$store.dispatch("fetchProjects");
  },
};
</script>
