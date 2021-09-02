<template>
  <div class="efmWorkingSpace fill-height">
    <efm-tree-view
        />
  </div>
</template>

<script>
// import treeMenu from "@/components/menu/treeMenu.vue";
import efmTreeView from "@/views/efm/efmTreeView.vue";
// import Concepts from "@/components/efm/concepts.vue";
import { mapActions, mapGetters } from 'vuex';

export default {
  components: {
    // treeMenu,
    efmTreeView,
    // Concepts
  },

  name: "efmTree",
  data() {
    return {
      showObjectInfoPane: true,
      showConceptsPane: false,
      theProject: null,
      errors: [],
      zoom: 1,
      currentConcept: null
    };
  },
  props: {
    treeID: {
      required: true
    }
  },
  methods: {
    async loadProject() {
      this.getTree({treeID: this.treeID})
    },
  },
  computed: {
    ...mapGetters('efm', [
      'treeInfo',
    ]),
    ...mapActions('efm', [
      'getTree',
    ]),
    efmTreeAreaCols: function() {
      console.log("showConcept " + this.showConceptsPane * 2);
      console.log("showInfo " + this.showObjectInfoPane * 2);
      let efmTreeWidth =
        12 - this.showConceptsPane * 2 - this.showObjectInfoPane * 2;
      console.log("efmTreeWidth " + efmTreeWidth);
      return efmTreeWidth;
    }
  },
  mounted() {
    this.$store.dispatch("efm/getTree", {treeID: this.treeID});
  }
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
