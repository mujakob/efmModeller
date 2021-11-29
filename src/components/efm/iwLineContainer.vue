<template>
    <!-- iw lines -->
    <svg
      :style="'height:'+svgHeight+'; width:'+svgWidth+';'"
      id="iwContainer"
    >
      <iw-line 
        v-for="iw in allIW" 
        :key="iw.id" 
        :theIW="iw" 
        style="z-index: 1"
        @new:height="setHeight"
    />
    </svg>
</template>

<script>
import { mapGetters } from 'vuex'
import iwLine from './iwLine.vue'
export default {
  name: 'svgLineContainer',
  data() {
      return {
          svgHeight: "100%",
          svgWidth: "100%",
          iwToRender: [],
      }
  },
  components: { iwLine },
  computed: {
    ...mapGetters("efm", ["iwToDraw", "getEFMobjectsByType"]),
    allIW() {
      return this.getEFMobjectsByType('iw')
    }
    
  },
  methods: {
      setWidth(newWidth) {
          this.svgWidth = newWidth
      },
      setHeight(newHeight) {
          this.svgHeight = newHeight + 'px'
          this.$emit('new:height', this.svgHeight)
      },
      checkForIWendpoints() {
      let iw_list = []
      for (let iw in this.getEFMobjectsByType('iw')) {
        if (document.getElementById('ds'+iw.to_ds_id) && document.getElementById('ds'+iw.from_ds_id)) {
          console.log('ready to render iw ' + iw.id)
          iw_list.append(iw)
        }
      }
      this.iwToRender = iw_list
    }
  },
  updated() {
    // // informing the store that the iw are ready to draw
    this.checkForIWendpoints()
    console.log('updated iw list')
  },
}
</script>

<style scoped>
svg {
    position:absolute;
    top:0px;
    left:0px;
}
</style>