<template>
  <v-row 
    class="fill-height grey lighten-1" 
    id="efmWorkspace"
  >
    <!-- concept pane -->
    <v-col 
      :cols="showConceptPane ? 3 : ''" 
      class="flex-shrink-1 flex-grow-0"
    >
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            x-small
            @click="showHideConceptPane()"
            v-bind="attrs"
            v-on="on"
            style="position:fixed;"
          >
            <v-icon v-if="showConceptPane"> mdi-chevron-left </v-icon>
            <v-icon v-else> mdi-chevron-right </v-icon>
          </v-btn>
        </template>
        <span v-if="showConceptPane">Hide concept pane</span>
        <span v-else>Show concept pane</span>
      </v-tooltip>

      <efm-concepts v-if="showConceptPane" />
    </v-col>

    <!-- rest of the window (tree + details) -->
    <v-col
      :cols="showConceptPane ? 9 : ''"
      style="overflow: hidden;"
      class="flex-grow-1 flex-shrink-0"
    >
      <!-- tree view -->
      <efm-tree-view id="efmTreeView" />

      <efm-details style="z-index: 100" v-if="objectForDetails" />
    </v-col>
  </v-row>
</template>

<script>
// import treeMenu from "@/components/menu/treeMenu.vue";
import efmTreeView from "@/views/efm/efmTreeView.vue";
// import Concepts from "@/components/efm/concepts.vue";
import { mapActions, mapGetters } from "vuex";
import EfmDetails from "./efmDetails.vue";
import EfmConcepts from "./efmConcepts.vue";

export default {
  components: {
    // treeMenu,
    efmTreeView,
    // Concepts

    EfmDetails,
    EfmConcepts,
  },

  name: "efmTree",
  data() {
    return {
      showObjectInfoPane: true,
      showConceptPane: false,
      theProject: null,
      errors: [],
      zoom: 1,
      currentConcept: null,
    };
  },
  props: {
    treeID: {
      required: true,
    },
  },
  methods: {
    async loadProject() {
      this.getTree({ treeID: this.treeID });
    },
    async showHideConceptPane() {
      this.showConceptPane = !this.showConceptPane

      // reloading the concepts when opening
      if (this.showConceptPane) {
        await this.$store.dispatch("efm/getConcepts");
      }
    }
  },
  computed: {
    ...mapGetters("efm", ["treeInfo", "objectForDetails"]),
    ...mapActions("efm", ["getTree"]),
    efmTreeAreaCols: function () {
      console.log("showConcept " + this.showConceptsPane * 2);
      console.log("showInfo " + this.showObjectInfoPane * 2);
      let efmTreeWidth =
        12 - this.showConceptsPane * 2 - this.showObjectInfoPane * 2;
      console.log("efmTreeWidth " + efmTreeWidth);
      return efmTreeWidth;
    },
  },
  beforeMount() {
    this.$store.commit('efm/unsetTreeData')
  },
  mounted() {
    this.$store.dispatch("efm/getTree", { treeID: this.treeID });
  },
};
</script>

<style>
#efmDetailsPane {
  position: absolute;
  right: 10px;
  top: 10px;
  min-width: 200px;
  padding: 10px;
}
.efmWorkingSpace {
  display: flex;
  flex-direction: column;
}
.efmMenu {
  flex: 0 0 auto !important;
}
.efmArea {
  flex: 1 0 auto;
}
</style>
