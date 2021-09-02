<template>
    <div
        class="float-left"
    >
        <v-card 
            color="blue"
            width="300px"
        >
            <v-card-title>{{theFR.name}}</v-card-title>
            <v-card-text>{{theFR.description}}</v-card-text>
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
        
        <treeDS
            v-for="dsID in theFR.is_solved_by_id"
            :key="dsID"
            :dsID="dsID"
        />

    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import treeDS from './treeDS.vue'
export default {
    name: 'FRobjectView',
  components: { treeDS },
    data() {
        return {
            showChildren: true,
        }
    },
    props: {
        frID: {type: Number, required: true,}
    },
    computed: {
        ...mapGetters('efm', [
            'frByID',
        ]),

        theFR() {
            return this.frByID(this.frID)
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