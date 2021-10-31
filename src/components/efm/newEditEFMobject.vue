<template>
  <v-dialog v-model="showDialog" max-width="95%">
    <v-card v-if="this.newObject" class="pa-5">
      <v-card-title>
        {{ titleText }}
      </v-card-title>

      <v-text-field
        v-model="newObject.name"
        label="name"
        :rules="rules.notEmpty"
        v-if="showField('name')"
      />

      <v-text-field 
        v-model="newObject.description"
        label="Description" 
        v-if="showField('description')"
      />

      <v-combobox
        v-model="newObject.iw_type"
        v-if="showField('iw_type')"
        label="iw type"
        :items="iwTypes"
      />

      <!-- <v-select
        v-model="newObject.parentID"
        :items="allPossibleParents"
        label="Parent object"
        item-text="name"
        item-value="id"
        :rules="[rules.notEmpty]"
      ></v-select> -->

      <v-card-actions>
        <v-btn @click="save"> save </v-btn>
        <v-btn @click="$emit('cancel')"> cancel </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "newEFMobject",
  data() {
    return {
      newObject: {},
      rules: {
        nameEmpty: (val) => (val || "").length > 0 || "Cannot be empty",
      },
      showDialog: true,
    };
  },
  methods: {
    async save() {
      this.$store.commit("clearErrors", this.$options.name);

      let objectToSubmit = {};

      // add required fields:
      for (const [api, field] of Object.entries(
        this.objectInfo.requiredFields
      )) {
        console.log(api, field);
        // check if field is set:
        if (this.newObject[field]) {
          // set to API value
          objectToSubmit[api] = this.newObject[field];
        } else {
          // raise error if empty (since it is required...)
          this.$store.commit("registerError", {
            component: this.$options.name,
            msg: '"' + field + '" can not be empty!',
          });
        }
      }

      // adding optional fields:
      for (const [api, field] of Object.entries(
        this.objectInfo.optionalFields
      )) {
        if (this.newObject[field]) {
          // set to API value
          objectToSubmit[api] = this.newObject[field];
        }
      }

      // if there are no errors, we can submit!
      if (!this.getErrorsOfComponent().length) {
        let newObj = null;
        if (this.editID) {
          console.log("submiting to PUT");
          // of course, if editID is set we need to submit an EDIT
          // but first, add the editID to the submitobject so the store knows what's up!
          objectToSubmit["id"] = this.editID;
          console.log("last log before disptach");
          console.log(objectToSubmit);

          newObj = await this.$store.dispatch("efm/editEFMobject", {
            type: this.objectType,
            data: objectToSubmit,
          });
        } else {
          // otherwise, we submit a POST
          console.log("submiting to POST");
          newObj = await this.$store.dispatch("efm/newEFMobject", {
            type: this.objectType,
            data: objectToSubmit,
          });
        }
        // emit to close popup
        if (newObj) {
          console.log(newObj);
          this.$emit("cancel");
        }
      } else {
        console.log(this.getErrorsOfComponent());
      }
    },
    loadObject() {
      if (this.editID) {
        console.log("loading object with ID " + this.editID);
        this.newObject = this.getEFMobjectByID(this.objectType, this.editID);
        // need to rewrite "parentID" from the API field description!
        // otherwise it would get omitted in the rewrite before submit
        // necessary for all requried values which have diferent API / Field names
        let parentIDinAPI = Object.keys(this.objectInfo.requiredFields).find(
          (key) => this.objectInfo.requiredFields[key] === "parentID"
        );
        if (parentIDinAPI) {
          this.newObject["parentID"] = this.newObject[parentIDinAPI];
        }
      } else {
        console.log("creating new object");
        this.newObject = {
          name: "",
          description: "",
        };
        if (this.parentID) {
          console.log("adding parent ID " + this.parentID);
          this.newObject.parentID = this.parentID;
        }
      }
    },
    showField(fieldName) {
      // checks objectInfo.requiredFields and .optionalFields whether the field should be shown
      //returns "required", "optional" or false
      if (fieldName in this.objectInfo.requiredFields) {
        return "required"
      } else if (fieldName in this.objectInfo.optionalFields) {
        return "optional"
      } else {
        return false
      }
    }
  },
  props: {
    editID: { type: Number, default: null }, // if set, we are in editing mode
    parentID: { type: Number, default: null }, //required for new, auto-set in editing
    objectType: { type: String, required: true }, // sets the type of the form
  },
  computed: {
    ...mapGetters(["getErrorsOfComponent", "iwTypes"]),
    ...mapGetters("efm", [
      "getEFMobjectByID",
      "EFMobjectInfo",
      "efmObjectPossibleParents",
    ]),
    objectInfo() {
      return this.EFMobjectInfo(this.objectType);
    },
    titleText() {
      if (this.editID) {
        return "Editing " + this.objectInfo.short + ": " + this.newObject.name;
      } else {
        return (
          "Creating new " +
          this.objectInfo.short +
          " for " +
          this.parentObject.name
        );
      }
    },
    allPossibleParents() {
      return this.efmObjectPossibleParents(this.objectType, this.editID);
    },
    parentObject() {
      if (this.parentID) {
        return this.getEFMobjectByID(this.objectInfo.parentType, this.parentID);
      } else {
        return null;
      }
    },
  },
  mounted() {
    this.loadObject();
  },
};
</script>
