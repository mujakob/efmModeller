<template>
  <v-card-actions>
    <!-- plus button speed dial -->
    <v-speed-dial
      v-model="fab"
      :direction="popupDirection"
      open-on-hover
      class="mr-3"
      v-if="addButtonsObjectSpecific.length > 1"
    >
      <template v-slot:activator>
        <v-btn v-model="fab" fab x-small>
          <v-icon v-if="fab"> mdi-close </v-icon>
          <v-icon v-else> mdi-plus </v-icon>
        </v-btn>
      </template>
      <v-tooltip
        bottom
        v-for="b in addButtonsObjectSpecific"
        :key="b.link"
        z-index="102"
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
            :color="objectColor(b.color)"
          >
            <v-icon v-if="b.icon"> {{ b.icon }} </v-icon>
            <span v-else>{{ b.buttonText }}</span>
          </v-btn>
        </template>
        <span>{{ b.text }}</span>
      </v-tooltip>
    </v-speed-dial>
    <!--  in case only one add object button we don't need a plus -->
    <v-tooltip bottom v-else-if="addButtonsObjectSpecific.length">
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
          :color="objectColor(addButtonsObjectSpecific[0].color)"
        >
          <v-icon v-if="addButtonsObjectSpecific[0].icon">
            {{ addButtonsObjectSpecific[0].icon }}
          </v-icon>
          <span v-else>{{ addButtonsObjectSpecific[0].buttonText }}</span>
        </v-btn>
      </template>
      <span>{{ addButtonsObjectSpecific[0].text }}</span>
    </v-tooltip>

    <!-- edit buttons -->
    <!-- speed dial in case "small" -->
    <v-speed-dial
      v-model="fabEdit"
      :direction="popupDirection"
      open-on-hover
      class="mr-3"
      v-if="smallEditor"
    >
      <template v-slot:activator>
        <v-btn v-model="fabEdit" fab x-small>
          <v-icon v-if="fabEdit"> mdi-close </v-icon>
          <v-icon v-else> mdi-pencil </v-icon>
        </v-btn>
      </template>
        <!-- buttons -->
      <v-tooltip bottom v-for="(b, index) in editButtonsObjectSpecific" :key="index">
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
    </v-speed-dial>

    <!-- normel edit buttons -->
    <v-tooltip bottom v-else v-for="(b, index) in editButtonsObjectSpecific" :key="index">
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
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      fab: false,
      fabEdit: false,
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
          function: "buttonSelectNewParent",
          forElements: ["ds", "c", "iw", "fr"],
          disabled: false,
        },
        {
          text: "Edit object info",
          icon: "mdi-pencil",
          link: null,
          function: "buttonEditSelf",
          forElements: ["ds", "c", "iw", "fr", "dp", "fp", "bp",],
          disabled: false,
        },
        {
          text: "Delete this object",
          icon: "mdi-delete",
          link: null,
          function: "buttonDeleteSelf",
          forElements: ["ds", "iw", "c", "fr", "dp", "fp", "bp",],
          disabled: false,
        },
      ],
      // elements for (+) dropdown:
      addButtons: [
        {
          text: "Add new alternative solution",
          buttonText: "ds",
          function: "buttonNewChild",
          forElements: ["fr"],
          disabled: false,
          color: "ds", // fetches from settings/efmObjectColor
        },
        {
          text: "Add new function",
          buttonText: "fr",
          function: "buttonNewChild",
          forElements: ["ds"],
          disabled: false,
          color: "fr",
        },
        {
          text: "Add new iw",
          buttonText: "iw",
          function: "buttonNewIW",
          forElements: ["ds"],
          disabled: false,
        },
        {
          text: "Add new constraint",
          buttonText: "C",
          function: "buttonNewC",
          forElements: ["ds"],
          disabled: false,
          color: "c",
        },
        {
          text: "Add new design parameter",
          buttonText: "DP",
          function: "buttonNewDP",
          forElements: ["ds"],
          disabled: false,
          color: "ds", // fetches from settings/efmObjectColor
        },
        {
          text: "Add new behaviour parameter",
          buttonText: "BP",
          function: "buttonNewBP",
          forElements: ["ds"],
          disabled: false,
          color: "ds", // fetches from settings/efmObjectColor
        },
        {
          text: "Add new function parameter",
          buttonText: "FP",
          function: "buttonNewFP",
          forElements: ["fr"],
          disabled: false,
          color: "fr", // fetches from settings/efmObjectColor
        },
      ],
    };
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
    smallEditor: {
      type: Boolean,
      required: false,
      default: false,
    },
    popupDirection: { // decides the direction of the fab menues
      type: String,
      required: false,
      default: 'top'
    }
  },
  computed: {
    ...mapGetters("efm", ["efmObjectPossibleParents", "efmObjectPossibleIW"]),
    ...mapGetters(["efmObjectColor"]),
    // button filter by objectType
    addButtonsObjectSpecific() {
      let sAddButtons = this.addButtons.filter((b) =>
        b.forElements.includes(this.objectType)
      );
      return sAddButtons;
    },
    // button filter by objectType
    editButtonsObjectSpecific() {
      let sEditButtons = this.editButtons.filter((b) =>
        b.forElements.includes(this.objectType)
      );
      return sEditButtons;
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
  },
  methods: {
    objectColor(obj) {
      return this.efmObjectColor(obj);
    },
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
    buttonNewC() {
      this.$emit("newObject", {
        objectType: "c",
        parentID: this.objectID,
      });
    },
    buttonNewBP() {
      this.$emit("newObject", {
        objectType: "bp",
        parentID: this.objectID,
      });
    },
    buttonNewFP() {
      this.$emit("newObject", {
        objectType: "fp",
        parentID: this.objectID,
      });
    },
    buttonNewDP() {
      this.$emit("newObject", {
        objectType: "dp",
        parentID: this.objectID,
      });
    },

    buttonSelectNewParent() {
      // first we set the objects to select in the gui to possible parents
      this.$store.commit(
        "efm/setObjectsToSelect",
        this.efmObjectPossibleParents(this.objectType, this.objectID)
      );
      this.$store.commit("efm/setWaitingForNewParent", {
        type: this.objectType,
        id: this.objectID,
      });
      // set watching parameter:
      this.waitingForNewParent = true;
    },
    buttonNewIW() {
      this.$store.commit(
        "efm/setObjectsToSelect",
        this.efmObjectPossibleIW(this.objectID)
      );
      this.$store.commit("efm/setWaitingForIW", {
        type: this.objectType,
        id: this.objectID,
      });
    },
  },
};
</script>

<style></style>
