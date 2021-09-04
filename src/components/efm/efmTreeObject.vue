<template>
  <div v-if="theObject" :id="objectType + objectID" class="efmElement">
    <v-card :class="objectType">
      <!-- <router-link :to="{
                name: '${objectType}Detail',
                params: {dsID: String(theDS.id)}
                }"> -->
      <v-card-title class="text-h5">{{ theObject.name }}</v-card-title>
      <!-- </router-link> -->
      <v-card-text>{{ theObject.description }}</v-card-text>
      <v-card-actions>
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
import { mapGetters } from 'vuex';

export default {
  name: "DsTree",
  components: {},
  data() {
    return {
      projectData: null,
      editButtons: [
        {
          text: "Add new child",
          icon: "mdi-plus",
          function: 'buttonNewChild',
          disabled: false,
        },
        // {
        //   text: "Show object info",
        //   icon: "mdi-badge-account-alert",
        //   link: {
        //     name: this.objectType + "Detail",
        //     params: { objID: this.objectID }
        //   },
        //   disabled: true,
        // },
        // {
        //   text: "Move object to new parent",
        //   icon: "mdi-source-pull",
        //   link: null,
        //   disabled: true,
        // },
        {
          text: "Edit object info",
          icon: "mdi-pencil",
          link: null,
          function: 'buttonEditSelf',
          disabled: false,
        },
        {
          text: "Delete this object",
          icon: "mdi-delete",
          link: null,
          function: 'buttonDeleteSelf',
          disabled: false,
        }
      ]
    };
  },
  computed: {
    ...mapGetters('efm', [
      'getEFMobjectByID',
      'frByID',
    ]),
    theObject() {
      return this.getEFMobjectByID(this.objectType, this.objectID)
    },
    children() {
      if (this.objectType === "ds") {
        return this.theObject.requires_functions_id;
      } else if (this.objectType === "fr") {
        return this.theObject.is_solved_by_id;
      } else {
        return ''
      }
    },
    otherType() {
      if (this.objectType === "ds") {
        return 'fr'
      } else if (this.objectType === "fr") {
        return 'ds'
      } else {
        return ''
      }
    },
  },
  props: {
    objectType: {
      type: String,
      required: true
    },
    objectID: {
      type: Number,
      required: true
    },
    dna: {
      // defines which instance is loaded
      type: String,
      required: false,
      default: null
    }
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
       this.$emit('newObject', {objectType: data.objectType, editID: data.editID, parentID: data.parentID})
    },
    deleteObject(data) {
      this.$emit('deleteObject', {toDeleteID: data.toDeleteID, toDeleteType: data.toDeleteType})
    },

    // helper function for buttons (to enable dynamic button generation with functions)
    handle_function_call(function_name) {
      this[function_name]()
    },
    buttonNewChild() {
      this.$emit('newObject', {objectType: this.otherType, parentID: this.objectID})
    },
    buttonEditSelf() {
      this.$emit('newObject', {objectType: this.objectType, editID: this.objectID})
    },
    buttonDeleteSelf() {
      this.$emit('deleteObject', {toDeleteType: this.objectType, toDeleteID: this.objectID})
    }
  },
  mounted() {
    // this.loadTheObject();
  // },
  // watch: {
  //   dna: function() {
  //     // this.loadTheObject();
  //   }
  }
};
</script>
