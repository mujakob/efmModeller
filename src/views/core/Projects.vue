<template>
  <div class="home">
    <v-row class="ma-3">
      <v-col>
        <span class="text-h3">Your projects</span>
      </v-col>

      <v-spacer />

      <v-col>
        <!-- new project button  -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              @click="newProjectDialog = true"
              v-bind="attrs"
              v-on="on"
              elevation="3"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>add new project</span>
        </v-tooltip>
      </v-col>
    </v-row>

    <!--  new project dialog -->
    <v-dialog v-model="newProjectDialog" max-width="95%">
      <v-card>
        <v-card-title>Create a new project</v-card-title>
        <v-card-subtitle
          >You will automatically be set as owner</v-card-subtitle
        >
        <v-text-field v-model="newProjectName" />
        <v-card-actions>
          <v-btn @click="newProjectDialog = false"> cancel </v-btn>
          <v-btn @click="saveNewProject"> save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--  new tree dialog -->
    <v-dialog v-model="newTreeDialog" max-width="95%">
      <v-card>
        <v-card-title>Create a new EFM-subproject</v-card-title>
        <v-text-field v-model="newTreeName" />
        <v-text-field v-model="newTreeDescription" />
        <v-card-actions>
          <v-btn @click="newTreeDialog = false"> cancel </v-btn>
          <v-btn @click="saveNewTree"> save </v-btn>
          <v-btn @click="saveNewTree(true)"> save and open </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- pannels with projects -->
    <v-expansion-panels>
      <v-expansion-panel v-for="project in projectList" :key="project.id">
        <v-expansion-panel-header class="text-h4">
          {{ project.name }}
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <!-- project header info -->
          <v-row>
            <v-col class="grow">
              <p class="text-caption">
                Project ID: {{ project.id }}; your role:
                {{ aLvl(project.access_level) }}
              </p>
            </v-col>
            <v-col class="shrink">
              <v-btn disabled>edit</v-btn>
            </v-col>
            <v-col class="shrink">
              <v-btn disabled v-on:click="deleteProject(project.id)"
                >delete</v-btn
              >
            </v-col>
          </v-row>

          <!-- efm trees table  -->
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">EFM tree name</th>
                  <th class="text-right">tree id</th>
                  <th class="text-right">subproject id</th>

                  <!-- new subproject button -->
                  <th>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          fab
                          @click="newTreeForProject(project.id)"
                          x-small
                          v-bind="attrs"
                          v-on="on"
                          color="green"
                        >
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </template>
                      <span>Add new subproject (EFM-tree)</span>
                    </v-tooltip>
                  </th>
                </tr>
              </thead>

              <!-- subproject table -->
              <tbody v-if="project.subprojects.length">
                <tr
                  v-for="sp in project.subprojects.filter((sp) => sp.tree)"
                  :key="sp.id"
                >
                  <td class="text-left">
                    <router-link
                      :to="{
                        name: 'efm-project',
                        params: { treeID: sp.tree.id },
                      }"
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
                  <td>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          fab
                          @click="toDeleteID = sp.id"
                          x-small
                          color="red"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon>mdi-delete-forever</v-icon>
                        </v-btn>
                      </template>
                      <span
                        >Delete subproject and EFM-tree "{{
                          sp.tree.name
                        }}"</span
                      >
                    </v-tooltip>
                  </td>
                </tr>
              </tbody>
              <span v-else> currently no subprojects with EFM-trees </span>
            </template>
          </v-simple-table>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <!-- deletion dialog  -->
    <v-dialog v-model="deleteTreeDialog" max-width="95%">
      <v-card>
        <v-card-title>Deleting EFM-subproject</v-card-title>
        Are you sure you want to delete {{ toDeleteID }}?
        <v-card-actions>
          <v-btn @click="toDeleteID = null"> cancel </v-btn>
          <v-btn @click="deleteSubproject"> delete </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from "vuex";
import settings from "@/settings";

export default {
  name: "Home",
  data() {
    return {
      newProjectName: null,
      newProjectDialog: false,

      newTreeName: "",
      newTreeDescription: "",
      newTreeProject: 0,
      newTreeDialog: false,

      toDeleteID: null,

      rules: {
        nameEmpty: (val) => (val || "").length > 0 || "Cannot be empty",
      },
    };
  },
  computed: {
    ...mapGetters(["projectList"]),

    deleteTreeDialog: {
      get: function () {
        return Boolean(this.toDeleteID);
      },
      set: function () {
        this.toDeleteID = null;
      },
    },
  },
  methods: {
    aLvl(lvl) {
      return settings.accessLevel(lvl);
    },
    async saveNewProject() {
      await this.$store.dispatch("newProject", {
        projectName: this.newProjectName,
      });
      this.newProjectName = null;
      this.newProjectDialog = false;
    },

    async saveNewTree(forward = false) {
      const treeData = {
        name: this.newTreeName,
        description: this.newTreeDescription,
      };

      let theNewTree = await this.$store.dispatch("efm/newTree", {
        projectID: this.newTreeProject,
        treeData: treeData,
      });
      // reset values
      this.newTreeName = "";
      this.newTreeDescription = "";
      this.newTreeProject = 0;
      this.newTreeDialog = false;

      // reset dialog:
      this.newTreeDialog = false;
      this.newTreeProject = null;

      if (forward && theNewTree) {
        // directly push to the new tree view:
        this.$router.push({
          name: "efm-project",
          params: { treeID: theNewTree.id },
        });
      }
    },
    newTreeForProject(projectID) {
      this.newTreeDialog = true;
      this.newTreeProject = projectID;
    },
    async deleteSubproject() {
      const deleted = await this.$store.dispatch("efm/deleteTree", {
        treeID: this.toDeleteID,
      });
      if (deleted) {
        this.toDeleteID = null;
      }
    },
  },
  mounted() {
    this.$store.dispatch("fetchProjects");
  },
};
</script>
