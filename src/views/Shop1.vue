<template>
  <div>
    <mu-card>
      <table border="0" width="100%">
        <tr valign="top">
          <td width="15%" class="thumb" align="center">
            Outside Cam<br />
            <div v-for="(item,idx) in camOutside2" style="position:relative">


              
              <svg :width="width" :height="height" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <image v-bind:xlink:href="item.file.mediaLink" x="0" y="0" :width="width" :height="height" />
                <template v-for="(face,faceIdx) in item.face">
                  <rect v-bind:y="face.rect.top" v-bind:x="face.rect.left" v-bind:width="face.rect.width" v-bind:height="face.rect.height" stroke="red" fill="white" fill-opacity="0.2" />
                </template>
              </svg>

              <!--
              <div style="position:absolute; background:white; width:20px; left:0; top:0; font-size:9px;">{{idx ? 'T-' + idx : 'Now'}}</div>
              <img :src="item.file.mediaLink" :key="idx" />
              -->
            </div>
          </td>
          <td width="70%">
            <highcharts :options="chartOption" ref="chartOption"></highcharts>
          </td>
          <td width="15%" class="thumb" align="center">
            In-store Cam<br />
            <div v-for="(item,idx) in camInstore2" style="position:relative">
              <svg :width="width" :height="height" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <image v-bind:xlink:href="item.file.mediaLink" x="0" y="0" :width="width" :height="height" />
                <template v-for="(face,faceIdx) in item.face">
                  <rect v-bind:y="face.rect.top" v-bind:x="face.rect.left" v-bind:width="face.rect.width" v-bind:height="face.rect.height" stroke="red" fill="white" fill-opacity="0.2" />
                </template>
              </svg>
              <!--
              <div style="position:absolute; background:white; width:20px; left:0; top:0; font-size:9px;">{{idx ? 'T-' + idx : 'Now'}}</div>
              <img :src="item.file.mediaLink" :key="idx" />
              -->
            </div>
          </td>
        </tr>
      </table>
    </mu-card>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      width: 180,
      height: 101,
      camInstore: [],
      camOutside: [],
      camInstore2: [],
      camOutside2: [],
      chartOption: {
        chart: {
          maxWidth: 600,
          type: 'line'
        },
        title: {
          text: 'Outside vs. In-store Traffic'
        },
        xAxis: {
          categories: ['T-5', 'T-4', 'T-3', 'T-2', 'T-1', 'Now']
        },
        yAxis: {
          title: {
            text: 'Number of persons'
          }
        },
        plotOptions: {
          line: {
            dataLabels: {
              enabled: true
            },
            enableMouseTracking: false
          }
        },
        series: [{
          name: 'Outside',
          data: [0, 0, 0, 0, 0, 0],
          color: '#CC0000'
        }, {
          name: 'In-store',
          data: [0, 0, 0, 0, 0, 0],
          color: '#2196F3'
        }]
      }
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    calRect (rect) {
      // 1348 x 759
      var newRect = {}
      newRect.width = Math.floor(180 / 1348 * rect.width)
      newRect.height = Math.floor(101 / 759 * rect.height)
      newRect.left = Math.floor(180 / 1348 * rect.left)
      newRect.top = Math.floor(101 / 759 * rect.top)
      return newRect
    }
  },
  created() {
  },
  mounted() {
    var self = this
    var myChart = this.$refs.chartOption
    this.$firebase.database().ref('shops/shops_outside').limitToLast(6).on('value', function (snapshot) {
      self.camOutside = []
      var numFaces = []
      snapshot.forEach(child => {
        var val = child.val()
        if (val.face) {
          for (var j =0; j < val.face.length; j++) {
            val.face[j].rect = self.calRect(val.face[j].faceRectangle)
          }
        }
        console.log(val)
        self.camOutside.push(val)
        numFaces.push(val.face ? val.face.length : 0)
      })
      for (var i = numFaces.length; i < 6; i++) {
        numFaces.push(0)
      }
      myChart.chart.series[0].setData(numFaces)
      self.camOutside2 = self.camOutside.reverse()
    })
    this.$firebase.database().ref('shops/shops_instore').limitToLast(6).on('value', function (snapshot) {
      self.camInstore = []
      var numFaces = []
      snapshot.forEach(child => {
        var val = child.val()
        if (val.face) {
          for (var j =0; j < val.face.length; j++) {
            val.face[j].rect = self.calRect(val.face[j].faceRectangle)
          }
        }
        self.camInstore.push(val)
        numFaces.push(val.face ? val.face.length : 0)
      })
      for (var i = numFaces.length; i < 6; i++) {
        numFaces.push(0)
      }
      myChart.chart.series[1].setData(numFaces)
      self.camInstore2 = self.camInstore.reverse()
    })
  }
}
</script>

<style scoped>
.thumb {
  width: 180px;
}
.thumb img {
  width: 180px;
}
</style>
