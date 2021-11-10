<template>
    <v-menu offset-y >
        <template v-slot:activator="{ on, attrs }">
            <v-btn v-bind="attrs" v-on="on"> view </v-btn>
        </template>
        <v-list dense nav>
            <v-list-item>
                 <v-switch
                    v-model="toggleEditor"
                    label="show edit buttons in EFM tree"
                />
            </v-list-item>
            <v-list-item>
                 <v-switch
                    v-model="toggleConstraints"
                    :disabled="!treeObjectSize"
                    label="show constraints in EFM tree"
                />
            </v-list-item>
            <v-list-item>
                 <v-switch
                    v-model="toggleIW"
                    label="show iw lines in EFM tree"
                />
            </v-list-item>
            <v-list-item>
                <v-slider
                    v-model="objectSize"
                    min="0"
                    max="2"
                    label="efm tree object size"
                    ticks="always"
                    tick-size="4"
                    :tick-labels="['s', 'm', 'l']"
                    inverse-label
                >
                </v-slider>    
            </v-list-item>
        </v-list>
    </v-menu>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    data() {
        return {

        }
    },
    computed: {
        ...mapGetters([
            "showEditor",
            "treeObjectSize",
            "showConstraints",
            "showIW",
        ]),
         toggleEditor: {
            get: function() {
                return this.showEditor
            },
            set: function(value) {
                this.$store.commit("setEditorVisibility", value) 
            }
        },
        toggleConstraints: {
            get: function() {
                return this.showConstraints
            },
            set: function(value) {
                this.$store.commit("setConstraintVisibility", value) 
            }
        },
        toggleIW: {
            get: function() {
                return this.showIW
            },
            set: function(value) {
                this.$store.commit("setIWvisibility", value) 
            }
        },
        objectSize: {
            get: function() {
                return this.treeObjectSize
            },
            set: function(value) {
                this.$store.commit('setTreeObjectSize', value)
            }
        }
    }
}
</script>