<template>
  <div>
    <mu-card>
      <table border="0" width="100%">
        <tr valign="top">
          <td class="thumb" align="center">
            In-store Cam<br />
            <div v-for="(item,idx) in camInstore2" style="position:relative">
              <!--
              <div style="position:absolute; background:white; width:20px; left:0; top:0; font-size:9px;">{{idx ? 'T-' + idx : 'Now'}}</div>
              <img :src="item.file.mediaLink" :key="idx" />
              -->
              <svg :width="width" :height="height" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <image v-bind:xlink:href="item.file.mediaLink" x="0" y="0" :width="width" :height="height" />
                <template v-for="(face,faceIdx) in item.face">
                  <rect v-bind:y="face.rect.top" v-bind:x="face.rect.left" v-bind:width="face.rect.width" v-bind:height="face.rect.height" stroke="red" fill="white" fill-opacity="0.2" />
                </template>
              </svg>
            </div>
          </td>
          <td width="100%">
            <highcharts :options="chartOption" ref="chartOption"></highcharts>
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
      camInstore2: [],
      chartOption: {
        chart: {
          type: 'column'
        },

        title: {
          text: 'In-store Traffic by Demographics'
        },

        xAxis: {
          categories: ['T-5', 'T-4', 'T-3', 'T-2', 'T-1', 'Now']
        },

        yAxis: {
          allowDecimals: false,
          min: 0,
          title: {
            text: 'Number of leads'
          }
        },

        tooltip: {
          formatter: function () {
            return '<b>' + this.x + '</b><br/>' +
              this.series.name + ': ' + this.y + '<br/>' +
              'Total: ' + this.point.stackTotal;
          }
        },

        plotOptions: {
          column: {
            stacking: 'normal'
          }
        },

        series: [{
          name: 'M18-24',
          data: [0, 0, 0, 0, 0, 0],
          stack: 'male',
          color: '#99CCFF'
        }, {
          name: 'M25-34',
          data: [0, 0, 0, 0, 0, 0],
          stack: 'male',
          color: '#6699CC'
        }, {
          name: 'M35-44',
          data: [0, 0, 0, 0, 0, 0],
          stack: 'male',
          color: '#336699'
        }, {
          name: 'M45+',
          data: [0, 0, 0, 0, 0, 0],
          stack: 'male',
          color: '#003366'
        }, {
          name: 'F18-24',
          data: [0, 0, 0, 0, 0, 0],
          stack: 'female',
          color: '#FF99CC'
        }, {
          name: 'F25-34',
          data: [0, 0, 0, 0, 0, 0],
          stack: 'female',
          color: '#CC6699'
        }, {
          name: 'F35-44',
          data: [0, 0, 0, 0, 0, 0],
          stack: 'female',
          color: '#993366'
        }, {
          name: 'F45+',
          data: [0, 0, 0, 0, 0, 0],
          stack: 'female',
          color: '#660033'
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
    this.$firebase.database().ref('shops/shops_instore').limitToLast(6).on('value', function (snapshot) {
      self.camInstore = []
      var numFaces = {
        male: [[], [], [], [], [], []],
        female: [[], [], [], [], [], []]
      }
      var _round = 0
      var _record = {
        male: [
          [0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0]
        ],
        female: [
          [0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0]
        ]
      }
      snapshot.forEach(child => {
        // foreach picture
        var val = child.val()
        if (val.face) {
          for (var j =0; j < val.face.length; j++) {
            val.face[j].rect = self.calRect(val.face[j].faceRectangle)
          }
        }
        if (val.face.length > 0) {
          var _gender = ''
          var _ageGroup = 0
          for (var j = 0; j < val.face.length; j++) {
            _gender = val.face[j].faceAttributes.gender
            if (val.face[j].faceAttributes.age < 25) {
              _ageGroup = 0
            } else if (val.face[j].faceAttributes.age < 35) {
              _ageGroup = 1
            } else if (val.face[j].faceAttributes.age < 45) {
              _ageGroup = 2
            } else {
              _ageGroup = 3
            }

            _record[_gender][_ageGroup][_round]++
          }
          _round++
        }
        self.camInstore.push(val)
      })
      self.camInstore2 = self.camInstore.reverse()
      console.log(_record)
      myChart.chart.series[0].setData(_record['male'][0])
      myChart.chart.series[1].setData(_record['male'][1])
      myChart.chart.series[2].setData(_record['male'][2])
      myChart.chart.series[3].setData(_record['male'][3])
      myChart.chart.series[4].setData(_record['female'][0])
      myChart.chart.series[5].setData(_record['female'][1])
      myChart.chart.series[6].setData(_record['female'][2])
      myChart.chart.series[7].setData(_record['female'][3])
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
