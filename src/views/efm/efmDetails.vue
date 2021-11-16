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
      @newObject="newObject"
      @deleteObject="deleteObject"
    />

    <!-- description -->
    <v-card-text v-if="objData.description">
      <v-divider />
      <p class="text-caption"> description: </p>
      {{ objData.description }}
    </v-card-text>

    <v-card-text v-if="children">
      <v-divider />
      <p class="text-caption"> 
        {{objInfo.childrenString}}
      </p>
      <v-chip
        v-for="c in children"
        :key="c.id"
        @click="setForDetails(c.objType, c.id)"
        :color="objectColor(c.objType)"
      >
        {{c.name}}
      </v-chip>
    </v-card-text>


    <!-- IW (in case DS) -->
    <v-card-text v-if="incomingIW.length">
      <v-divider />
      <p class="text-caption"> 
        incoming interactions 
      </p>

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
    </v-card-text>

    <v-card-text v-if="outgoingIW.length">
      <v-divider />
      <p class="text-caption">
        outgoing interactions 
      </p>
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
    </v-card-text>

    <v-card-text  v-if="constraints.length">
      <v-divider />
      <!-- constraints (in case DS) -->
      <p class="text-caption"> 
        is constrained by 
      </p>
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
