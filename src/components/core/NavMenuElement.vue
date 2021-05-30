<template>
    <v-list-item
        link
        :to="item.link"
        v-on:click="$emit(item.func, item.param)"
    >
        <v-list-item-icon>
        <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
    </v-list-item>
</template>

<script>
export default {
    props: {
        item: {required: true,}
        
        // ### SAMPLE ITEM: 
        // {   title: 'Reload data from server', 
        //     icon: 'mdi-book-sync',
        //     link: {name: 'tree', params: {treeID: String(this.theProject.id)}},
        //     func: 'reloadProject',
        // },   
    }
}
</script>