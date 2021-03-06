<template>
  <v-card
    width="40%"
    min-width="300px"
    class="ma-10"
    style="position: fixed; top: 50px; right: 10px"
  >
    <!-- object type string -->
    <v-card-text :class="thisObjectColor">
      {{ objInfo.string }}
    </v-card-text>

    <!-- name, id, parent,  -->
    <v-card-title>
      {{ objData.name }}
      <v-spacer />
      <v-btn fab x-small @click="unsetDetails"> x </v-btn>
    </v-card-title>
    <v-card-text> 
      id: {{ objectID }}
      <p v-if="parent">
        <span class="text-caption"> {{ objInfo.parentString }}: </span>
        <v-chip
          @click="setForDetails(objInfo.parentType, parent.id)"
          :color="objectColor(objInfo.parentType)"
        >
          {{ parent.name }}
        </v-chip>
      </p>
    </v-card-text>

    <!-- editing menu -->
    <editing-menu
      :objectID="objectID"
      :objectType="objectType"
      :popupDirection="'bottom'"
      @newObject="newObject"
      @deleteObject="deleteObject"
    />

    <!-- description -->
    <v-card-text v-if="objData.description">
      <v-divider />
      <p class="text-caption"> description: </p>
      {{ objData.description }}
    </v-card-text>

    <!-- parameters  -->
    <v-card-text v-if="parameters.dp.length">
      <v-divider />
      
      <p class="text-caption"
        @click="showDP = !showDP"
        >
        <v-icon v-if="showDP">mdi-chevron-up</v-icon>
        <v-icon v-else>mdi-chevron-down</v-icon>
        design parameters: ({{parameters.dp.length}})
      </p>
      <div v-if="showDP">
        <p 
          v-for="p in parameters.dp" 
          :key="p.id"
          @click="setForDetails('dp', p.id)"
        >
          {{p.name}}: {{p.value}}
        </p>
      </div>
    </v-card-text>
    <!-- behaviour parameters  -->
    <v-card-text v-if="parameters.bp.length">
      <v-divider />
      
      <p class="text-caption"
        @click="showBP = !showBP"
        >
        <v-icon v-if="showBP">mdi-chevron-up</v-icon>
        <v-icon v-else>mdi-chevron-down</v-icon>
        behaviour parameters: ({{parameters.bp.length}})
      </p>
      <div v-if="showBP">
        <p 
          v-for="p in parameters.bp" 
          :key="p.id"
          @click="setForDetails('bp', p.id)"
        >
          {{p.name}}: {{p.value}}
        </p>
      </div>
    </v-card-text>
    <!-- function parameters  -->
    <v-card-text v-if="parameters.fp.length">
      <v-divider />
      
      <p class="text-caption"
        @click="showFP = !showFP"
        >
        <v-icon v-if="showFP">mdi-chevron-up</v-icon>
        <v-icon v-else>mdi-chevron-down</v-icon>
        function parameters: ({{parameters.fp.length}})
      </p>
      <div v-if="showFP">
        <p 
          v-for="p in parameters.fp" 
          :key="p.id"
          @click="setForDetails('fp', p.id)"
        >
          {{p.name}}: {{p.value}}
        </p>
      </div>

    </v-card-text>

    <!-- children -->
    <v-card-text v-if="children.length">
      <v-divider />
      <p class="text-caption"
        @click="showChildren = !showChildren"
        >
        <v-icon v-if="showChildren">mdi-chevron-up</v-icon>
        <v-icon v-else>mdi-chevron-down</v-icon> 
        {{objInfo.childrenString}} ({{children.length}})
      </p>
      <div v-if="showChildren">
        <v-chip
          v-for="c in children"
          :key="c.id"
          @click="setForDetails(c.objType, c.id)"
          :color="objectColor(c.objType)"
        >
          {{c.name}}
        </v-chip>
      </div>
    </v-card-text>


    <!-- IW (in case DS) -->
    <v-card-text v-if="incomingIW.length">
      <v-divider />
      <p class="text-caption"
        @click="showIWin = !showIWin"
        >
        <v-icon v-if="showIWin">mdi-chevron-up</v-icon>
        <v-icon v-else>mdi-chevron-down</v-icon> 
        incoming interactions ({{incomingIW.length}})
      </p>
      <div v-if="showIWin">
        <v-chip 
          v-for="iw in incomingIW" 
          :key="iw.id"
          :color="objectColor('iw')"
          @click="setForDetails('iw', iw.id)"
        >
          <v-avatar
            :class="[objectColor('iw'), 'darken-4']"
            left
          >
            <v-icon color="white"> mdi-chevron-left </v-icon>
          </v-avatar>
          iw {{ iw.fromName }}; {{ iw.iwType }}
        </v-chip>
      </div>
    </v-card-text>

    <v-card-text v-if="outgoingIW.length">
      <v-divider />
      <p class="text-caption"
        @click="showIWout = !showIWout"
        >
        <v-icon v-if="showIWout">mdi-chevron-up</v-icon>
        <v-icon v-else>mdi-chevron-down</v-icon>
        outgoing interactions ({{outgoingIW.length}})
      </p>
      <div v-if="showIWout">
        <v-chip
          v-for="iw in outgoingIW" 
          :key="iw.id"
          @click="setForDetails('iw', iw.id)"
          :color="objectColor('iw')"
        >
          <v-avatar
            :class="[objectColor('iw'), 'darken-4']"
            left
          >
            <v-icon color="white"> mdi-chevron-right </v-icon>
          </v-avatar>
          iw {{ iw.toName }}; {{ iw.iwType }}
        </v-chip>
      </div>
    </v-card-text>
    
    <!-- constraints  -->
    <v-card-text  v-if="constraints.length">
      <v-divider />
      <!-- constraints (in case DS) -->
      <p class="text-caption"
        @click="showConstraints = !showConstraints"
        >
        <v-icon v-if="showConstraints">mdi-chevron-up</v-icon>
        <v-icon v-else>mdi-chevron-down</v-icon> 
        is constrained by ({{constraints.length}})
      </p>
      <div v-if="showConstraints">
        <v-chip
          class="ma-2"
          :color="efmObjectColor('c')"
          text-color="white"
          v-for="c in constraints"
          :key="c.id"
          @click="setForDetails('c', c.id)"
        >
          {{ c.name }}
        </v-chip>
      </div>
    </v-card-text>


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
      @deleted="unsetDetails"
    />
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import NewDS from "../../components/efm/newEditEFMobject.vue";
import DeleteEFMobject from "../../components/efm/deleteEFMobject.vue";
import EditingMenu from "@/components/efm/editingMenu.vue";

export default {
  name: "efmObjectDetail",
  components: { NewDS, DeleteEFMobject, EditingMenu },
  data() {
    return {
      // for newObject popup:
      newObjectPopup: false,
      newObjectEditID: null,
      newObjectParentID: null,
      newObjectType: null,

      // show/hide for details
      showBP: false,
      showDP: false,
      showFP: false,
      showConstraints: false,
      showIWin: false,
      showIWout: false,
      showChildren: false,

      // for deleteObject popup
      toDeleteType: null,
      toDeleteID: null,
      toDeletePopup: null,
    };
  },
  computed: {
    ...mapGetters("efm", [
      "objectForDetails",
      "EFMobjectInfo",
      "efmObjectChildren",
      "getEFMobjectByID",
      "efmObjectParent",
      "incomingIWofDS",
      "outgoingIWofDS",
      "efmObjectConstraints",
      "efmParametersOfObject",
    ]),
    ...mapGetters(["efmObjectColor"]),
    objectType() {
      return this.objectForDetails.type;
    },
    objectID() {
      return this.objectForDetails.id;
    },

    objData() {
      return this.getEFMobjectByID(this.objectType, this.objectID);
    },
    objInfo() {
      return this.EFMobjectInfo(this.objectType, this.objectID);
    },
    parent() {
      return this.efmObjectParent(this.objectType, this.objectID);
    },
    children() {
      const childIDs = this.efmObjectChildren(this.objectType, this.objectID);
      let childObjects = []
      for (const c of childIDs) {
        console.log(c)
        let cObject = this.getEFMobjectByID(c.type, c.id)
        cObject.objType = c.type   // needed cause usually the objects don't know their own type -.-
        childObjects.push(cObject)
      }
      return childObjects        
    },
    parameters() {
      return this.efmParametersOfObject(this.objectType, this.objectID)
    },

    // IW for DS:
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
    thisObjectColor() {
      return this.efmObjectColor(this.objectType);
    },
  },
  methods: {
    unsetDetails() {
      this.$store.commit("efm/setObjectForDetails", null);
    },
    // click functions
    setForDetails(type, id) {
      this.$store.commit("efm/setObjectForDetails", { type: type, id: id });
    },
    // edit, delete, new
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
    objectColor(type) {
      return this.efmObjectColor(type)
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

<style scoped>
.text-caption {
  margin-bottom: 5px !important;
}

.v-card__text {
  padding-top: 2px;
  padding-bottom: 2px;
}
</style>