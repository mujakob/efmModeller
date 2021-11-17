<template>
    <v-chip :color="headColor">
        <v-avatar
            x-small
            fab
            top
            left
            absolute
            @click="dismiss"
            color="grey"
        > 
           
            <v-progress-circular 
                v-if="autoDissmiss"
                :value="100-(100/5000*autoDissmissTime)"
                size="15"
                width="1"
            >
                x
            </v-progress-circular>
            <span v-else>x</span>
        </v-avatar>
        <span class="text-overline" style="overflow: truncate;"> 
            {{message.type}} 
        </span>
        <span 
            class="text-caption"
            v-if="message.component"
        >
            {{message.component}}: 
        </span>
        <span class="text-caption">
            {{message.message}}
        </span>
    </v-chip>

</template>

<script>
export default {
    data() {
        return {
            autoDissmissTime: 5000,
            autoDissmissStepTime: 100,
            autoDissmiss: false,
        }
    },
    props: {
        message: {required: true}
    },
    computed: {
        headColor() {
            if (this.message.type == 'error') {
                return 'red';
            } else if (this.message.type == 'info') {
                return 'green';
            } else if (this.message.type == 'warning') {
                return 'amber';
            } else {
                return ''
            }
        }
    },
    methods: {
        dismiss() {
            this.$store.commit("removeMessage", this.message.id);
        },
        dismissWithTimeout() {
            // removes an info message after 4sec
            if (this.message.type == 'info') {
                this.autoDissmiss = true
                var countdown = setInterval(() => {
                    if(this.autoDissmissTime  <= 0){
                        this.dismiss()
                        clearInterval(countdown)
                    }
                    // console.log(this.autoDissmissTime )
                   this.autoDissmissTime  -= this.autoDissmissStepTime
                }, this.autoDissmissStepTime);
            }   
        
        },
    },
    mounted() {
        this.dismissWithTimeout()
        console.log()
    }
}
</script>