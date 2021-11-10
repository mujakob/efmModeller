<template>
    <!-- iw lines -->
    <svg
      :style="'height:'+svgHeight+'; width:'+svgWidth+';'"
      id="iwContainer"
    >
      <iw-line 
        v-for="iw in iwToDraw" 
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
          svgWidth: "100%"
      }
  },
  components: { iwLine },
  computed: {
    ...mapGetters("efm", ["iwToDraw"]),
  },
  methods: {
      setWidth(newWidth) {
          this.svgWidth = newWidth
      },
      setHeight(newHeight) {
          this.svgHeight = newHeight + 'px'
          this.$emit('new:height', this.svgHeight)
      }
  }
}
</script>

<style scoped>
svg {
    position:absolute;
    top:0px;
    left:0px;
}
</style>