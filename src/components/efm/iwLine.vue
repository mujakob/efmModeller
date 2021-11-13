<template>
  <g>
    <!-- iw line  -->
    <path
      :d="svgQuadraticCurve"
      :stroke="lineColor"
      :stroke-width="lineWidth"
      fill="none"
    />

    <!-- arrow head  -->
    <polyline
      :points="arrowHead"
      :style="
        'fill:' +
        lineColor +
        '; stroke:' +
        lineColor +
        '; stroke-width:' +
        lineWidth
      "
    />

    <!-- selector and identificator -->
    <circle
      :cx="centrePoint.x"
      :cy="centrePoint.y"
      :r="identifierRadius"
      :stroke="lineColor"
      :stroke-width="lineWidth"
      fill="white"
      @click="selectIW"
    />
    <text
      :x="centrePoint.x - identifierRadius / 2"
      :y="centrePoint.y + identifierRadius / 2"
      @click="selectIW"
    >
      {{ iwType_shorthand }}
    </text>
    <!-- <circle :cx="startX" :cy="startY" r="5" stroke="black" stroke-width="3" fill="none" />
      <circle :cx="endX" :cy="endY" r="5" stroke="black" stroke-width="3" fill="none" /> -->
  </g>
</template>

<script>
import { mapGetters } from "vuex";
// import { mapGetters } from 'vuex'

export default {
  name: "iwLine",
  data() {
    return {
      // curveheight determines how far out from the lower point we bend the curve, factorised with curve length
      curveHeightFactor: 0.4,
      identifierRadius: 10,
      lineWidth: 3,
      arrowHeight: 10,
      arrowWidth: 10,

      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      posLeft: 0,
      posTop: 0,
    };
  },
  props: {
    theIW: { required: true },
  },
  computed: {
    ...mapGetters(["efmObjectColor"]),
    efmCanvas() {
      return document.getElementById("efmTreeView");
    },

    startElement() {
      return document.getElementById("iwFrom" + this.theIW.id);
    },
    endElement() {
      return document.getElementById("iwTo" + this.theIW.id);
    },
    curveHeight() {
      const deltaY = this.startY - this.endY;
      return Math.abs(deltaY) + this.curveHeightFactor * this.curveLength;
    },
    curveLength() {
      return Math.abs(this.endX - this.startX);
    },
    curveLengthCorrected() {
      // adds linewidth and arrow width
      return this.curveLength + this.arrowWidth + this.lineWidth;
    },
    centrePoint() {
      // centrePoint (Pc) is defined by central on x distance between start and end
      //    and y being dx*heightfactor below
      // curve goes through it, and it is where the identifier circle sits
      let xc = this.startX + (this.endX - this.startX) / 2; // middle between start and end
      let yc = this.endY // lowest point of the two starting points,
      if (this.startY > this.endY) {
        yc = this.startY  // if the other point is actually lower...
      }
      yc = yc + xc * this.curveHeightFactor; // adding curveheigtfactor * deltaX
      return { x: xc, y: yc };
    },
    controlPoint() {
      // control point for quadratic bezier curve based on start, centrePoint, end
      let x1 = 2 * this.centrePoint.x - this.startX / 2 - this.endX / 2;
      let y1 = 2 * this.centrePoint.y - this.startY / 2 - this.endY / 2;
      return { x: x1, y: y1 };
    },
    svgCubicCurve() {
      // const startX = 0
      // const startY = 0
      // const endX = this.curveLength
      // const endY = Math.abs(this.iwStartPos.y - this.iwEndPos.y)
      const controlY = this.curveHeight;
      // console.log(
      //   "startX" +
      //     this.startX +
      //     " startY " +
      //     this.startY +
      //     " endX " +
      //     this.endX +
      //     " endY " +
      //     this.endY +
      //     " controlY" +
      //     controlY
      // );
      // corrections for arrow display:
      let endX_corrected = this.endX + this.arrowWidth / 2;
      let endY_corrected = this.endY + this.arrowHeight;

      // returns the svg string for a bezier curve
      return (
        "M " +
        this.startX +
        " " +
        this.startY +
        " C " +
        this.startX +
        " " +
        controlY +
        ", " +
        this.endX +
        " " +
        controlY +
        ", " +
        endX_corrected +
        " " +
        endY_corrected
      );
    },
    svgQuadraticCurve() {
      // curve through start, centrepoint, end
      // corrections for arrow display:
      let endX_corrected = this.endX + this.arrowWidth / 2;
      let endY_corrected = this.endY + this.arrowHeight;

      const curveString =
        "M " +
        this.startX +
        " " +
        this.startY +
        " Q " +
        this.controlPoint.x +
        " " +
        this.controlPoint.y +
        ", " +
        endX_corrected +
        " " +
        endY_corrected;
      // console.log(curveString)
      return curveString;
    },
    arrowHead() {
      // up-facing arrow in endpoint
      const height = this.arrowHeight;
      const width = this.arrowWidth;
      // The tip
      const tX = this.endX + this.arrowWidth / 2;
      const tY = this.endY + this.lineWidth;
      let points = tX + ", " + tY + " ";
      points =
        points + String(tX - width / 2) + ", " + String(tY + height) + " ";
      points =
        points + String(tX + width / 2) + ", " + String(tY + height) + " ";
      points = points + tX + ", " + tY;
      return points;
    },
    lineColor() {
      return this.efmObjectColor("iw_" + this.theIW.iw_type);
    },
    iwType_shorthand() {
      return this.theIW.iw_type.substring(0, 1);
    },
  },
  methods: {
    offset(element) {
      var rect = element.getBoundingClientRect()
      // var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop

      var canvasRect = this.efmCanvas.getBoundingClientRect();

      console.log(rect.top, scrollTop, canvasRect.top)

      return {
        y: rect.top - canvasRect.top,
        x: rect.left - canvasRect.left,
      };
    },

    setStartEndPoints() {
      
      let start = this.offset(this.startElement);
      let end = this.offset(this.endElement);
      this.startX = start.x
      this.endX = end.x
      this.startY = start.y
      this.endY = end.y

    },

    selectIW() {
      this.$store.commit("efm/setObjectForDetails", {
        type: "iw",
        id: this.theIW.id,
      });
    },
  },
  beforeMount() {
    this.setStartEndPoints();
  },
  mounted() {
    window.addEventListener("resize", this.setStartEndPoints());
    this.$emit('new:height', this.centrePoint.y)
  },
};
</script>
