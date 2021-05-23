<template>
    <v-app-bar app>
        <error-message v-for="(e, index) in errors" :key="index" :error="e"/>
        <v-app-bar-title> My App Title </v-app-bar-title>
    
        <!-- User menug and login -->
        <v-avatar
            color="primary"
            size="56"
        >
                    
            <v-img v-if="user.image" :src="userImg" />

            <v-icon v-else>
              mdi-account-circle
            </v-icon>

        </v-avatar>
    </v-app-bar>
</template>

<script>
import utils from '@utils'
import settings from '@settings'
import ErrorMessage from '../errorMessage.vue'

export default {
    components: {
        ErrorMessage
    },
    data() {
        return {
            user: null,
            errors: [],
        }
    },
    methods: {
        getUser() {
            try {
                this.user utils.getCurrentUser()
            } catch (e) {
                this.errors.push(e)
            }
    }
    },
    computed: {
        loggedIn: function() {
            return utils.userLoggedIn()
        },

        userImg: function() {
            if (user.image) {
                return settings.imageHost + user.image
            } else {
                return null
            }
    }
    }
}
</script>