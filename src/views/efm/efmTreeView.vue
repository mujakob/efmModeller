<template>
  <v-container 
    id="efmTreeView" 
    class="ma-0 pa-0"
    :style="'position:relative; min-height:' + canvasHeight + 'px;'"
  >
    <!-- <treeDS
            :dsID="treeInfo.top_level_ds_id"
        /> -->

    <!-- top-lvl-ds and subseqent children -->
    <efm-tree-object
      v-if="treeInfo"
      :objectID="treeInfo.top_level_ds_id"
      objectType="ds"
      @newObject="newObject"
      @deleteObject="deleteObject"
      style="z-index: 10"
    />

    <iw-line-container 
      v-if="showIW"
      @new:height="setHeight"
    />

    <!-- Add / edit menut -->
    <NewDS
      v-if="newObjectPopup"
      :editID="newObjectEditID"
      :parentID="newObjectParentID"
      :objectType="newObjectType"
      @cancel="newObjectPopup = false"
    />

    <!-- delete menu -->
    <DeleteEFMobject
      v-if="toDeletePopup"
      :toDeleteID="toDeleteID"
      :toDeleteType="toDeleteType"
      @cancel="toDeletePopup = false"
      @deleted="toDeletePopup = false"
    />
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import DeleteEFMobject from "../../components/efm/deleteEFMobject.vue";
// import EfmLines from '../../components/efm/efmLines.vue';
import EfmTreeObject from "../../components/efm/efmTreeObject.vue";
import IwLineContainer from "../../components/efm/iwLineContainer.vue";
import NewDS from "../../components/efm/newEditEFMobject.vue";
// import treeDS from '../../components/efm/treeDS.vue'

export default {
  components: { EfmTreeObject, NewDS, DeleteEFMobject, IwLineContainer },
  data() {
    return {
      // for newObject popup:
      newObjectPopup: false,
      newObjectEditID: null,
      newObjectParentID: null,
      newObjectType: null,

      // for deleteObject popup
      toDeleteType: null,
      toDeleteID: null,
      toDeletePopup: null,

      canvasHeight: 100,
    };
  },
  name: "efmTreeView",
  computed: {
    ...mapGetters("efm", ["treeInfo", "getEFMobjectsByType",]),
    // settings:
    ...mapGetters(['showIW'])
  },
  methods: {
    newObject(data) {
      this.newObjectEditID = data.editID;
      this.newObjectParentID = data.parentID;
      this.newObjectType = data.objectType;
      this.newObjectPopup = true;
    },
    deleteObject(data) {
      this.toDeleteID = data.toDeleteID;
      this.toDeleteType = data.toDeleteType;
      this.toDeletePopup = true;
    },
    abortAllActions() {
      console.log("ABORT");

      // cancelling deletion:
      this.toDeleteID = null;
      this.toDeleteType = null;
      this.toDeletePopup = false;

      // cancelling new object menu:
      this.newObjectEditID = null;
      this.newObjectParentID = null;
      this.newObjectType = null;
      this.newObjectPopup = false;

      // cancelling connections:
      this.$store.commit("efm/cancelSelection");
    },
    
    setHeight(newHeight) {
      if (newHeight > this.canvasHeight){
        this.canvasHeight = newHeight
        this.$emit('new:height', this.canvasHeight)
      }
    },
  },
  mounted() {
    let self = this;
    window.addEventListener("keyup", function (ev) {
      if (ev.key == "Escape") {
        self.abortAllActions();
      }
    });
  },
};
</script>

<style>
.efmTree {
  /* min-width: 800px; */
  min-height: 600px;
  overflow: auto;
}

.efmSubElements {
  display: flex;
  list-style: none;
  padding-left: 0px !important;
}

.fr {
  border-top: 2px solid rgb(0, 0, 126) !important;
}
.ds {
  border-top: 2px solid rgb(199, 152, 0) !important;
}

.efmElement {
  padding-top: 10px;
}

.efmElement .v-card {
  margin-left: 10px;
  width: 200px;
}
</style>
