<template>
    <v-card
        width="40%"
        min-width="300px"
        class="ma-10"
        style="position:fixed; top:50px; right:10px;"
    >
        
        <v-card-title>
            {{objData.name}}
            <v-spacer />
            <v-btn fab x-small @click="unsetDetails"> x </v-btn>
        </v-card-title>
        <v-card-subtitle>
            id: {{objID}}
        </v-card-subtitle>
        <v-card-subtitle v-if="parent">
            {{objInfo.parentID}}: {{parent.name}}
        </v-card-subtitle>
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
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: 'efmObjectDetail',
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
    },
    methods: {
        unsetDetails() {
            this.$store.commit("efm/setObjectForDetails", null)
        }
    }
}
</script>