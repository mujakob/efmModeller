<template>
    <!-- iw lines -->
    <svg
      :style="'height:'+svgHeight+'px; width:'+svgWidth+'px;'"
      id="iwContainer"
      :key="updateIW"
    >
      <iw-line 
        v-for="iw in allIW" 
        :key="iw.id" 
        :theIW="iw" 
        style="z-index: 1"
        @new:height="setHeight"
        @new:width="setWidth"
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
          svgHeight: 100,
          svgWidth: 100,
          iwToRender: [],
      }
  },
  components: { iwLine },
  computed: {
    ...mapGetters("efm", [
      "iwToDraw",
      "getEFMobjectsByType",
      "selectedConcept"
      ]),

    ...mapGetters(["showEditor", "treeObjectSize", "showConstraints", "showIW"]),

    allIW() {
      return this.getEFMobjectsByType('iw')
    },
    updateIW(){
      // collects all store variables which should, when changed, trigger iw rerendering

      // efm triggers
      let updateVal = Number(this.iwToDraw.length) 
      if (this.selectedConcept) {
        updateVal += this.selectedConcept.id
      }

      // settings triggers
      updateVal += Number(this.showEditor) + Number(this.showConstraints) + Number(this.treeObjectSize)

      return updateVal
    }
    
  },
  methods: {
      setWidth(newWidth) {
        if (newWidth > this.svgWidth) {
          this.svgWidth = newWidth
          this.$emit('new:width', this.svgWidth)
        }
      },
      setHeight(newHeight) {
        if (newHeight > this.svgHeight){
          this.svgHeight = newHeight
          this.$emit('new:height', this.svgHeight)
        }
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