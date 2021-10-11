<template>
    <svg
        :style="'position: absolute; top: ' + posTop + '; left: ' + posLeft + ';'"
        :height="curveHeight"
        :width="curveLengthCorrected"
        v-if="endElement && startElement"
    >
        <!-- iw line  -->
        <path 
            :d="svgCubicCurve"
            :stroke="lineColor"
            :stroke-width="lineWidth"
            fill="none" 
        />    
        <!-- arrow head  -->
        
        <polyline 
            :points="arrowHead"
            :style="'fill:'+lineColor+'; stroke:'+lineColor+'; stroke-width:'+lineWidth" 
        />
      <!-- <circle :cx="startX" :cy="startY" r="5" stroke="black" stroke-width="3" fill="none" />
      <circle :cx="endX" :cy="endY" r="5" stroke="black" stroke-width="3" fill="none" /> -->
    </svg>
</template>

<script>
// import { mapGetters } from 'vuex'


export default {
    name: 'iwLine',
    data() {
        return {
            // curveheight determines how far out from the lower point we bend the curve, factorised with curve length
            curveHeightFactor: 1,
            lineColor: 'blue',
            lineWidth: 5,
            arrowHeight: 10,
            arrowWidth: 10,

            startX: 0,
            startY: 0,
            endX: 0,
            endY: 0,
            posLeft: 0,
            posTop: 0,
        }
    },
    props: {
        theIW: {required: true},
    },
    computed: {  
        startElement() {
            return document.getElementById('iwFrom'+this.theIW.id)
        },
        endElement() {
            return document.getElementById('iwTo'+this.theIW.id)
        },
        curveHeight() {
            const deltaY = this.startY - this.endY  
            return Math.abs(deltaY) + this.curveHeightFactor * this.curveLength
        },
        curveLength() {
            return Math.abs(this.endX - this.startX)
        },
        curveLengthCorrected() {
            // adds linewidth and arrow width
            return this.curveLength + this.arrowWidth + this.lineWidth
        },
        svgCubicCurve() {
            // const startX = 0
            // const startY = 0
            // const endX = this.curveLength
            // const endY = Math.abs(this.iwStartPos.y - this.iwEndPos.y)
            const controlY = this.curveHeight
            console.log('startX' + this.startX + ' startY '+ this.startY+' endX '+this.endX+' endY '+this.endY+' controlY'+controlY)
            // corrections for arrow display:
            let endX_corrected = this.endX + this.arrowWidth/2
            let endY_corrected = this.endY + this.arrowHeight

            // returns the svg string for a bezier curve
            return 'M ' + this.startX + ' ' + this.startY + ' C ' + this.startX + ' ' + controlY + ', ' + this.endX + ' ' + controlY + ', ' + endX_corrected + ' ' + endY_corrected
        },
        arrowHead() {
            // up-facing arrow in endpoint
            const height = this.arrowHeight
            const width = this.arrowWidth
            // The tip
            const tX = this.endX + this.arrowWidth/2
            const tY = this.endY + this.lineWidth
            let points = tX + ', ' + tY + ' ' 
            points = points + String(tX-width/2) + ', ' + String(tY+height) + ' '
            points = points + String(tX+width/2) + ', ' + String(tY+height) + ' '
            points = points + tX + ', ' + tY 
            return points
        }
    },
    methods: {
        // ...mapGetters('efm', ['getEFMobjectByID',]),
        // theIW() {
        //     return this.getEFMobjectByID('iw', iwID)
        // },
        iwFromPos() {
            // returns {x: startX, y: starty}
            var rect = this.startElement.getBoundingClientRect(),
            scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            return { y: rect.top + scrollTop, x: rect.left + scrollLeft}

        },
        iwToPos() {
            // returns {x: endX, y: endY}
            // returns center of element with id "objectID"
            var rect = this.endElement.getBoundingClientRect(),
            scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            return { y: rect.top + scrollTop, x: rect.left + scrollLeft }
        },
        setStartEndPoints() {
            let start = this.iwFromPos()
            let end = this.iwToPos()
            if (start.x < end.x) {
                // case start is left, end is right
                // i.e. arrto from left to right
                this.startX = 0
                this.endX = end.x - start.x

                this.posLeft = start.x
            } else {
                this.startX = start.x - end.x
                this.endX = 0 

                this.posLeft = end.x
            }
            if (start.y < end.y) {
                // case star is top, end is bottom
                // i.e. arrow top down
                this.startY = 0
                this.endY = end.y - start.y

                this.posTop = start.y
            } else {
                this.startY = start.y - end.y
                this.endY = 0

                this.posTop = end.y
            }
        },
    },
    mounted() {
        this.setStartEndPoints()
    }
}
</script>