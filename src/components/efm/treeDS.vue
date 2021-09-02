<template>
    <div
        class="float-left"
    >
        <v-card 
            color="yellow"
            width="300px"
        >
            <v-card-title>{{theDS.name}}</v-card-title>
            <v-card-text>{{theDS.description}}</v-card-text>
            <v-card-actions>
                <v-btn
                    @click="newChild"
                >
                    new function
                </v-btn>
                <v-btn
                    @click="editSelf"
                >
                    edit
                </v-btn>
                <v-btn
                    @click="deleteSelf"
                >
                    delete
                </v-btn>
                <v-btn
                    @click="showChildren != showChildren"
                    fab
                    small
                >
                    <v-icon v-if="showChildren"> mdi-chevron-down-box-outline</v-icon>
                    <v-icon v-else> mdi-chevron-down-box-outline</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
        
        <treeFR
            v-for="frID in theDS.requires_functions_id"
            :key="frID"
            :frID="frID"
        />

    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import treeFR from './treeFR.vue'
export default {
    name: 'DSobjectView',
    components: { treeFR },
    data() {
        return {
            showChildren: true,
        }
    },
    props: {
        dsID: {type: Number, required: true,}
    },
    computed: {
        ...mapGetters('efm', [
            'dsByID',
        ]),

        theDS() {
            return this.dsByID(this.dsID)
        }
    },
    methods: {
        newChild() {
            console.log('new child')
        },
        deleteSelf() {
            console.log('delete')
        },
        editSelf() {
            console.log('edit')
        }
    },
}
</script>