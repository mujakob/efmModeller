<template>
  <div
    v-if="theObject"
    :id="objectType + objectID"
    :ref="objectType + objectID"
    class="efmElement transparent"
  >
    <v-card
      :class="[
        isToBeSelected ? 'toBeSelected' : '',
        isSelected ? 'selected' : '',
      ]"
      style="z-index: 10"
      :height="elementHeight"
      :width="elementWidth"
    >
      <!-- <router-link :to="{
                name: '${objectType}Detail',
                params: {dsID: String(theDS.id)}
                }"> -->

      <!-- button to answer the "select this" call  -->
      <v-btn
        v-if="isToBeSelected"
        absolute
        fab
        @click="selectThis"
        class="mr-auto mt-5"
        color="yellow"
      >
        <v-icon>mdi-source-pull</v-icon>
      </v-btn>

      <!-- element card details  -->
      <v-card-title
        @click="setForDetails(objectType, objectID)"
        :class="[
          objectColor,
          treeObjectSize ? 'text-h6' : 'text-subtitle-2',
          'text-truncate',
          !treeObjectSize ? 'pa-1' : 'pa-2',
          ]"
      >
        {{ theObject.name }}
      </v-card-title>
      <!-- constraints -->
      <v-speed-dial
        v-model="showAllConstraints"
        direction="top"
        open-on-hover
        class="mr-3"
        v-if="constraints.length && showConstraints"
      >
        <template v-slot:activator>
          <v-chip class="ma-2" :color="constraintColor" text-color="white">
            <v-avatar left :class="[constraintColor, 'darken-4']">
              {{ constraints.length }}
            </v-avatar>
            constraints
          </v-chip>
        </template>
        <v-chip
          class="ma-2"
          :color="constraintColor"
          text-color="white"
          v-for="c in constraints"
          :key="c.id"
          @click="setForDetails('c', c.id)"
        >
          {{ c.name }}
        </v-chip>
      </v-speed-dial>
      
      <!-- DESCRIPTION -->
      <v-card-text
        v-if="treeObjectSize"
        class="text-truncate pt-0"
      >
        {{ theObject.description }}
      </v-card-text>
      
      <!-- EDITING MENU  -->
      <editing-menu
        v-if="showEditor"
        :objectID="objectID"
        :objectType="objectType"
        :smallEditor="!Boolean(treeObjectSize)"
        @newObject="newObject"
        @deleteObject="deleteObject"
      />
      
    </v-card>
    <ul class="efmSubElements transparent">
      <li v-for="child in children" :key="child.id" class="transparent">
        <efm-tree-object
          :objectType="otherType"
          :objectID="child.id"
          :dna="dna"
          @newObject="newObject"
          @deleteObject="deleteObject"
        />
      </li>
    </ul>
  </div>
</template>

<script>
// import utils from "@/utils";
import { mapGetters, mapMutations } from "vuex";
import EditingMenu from "./editingMenu.vue";

export default {
  name: "efmTreeObject",
  components: { EditingMenu },
  data() {
    return {
      projectData: null,

      // parameters for gui editing watchers:
      waitingForNewParent: false,

      // show/hide constraints:
      showAllConstraints: false,

    };
  },
  computed: {
    ...mapGetters("efm", [
      "getEFMobjectByID",
      "frByID",
      "objectIsToBeSelected",
      "theSelectedObject",
      "EFMobjectInfo",
      "efmObjectChildren",
      "incomingIWofDS",
      "outgoingIWofDS",
      "isSelectedForDetails",
      "efmObjectConstraints",
      "selectedConcept",
    ]),

    // settings getter
    ...mapGetters([
      "efmObjectColor",
      "showEditor",
      "treeObjectSize",
      "showConstraints",
      ]),

    ...mapMutations("efm", ["setObjectForDetails"]),

    theObject() {
      return this.getEFMobjectByID(this.objectType, this.objectID);
    },
    children() {
      // returns id of children as list
      let children = this.efmObjectChildren(this.objectType, this.objectID)
      // if (this.objectType === "ds") {
      //   // returning FR objects
      //   return this.theObject.requires_functions_id;
      // } else if (this.objectType === "fr") {
      //   // returning DS objects
      //   let children = this.theObject.is_solved_by_id;

      if (this.objectType === "fr" && this.selectedConcept) {
        // in case concept is loaded we filter by dna:
        const dna = this.selectedConcept.dna;
        // console.log("dna: " + dna);
        children = children.filter((child) => dna.includes(child.id));
      }
      return children;
      // } else {
      //   return "";
      // }
    },
    otherType() {
      if (this.objectType === "ds") {
        return "fr";
      } else if (this.objectType === "fr") {
        return "ds";
      } else {
        return "";
      }
    },
    isToBeSelected() {
      return this.objectIsToBeSelected(this.objectType, this.objectID);
    },
    objectInfo() {
      return this.EFMobjectInfo(this.objectType, this.objectID);
    },
    // incomingIW() {
    //   if (this.objectType == "ds") {
    //     return this.incomingIWofDS(this.objectID);
    //   } else {
    //     return [];
    //   }
    // },
    // outgoingIW() {
    //   if (this.objectType == "ds") {
    //     return this.outgoingIWofDS(this.objectID);
    //   } else {
    //     return [];
    //   }
    // },
    constraints() {
      return this.efmObjectConstraints(this.objectType, this.objectID);
    },
    // selection
    isSelected() {
      return this.isSelectedForDetails(this.objectType, this.objectID);
    },
    // COLORS
    objectColor() {
      return this.efmObjectColor(this.objectType);
    },
    constraintColor() {
      return this.efmObjectColor("c");
    },
    // iwColor() {
    //   return this.efmObjectColor("iw");
    // },
    elementHeight() {
      // min height for size = small and not elments
      let height = 30
      if (this.treeObjectSize) {
        // min height:
        height = 100
      }
      if (this.showEditor) {
        height += 50
      }
      if (this.showConstraints) {
        height += 30
      }
      return String(height) + 'px'
    },
    elementWidth() {
      switch (this.treeObjectSize) {
        case 0:
          return "100px"
        case 1:
          return "200px"
        case 2:
          return "300px"
      }
      return "150px"
    } 
  },
  props: {
    objectType: {
      type: String,
      required: true,
    },
    objectID: {
      type: Number,
      required: true,
    },
    dna: {
      // defines which instance is loaded
      type: String,
      required: false,
      default: null,
    },
  },
  methods: {
    // emited functions that are escalated up through the tree:
    newObject(data) {
      this.$emit("newObject", {
        objectType: data.objectType,
        editID: data.editID,
        parentID: data.parentID,
      });
    },
    deleteObject(data) {
      this.$emit("deleteObject", {
        toDeleteID: data.toDeleteID,
        toDeleteType: data.toDeleteType,
      });
    },

    // GUI selection mecahnism
    async selectThis() {
      // console.log("selected " + this.objectType + this.objectID);
      this.$store.commit("efm/objectIsSelected", {
        type: this.objectType,
        id: this.objectID,
      });
      let newRelationIsSet = await this.$store.dispatch(
        "efm/setNewRelationFromGui",
        { newRelation: this.theObject }
      );
      // resetting the selection mode
      if (newRelationIsSet) {
        console.log(newRelationIsSet)
        this.$store.commit("efm/setObjectsToSelect", []);
        if (newRelationIsSet.edit) {
          const data = newRelationIsSet.edit
          console.log(data)
           this.$emit("newObject", {
            objectType: data.objectType,
            editID: data.editID,
          });
        }
      }
    },

    // selection for details pane
    // setForDetails() {
    //   console.log('setting details ' + this.theObject.name)
    //   this.$store.commit("efm/setObjectForDetails", {type: this.objectType, id: this.objectID})
    // },
    setForDetails(type = this.objectType, id = this.objectID) {
      // console.log('select_for_details: type: ' + type + ' id: ' + id)
      this.$store.commit("efm/setObjectForDetails", { type: type, id: id });
    },
    reportDSasMounted() {
      if (this.objectType == 'ds') {
        this.$store.commit('efm/reportDSasMounted', this.objectID)
      }
    }
  },
  mounted() {
    // informing the store that the iw are ready to draw
    this.reportDSasMounted()
    // console.log('mounted ' + this.objectType + this.objectID )
  },
};
</script>

<style scoped>
.toBeSelected {
  border: 2px solid yellow;
}
.efmElement {
  background: transparent !important;
}
.selected {
  border: 2px solid black;
}
</style>
