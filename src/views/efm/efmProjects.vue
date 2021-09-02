<template>
  <v-card>
    <v-card-title>All projects:</v-card-title>

    <!-- new project button  -->
    <v-btn
      @click="newProject"
    >
      new project
    </v-btn>

      <!-- existing projects: -->
    <v-expansion-panels>
      <v-expansion-panel v-for="project in allTrees" :key="project.id">
        <v-expansion-panel-header>
          <router-link
            :to="{ name: 'project', params: { treeID: project.id } }"
          >
            {{ project.name }}
          </router-link>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row>
            <v-col class="grow">
              <p class="text-caption">Project ID: {{ project.id }}</p>
            </v-col>
            <v-col class="shrink">
              <v-btn
                @click="editProject(project.id)"
              >
                edit
              </v-btn>
            </v-col>
            <v-col class="shrink">
              <v-btn 
                @click="deleteProject(project.id)"
              >
                delete
              </v-btn>
            </v-col>
          </v-row>
          {{ project.description }}
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    
    <!-- popup for editing/new -->
    <NewDS
      v-if="newObjectPopup"
      :editID="newObjectEditID"
      objectType="tree"
      @cancel="newObjectPopup = false"
    />
    <DeleteEFMobject
        v-if="toDeletePopup"
        :toDeleteID="deleteObjectID"
        toDeleteType="tree"
        @cancel="toDeletePopup = false"
    />
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import DeleteEFMobject from '../../components/efm/deleteEFMobject.vue';
import NewDS from '../../components/efm/newEditEFMobject.vue';

export default {
  name: 'efmProjects',
  components: { 
    NewDS,
    DeleteEFMobject,
  },
  data() {
    return {
      newObjectPopup: false,
      newObjectEditID: 0,
      toDeletePopup: false,
      deleteObjectID: 0,
    };
  },
  computed: {
    ...mapGetters('efm', ['allTrees'])
  },
  methods: {
    newProject() {
      this.newObjectEditID = 0
      this.newObjectPopup = true
    },
    editProject(pID) {
      this.newObjectEditID = pID
      this.newObjectPopup = true
    },
    deleteProject(pID) {
      this.deleteObjectID = pID
      this.toDeletePopup = true
    }
  },
  mounted() {
    this.$store.dispatch('efm/getTreeList')
  }
};
</script>

<style lang="scss" scoped></style>
