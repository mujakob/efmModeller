<template>
  <div
    v-if="theObject"
    :id="objectType + objectID"
    class="efmElement transparent"
  >
    <v-card
      :class="[
        isToBeSelected ? 'toBeSelected' : '',
        isSelected ? 'selected' : '',
      ]"
      style="z-index: 10"
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
        class="text-h5"
        @click="setForDetails(objectType, objectID)"
        :class="objectColor"
      >
        {{ theObject.name }}
      </v-card-title>
      <!-- constraints -->
      <v-speed-dial
        v-model="showConstraints"
        direction="top"
        open-on-hover
        class="mr-3"
        v-if="constraints.length"
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

      <!-- <v-chip
        v-if="constraints.length"
        class="ma-2"
        :color="constraintColor"
        text-color="white"
        @click="showConstraints = !showConstraints"
      >
        <v-avatar
          left
          :class="[constraintColor, 'darken-4']"
        >
          {{constraints.length}}
        </v-avatar>
        constraints
      </v-chip> -->

      <!-- IW (in case DS) as connectors for iw arrows-->
      <div
        v-for="iw in incomingIW"
        :key="iw.id"
        :id="'iwTo' + iw.id"
        style="
          position: absolute;
          bottom: 2px;
          left: 2px;
          height: 2px;
          width: 2px;
          background-color: green;
        "
      ></div>
      <div
        v-for="iw in outgoingIW"
        :key="iw.id"
        :id="'iwFrom' + iw.id"
        style="
          position: absolute;
          bottom: 2px;
          right: 2px;
          height: 2px;
          width: 2px;
          background-color: green;
        "
      ></div>
      
      <!-- </router-link> -->
      <v-card-text>{{ theObject.description }}</v-card-text>
      <!-- <v-card-actions> -->
      <editing-menu
        :objectID="objectID"
        :objectType="objectType"
        @newObject="newObject"
        @deleteObject="deleteObject"
      />
      <!-- </v-card-actions> -->
    </v-card>
    <ul class="efmSubElements transparent">
      <li v-for="child in children" :key="child" class="transparent">
        <efm-tree-object
          :objectType="otherType"
          :objectID="child"
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
      showConstraints: false,
    };
  },
  computed: {
    ...mapGetters("efm", [
      "getEFMobjectByID",
      "frByID",
      "objectIsToBeSelected",
      "theSelectedObject",
      "EFMobjectInfo",
      "incomingIWofDS",
      "outgoingIWofDS",
      "isSelectedForDetails",
      "efmObjectConstraints",
      "selectedConcept",
    ]),

    ...mapGetters(["efmObjectColor"]),

    ...mapMutations("efm", ["setObjectForDetails"]),

    theObject() {
      return this.getEFMobjectByID(this.objectType, this.objectID);
    },
    children() {
      // returns id of children as list
      if (this.objectType === "ds") {
        // returning FR objects
        return this.theObject.requires_functions_id;
      } else if (this.objectType === "fr") {
        // returning DS objects
        let children = this.theObject.is_solved_by_id;

        if (this.selectedConcept) {
          // in case concept is loaded we filter by dna:
          const dna = this.selectedConcept.dna;
          console.log("dna: " + dna);
          children = children.filter((child) => dna.includes(child));
        }
        return children;
      } else {
        return "";
      }
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
    incomingIW() {
      if (this.objectType == "ds") {
        return this.incomingIWofDS(this.objectID);
      } else {
        return [];
      }
    },
    outgoingIW() {
      if (this.objectType == "ds") {
        return this.outgoingIWofDS(this.objectID);
      } else {
        return [];
      }
    },
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
    iwColor() {
      return this.efmObjectColor("iw");
    },
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
      console.log("selected " + this.objectType + this.objectID);
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
        this.$store.commit("efm/setObjectsToSelect", []);
      }
    },

    // selection for details pane
    // setForDetails() {
    //   console.log('setting details ' + this.theObject.name)
    //   this.$store.commit("efm/setObjectForDetails", {type: this.objectType, id: this.objectID})
    // },
    setForDetails(type = this.objectType, id = this.objectID) {
      this.$store.commit("efm/setObjectForDetails", { type: type, id: id });
    },
  },
  mounted() {
    // this.loadTheObject();
    // },
    // watch: {
    //   dna: function() {
    //     // this.loadTheObject();
    //   }
  },
  watch: {
    // theSelectedObject: function(val) {
    //   if (val && this.theSelectedObject) {
    //     console.log('FOUND ONE')
    //   }
    // }
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
