<template>
    <v-container
        id="notificationsCentre"
    >

        <!-- ERRORS -->
        <v-card
            class="msgbox error red darken-5 white--text ma-5"
            v-for="e in getAllErrors"
            :key="e.id"
        >
            <v-card-title>Error</v-card-title>
            <v-card-subtitle>
                id: {{e.id}} 
                <span v-if="e.component">; {{e.component}}</span>
            </v-card-subtitle>
            <v-card-text>{{e.message}}</v-card-text>
            <v-card-actions>
                <v-btn @click="dismissError(e.id)">dismiss</v-btn>
            </v-card-actions>
        </v-card>

        <!-- GOOD NEWS -->
        <v-card
            class="msgbox goodnews green text--white ma-5"
            v-for="n, index in allTheGoodNews"
            :key="index"
        >
            <v-card-title>{{n.message}}</v-card-title>
            <v-card-actions>
                <v-btn @click="dismissGoodNews(n.id)">dismiss</v-btn>
            </v-card-actions>
        </v-card>

    </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    name: "notifications",
    data() {
        return {

        }
    },
    computed: {
        ...mapGetters(['getAllErrors', 'allTheGoodNews'])
    },
    methods: {
        dismissError(errorID) {
            this.$store.commit('removeError', errorID)
        },
        dismissGoodNews(newsID) {
            this.$store.commit('removeNews', newsID)
        }
    }

}
</script>

<style scoped>
#notificationsCentre {
    position: fixed;
    display: flex;
    align-content: flex-end;
    align-items: flex-end;
    flex-direction: column;
    z-index: 100;
    bottom: 20px;
    right:20px;
    width:200px;
}

.msgbox {
    width: 200px;
}
</style>