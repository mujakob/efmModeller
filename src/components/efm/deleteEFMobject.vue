<template>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="text-h5">
          Are you sure you want to delete {{ theObjectToDelete.name }}?
        </v-card-title>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="red" text @click="deleteObject"> Delete </v-btn>

          <v-btn text @click="$emit('cancel')"> Actually, no! </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            dialog: true,
        }
    },
    props: {
        toDeleteID: {type: Number, required: true},
        toDeleteType: {type: String, required: true}
    },
    computed: {
        ...mapGetters('efm', [
            'getEFMobjectByID'
        ]),
        theObjectToDelete() {
            return this.getEFMobjectByID(this.toDeleteType, this.toDeleteID)
        }
    },
    methods: {
        async deleteObject() {
            let deleted = await this.$store.dispatch('efm/deleteEFMobject', {
                type: this.toDeleteType,
                id: this.toDeleteID,
            })
            if (deleted) {
                this.$emit('cancel')
            }
        }
    }
}
</script>