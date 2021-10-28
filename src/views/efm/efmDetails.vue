<template>
    <v-card
        width="40%"
        min-width="300px"
        class="ma-10"
        style="position:fixed; top:50px; right:10px;"
    >
        <!-- object type string -->
        <v-card-text :class="objectColor">
            {{objInfo.string}}
        </v-card-text>
      
        <!-- name, id parent, description -->
        <v-card-title>
            {{objData.name}}
            <v-spacer />
            <v-btn fab x-small @click="unsetDetails"> x </v-btn>
        </v-card-title>
        <v-card-subtitle>
            id: {{objID}}
        </v-card-subtitle>
        <v-card-subtitle v-if="parent" >
            {{objInfo.parentString}}: 
            <span 
                class="text-h6" 
                @click="setForDetails(objInfo.parentType, parent.id)"
            >
                {{parent.name}}
            </span>
        </v-card-subtitle>  

        <!-- editing menu -->
        <editing-menu 
          :objectID="objID" 
          :objectType="objType"
          @newObject="newObject"
          @deleteObject="deleteObject"
        />

        <v-card-text>
            {{objData.description}}
        </v-card-text>

        <v-divider />
        
        <!-- IW (in case DS) -->
        <v-chip v-for="iw in incomingIW" :key="iw.id">
            <v-icon left> mdi-chevron-left </v-icon>
            iw {{ iw.fromName }}; {{ iw.iwType }}
        </v-chip>
        <v-chip v-for="iw in outgoingIW" :key="iw.id">
            <v-icon left> mdi-chevron-right </v-icon>
            iw {{ iw.toName }}; {{ iw.iwType }}
        </v-chip>

        <v-divider />

        <!-- constraints (in case DS) -->
        <v-chip v-for="cID in objData.constraint_id" :key="cID" color="purple">
            constrained by {{ cID }}
        </v-chip>

        <!-- new, edit, delete menues  -->
        
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
import { mapGetters } from 'vuex'
import NewDS from "../../components/efm/newEditEFMobject.vue";
import DeleteEFMobject from "../../components/efm/deleteEFMobject.vue";
import EditingMenu from '@/components/efm/editingMenu.vue';

export default {
    name: 'efmObjectDetail',
    components: { NewDS, DeleteEFMobject, EditingMenu, },
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
        ...mapGetters('efm', [
            'objectForDetails',
            'EFMobjectInfo',
            'efmObjectChildren',
            'getEFMobjectByID',
            'efmObjectParent',        
            "incomingIWofDS",
            "outgoingIWofDS",
        ]),
        ...mapGetters([
            'efmObjectColor'
        ]),
        objType() {
            return this.objectForDetails.type
        },
        objID() {
            return this.objectForDetails.id
        },

        objData() {
            return this.getEFMobjectByID(this.objType, this.objID)
        },
        objInfo() {
            return this.EFMobjectInfo(this.objType, this.objID)
        },
        parent() {
            return this.efmObjectParent(this.objType, this.objID)
        },

        // IW for DS:
        // NOT WORKING...
        incomingIW() {
            if (this.objType == "ds") {
                return this.incomingIWofDS(this.objectID);
            } else {
                return [];
            }
        },
        outgoingIW() {
            if (this.objType == "ds") {
                return this.outgoingIWofDS(this.objectID);
            } else {
                return [];
            }
        },
        objectColor() {
            return this.efmObjectColor(this.objType)
        }

    },
    methods: {
        unsetDetails() {
            this.$store.commit("efm/setObjectForDetails", null)
        },
        // click functions
        setForDetails(type, id) {
            this.$store.commit("efm/setObjectForDetails", {type: type, id: id})
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
    },
    mounted() {
        let self = this;
        window.addEventListener("keyup", function (ev) {
            if (ev.key == "Escape") {
                self.abortAllActions();
            }
        });
    },
}
</script>