<template>
  <v-container>
    <!-- <treeDS
            :dsID="treeInfo.topLvlDSid"
        /> -->
    <efm-tree-object
      :objectID="treeInfo.topLvlDSid"
      objectType="ds"
      @newObject="newObject"
      @deleteObject="deleteObject"
    />

    <NewDS
      v-if="newObjectPopup"
      :editID="newObjectEditID"
      :parentID="newObjectParentID"
      :objectType="newObjectType"
      @cancel="newObjectPopup = false"
    />

    <DeleteEFMobject
      v-if="toDeletePopup"
      :toDeleteID="toDeleteID"
      :toDeleteType="toDeleteType"
      @cancel="toDeletePopup = false"
    />
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import DeleteEFMobject from "../../components/efm/deleteEFMobject.vue";
import EfmTreeObject from "../../components/efm/efmTreeObject.vue";
import NewDS from "../../components/efm/newEditEFMobject.vue";
// import treeDS from '../../components/efm/treeDS.vue'

export default {
  components: { EfmTreeObject, NewDS, DeleteEFMobject },
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
    };
  },
  name: "efmTreeView",
  computed: {
    ...mapGetters("efm", ["treeInfo"]),
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
  },
};
</script>

<style>
.efmTree {
  /* min-width: 800px; */
  min-height: 600px;
  overflow: auto;
}
.loadingicon {
  width: 100px;
  height: 100px;
  justify-content: center;
  align-content: center;
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
