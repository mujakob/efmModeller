<template>
  <div v-if="theObject" :id="objectType + objectID" class="efmElement">
    <v-card 
      :class="[
        objectType, 
        isToBeSelected ? 'toBeSelected' : '',
      ]"
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
      <v-card-title class="text-h5">{{ theObject.name }}</v-card-title>
      <!-- IW (in case DS) -->
      <v-chip 
        v-for="iw in incomingIW" 
        :key="iw.id"
      >
        <v-icon left>
          mdi-chevron-left
        </v-icon>
        iw {{iw.fromName}}; {{iw.iwType}}
      </v-chip>
      <v-chip 
        v-for="iw in outgoingIW" 
        :key="iw.id"
      >
        <v-icon left>
          mdi-chevron-right
        </v-icon>
        iw {{iw.toName}}; {{iw.iwType}}
      </v-chip>
      <!-- constraints (in case DS) -->
      <v-chip 
        v-for="cID in theObject.constraint_id" 
        :key="cID"
        color="purple"
      >
        constrained by {{cID}}
      </v-chip>
      <!-- </router-link> -->
      <v-card-text>{{ theObject.description }}</v-card-text>
      <v-card-actions>

        <!-- plus button speed dial -->
        <v-speed-dial
          v-model="fab"
          direction="right"
          open-on-hover
          class="mr-3"
          v-if="addButtonsObjectSpecific.length > 1"
        >
          <template v-slot:activator>
            <v-btn
              v-model="fab"
              fab
              x-small
            >
              <v-icon v-if="fab">
                mdi-close
              </v-icon>
              <v-icon v-else>
                mdi-plus
              </v-icon>
            </v-btn>
          </template>
          <v-tooltip 
            bottom
            v-for="b in addButtonsObjectSpecific" 
            :key="b.link"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                fab
                x-small
                :to="b.link"
                @click="handle_function_call(b.function)"
                v-bind="attrs"
                v-on="on"
                :disabled="b.disabled"
                :color="b.color"
              >
                <v-icon v-if="b.icon"> {{ b.icon }} </v-icon>
                <span v-else>{{b.buttonText}}</span>
              </v-btn>
            </template>
            <span>{{ b.text }}</span>
          </v-tooltip>
        </v-speed-dial>
        <!--  in case only one add object button we don't need a plus -->
        <v-tooltip 
            bottom
            v-else
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                fab
                x-small
                :to="addButtonsObjectSpecific[0].link"
                @click="handle_function_call(addButtonsObjectSpecific[0].function)"
                v-bind="attrs"
                v-on="on"
                class="mr-3"
                :disabled="addButtonsObjectSpecific[0].disabled"
                :color="addButtonsObjectSpecific[0].color"
              >
                <v-icon v-if="addButtonsObjectSpecific[0].icon"> {{ addButtonsObjectSpecific[0].icon }} </v-icon>
                <span v-else>{{addButtonsObjectSpecific[0].buttonText}}</span>
              </v-btn>
            </template>
            <span>{{ addButtonsObjectSpecific[0].text }}</span>
        </v-tooltip>

        <!-- edit buttons -->
        <v-tooltip bottom v-for="(b, index) in editButtons" :key="index">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              x-small
              :to="b.link"
              @click="handle_function_call(b.function)"
              v-bind="attrs"
              v-on="on"
              class="mr-3"
              :disabled="b.disabled"
            >
              <v-icon> {{ b.icon }} </v-icon>
            </v-btn>
          </template>
          <span>{{ b.text }}</span>
        </v-tooltip>
      </v-card-actions>
    </v-card>
    <ul class="efmSubElements">
      <li v-for="child in children" :key="child">
        <ds-tree
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
import { mapGetters } from "vuex";

export default {
  name: "DsTree",
  components: {},
  data() {
    return {
      projectData: null,
      fab: false,
      editButtons: [
        // {
        //   text: "Show object info",
        //   icon: "mdi-badge-account-alert",
        //   link: {
        //     name: this.objectType + "Detail",
        //     params: { objID: this.objectID }
        //   },
        //   disabled: true,
        // },
        {
          text: "Move object to new parent",
          icon: "mdi-source-pull",
          function: 'buttonSelectNewParent',
          disabled: false,
        },
        {
          text: "Edit object info",
          icon: "mdi-pencil",
          link: null,
          function: "buttonEditSelf",
          disabled: false,
        },
        {
          text: "Delete this object",
          icon: "mdi-delete",
          link: null,
          function: "buttonDeleteSelf",
          disabled: false,
        },
      ],
      // elements for (+) dropdown:
      addButtons: [
        {
          text: "Add new alternative solution",
          buttonText: "ds",
          function: "buttonNewChild",
          forElements: ['fr'],
          disabled: false,
          color:'yellow'
        },
        {
          text: "Add new function",
          buttonText: "fr",
          function: "buttonNewChild",
          forElements: ['ds'],
          disabled: false,
          color: 'blue',
        },
        {
          text: "Add new iw",
          buttonText: "iw",
          function: "buttonNewIW",
          forElements: ['ds'],
          disabled: false,
        },
        {
          text: "Add new constraint",
          buttonText: "C",
          function: "buttonNewC",
          forElements: ['ds'],
          disabled: true,
        },
      ],
      // parameters for gui editing watchers:
      waitingForNewParent: false,
    };
  },
  computed: {
    ...mapGetters("efm", [
      "getEFMobjectByID", 
      "frByID",
      "objectIsToBeSelected",
      "efmObjectPossibleParents",
      "theSelectedObject",
      "EFMobjectInfo",
      "efmObjectPossibleIW",
      "incomingIWofDS",
      "outgoingIWofDS",
    ]),

    theObject() {
      return this.getEFMobjectByID(this.objectType, this.objectID);
    },
    children() {
      if (this.objectType === "ds") {
        return this.theObject.requires_functions_id;
      } else if (this.objectType === "fr") {
        return this.theObject.is_solved_by_id;
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
      return this.objectIsToBeSelected(this.objectType, this.objectID)
    },
    objectInfo() {
      return this.EFMobjectInfo(this.objectType, this.objectID)
    },
    incomingIW() {
      if (this.objectType == 'ds') {
        return this.incomingIWofDS(this.objectID)
      } else {
        return []
      }
  },
    outgoingIW() {
      if (this.objectType == 'ds') {
        return this.outgoingIWofDS(this.objectID)
      } else {
        return []
      }
    },

    // button filter by objectType
    addButtonsObjectSpecific() {
      let sAddButtons = this.addButtons.filter(b => b.forElements.includes(this.objectType))
      return sAddButtons
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
    // loadTheObject() {
    //   // this.projectData = JSON.parse(sessionStorage.getItem(this.concept))

    //   let sourceObj = null;
    //   let children = null;
    //   let otherType = null;

    //   if (this.objectType === "ds") {
    //     sourceObj = this.dsByID(this.objectID)
    //     //sourceObj = this.projectData .ds.find(ds => ds.id == this.objectID)
    //     children = sourceObj.requires_functions_id;
    //     otherType = "fr";
    //   } else if (this.objectType === "fr") {
    //     sourceObj = this.frByID(this.objectID)
    //     // sourceObj = this.projectData .fr.find(fr => fr.id == this.objectID)
    //     children = sourceObj.is_solved_by_id;
    //     // filter in case of DNA
    //     if (this.dna) {
    //       children = children.filter(child => this.dna.includes(child));
    //     }
    //     otherType = "ds";
    //   }

    //   let theObj = {
    //     name: sourceObj.name,
    //     description: sourceObj.description,
    //     children: children,
    //     id: sourceObj.id,
    //     otherType: otherType
    //   };
    //   this.theObject = theObj;
    //   this.otherType = otherType
    // },

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

    // helper function for buttons (to enable dynamic button generation with functions)
    handle_function_call(function_name) {
      this[function_name]();
    },
    buttonNewChild() {
      this.$emit("newObject", {
        objectType: this.otherType,
        parentID: this.objectID,
      });
    },
    buttonEditSelf() {
      this.$emit("newObject", {
        objectType: this.objectType,
        editID: this.objectID,
      });
    },
    buttonDeleteSelf() {
      this.$emit("deleteObject", {
        toDeleteType: this.objectType,
        toDeleteID: this.objectID,
      });
    },
    buttonSelectNewParent() {
      // first we set the objects to select in the gui to possible parents
      this.$store.commit('efm/setObjectsToSelect', this.efmObjectPossibleParents(this.objectType, this.objectID))
      this.$store.commit('efm/setWaitingForNewParent',({type: this.objectType, id: this.objectID}))
      // set watching parameter:
      this.waitingForNewParent = true
    },
    buttonNewIW() {
      this.$store.commit('efm/setObjectsToSelect', this.efmObjectPossibleIW(this.objectID))
      this.$store.commit('efm/setWaitingForIW',({type: this.objectType, id: this.objectID}))

    },

    // GUI selection mecahnism
    async selectThis() {
      console.log('selected ' + this.objectType + this.objectID)
      this.$store.commit('efm/objectIsSelected', {type: this.objectType, id: this.objectID})
      let newRelationIsSet = await this.$store.dispatch('efm/setNewRelationFromGui', {newRelation: this.theObject})
      // resetting the selection mode
      if (newRelationIsSet) {
        this.$store.commit('efm/setObjectsToSelect', [])
      }
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
  }
};
</script>

<style scoped>
  .toBeSelected {
    border: 2px solid yellow;
  }
</style>