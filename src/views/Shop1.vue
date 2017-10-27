<template>
  <div>
    <mu-card>
      <table border="0" width="100%">
        <tr valign="top">
          <td class="thumb" align="center">
            Outside Cam<br />
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/15/Weekend_market_bangkok.jpg" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/15/Weekend_market_bangkok.jpg" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/1/15/Weekend_market_bangkok.jpg" />
          </td>
          <td width="100%">
            <highcharts :options="senseChartOption" ref="senseChart"></highcharts>
          </td>
          <td class="thumb" align="center">
            In-store Cam<br />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/0d/Rossmann_Innen.jpg" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/0d/Rossmann_Innen.jpg" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/0/0d/Rossmann_Innen.jpg" />
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
      senseChartOption: {
        chart: {
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
          data: [10, 12, 14, 28, 10, 9],
          color: '#CC0000'
        }, {
          name: 'In-store',
          data: [6, 4, 4, 5, 3, 1],
          color: '#2196F3'
        }]
      }
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
  },
  created() {
  },
  mounted() {
  }
}
</script>

<style scoped>
.thumb { width:180px; }
.thumb img { width:180px }
</style>
